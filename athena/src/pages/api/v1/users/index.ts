import { check } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import handleError from "../../../../config/errorHandler";
import runMiddleware from "../../../../config/middleware";
import NotFoundError from "../../../../errors/NotFoundError";
import { userDetailsToGetUser } from "../../../../interfaces/api/v1/GetUser.interface";
import DeleteUsers from "../../../../interfaces/api/v1/user/DeleteUsers.interface";
import { toCreateUser } from "../../../../interfaces/api/v1/user/PutUser.interface";
import { createUser, deleteUsers, getUsersDetails } from "../../../../service/adminIdService";

function postValidations() {
    return [
        check("personalId").exists().isNumeric().withMessage("Must be a numeric string").isLength({min: 11, max:11}).withMessage("Must consist of 11 digits").bail(),
        check("forename").exists().isString().notEmpty().bail(),
        check("surname").exists().isString().notEmpty().bail(),
        check("password").exists().isString().withMessage("Must be a string").isLength({min: 12}).withMessage("Password must have 12 characters or more").bail(),
        check("expirationDate").exists().isString().withMessage("Must be a string").notEmpty().isISO8601().bail()
    ]
}

function deleteValidations() {
    return [
        check("ids").exists().isArray().isNumeric().notEmpty().bail()
    ]
}

/**
 * Handles GET, POST and DELETE requests.
 * @param req The request.
 * @param res The response.
 * @throws NotFoundError if req does not use GET, POST or DELETE.
 * @returns POST: Http status 201 and the details of the new user.
 * @returns GET: Http status 200 and the details of all users.
 * @returns DELETE: Http status 204
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try{
        if(req.method !== "GET" && req.method !== "POST" && req.method !== "DELETE") throw new NotFoundError("Method for entity does not exist.")
        //Create new entity
        if(req.method === "POST"){
            await runMiddleware(req, res, postValidations())
            const result = await createUser(toCreateUser(req.body))
            res.status(201).json(userDetailsToGetUser(result))
            return
        }
        //Deletes entities.
        if(req.method === "DELETE"){
            const ids = (req.body as DeleteUsers).ids
            await runMiddleware(req, res, deleteValidations())
            await deleteUsers(ids)
            res.status(204).end()
            return
        }
        //GETs entities
        await runMiddleware(req, res);
        const response = await getUsersDetails()
        res.status(200).json(response.map(user => userDetailsToGetUser(user)))
    } catch (err) {
        const { status, response } = handleError(err);
        res.status(status).json(response);
    } 
  }
  