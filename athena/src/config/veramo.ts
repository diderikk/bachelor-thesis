import {
  createAgent, IDataStore, IDIDManager, IKeyManager,
  IMessageHandler, IResolver
} from "@veramo/core";
import { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } from "@veramo/credential-w3c";
import { JwtMessageHandler } from "@veramo/did-jwt";
import { DIDManager } from "@veramo/did-manager";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import {
  KeyManager
} from "@veramo/key-manager";
import { KeyManagementSystem } from "@veramo/kms-local";
import { MessageHandler } from "@veramo/message-handler";
import { Resolver } from "did-resolver";
import { getResolver as keyDidResolver } from "key-did-resolver";
import KeyValues from "../interfaces/verifiable_credential/KeyValues.interface";
import { KeyDIDProvider } from "./did-provider-key";
import { SupabaseDIDStore } from "./supabase-did-store";
import { SupabaseKeyStore, SupabasePrivateKeyStore } from "./supabase-key-store";

// Creates a Veramo agent
const agent = createAgent<
  IDIDManager & IKeyManager & IDataStore & IResolver & ICredentialIssuer & IMessageHandler
>({
  plugins: [
    new KeyManager({
      store: new SupabaseKeyStore(),
      kms: {
				local: new KeyManagementSystem(new SupabasePrivateKeyStore())
      },
    }),
    new DIDManager({
      store: new SupabaseDIDStore(),
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
 * Creates a DID for the issuer if it does not exists in the DID store
 * @returns a DID
 */
const createIssuerDid = async () => {
    const DID = await agent.didManagerCreate({
    alias: 'issuer',
    provider: 'did:key',
    kms: 'local'
  });
  return DID;
};

/**
 * Returns the issuer DID if it exists or creates a new DID with the alias "issuer"
 * @returns Issuer DID
 */
export const getIssuerDID = async () => {
  try {
    return await agent.didManagerGetByAlias({alias: 'issuer'})
  } catch(error) {
	  return await createIssuerDid();
  }
}

/**
 * Creates a Verifiable Credential from an ID for a holder/subject
 * @context, type and issuanceDate is set automatically
 * @param holderDID subject receiving the Verifiable Credential
 * @param values ID object
 * @returns 
 */
export const createVerifiableCredential = async (holderDID: string, values: KeyValues) => {
  // Issuer DID
	const issuerDID = await getIssuerDID();
  // Document DID, unique for each Verifiable Credential
	const DID  = await agent.didManagerCreate();
	return await agent.createVerifiableCredential({
    credential: {
      id: DID.did,
			// Set automatically
      // type: [
      // 	"Verifiable Credentials"
      // ],
      issuer: {
        id: issuerDID.did,
        name: "Athena",
      },
      credentialSubject: {
        id: holderDID,
      	document: values,
      },
    },
    proofFormat: "jwt",
    save: false,
  });
}
