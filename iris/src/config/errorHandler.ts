import logger from "./logger";
import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import ErrorResponse from "../interfaces/errors/ErrorResponse.interface";

/**
 * Creates an error response with a status and a body for 
 * a given error that should be defined in the errors/ directory
 * 
 * If the error is not defined in the errors/ directory,
 * the function returns an "Unknown error" body
 * 
 * @param err Error or unknown
 * @returns ErrorResponse
 */
const handleError = (err: unknown) => {
  if (err instanceof Error) {
    logger.error(err.name);

    switch (err.name) {
      case "NotFoundError":
        return {
          status: 404,
          response: { error: err.message },
        } as ErrorResponse;
      case "UnprocessableEntityError":
        const tempError = err as UnprocessableEntityError;
        if (tempError.errors)
          return {
            status: 422,
            response: { errors: tempError.errors },
          } as ErrorResponse;
        return {
          status: 422,
          response: { error: err.message },
        } as ErrorResponse;
      case "InternalServerError":
        return {
          status: 500,
          response: { error: err.message },
        } as ErrorResponse;
      case "ExpiredEntityError":
        return {
          status: 410,
          response: { error: err.message },
        } as ErrorResponse;
      case "InvalidDidError":
        return {
          status: 400,
          response: { error: err.message },
        } as ErrorResponse;
    }
  }
  return { status: 500, response: { error: "Unknown Error" } } as ErrorResponse;
};

export default handleError;
