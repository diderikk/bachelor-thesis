import { NextApiRequest, NextApiResponse } from "next";
import handleError from "../../../../config/errorHandler";
import runMiddleware from "../../../../config/middleware";
import NotFoundError from "../../../../errors/NotFoundError";
import { DeleteID } from "../../../../interfaces/ids/delete.interface";
import { fetch, invalidate } from "../../../../services/ids";

/**
 * GET /api/v1/ids/{documentDid}
 * DELETE /api/v1/ids/{documentDid}
 * 
 * Endpoint for fetching a single ID agreement or invalidating a single ID agreement
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch a single ID agreement
    if (req.method === "GET") {
      await runMiddleware(req, res);

      const { documentDid } = req.query;
      // Converts URL param to string if was string[]
      const params = typeof documentDid !== "string" ? documentDid[0] : documentDid;

      const response = await fetch(params);
      res.status(200).json(response);
    }
    // Invalidate ID agreement
    else if(req.method === "DELETE") {
      await runMiddleware(req, res);

      const { documentDid } = req.query;
      // Converts URL param to string if was string[]
      const param = typeof documentDid !== "string" ? documentDid[0] : documentDid;
      const response = await invalidate({documentDid: param} as DeleteID);
      res.status(200).json(response);
    } 
    else throw new NotFoundError("URL path not found");
  } catch (err) {
    const { status, response } = handleError(err);
    res.status(status).json(response);
  }
}
