// https://github.com/uport-project/veramo/blob/next/packages/did-provider-key/src/key-did-provider.ts
/*
  NB! This file was fetched from the link above and used because of an error using the provider class from the 
  NPM package "did-provider-key". The error occured when creating DIDs with the "did:key" provider. Copying the file and 
  using the exported class below instead solved the problem. 
*/

import {
    IIdentifier,
    IKey,
    IService,
    IAgentContext,
    IKeyManager,
  } from '@veramo/core';
  import {AbstractIdentifierProvider} from '@veramo/did-manager';
  import Multibase from 'multibase';
  import Multicodec from 'multicodec';
  
  
  type IContext = IAgentContext<IKeyManager>;
  
  /**
   * {@link @veramo/did-manager#DIDManager} identifier provider for `did:key` identifiers
   *
   * @alpha
   */
  export class KeyDIDProvider extends AbstractIdentifierProvider {
    private defaultKms: string;
  
    constructor(options: {defaultKms: string}) {
      super();
      this.defaultKms = options.defaultKms;
    }
  
    async createIdentifier(
      {kms, options}: {kms?: string; options?: any},
      context: IContext,
    ): Promise<Omit<IIdentifier, 'provider'>> {
      const key = await context.agent.keyManagerCreate({
        kms: kms || this.defaultKms,
        type: 'Ed25519',
      });
  
      const methodSpecificId = Buffer.from(
        Multibase.encode(
          'base58btc',
          Multicodec.addPrefix(
            'ed25519-pub',
            Buffer.from(key.publicKeyHex, 'hex'),
          ),
        ),
      ).toString();
  
      const identifier: Omit<IIdentifier, 'provider'> = {
        did: 'did:key:' + methodSpecificId,
        controllerKeyId: key.kid,
        keys: [key],
        services: [],
      };
      return identifier;
    }
  
    async deleteIdentifier(
      identifier: IIdentifier,
      context: IContext,
    ): Promise<boolean> {
      for (const {kid} of identifier.keys) {
        await context.agent.keyManagerDelete({kid});
      }
      return true;
    }
  
    async addKey(
      {
        identifier,
        key,
        options,
      }: {identifier: IIdentifier; key: IKey; options?: any},
      context: IContext,
    ): Promise<any> {
      throw Error('KeyDIDProvider deleteIdentity not supported');
    }
  
    async addService(
      {
        identifier,
        service,
        options,
      }: {identifier: IIdentifier; service: IService; options?: any},
      context: IContext,
    ): Promise<any> {
      throw Error('KeyDIDProvider addService not supported');
    }
  
    async removeKey(
      args: {identifier: IIdentifier; kid: string; options?: any},
      context: IContext,
    ): Promise<any> {
      throw Error('KeyDIDProvider removeKey not supported');
    }
  
    async removeService(
      args: {identifier: IIdentifier; id: string; options?: any},
      context: IContext,
    ): Promise<any> {
      throw Error('KeyDIDProvider removeService not supported');
    }
  }
  