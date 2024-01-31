/**
 * Modified version of: https://github.com/uport-project/veramo/blob/next/packages/key-manager/src/memory-key-store.ts
 * Because the basic key stores that Veramo provides does not satisfy the teams needs, 
 * but the team still needs to create a class that uses the AbstractKeyStore interface to be able to utilize Veramo.
 */


import EncryptedStorage from 'react-native-encrypted-storage';
import {IKey} from '@veramo/core';
import {AbstractKeyStore} from '@veramo/key-manager';
import {AbstractPrivateKeyStore, ManagedPrivateKey} from '@veramo/key-manager';
import {v4 as uuidv4} from 'uuid';
import {ImportablePrivateKey} from '@veramo/key-manager/build/abstract-private-key-store';

/**
 * Class used for Veramo to store keys and metadata generated when creating a DID
 */
export class SecureKeyStore extends AbstractKeyStore {
  async get({kid}: {kid: string}): Promise<IKey> {
    const item = await EncryptedStorage.getItem(kid);
    const key: IKey = JSON.parse(item!);
    if (!key) throw Error('Key not found');
    return key;
  }

  async delete({kid}: {kid: string}) {
    try {
      await EncryptedStorage.removeItem(kid);
      return true;
    } catch {
      return false;
    }
  }

  async import(args: IKey) {
    try {
      await this.get({kid: args.kid});
      return false;
    } catch {
      try {
        await EncryptedStorage.setItem(args.kid, JSON.stringify(args));
        return true;
      } catch {
        return false;
      }
    }
  }

  async list(args: {}): Promise<Exclude<IKey, 'privateKeyHex'>[]> {
    /*
    Not necessary for our implementation of Veramo, and we only store a single key,
    the key for the holder DID. 
    Therefore, simple implementation, return empty list.
    */
    return [];
  }
}

/**
 * Class used for Veramo to store private keys and metadata generated when creating a DID
 */
export class SecurePrivateKeyStore extends AbstractPrivateKeyStore {
  async get({alias}: {alias: string}): Promise<ManagedPrivateKey> {
    alias = `priv-${alias}`;
    const item = await EncryptedStorage.getItem(alias);
    const key: ManagedPrivateKey = JSON.parse(item!);
    if (!key) throw Error('Key not found');
    return key;
  }

  async delete({alias}: {alias: string}) {
    alias = `priv-${alias}`;
    try {
      await EncryptedStorage.removeItem(alias);
      return true;
    } catch {
      return false;
    }
  }

  async import(args: ImportablePrivateKey) {
    try {
      const alias = `priv-${args.alias || uuidv4()}`;
      let existingEntry: ManagedPrivateKey | null = null;
      try {
        existingEntry = await this.get({alias});
      } catch {}
      if (existingEntry && existingEntry.privateKeyHex !== args.privateKeyHex) {
        throw new Error(
          'key_already_exists: key exists with different data, please use a different alias',
        );
      }
      await EncryptedStorage.setItem(alias, JSON.stringify({...args, alias}));
      return {...args, alias};
    } catch (error) {
      throw Error('Something went wrong trying to store private key');
    }
  }
  // Solution for acquiring stored a private key from a kid,
  // necessary for recreating/importing the stored DID.
  static async getPrivateKey(kid: string): Promise<ManagedPrivateKey> {
    kid = `priv-${kid}`;
    try {
      const item = await EncryptedStorage.getItem(kid);
      const key: ManagedPrivateKey = JSON.parse(item!);
      if (!key) throw Error('Key not found');
      return key;
    } catch {
      throw Error('Key not found');
    }
  }

  async list(): Promise<Array<ManagedPrivateKey>> {
    /*
    Not necessary for our implementation of Veramo, and we only store a single key,
    the key for the holder DID. 
    Therefore, simple implementation, return empty list.
    */
    return [];
  }
}
