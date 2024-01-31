import {
  createAgent, IDataStore, IDIDManager, IIdentifier, IKeyManager,
  IMessageHandler, IResolver, MinimalImportableKey, VerifiableCredential
} from "@veramo/core";
import { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } from "@veramo/credential-w3c";
import { JwtMessageHandler } from "@veramo/did-jwt";
import { DIDManager, MemoryDIDStore } from "@veramo/did-manager";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import {
  KeyManager
} from "@veramo/key-manager";
import { KeyManagementSystem } from "@veramo/kms-local";
import { MessageHandler } from "@veramo/message-handler";
import { Resolver } from "did-resolver";
import { getResolver as keyDidResolver } from "key-did-resolver";
import { KeyDIDProvider } from "./did-provider-key";
import { SecureKeyStore, SecurePrivateKeyStore } from "./secure-key-store";
import moment from "moment";

const agent = createAgent<
  IDIDManager & IKeyManager & IDataStore & IResolver & ICredentialIssuer & IMessageHandler
>({
  plugins: [
    new KeyManager({
      store: new SecureKeyStore(),
      kms: {
				local: new KeyManagementSystem(new SecurePrivateKeyStore())
      },
    }),
    new DIDManager({
      store: new MemoryDIDStore(),
      defaultProvider: "did:key",
      providers: {
        "did:key": new KeyDIDProvider({
          defaultKms: "local",
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...keyDidResolver(),
      }),
    }),
		new CredentialIssuer(),
		new MessageHandler({
			messageHandlers: [new JwtMessageHandler(), new W3cMessageHandler()]
		})
  ],
});

/**
 * Import an existing DID into the Veramo agent
 * 
 * @param identifier DID
 */
export const importWallet = async (identifier: IIdentifier) => {
  const keys : MinimalImportableKey[] = await Promise.all(identifier.keys.map(async k => {
    const managedPrivateKey = await SecurePrivateKeyStore.getPrivateKey(k.kid);

    return {
      privateKeyHex: managedPrivateKey.privateKeyHex,
      type: k.type,
      kms: k.kms,
      publicKeyHex: k.publicKeyHex,
      kid: k.kid
    } as MinimalImportableKey
  }));
  await agent.didManagerImport({
    keys,
    controllerKeyId: identifier.controllerKeyId,
    alias: identifier.alias,
    services: identifier.services,
    provider: identifier.provider,
    did: identifier.did,
  })
}

/**
 * Creates a holder DID 
 * @returns Decentralized Identifier
 */
export const createWallet = async () => {
    const DID = await agent.didManagerCreate({
    alias: 'holder',
    provider: 'did:key',
    kms: 'local'
  });
  return DID;
};

/**
 * Creates a Verifiable Presentation from one or many Verifiable Credentials and a holder DID 
 * 
 * @param holderDid 
 * @param verifiableCredentials 
 * @returns Verifiable Presentation
 */
export const createVerifiablePresentation = async (holderDid: string, verifiableCredentials: VerifiableCredential[]) => {
  return agent.createVerifiablePresentation({
    presentation: {
      holder: holderDid,
      verifiableCredential: verifiableCredentials,
    },
    proofFormat: 'jwt',
    save: false
  })
}

/**
 * Decodes JWT and returns the data if the proof is valid
 * Returns null if not valid
 */
export const decodeProof = async (proof: string) => {
  try {
    //Throws error whenever token is not valid
    const res = await agent.handleMessage({raw: proof})
    return res
  } catch (error) {
    return null
  }
  
}