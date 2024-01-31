/**
 * Modified version of: https://github.com/uport-project/veramo/blob/next/packages/key-manager/src/memory-key-store.ts
 * Because the basic key stores that Veramo provides does not satisfy the teams needs, 
 * but the team still needs to create a class that uses the AbstractKeyStore interface to be able to utilize Veramo.
 */

import { IKey } from '@veramo/core'
import { AbstractKeyStore } from '@veramo/key-manager'
import {
  AbstractPrivateKeyStore,
  ManagedPrivateKey,
} from '@veramo/key-manager'
import { v4 as uuidv4 } from 'uuid'
import IssuerDIDKeys from '../interfaces/verifiable_credential/IssuerDIDKeys'
import { supabase } from './supabase'
import {ImportablePrivateKey} from '@veramo/key-manager/build/abstract-private-key-store';

/**
 * KeyStore for storing keys (public keys and metadata) when creating DIDs.
 * This implementation will store the keys in Supabase.
 */
export class SupabaseKeyStore extends AbstractKeyStore {
  async get({ kid }: { kid: string }): Promise<IKey> {
    const { data , error } = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").select("publicKey").eq("kid", kid).single()
    if (data === null || error || !data.publicKey) throw Error('Key not found')
    return data.publicKey
  }

  async delete({ kid }: { kid: string }) {
    const { data, error } = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").delete().eq("kid", kid)
    return (data !== null && !error)
  }

  async import(args: IKey) {
    const getRes = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").select("*");
    if (getRes.data !== null && !getRes.error && getRes.data.length > 0) return true;
    const {data, error} = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").insert([{
      kid: args.kid,
      publicKey: args
    }])
    return (data !== null && !error)
  }

  /**
   * Is never used but veramo's interface requires it.
   * @param args 
   * @returns 
   */
  async list(args: {}): Promise<Exclude<IKey, 'privateKeyHex'>[]> {
    return []
  }
}

/**
 * KeyStore for storing private keys when creating DIDs.
 * This implementation will store the keys in Supabase.
 */
export class SupabasePrivateKeyStore extends AbstractPrivateKeyStore {

  async get({ alias }: { alias: string }): Promise<ManagedPrivateKey> {
    //Alias is the same as kid, veramo has just defined it with a different name
    const { data , error } = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").select("privateKey").eq("kid", alias).single()
    if (data === null || error || !data.privateKey) throw Error('Key not found')
    return data.privateKey
  }

  async delete({ alias }: { alias: string }) {
    //Alias is the same as kid, veramo has just defined it with a different name
    const { data, error } = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").delete().eq("kid", alias)
    return (data !== null && !error)
  }

  async import(args: ImportablePrivateKey) {
    const alias = args.alias || uuidv4()
    const getRes = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").select("*");
    const privateKey =  { ...args, alias }
    if(getRes.data !== null && !getRes.error && getRes.data.length > 0) return privateKey;
    const {data, error} = await supabase.from<IssuerDIDKeys>("IssuerDIDKeys").insert([{
      kid: alias,
      privateKey
    }])
    if(error || data === null) throw Error("Could not insert into supabase")
    return privateKey
  }

  /**
   * Is never used but veramo's interface requires it.
   * @returns 
   */
  async list(): Promise<Array<ManagedPrivateKey>> {
    return []
  }
}