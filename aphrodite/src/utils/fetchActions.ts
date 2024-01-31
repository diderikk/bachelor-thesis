import CreateIdResponse from '../interfaces/CreateIdResponse.interface';
import GetAgreementResponse from '../interfaces/GetAgreementResponse.interface';
import ProviderResponse from '../interfaces/ProviderResponse.interface';
import fetchInstance from './fetchInstance';


//TODO add error handling to methods by observer pattern and snackbar

export const addIdentityDocument = async (
  issuerID: string,
  document: string,
  walletAddress: string,
) => {
    return await fetchInstance.post('ids/', {issuerID, documentHash: document, walletAddress}) as CreateIdResponse;
};

export const fetchProviders = async () => {
  return await fetchInstance.get('issuers/') as ProviderResponse[];
}

export const fetchProvider = async (issuerName: string) => {
  return await fetchInstance.get(`issuers/${issuerName}`) as ProviderResponse
}

export const fetchAgreement = async (documentDid: string) => {
  return await fetchInstance.get(`ids/${documentDid}`) as GetAgreementResponse
}

export const deleteId = async (documentDid: string) => {
  return await fetchInstance.delete(`ids/${documentDid}`);
}
