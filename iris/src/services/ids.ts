import moment from 'moment';
import API from "../config/anchor";
import logger from "../config/logger";
import prisma from "../config/prisma";
import { decodeProof } from "../config/veramo";
import ExpiredEntityError from "../errors/ExpiredEntityError";
import InternalServerError from "../errors/InternalServerError";
import InvalidDidError from "../errors/InvalidDidError";
import NotFoundError from "../errors/NotFoundError";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import {
  CreateIDParams,
  CreateIDResponse
} from "../interfaces/ids/create.interface";
import { DeleteID, DeleteIDResponse, DeleteIDs } from "../interfaces/ids/delete.interface";
import { addIdAgreement, invalidateIdAgreement, invalidateIdAgreements } from "./rpc";

/**
 * Adds the given ID to the blockchain together with the issuer DID and holder DID
 * @param params CreateID interface
 * 
 * @throws sableEntity if any of the parameters are empty
 * @throws InternalServerError if wallet keypair does not exist or transaction failed
 */
export const create = async (
  params: CreateIDParams
): Promise<CreateIDResponse> => {
  logger.info(params, "Create ID called");

  if (
    params.documentDid.trim().length === 0 ||
    params.issuerDid.trim().length === 0 ||
    params.holderDid.trim().length === 0
  )
    throw new UnprocessableEntityError("A parameter was empty");

  const program = await API.connect();
  try {
    return await addIdAgreement(params, program);
  } catch (error) {
    throw new InternalServerError("Transaction failed: could not create ID");
  }
};

/**
 * Invalidates an ID agreement with the specific document DID. Equivalent of deleting an ID,
 * since it will be invalidated in the blockchain.
 * 
 * @param params document DID
 * 
 * @throws UnprocessableEntity if any of the parameters are empty
 * @throws InternalServerError if transaction failed or if wallet keypair does not exist
 */
export const invalidate = async (
  params: DeleteID
): Promise<DeleteIDResponse> => {
  logger.info(params, "Invalidate ID called");

  if (
    params.documentDid.trim().length === 0
  )
    throw new UnprocessableEntityError("A parameter was empty");

  const program = await API.connect();
  try {
    return await invalidateIdAgreement(params, program);
  } catch (error) {
    throw new InternalServerError("Transaction failed: could not invalidate ID");
  }
};

/**
 * Invalidates many ID agreements with the given document DIDs. Equivalent of
 * deleting ID agreements, since it will be invalidated on the blockchain.
 * 
 * @param params DIDs of all the document agreements to be deleted/invalidated
 * @throws UnprocessableEntity if any of the parameters are empty
 * @throws InternalServerError if transaction failed or if wallet keypair does not exist
 */
 export const invalidateMany = async (
  params: DeleteIDs
): Promise<void> => {
  logger.info(params, "Invalidate IDs called");

  if (
    params.documentDids.length === 0
  )
    throw new UnprocessableEntityError("A parameter was empty");

  const program = await API.connect();
  try {
    await invalidateIdAgreements(params, program);
  } catch (error) {
    throw new InternalServerError("Transaction failed: could not invalidate IDs");
  }
};

/**
 * Fetches the ID agreement from the blockchain by a given document DID
 * 
 * @param documentDid A document DID
 * @returns ID agreement from blockchain
 * @throws InternalServerError if wallet keypair does not exist
 * @throws NotFoundError if public key does not match any existing account
 */
export const fetch = async (documentDid: string) => {
  logger.info("Show ID called with documentDid: ", documentDid);

  // Fetches documentAccount from database
  const document = await prisma.documentAccount.findUnique({
    where: {
      documentDid: documentDid,
    },
  });
  const program = await API.connect();

  try {
    return await program.account.document.fetch(document?.publicKey!);
  } catch (error) {
    throw new NotFoundError("Document not found");
  }
};

/**
 * Checks if the ID agreement is valid using the smart contract.
 * 
 * @param proofToken JWT proof token, holder DID and issuer DID
 * @returns true if ID agreement is on the blockchain and is valid, false otherwise
 * @throws UnprocessableEntity if any of the parameters are empty
 */
export const verify = async (proofToken: string) => {
  // Throw an error if param is empty
  if (proofToken.trim().length === 0) 
  throw new UnprocessableEntityError("A parameter was empty");

  // Handle proof token
  const decodedProof = await decodeProof(proofToken)

  if(!decodedProof) throw new InternalServerError("Error while handling the proof token");
  
  // Find document agreement stored on the blockchain
  const id = await fetch(decodedProof.credentials![0].credentialSubject.id!);

  // Check if parameters equal parameters stored on the blockchain
  if(decodedProof.from !== id.holderDid) throw new InvalidDidError("Holder DID does not match");
  if(decodedProof.credentials![0].issuer.id !== id.issuerDid) throw new InvalidDidError("Issuer DID does not match");

  // Check if document hasn't gone out of date
  if(moment().diff(moment(id.expirationDate), "days") >= 0) throw new ExpiredEntityError("The document has expired");

  return id.valid;
}
