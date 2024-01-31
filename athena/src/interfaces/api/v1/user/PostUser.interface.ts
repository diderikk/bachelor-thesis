import { CreateUser } from "../../../service/CreateUser.interface";

export default interface PostUser{
    readonly personalId: string;
    readonly password: string;
    readonly forename: string;
    readonly surname: string;
    readonly expirationDate: string;
}

export const toId = (obj: PostUser): CreateUser => {
    return {
        ...obj
    }
}