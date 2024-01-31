export interface CreateIDParams {
	documentDid: string;
	issuerDid: string;
	holderDid: string;
	expirationDate: string;
}

export interface CreateIDResponse {
	blockHash: string;
	publicKey: string;
}

