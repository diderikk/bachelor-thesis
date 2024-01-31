import crypto from "crypto"
import ENV from "../config/env"
import HashSaltCombo from "../interfaces/HashSaltCombo.interface"


/**
 * Hashes a password with a salt
 * @param password The password to be hashed
 * @param salt The salt to be used when hashing
 * @returns A structure consisting of a hash and a salt.
 */
export const hash = (password: Buffer, salt: Buffer): Promise<HashSaltCombo> => {
    return new Promise((res, rej) => {
        crypto.pbkdf2(password, salt, ENV.PBKDF2_ITERATIONS, ENV.PBKDF2_KEY_SIZE, "sha512", (err, derviedKey) => {
            return err ? rej(null) : res({hash: derviedKey.toString("hex"), salt: salt.toString("hex")})
        })
    })
}

export const getSalt = () => crypto.randomBytes(ENV.PBKDF2_KEY_SIZE)