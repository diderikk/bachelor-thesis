export default interface User {
    readonly id: number;
    personalId: string;
    hash: string;
    salt: string;
    forename: string;
    surname: string;
    //Using string, since default JS Date api is bad
    expirationDate: string;
    readonly documentDIDs: string[];
}
