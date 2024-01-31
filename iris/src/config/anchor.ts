import { Program, Provider } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {
  ConfirmOptions, Connection, Keypair,
  PublicKey
} from "@solana/web3.js";
import * as fs from 'fs';
import InternalServerError from "../errors/InternalServerError";
import { Kratos } from "../interfaces/kratos/kratos";
import idl from "../interfaces/kratos/kratos.json";
const fsPromises = fs.promises

/**
 * Singleton class for creating a connection to the smart contract
 */
class API {
  private static api: Program<Kratos>;
  private static address: string = process.env.ANCHOR_ADDRESS!;

  private constructor() {}
  /**
   * Reads Solana wallet key pair from file defined in the .env file
   * File is generated when Solana is downloaded
   * Defines wallet, connection and provider, and creates a Program object
   * that can be used for communicating with the smart contract
   * 
   * @returns Connection to smart contract
  */
  public static async connect(): Promise<Program<Kratos>> {
    if (!API.api) {
      const opts: ConfirmOptions = {
        preflightCommitment: "processed",
      };
      try {
        // Fetches wallet key pair from file
        let keyPairStr = (await fsPromises.readFile(process.env.KEY_PAIR_PATH!)).toString();
        keyPairStr = keyPairStr.substring(1, keyPairStr.length-1)
        const keyPair = keyPairStr.split(",").map(item => parseInt(item))
        const wallet = new NodeWallet(
          Keypair.fromSecretKey(Uint8Array.from(keyPair))
        );
        // Connects to the smart contract
        const connection = new Connection(this.address, opts);
        const provider = new Provider(connection, wallet, opts);
        // Fetches from kratos.json
        const programId = new PublicKey(idl.metadata.address);
        API.api = new Program<Kratos>(idl as any as Kratos, programId, provider);
      } catch(error){
        throw new InternalServerError("Could not fetch wallet keypair");
      }  
    }
    return API.api;
  }
}

export default API;
