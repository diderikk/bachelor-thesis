import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IKeyManager,
	IMessageHandler,
} from "@veramo/core";
import { DIDManager, MemoryDIDStore } from "@veramo/did-manager";
import {
  KeyManager,
  MemoryKeyStore,
  MemoryPrivateKeyStore,
} from "@veramo/key-manager";
import { KeyManagementSystem } from "@veramo/kms-local";
import { DIDResolverPlugin } from "@veramo/did-resolver";
import { Resolver } from "did-resolver";
import { getResolver as keyDidResolver } from "key-did-resolver";
import { KeyDIDProvider } from "../utils/did-provider-key";
import { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } from "@veramo/credential-w3c";
import { MessageHandler } from "@veramo/message-handler";
import { JwtMessageHandler } from "@veramo/did-jwt";

// Creats a Veramo agent
const agent = createAgent<
  IDIDManager & IKeyManager & IDataStore & IResolver & ICredentialIssuer & IMessageHandler
>({
  plugins: [
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: {
				local: new KeyManagementSystem(new MemoryPrivateKeyStore())
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
 * Decodes a JWT proof derived from a Verifiable Credential or a Verifiable Presentation. 
 * Uses Veramo MessageHandler <- JwtMessageHandler + W3cMessageHandler
 * JwtMessageHandler handles the JWT string received
 * W3cMessageHandler handles the Credential/Presentation
 * 
 * @param proof JWT string
 * @returns IMessage object if JWT was valid
 */
export const decodeProof = async (proof: string) => {
  return await agent.handleMessage({
    raw: proof,
  })
}
