import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import API from "../config/anchor";
import logger from "../config/logger";
import prisma from "../config/prisma";
import InternalServerError from "../errors/InternalServerError";
import NotFoundError from "../errors/NotFoundError";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import {
  CreateIssuerParams,
  CreateIssuerResponse
} from "../interfaces/issuers/create.interface";
import { FetchIssuerParams } from "../interfaces/issuers/fetch.interface";
import IssuerAccount from "../interfaces/prisma/IssuerAccount.interface";
import { verify } from "../pages/utils/jwt";
import { addIssuer, fetchIssuers } from "./rpc";

/**
 * Returns all issue providers registered on the blockchain
 *
 * @returns All issuers stored on blockchain and database
 * @throws NotFoundError if no issuers were found
 */
export const index = async () => {
  logger.info("Index issuers called");

  const issuers: IssuerAccount[] = await prisma.issuerAccount.findMany();
  const accounts = issuers.map((issuer) => issuer.publicKey);
  const program = await API.connect();
  try {
    return await fetchIssuers(accounts, program) as FetchIssuerParams[];
  } catch (error) {
    throw new NotFoundError("Issuers not found");
  }
  
};

/**
 * Finds and returns the first issuer with the given DID, undefined if none were found
 * 
 * @param did DID belonging to an issuer
 * @throws NotFoundError if the issuer with the given DID was not found
 * @returns an issuer with the given DID, undefined if nothing was found
 */
export const fetchIssuer = async (did: string) => {
  logger.info("fetchIssuer called");

  const issuers = await index();
  const issuer = issuers.find(issuer => issuer.did === did && issuer.valid);
  if(issuer) return {publicKey: issuer?.did};
  throw new NotFoundError("Issuer not found");
}

/**
 * Adds a issuer to the blockchain
 * 
 * @param params, of type CreateIssuerParams, issuerId, publicKey and url
 * @returns confirmation of it being on the blockchain
 * @throws UnprocessableEntity if any of the parameters are empty or invalid token
 * @throws InternalServerError if wallet keypair does not exist, invalid token or transaction failed
 */
export const create = async (
  params: CreateIssuerParams,
  token: string
): Promise<CreateIssuerResponse> => {
  logger.info("Create issuer called with params: ", params);
  
  if (
    params.url.trim().length === 0 ||
    params.issuerName.trim().length === 0 ||
    params.did.trim().length === 0 ||
    token.trim().length === 0
  )
    throw new UnprocessableEntityError("A parameter was empty");

  if (!(await verify(token))) throw new UnprocessableEntityError("Invalid token");

  const program = await API.connect();
  let cache: RedisClientType | null = null;
  try {
    cache = createClient({
      url: process.env.REDIS_URL!,
    });
    await cache.connect();
  } catch (error) {
    throw new InternalServerError(
      "Connection error: Could not connect to cache client"
    );
  }

  if (await cache!.get(token)) {
    await cache!.disconnect();
    throw new UnprocessableEntityError("Blacklisted token");
  }

  try {
    const confirmIssuer = await addIssuer(params, program);
    // Saves account's public key in database
    await prisma.issuerAccount.create({
      data: {
        issuerDid: params.did,
        publicKey: confirmIssuer.publicKey
      },
    });
    await cache!.set(token, "invalid");

    await cache!.disconnect();

    return confirmIssuer;
  } catch (error) {
    await cache!.disconnect();
    throw new InternalServerError(
      "Transaction failed: could not create issuer"
    );
  }
};