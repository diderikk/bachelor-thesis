import { GetUser } from "../api/v1/GetUser.interface";

//TODO add expiration date 
export interface IdFormData{
    readonly personalId: string;
    readonly password: string;
    readonly forename: string;
    readonly surname: string;
    readonly expirationDate: string;
}

export const toIdFormData = (user: GetUser): IdFormData => {
    return {
        password: "",
        ...user
    }
}