export interface CreateIssuerParams {
	did: string;
	issuerName: string;
	url: string;
}

export interface CreateIssuerResponse {
	blockHash: string;
	publicKey: string;
}

