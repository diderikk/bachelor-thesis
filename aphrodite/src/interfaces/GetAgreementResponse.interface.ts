export default interface GetAgreementResponse {
    holderDid: string, 
    documentDid: string, 
    issuerDid: string, 
    expirationDate: string, 
    valid:boolean
}