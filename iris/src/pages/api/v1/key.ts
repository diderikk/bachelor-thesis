import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "../../../config/middleware";
import NotFoundError from "../../../errors/NotFoundError";
import handleError from "../../../config/errorHandler";
import { sign } from "../../utils/jwt";

/**
 * GET /api/v1/key
 * 
 * Endpoint for fetching an API Key allowing an issuer to register
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
      if (validateBasicAuthentication(req, res)) {
        const token = await sign();
        res.status(200).json({ key: token });
      }
    } else throw new NotFoundError("URL path not found");
  } catch (err) {
    const { status, response } = handleError(err);
    res.status(status).json(response);
  }
}

// Validates content of authorization header
const validateBasicAuthentication = (
  req: NextApiRequest,
  res: NextApiResponse
): boolean => {
  // Fetch and check Authorization header
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Basic ")
  ) {
    res.status(401).send("Unauthorized");
    return false;
  }
  // Splits and converts credentials from base64
  const base64Credentials = req.headers.authorization!.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  // Validates username and password against environment variables
  const [username, password] = credentials.split(":");
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(401).send("Unauthorized");
    return false;
  }

  return true;
};
