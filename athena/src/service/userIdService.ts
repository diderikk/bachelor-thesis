import { VerifiableCredential } from "@veramo/core";
import ENV from "../config/env";
import { supabase } from "../config/supabase";
import { createVerifiableCredential } from "../config/veramo";
import { createAgreement } from "../connector/irisConnector";
import FailedAuthenticationError from "../errors/FailedAuthenticationError";
import HashingError from "../errors/HashingError";
import InternalServerError from "../errors/InternalServerError";
import LoginDetails from "../interfaces/service/LoginDetails.interface";
import User from "../interfaces/service/User.interface";
import { toKeyValues } from "../interfaces/verifiable_credential/KeyValues.interface";
import { hash } from "../utils/password";


/**
 * Returns the VC belonging to the user if the users login details are correct.
 * Calls Iris to create new agreement on the blockchain.
 * Saves the did of the VC to the users documentDid list in supabase.
 * @param details The details needed to verify the user along with creating the VC.
 * @throws FailedAuthenticationError if username or password is wrong.
 * @throws InternalServerError if updating the user in supabase fails or the agreement could not be created.
 * @returns The VC.
 */
export const getUserVC = async (details: LoginDetails): Promise<VerifiableCredential> => {
    const getUserRes = await supabase.from<User>(ENV.SUPABASE_USER_TABLE).select("*").eq("personalId", details.personalId).single()
    if(getUserRes.error || getUserRes.data === null) throw new FailedAuthenticationError("Username or password is incorrect.")
    let pass
    try {
        pass = await hash(Buffer.from(details.password), Buffer.from(getUserRes.data.salt, "hex"))
    } catch (error) {
        throw new HashingError("Could not hash password")
    }
    if(pass.hash !== getUserRes.data.hash) throw new FailedAuthenticationError("Username or password is incorrect.")
    const vc = await createVerifiableCredential(details.did, toKeyValues(getUserRes.data))
    const created = await createAgreement(vc.id!, vc.issuer.id, vc.credentialSubject.id!, getUserRes.data.expirationDate)
    if(!created) throw new InternalServerError("Could not create new agreement.")
    getUserRes.data.documentDIDs.push(vc.id!)
    const updateUserRes = await supabase.from<User>(ENV.SUPABASE_USER_TABLE).update(getUserRes.data).eq("id", getUserRes.data.id)
    if(updateUserRes.error || updateUserRes.data === null) throw new InternalServerError("Server cannot handle request currently.")
    return vc
}