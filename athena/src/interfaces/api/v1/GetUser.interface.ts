import User from "../../service/User.interface";
import UserDetails from "../../service/UserDetails.interface";

export interface GetUser{
    readonly id: number;
    readonly personalId: string;
    readonly forename: string;
    readonly surname: string;
    readonly expirationDate: string;
}

export function userToGetUser (user: User): GetUser {
    const val = JSON.parse(JSON.stringify(user))
    delete val.hash
    delete val.salt
    delete val.issuerDIDs
    return val as GetUser
}

export function userDetailsToGetUser (user: UserDetails): GetUser {
    return {
        ...user
    }
}