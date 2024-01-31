export interface DeleteID {
	documentDid: string;
}

export interface DeleteIDs {
	documentDids: string[];
}

export interface DeleteIDResponse {
	blockHash: string;
	publicKey: string;
}