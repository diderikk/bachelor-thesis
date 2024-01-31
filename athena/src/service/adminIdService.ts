import ENV from "../config/env"
import { supabase } from "../config/supabase"
import { revokeAgreements } from "../connector/irisConnector"
import HashingError from "../errors/HashingError"
import InternalServerError from "../errors/InternalServerError"
import NotFoundError from "../errors/NotFoundError"
import { CreateUser } from "../interfaces/service/CreateUser.interface"
import DeleteUserDetails from "../interfaces/service/DeleteUserDetails.interface"
import User from "../interfaces/service/User.interface"
import UserDetails, { toUserDetails } from "../interfaces/service/UserDetails.interface"
import { getSalt, hash } from "../utils/password"

/**
 * Gets the details of all users in supabase.
 * @throws NotFound if there are no users to get.
 * @returns The details of all users.
 */
export const getUsersDetails = async () => {
    const { data, error } = await supabase.from<UserDetails>(ENV.SUPABASE_USER_TABLE).select("id, personalId, forename, surname, expirationDate")
    if(error || data === null) throw new NotFoundError("Entities not found")
    return data
}

/**
 * Gets the details of a user in supabase.
 * @param id The id of the user.
 * @throws NotFound if there is no user with the given id.
 * @returns The details of the selected user.
 */
export const getUserDetails = async (id: string) => {
    const { data, error } = await supabase.from<UserDetails>(ENV.SUPABASE_USER_TABLE).select("id, personalId, forename, surname, expirationDate").eq("id", id).single()
    if(error || data === null) throw new NotFoundError("Entities not found")
    return data
}

/**
 * Gets a user in supabase.
 * @param id The id of the user.
 * @throws NotFound if there is no user with the given id.
 * @returns The selected user.
 */
const getUser = async (id: string) => {
    const { data, error } = await supabase.from<User>(ENV.SUPABASE_USER_TABLE).select("*").eq("id", id).single()
    if(error || data === null) throw new NotFoundError("Entities not found")
    return data
}

/**
 * Gets the id and documentDids belonging to the selcted users in supabase.
 * @param ids The ids of the users.
 * @throws NotFound if there are no users with the given ids.
 * @returns The id and documentDids belonging to the selcted users.
 */
const getSelectedUsersDocumentDids = async (ids: string[]) => {
    const { data, error } = await supabase.from<DeleteUserDetails>(ENV.SUPABASE_USER_TABLE).select("id, documentDIDs").in("id", ids.map(id => +id))
    if(error || data === null) throw new NotFoundError("Entities not found")
    return data
}

/**
 * Creates a user and stores it in supabase with a hashed and salted password.
 * @param user The user to be created.
 * @throws InternalServerError if the user could not be stored.
 * @throws HashingError if the hash and salt process could not be completed.
 * @returns The details of the stored user.
 */
//TODO add error handling for unique property personalId
export const createUser = async (user: CreateUser) => {
    const salt = getSalt()
    let pass
    try {
        pass = await hash(Buffer.from(user.password), salt)
    } catch (error) {
        throw new HashingError("Could not hash password")
    }
    const createdUser = {
        personalId: user.personalId,
        hash: pass.hash,
        salt: pass.salt,
        forename: user.forename,
        surname: user.surname,
        expirationDate: user.expirationDate,
        documentDIDs: []
    }
    const { data, error } = await supabase.from<User>(ENV.SUPABASE_USER_TABLE).insert([createdUser]).single()
    if(error || data === null) throw new InternalServerError("Entity could not be created")
    return toUserDetails(data)
}


/**
 * Edits the identity document with the specified by replacing its values with that of the identityDocument param.
 * Hash and salt is only changed if a valid password is sent along.
 * @param identifier The identifier string of the id.
 * @param identityDocument The values to replace the old ones.
 * @throws InternalSevrerError if an error occured during updating the row in supabase.
 * @throws HashingError if an error occured during hashing and salting the new password.
 * @returns The details of the edited user.
 */
//TODO add error handling for unique property personalId
export const editUser = async (id: string, editedUser: CreateUser) => {
    const user = await getUser(id)
    user.personalId = editedUser.personalId
    user.forename = editedUser.forename
    user.surname = editedUser.surname
    //Only editing password if it is defined and has a valid length.
    if(editedUser.password && editedUser.password.length >= 12) {
        const salt = getSalt()
        let pass
        try {
            pass = await hash(Buffer.from(editedUser.password), salt)
        } catch (error) {
            throw new HashingError("Could not hash password")
        }
        user.hash = pass.hash
        user.salt = pass.salt
    }
    const { data, error } = await supabase.from<User>(ENV.SUPABASE_USER_TABLE).update(user).eq("id", user.id).single()
    if(error || data === null) throw new InternalServerError("Entity could not be updated")
    return toUserDetails(data)
}

/**
 * Removes users from the user table and returns them.
 * @param identifiers the identifiers of the users to be deleted.
 * @throws Inernal server error if the element does not exist.
 * @returns The deleted users.
 */
export const deleteUsers = async (identifiers: string[]) => {
    const users = await getSelectedUsersDocumentDids(identifiers)
    //Gathers all documentDids from every user into a list.
    const documentDids:string[] = users.flatMap(user => user.documentDIDs)
    //Only revoking agreements if there are any to revoke
    if(documentDids.length > 0) {
        // Requests revoking all agreemenets from the blockchain.
        const deleted = await revokeAgreements(documentDids)
        if(!deleted) throw new InternalServerError("Could not revoke agreements.")
    }
    const { data, error } = await supabase.from<User>(ENV.SUPABASE_USER_TABLE).delete().in("id", identifiers)
    if(error || data === null || data.length === 0) throw new InternalServerError("No entities could be deleted")
    return data
}