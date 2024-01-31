import { check } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "../../../../config/middleware";
import NotFoundError from "../../../../errors/NotFoundError";
import handleError from "../../../../config/errorHandler";
import { verify } from "../../../../services/ids";

function validations() {
  return [
    check("proofToken").exists().isString().notEmpty().bail(),
  ];
}

/**
 * POST /api/v1/verify
 * 
 * Endpoint used for verifying a JWT string derived from a Verifiable Credential or 
 * Verifiable Presentation against a ID agreement that should have been created when the
 * Verifiable Credential was issued
 * 
 * @param req NextApiRequest
 * @param res NextApiRequest
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      await runMiddleware(req, res, validations());

      const params = req.body as string;
      const response = await verify(params);

      res.status(200).json(response);
    } else throw new NotFoundError("URL path not found");
  } catch (err) {
    const { status, response } = handleError(err);
    res.status(status).json(response);
  }
}
