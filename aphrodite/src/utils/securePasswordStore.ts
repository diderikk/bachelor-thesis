import { IIdentifier } from "@veramo/core";
import EncryptedStorage from 'react-native-encrypted-storage';
import "../../shim.js";
import ENV from "../config/env";
import { SecurePasswordStoreErrorFeedback } from "../enums/SecurePasswordStoreErrorFeedback.enum";
import HashSaltCombo from "../interfaces/HashSaltCombo.interface";
import WalletCredentials from "../interfaces/WalletCredentials.interface";
import { createWallet, importWallet } from "../veramo/veramo";
import { getSalt, hash } from "./password";

/**
 * Creates a new user account if there is not already one on the device
 * @param password The password the user wants to sign up with
 * @returns A promise of either false of an error occured, or the generated wallet address belonging to the user
 */
export const signUp = async (password:string): Promise<string|SecurePasswordStoreErrorFeedback> => {

    const salt = getSalt()
    let pass
    try {
        pass = await hash(Buffer.from(password), salt)
    } catch (error) {
        return SecurePasswordStoreErrorFeedback.PBKDF2_ERROR
    }
    const exists = await userExists()
    if(exists) return SecurePasswordStoreErrorFeedback.USER_ALREADY_EXISTS
    //TODO handle error
    let walletDid: IIdentifier
    try {
        walletDid = await createWallet()
    } catch (error) {
        return SecurePasswordStoreErrorFeedback.DID_ERROR
    }
    try {
        //Assigning to constant to verify correct type
        const credentials: WalletCredentials = {
            did: walletDid,
            hashSalt: pass
        }
        await EncryptedStorage.setItem(ENV.SECURE_STORE_USER_KEY, JSON.stringify(credentials))
    } catch (error) {
        return SecurePasswordStoreErrorFeedback.STORE_ERROR
    }
    return walletDid.did
}

/**
 * Will delete the user and all user's IDs
 */
export const resetDevice = async (): Promise<boolean> => {
    try {
        await EncryptedStorage.clear()
        return true
    } catch (error) {
        return false
    }
}

/**
 * Checks if the user has entered the correct password
 * @param password The users password
 * @returns A promise of either false of an error occured, or the generated wallet keys belonging to the user
 */
export const verify = async (password: string): Promise<string|SecurePasswordStoreErrorFeedback> => {
    let credentials: WalletCredentials
    try {
        const credentialsString = await EncryptedStorage.getItem(ENV.SECURE_STORE_USER_KEY)
        if(credentialsString === null) return SecurePasswordStoreErrorFeedback.STORE_ERROR
        credentials = JSON.parse(credentialsString)
    } catch (error) {
        return SecurePasswordStoreErrorFeedback.STORE_ERROR
    }

    let newHash: HashSaltCombo
    try {
         //The salt needs to be converted to a buffer, and since it is stored as a hex that needs to be its format
         newHash = await hash(Buffer.from(password), Buffer.from(credentials.hashSalt.salt, "hex"))
    } catch (error) {
        return SecurePasswordStoreErrorFeedback.PBKDF2_ERROR
    }

    if(credentials.hashSalt.hash === newHash.hash) {
        await importWallet(credentials.did)
        return credentials.did.did
    }
    return SecurePasswordStoreErrorFeedback.WRONG_PASSWORD
}

/**
 * Checks if the device already has a user
 * @returns A promise containing either true or false
 */
export const userExists = async (): Promise<boolean> => {
    try{
        const credentials = await EncryptedStorage.getItem(ENV.SECURE_STORE_USER_KEY)
        return credentials !== null
    } catch(error){
        return false
    }
}