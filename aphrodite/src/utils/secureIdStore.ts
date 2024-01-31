import EncryptedStorage from 'react-native-encrypted-storage';
import ENV from '../config/env';
import { SecureIdStoreErrorFeedback } from '../enums/SecureIdStoreFeedback.enum';
import { IdCard } from '../interfaces/IdCard.interface';
import IdCardNicknameList from '../interfaces/IdCardNicknameListinterface';
import { removeNullOrUndefined } from './array';

/**
 * Creates and stores the list contining the name and order of every ID added
 * Only creates if the list does not already exist.
 * @returns SecureIdStoreFeedback based on the result. Success if either the list exists or has been created.
 */
export const createIdCardList = async () => {
  try {
    const res = await EncryptedStorage.getItem(ENV.SECURE_STORE_ID_CARD_LIST_KEY);
    //Is success because it already exists and dont need to be created
    if (res !== null) return SecureIdStoreErrorFeedback.SUCCESS;
    const defaultObj: IdCardNicknameList = {values: []};
    EncryptedStorage.setItem(ENV.SECURE_STORE_ID_CARD_LIST_KEY, JSON.stringify(defaultObj));
    return SecureIdStoreErrorFeedback.SUCCESS;
  } catch (error) {
    return SecureIdStoreErrorFeedback.STORE_ERROR;
  }
};

//TODO Maybe automatic assignment of id inside function is better
/**
 * Saves the identity document to the keychain
 */
export const saveId = async (idCard: IdCard) => {
  try {
    const res = await EncryptedStorage.getItem(ENV.SECURE_STORE_ID_CARD_LIST_KEY);
    if (res === null)
      return SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT;
    const idNicknames: IdCardNicknameList = JSON.parse(res);
    // Checks if the ID has already been added
    if (idNicknames.values.includes(idCard.nickname))
      return SecureIdStoreErrorFeedback.ID_NICKNAME_OCCUPIED;

    /*
        TODO maybe check if an id is in use with the same provider
        Only allowing one ID per provdier would hinder people storing others IDs on their devices
        Don't think ID providers issue multiple IDs for the same person as this defeats 
        the purpose of ids.
        */

    try {
      await EncryptedStorage.setItem(
        idCard.nickname.toString(),
        JSON.stringify(idCard),
      );
    } catch (error) {
      return SecureIdStoreErrorFeedback.STORE_ERROR;
    }

    idNicknames.values.push(idCard.nickname);
    try {
      await EncryptedStorage.setItem(
        ENV.SECURE_STORE_ID_CARD_LIST_KEY,
        JSON.stringify(idNicknames),
      );
    } catch (error) {
      //TODO maybe errorhandle this
      await EncryptedStorage.removeItem(idCard.nickname.toString());
      return SecureIdStoreErrorFeedback.STORE_ERROR;
    }
    return SecureIdStoreErrorFeedback.SUCCESS;
  } catch (error) {
    return SecureIdStoreErrorFeedback.STORE_ERROR;
  }
};

/**
 * Retrieves the specified identity document from the keychain
 */
export const getId = async (idNickname: string): Promise<IdCard | SecureIdStoreErrorFeedback> => {
  try {
    const res = await EncryptedStorage.getItem(idNickname);
    if (res === null) return SecureIdStoreErrorFeedback.ID_ABSENT;
    return JSON.parse(res);
  } catch (error) {
    return SecureIdStoreErrorFeedback.STORE_ERROR;
  }
};

/**
 * Retrieves all identity documents from the keychain
 */
export const getAllIds = async (): Promise<IdCard[] | SecureIdStoreErrorFeedback> => {
  try {
    const res = await EncryptedStorage.getItem(ENV.SECURE_STORE_ID_CARD_LIST_KEY);
    if (res === null)
      return SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT;
    const idCardNicknames: IdCardNicknameList = JSON.parse(res);
    const promises: Promise<string | null>[] = [];
    idCardNicknames.values.forEach(e => {
      promises.push(EncryptedStorage.getItem(e));
    });
    const idRes = await Promise.all(promises);
    //Remove null or undefined is more type safe than filter
    const ids: IdCard[] = removeNullOrUndefined(idRes).map(id =>
      JSON.parse(id),
    );
    return ids;
  } catch (error) {
    return SecureIdStoreErrorFeedback.STORE_ERROR;
  }
};

/**
 * Edits an exisiting Id stored on device
 * @param idNickname
 * @returns SecureIdStoreErrorFeedback value for if it was successful or not
 */
export const editId = async (
  idNickname: string,
  newColor: string,
  newNickname: string,
) => {
  try {
    const res = await EncryptedStorage.getItem(ENV.SECURE_STORE_ID_CARD_LIST_KEY);
    if (res === null)
      return SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT;
    const idNicknames: IdCardNicknameList = JSON.parse(res);
    // Checks if nickname already exists
    if (idNicknames.values.includes(newNickname))
      return SecureIdStoreErrorFeedback.ID_NICKNAME_OCCUPIED;

    // Fetches the IdCard from storage
    const item = await EncryptedStorage.getItem(idNickname);
    if (item === null) return SecureIdStoreErrorFeedback.ID_ABSENT;
    const idCard: IdCard = JSON.parse(item!);

    const oldNickname = idCard.nickname;
    // Updates the idCard
    try {
      idCard.colorCode = newColor;
      idCard.nickname = newNickname;
      await EncryptedStorage.setItem(newNickname, JSON.stringify(idCard));
    } catch (error) {
      return SecureIdStoreErrorFeedback.STORE_ERROR;
    }
    // Replaces old nickname with new nickname
    idNicknames.values[idNicknames.values.indexOf(oldNickname)] = newNickname;

    // Updates the ID card list
    try {
      await EncryptedStorage.setItem(
        ENV.SECURE_STORE_ID_CARD_LIST_KEY,
        JSON.stringify(idNicknames),
      );
    } catch (error) {
      await EncryptedStorage.removeItem(newNickname);
      return SecureIdStoreErrorFeedback.STORE_ERROR;
    }

    await EncryptedStorage.removeItem(oldNickname);

    return SecureIdStoreErrorFeedback.SUCCESS;
  } catch (error) {
    return SecureIdStoreErrorFeedback.STORE_ERROR;
  }
};

/**
 * Deletes an ID stored on device
 * @param idNickname
 * @returns a feedback value dependent on the outcome
 */
export const deleteId = async (idNickname: string) => {
  try {
    const res = await EncryptedStorage.getItem(ENV.SECURE_STORE_ID_CARD_LIST_KEY);
    if (res === null)
      return SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT;
    const idNicknames: IdCardNicknameList = JSON.parse(res);

    if (!idNicknames.values.includes(idNickname))
      return SecureIdStoreErrorFeedback.ID_ABSENT;

    const oldNicknames = idNicknames;
    idNicknames.values = idNicknames.values.filter(
      nickname => nickname !== idNickname,
    );
    await EncryptedStorage.setItem(
      ENV.SECURE_STORE_ID_CARD_LIST_KEY,
      JSON.stringify(idNicknames),
    );

    try {
      await EncryptedStorage.removeItem(idNickname);
    } catch (error) {
      await EncryptedStorage.setItem(
        ENV.SECURE_STORE_ID_CARD_LIST_KEY,
        JSON.stringify(oldNicknames),
      );
      return SecureIdStoreErrorFeedback.STORE_ERROR;
    }
    return SecureIdStoreErrorFeedback.SUCCESS;
  } catch (error) {
    return SecureIdStoreErrorFeedback.STORE_ERROR;
  }
};
