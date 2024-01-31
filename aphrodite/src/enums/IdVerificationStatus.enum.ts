enum IdVerificationStatus {
    INVALID_SIGNATURE = "Invalid signature",
    REVOKED = "Revoked",
    EXPIRED = "Expired",
    INVALID_ISSUER = "Invalid issuer",
    DOES_NOT_EXIST = "Does not exist",
    INVALID_HOLDER = "Invalid holder",
    ERROR = "Error",
    SUCCESS = "Success"
}

export default IdVerificationStatus