import { IIdentifier } from "@veramo/core";
import { AbstractDIDStore } from "@veramo/did-manager";
import { supabase } from "./supabase";

/**
 * Modified version of: https://github.com/uport-project/veramo/blob/next/packages/key-manager/src/memory-key-store.ts
 * Because the basic key stores that Veramo provides does not satisfy the projects needs, 
 * but a class thet implments the AbstractKeyStore interface is still needed to utilize Veramo.
 */
export class SupabaseDIDStore extends AbstractDIDStore {
  /**
   * The non-static get is required by veramo to work and is therefore implemented.
   * It fetches the seletected did from supabase.
   * @param did If defined, then alias should be undefined. Is the string representation of the did e.g., did:key:jkdfkjwehigtyftyf454AHHWDGufhe
   * @param alias If defined, provider also must be defined and did should not be defined. Is the alias given to the did e.g., "my private did"
   * @param provider If defined, alias also must be defined and did should not be defined. Is the did's provider e.g., did:key or did:ethr.
   * @throws Error if the did is not found, or if demands of (did && !alias) or (!did && alias && provider) is not met.
   * @returns The did requested from supabase.
   */
  async get({
    did,
    alias,
    provider,
  }: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    if (did && !alias) {
      const { data, error } = await supabase
        .from<IIdentifier>("IssuerDID")
        .select("*")
        .eq("did", did)
        .single();
      if (data === null || error) throw Error("DID not found");
      return data;
    } else if (!did && alias && provider) {
      const { data, error } = await supabase
        .from<IIdentifier>("IssuerDID")
        .select("*")
        .eq("alias", alias)
        .eq("provider", provider)
        .single();
      if (data === null || error) throw Error("DID not found");
      return data;
    } 
    else {
      throw Error(
        "Invalid arguments: Get requires did or (alias and provider)"
      );
    }
  }

  /**
   * The static get is used in the project to get low level access to the did, which is needed but not provided by veramo.
   * It fetches the seletected did from supabase.
   * @param did If defined, then alias and provider should be undefined. Is the string representation of the did e.g., did:key:jkdfkjwehiufhe
   * @param alias If defined, provider also must be defined and did should not be defined. Is the alias given to the did e.g., "my private did"
   * @param provider If defined, alias also must be defined and did should not be defined. Is the did's provider e.g., did:key or did:ethr.
   * @throws Error if the did is not found, or if demands of (did && !alias) or (!did && alias && provider) is not met.
   * @returns The did requested from supabase.
   */
  static async get({
    did,
    alias,
    provider,
  }: {
    did: string;
    alias: string;
    provider: string;
  }): Promise<IIdentifier> {
    if (did && !alias) {
      const { data, error } = await supabase
        .from<IIdentifier>("IssuerDID")
        .select("*")
        .eq("did", did)
        .single();
      if (data === null || error) throw Error("DID not found");
      return data;
    } else if (!did && alias && provider) {
      const { data, error } = await supabase
        .from<IIdentifier>("IssuerDID")
        .select("*")
        .eq("alias", alias)
        .eq("provider", provider)
        .single();
      if (data === null || error) throw Error("DID not found");
      return data;
    } else {
      throw Error(
        "Invalid arguments: Get requires did or (alias and provider)"
      );
    }
  }

  /**
   * Deletes a did from supabase.
   * @param did The did to be deleted.
   * @returns True if deleted, else it returns false.
   */
  async delete({ did }: { did: string }) {
    const { data, error } = await supabase
      .from<IIdentifier>("IssuerDID")
      .delete()
      .eq("did", did);
    return data !== null && !error;
  }

  /**
   * Inserts a new did to supabase if it does not already exist.
   * @param args 
   * @throws Error if the did already exists.
   * @returns True if inserte. If an error occured during insertion, false is returned.
   */
  async import(args: IIdentifier) {
    if (args.alias !== "issuer") return true;
    const getRes = await supabase
      .from<IIdentifier>("IssuerDID")
      .select("*")
      .eq("alias", args.alias)
      .single();
    if (getRes.data !== null || !getRes.error)
      throw Error("Key already exists");

    const { data, error } = await supabase
      .from<IIdentifier>("IssuerDID")
      .insert([
        {
          did: args.did,
          provider: args.provider,
          controllerKeyId: args.controllerKeyId,
          alias: args.alias,
          keys: args.keys,
          services: args.services,
        },
      ]);
    return data !== null && !error;
  }

  /**
   * Is never used but veramo's interface requires it.
   * @param args An empty object that is never used.
   * @returns An empty list.
   */
  async list(args: {}): Promise<IIdentifier[]> {
    return [];
  }
}
