import { check } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import handleError from "../../../../config/errorHandler";
import runMiddleware from "../../../../config/middleware";
import NotFoundError from "../../../../errors/NotFoundError";
import { userDetailsToGetUser } from "../../../../interfaces/api/v1/GetUser.interface";
import { toCreateUser } from "../../../../interfaces/api/v1/user/PutUser.interface";
import { editUser, getUserDetails } from "../../../../service/adminIdService";

function validations () {
    return [
        check("personalId").exists().isNumeric().withMessage("Must be a numeric string").isLength({min: 11, max:11}).withMessage("Must consist of 11 digits").bail(),
        check("forename").exists().isString().notEmpty().bail(),
        check("surname").exists().isString().notEmpty().bail(),
        check("password").if(check("password").exists().isLength({min:0}).bail()).isString().withMessage("Must be a string").isLength({min: 12}).withMessage("Password mus have 12 characters").bail(),
        check("expirationDate").exists().isString().withMessage("Must be a string").notEmpty().isISO8601().toDate().bail()
    ]
}

/**
 * Handles GET and PUT requests.
 * @param req The request.
 * @param res The response.
 * @throws NotFoundError if req does not use GET or PUT.
 * @returns GET: Http status 200 and the details of the requested user.
 * @returns PUT: Https status 200 and the details of the edited user.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try{
        const {id} = req.query
        if(req.method !== "GET" && req.method !== "PUT") throw new NotFoundError("Method for entity does not exist.")
        //Edit existing entity
        if(req.method === "PUT"){
            await runMiddleware(req, res, validations())
            const result = await editUser(id as string, toCreateUser(req.body))
            res.status(200).json(userDetailsToGetUser(result))
            return
        }
        //GETs an entity
        await runMiddleware(req, res);
        const result = await getUserDetails(id as string)
        res.status(200).json(userDetailsToGetUser(result))
        return
    } catch (err) {
        const { status, response } = handleError(err);
        res.status(status).json(response);
    }
  }