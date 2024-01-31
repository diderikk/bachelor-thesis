import moment from "moment"
import IdVerificationStatus from "../enums/IdVerificationStatus.enum"
import { FetchError } from "../errors/FetchError"
import KeyValues from "../interfaces/KeyValues.interface"
import { decodeProof } from "../veramo/veramo"
import { fetchAgreement } from "./fetchActions"

/**
 * Verifies a JWT token against Veramo MessageHandler and a ID agreement stored on smart contract
 * @param proof Read from a QR-code
 * @returns Validation status and decoded document object
 */
export const handleId = async (proof: string): Promise<{status: IdVerificationStatus, data: KeyValues}> => {
    //TODO Maybe decode individuel credentials. But we think veramo does that for us.
    const decodedProof = await decodeProof(proof)
    if(decodedProof === null || !decodedProof.credentials) return {status: IdVerificationStatus.INVALID_SIGNATURE, data: {} }
    let blockchainData
    try{
        const promises = decodedProof.credentials.map(vc => {
            return fetchAgreement(vc.id!)
        })
        blockchainData = await Promise.all(promises)
    } catch (error) {
        if(error instanceof FetchError && error.statusCode === 404) return {status: IdVerificationStatus.DOES_NOT_EXIST, data: {} }
        else return {status: IdVerificationStatus.ERROR, data: {} }
    }
    if(blockchainData.length !== decodedProof.credentials.length) return {status: IdVerificationStatus.INVALID_SIGNATURE, data: {}}
    if(blockchainData.some(d => !d.valid)) return {status: IdVerificationStatus.REVOKED, data: {} }
    if(blockchainData.some(d => moment(d.expirationDate).diff(moment(),"days") <= 0)) return {status: IdVerificationStatus.EXPIRED, data: {} }
    /*
     TODO
     Currently this is not actually safe
     But the task works under the assumption that to create an agreement an Issuer needs to prove itself
     */
    const holderData: KeyValues = {}
    for(let i = 0; i < blockchainData.length; i++) {
        if(blockchainData[i].issuerDid !== decodedProof.credentials[i].issuer.id) return {status: IdVerificationStatus.INVALID_ISSUER, data: {} }
        if(blockchainData[i].holderDid !== decodedProof.from) return {status: IdVerificationStatus.INVALID_HOLDER, data: {}}
        Object.keys(decodedProof.credentials[i].credentialSubject.document).forEach((key) => {
            holderData[key] = decodedProof.credentials![i].credentialSubject.document[key]
        })
    }
    return {status: IdVerificationStatus.SUCCESS, data: holderData}
}
