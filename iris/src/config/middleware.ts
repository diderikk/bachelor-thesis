import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { ValidationChain, validationResult } from "express-validator";
import logger from "./logger";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "OPTION", "POST", "PUT", "DELETE"],
  origin: ["localhost:8080"],
});

/**
 * Executes a middleware function on the Request and Response Next objects
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param fn function
 * @returns Promise<void>
 */
function initMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

/**
 * Creates a middleware function for executing all express-validations asynchronously
 * 
 * @param validations Parameter validation for received request
 * @returns 
 */
function validateMiddleware(validations: ValidationChain[] | []) {
  return async (req: NextApiRequest, _res: NextApiResponse, next: any) => {
    await Promise.all(
      validations.map((validation: any) => validation.run(req))
    );
    return next();
  };
}

/**
 * Used for initializing CORS and execute validations on request parameters
 * 
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param validations express validations
 * @throws UnprocessableEntityError if a validation failed
 */
async function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  validations?: ValidationChain[] | []
) {
  logger.info(`Incomming request: ${req.method} ${req.url}`);
  await initMiddleware(req, res, cors);
  if (validations)
    await initMiddleware(req, res, validateMiddleware(validations));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new UnprocessableEntityError(
      "Request did not contain required parameters",
      errors.array({ onlyFirstError: true })
    );
  }
}

export default runMiddleware;
