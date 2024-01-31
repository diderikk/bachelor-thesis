import { IKey } from "@veramo/core"
import { ManagedPrivateKey } from "@veramo/key-manager"

export default interface IssuerDIDKeys{
    readonly kid: string
    //Public and private key are represented as JSON in database
    readonly publicKey?: IKey
    readonly privateKey?: ManagedPrivateKey
}