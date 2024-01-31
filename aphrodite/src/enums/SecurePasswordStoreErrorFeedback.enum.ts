
/**
 * Contains the what may have gone wrong when using the password storage
 */
export enum SecurePasswordStoreErrorFeedback {
    PBKDF2_ERROR,
    STORE_ERROR,
    USER_ALREADY_EXISTS,
    DID_ERROR,
    WRONG_PASSWORD
}
