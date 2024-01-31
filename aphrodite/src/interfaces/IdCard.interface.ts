import {VerifiableCredential, VerifiablePresentation} from '@veramo/core';

export interface IdCard {
  //Nickname is also used as id
  nickname: string;
  colorCode: string;
  credential: VerifiableCredential | VerifiablePresentation;
}

export const instanceOfVerifiableCredential = (
  obj: any,
): obj is VerifiableCredential => {
  return (
    Object.keys(obj).length >= 3 &&
    typeof obj.id === 'string' &&
    typeof obj.issuer.name === 'string' &&
    typeof obj.issuer.id === 'string' &&
    typeof obj.type[0] === 'string' &&
    typeof obj.credentialSubject.id === 'string' &&
    typeof obj.proof === 'object' &&
    typeof obj.proof.type === 'string'
  );
};

export const instanceOfVerifiablePresentation = (
  obj: any,
): obj is VerifiablePresentation => {
  return (
    Object.keys(obj).length >= 3 &&
    typeof obj.holder === 'string' &&
    typeof obj.type[0] === 'string' &&
    typeof obj.issuanceDate === 'string' &&
    typeof obj.proof === 'object' &&
    typeof obj.proof.type === 'string' &&
    typeof obj.proof.jwt === 'string'
  );
};

/**
 * Checks if object is of type the interface Id card.
 * There is a small loophole in the values and issuer properties inside the idData object, but this is a helper function to be used by the developers.
 * and not directly with user input, and also the best current solution that may be found.
 */
export const instanceOfIdCard = (obj: any): obj is IdCard => {
  return (
    (Object.keys(obj).length === 3 &&
      typeof obj.nickname === 'string' &&
      typeof obj.colorCode === 'string' &&
      instanceOfVerifiableCredential(obj.credential)) ||
    instanceOfVerifiablePresentation(obj.credential)
  );
};
