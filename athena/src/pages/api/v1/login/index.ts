import { check } from "express-validator"
import { NextApiRequest, NextApiResponse } from "next"
import handleError from "../../../../config/errorHandler"
import runMiddleware from "../../../../config/middleware"
import setupWebSocket from "../../../../config/websocket"
import NotFoundError from "../../../../errors/NotFoundError"
import { toLoginDetails } from "../../../../interfaces/api/v1/login/PostLogin.interface"
import { getUserVC } from "../../../../service/userIdService"

//Validating the request to make sure that the parameters are correct.
function validations() {
    return [
        check("personalId").exists().isNumeric().withMessage("Must be a numeric string").isLength({min: 11, max:11}).withMessage("Must consist of 11 digits").bail(),
        check("password").exists().isString().bail(),
        check("did").exists().isString().withMessage("Must be a string").bail()
    ]
}

/**
 * Handles POST requests.
 * @param req The request.
 * @param res The response.
 * @throws NotFoundError if req does not use POST.
 * @returns Http status 201 and the verifiable credential.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try{
        if(req.method !== "POST") throw new NotFoundError("Method for entity does not exist.")
        await runMiddleware(req, res, validations())
        //Returning User details instead of JWT token because this is only a mock issuer, and the user is only ever supposed to read the data.
        const result = await getUserVC(toLoginDetails(req.body))
        await setupWebSocket(res, result);
        res.status(201).json(result)
    } catch (err) {
        const { status, response } = handleError(err);
        res.status(status).json(response);
    } 
  }