import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "../../../../config/middleware";
import NotFoundError from "../../../../errors/NotFoundError";
import { fetchIssuer } from "../../../../services/issuers";
import handleError from "../../../../config/errorHandler";

/**
 * GET /api/v1/issuers/{issuerDid}
 * 
 * Endpoint for fetching a single issuer
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

      const { issuerDid } = req.query;
      // Converts URL param to string if was string[]
      const params = typeof issuerDid !== "string" ? issuerDid[0] : issuerDid;

      const response = await fetchIssuer( params );
      res.status(200).json(response);
    } else throw new NotFoundError("URL path not found");
  } catch (err) {
    const { status, response } = handleError(err);
    res.status(status).json(response);
  }
}
