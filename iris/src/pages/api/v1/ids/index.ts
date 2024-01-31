import { check } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import handleError from "../../../../config/errorHandler";
import runMiddleware from "../../../../config/middleware";
import NotFoundError from "../../../../errors/NotFoundError";
import { CreateIDParams } from "../../../../interfaces/ids/create.interface";
import { DeleteIDs } from "../../../../interfaces/ids/delete.interface";
import { create, invalidateMany } from "../../../../services/ids";

function validations() {
  return [
    check("holderDid").exists().isString().notEmpty().bail(),
    check("documentDid").exists().isString().notEmpty().bail(),
    check("issuerDid").exists().isString().notEmpty().bail(),
    check("expirationDate").exists().isString().notEmpty().bail(),
  ];
}

/**
 * POST /api/v1/ids
 * DELETE /api/v1/ids
 * 
 * Endpoint for creating a single ID agreement or invalidating multiple ID agreements
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Create an ID agreement
    if (req.method === "POST") {
      await runMiddleware(req, res, validations());

      const params = req.body as CreateIDParams;
      const response = await create(params);
      res.status(201).json(response);
    } 
    // Delete multiple ID agreements
    else if(req.method === "DELETE") {
      await runMiddleware(req, res);

      const params = req.body as DeleteIDs;
      await invalidateMany(params);
      res.status(200).end();
    } 
    else throw new NotFoundError("URL path not found");
  } catch (err) {
    const { status, response } = handleError(err);
    res.status(status).json(response);
  }
}
