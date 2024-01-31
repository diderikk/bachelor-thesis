import { IIdentifier } from "@veramo/core";
import  HashSaltCombo  from "./HashSaltCombo.interface";

export default interface WalletCredentials {
    did: IIdentifier,
    hashSalt: HashSaltCombo
}