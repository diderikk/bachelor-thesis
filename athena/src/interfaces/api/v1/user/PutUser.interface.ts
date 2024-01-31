import { CreateUser } from "../../../service/CreateUser.interface";

export default interface PutUser{
    readonly personalId: string;
    readonly password?: string;
    readonly forename: string;
    readonly surname: string;
    readonly expirationDate: string;
}

export const toCreateUser = (obj: PutUser): CreateUser => {
    return {
        personalId: obj.personalId,
        forename: obj.forename,
        surname: obj.surname,
        password: obj.password ?? "",
        expirationDate: obj.expirationDate ?? "",
    }
}