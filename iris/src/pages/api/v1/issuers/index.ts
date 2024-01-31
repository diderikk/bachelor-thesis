import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "../../../../config/middleware";
import NotFoundError from "../../../../errors/NotFoundError";
import { create, index } from "../../../../services/issuers";
import handleError from "../../../../config/errorHandler";
import { check } from "express-validator";
import { CreateIssuerParams } from "../../../../interfaces/issuers/create.interface";

function validations() {
  return [
    check("issuer.issuerName").exists().isString().notEmpty().bail(),
    check("issuer.url").exists().isString().notEmpty().bail(),
    check("issuer.did").exists().isString().notEmpty().bail(),
    check("token").exists().isString().notEmpty().bail(),
  ];
}

/**
 * GET /api/v1/issuers
 * POST /api/v1/issuers
 * 
 * Endpoint for registering an issuer and fetching all registered issuers
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      await runMiddleware(req, res);

      const response = await index();
      res.status(200).json(response);
    } else if (req.method == "POST") {
      await runMiddleware(req, res, validations());

      const params = req.body.issuer as CreateIssuerParams;
      const token = req.body.token as string;
      const response = await create(params, token);

      res.status(201).json(response);
    } else throw new NotFoundError("URL path not found");
  } catch (err) {
    const { status, response } = handleError(err);
    res.status(status).json(response);
  }
}
