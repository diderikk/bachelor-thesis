import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import prisma from "../config/prisma";
import { CreateIDParams } from "../interfaces/ids/create.interface";
import { DeleteID, DeleteIDs } from "../interfaces/ids/delete.interface";
import { CreateIssuerParams } from "../interfaces/issuers/create.interface";
import { Kratos } from "../interfaces/kratos/kratos";

/**
 * RPC call to smart contract for adding an ID agreement
 * 
 * @param params agreement parameters
 * @param program smart contract address
 * @returns block hash and public key
 */
export const addIdAgreement = async (
  params: CreateIDParams,
  program: Program<Kratos>
) => {
  const documentAccount = anchor.web3.Keypair.generate();

  const tx = await program.rpc.addId(
    params.documentDid,
    params.issuerDid,
    params.holderDid,
    params.expirationDate,
    {
      accounts: {
        contractAccount: documentAccount.publicKey,
        wallet: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [documentAccount],
    }
  );

  // Adds document account (keypair) into the database for later use
  await prisma.documentAccount.create({
    data: {
      documentDid: params.documentDid,
      publicKey: documentAccount.publicKey.toString(),
    },
  });

  return {
    blockHash: tx,
    publicKey: documentAccount.publicKey.toString(),
  };
};

/**
 * RPC call to invalidate ID agreement
 * 
 * @param params DID
 * @param program smart contract address
 * @returns block hash and public key
 */
export const invalidateIdAgreement = async (
  params: DeleteID,
  program: Program<Kratos>
) => {

  const documentAccount = await prisma.documentAccount.findUnique({
    where: {
      documentDid: params.documentDid,
    },
  });

  const tx = await program.rpc.invalidateId(
    {
      accounts: {
        contractAccount: new anchor.web3.PublicKey(documentAccount!.publicKey!),
      },
    }
  );

  return {
    blockHash: tx,
    publicKey: documentAccount!.publicKey!.toString(),
  };
};

/**
 * RPC call to invalidate ID agreements
 * 
 * @param params DIDs
 * @param program smart contract address
 */
export const invalidateIdAgreements = async (
  params: DeleteIDs,
  program: Program<Kratos>
) => {

  const documentAccounts = await prisma.documentAccount.findMany({
    where: {
      documentDid: { in: params.documentDids },
    },
  });

  const promises = documentAccounts.map(account => {
    program.rpc.invalidateId(
      {
        accounts: {
          contractAccount: new anchor.web3.PublicKey(account.publicKey),
        },
      }
    );
  });

  await Promise.all(promises);
};

/**
 * RPC call to smart contract for adding an issuer
 * 
 * @param params issuer parameters
 * @param program smart contract address
 * @returns block hash and public key
 */
export const addIssuer = async (
  params: CreateIssuerParams,
  program: Program<Kratos>
) => {
  const issuerAccount = anchor.web3.Keypair.generate();
  const tx = await program.rpc.addIssuer(
    params.did,
    params.issuerName,
    params.url,
    {
      accounts: {
        contractAccount: issuerAccount.publicKey,
        wallet: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [issuerAccount],
    }
  );

  return {
    blockHash: tx,
    publicKey: issuerAccount.publicKey.toString(),
  };
};

/**
 * RPC call to smart contract for fetching issuers
 * 
 * @param params list of public keys
 * @param program smart contract address
 * @returns 
 */
export const fetchIssuers = async(params: string[], program: Program<Kratos>) => {
	return await program.account.issuer.fetchMultiple(params);
}