import ENV from "../config/env";

/**
 * The connector consists of functions that communicate with the centralized backend: Iris.
 */

const url = `http://${ENV.BACKEND_URL}/api/v1/ids`;

const defaultHeaders = {
    "Accept": "application/json",
    'Content-Type': 'application/json',
}

/**
 * Requests that Iris creates an agreement on Kratos on behalf of Athena.
 * @param documentDid The did belonging to the verifiale credential.
 * @param issuerDid The did belonging to the issuer, that issued the verifiable credential.
 * @param holderDid The did belonging to the subject of the verifiable credential.
 * @param expirationDate When the agreement is set to expire. May expire before if revoked.
 * @returns true if agreement was created, else false is returned.
 */
export const createAgreement = async (documentDid: string, issuerDid: string, holderDid: string, expirationDate: string) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: defaultHeaders,
            body: JSON.stringify({
                holderDid,
                documentDid,
                issuerDid,
                expirationDate
            })
        })
        return response.status === 201
    } catch (error){
        return false;
    }
}

/**
 * Requests that Iris revokes an agreement on Kratos on behalf of Athena.
 * @param documentDid The did belonging to the verifiale credential.
 * @returns true if agreement was revoked, else false is returned.
 */
export const revokeAgreements = async (documentDids: string[]) => {
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: defaultHeaders,
            body: JSON.stringify({
                documentDids
            })
        })
        return response.status === 200
    } catch (error) {
        return false
    }
}