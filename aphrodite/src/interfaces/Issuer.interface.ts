export default interface Issuer {
    name: string;
    //Public key used as ID and to verify that the issud credentials sent to the wallet are correct
    publicKey: string;
}