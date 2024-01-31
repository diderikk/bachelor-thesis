import LoginDetails from "../../../service/LoginDetails.interface"

export default interface PostLogin{
    readonly personalId: string
    readonly password: string
    readonly did: string
}

export const toLoginDetails = (obj: PostLogin): LoginDetails => {
    return {
        ...obj
    }
}