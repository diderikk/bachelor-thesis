import User from "./User.interface";

export default interface UserDetails {
   readonly id: number;
   readonly personalId: string;
   readonly forename: string;
   readonly surname: string;
   readonly expirationDate: string;
}

export const toUserDetails = (user: User) => {
    const obj = JSON.parse(JSON.stringify(user))
    delete obj.hash
    delete obj.salt
    delete obj.issuerDIDs
    return obj as UserDetails
}
