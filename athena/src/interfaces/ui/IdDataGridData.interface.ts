import { GetUser } from "../api/v1/GetUser.interface";

export interface IdDataGridData {
    readonly id: number;
    readonly personalId: string;
    readonly forename: string;
    readonly surname: string;
    readonly expirationDate: string;
}

export const toIdDataGridData = (user: GetUser): IdDataGridData => {
    return {
        ...user
    }
}