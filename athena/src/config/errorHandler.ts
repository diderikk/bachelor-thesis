import UnprocessableEntityError from "../errors/UnprocessableEntityError";
import ErrorResponse from "../interfaces/errors/ErrorResponse.interface";
import logger from "./logger";

/**
 * Takes an unknown object and creates an ErrorResponse object from it if the unknown object is of the class hierarchy Error.
 * @param err An unknown object.
 * @returns ErrorResponse containing a http status and a response containing an error message in the error property.
 */
const handleError = (err: unknown) => {
  if (err instanceof Error) {
    logger.error(err.name);
    //cannot switch on instanceof or err.constructor meaning there is no natural way to check the subclass of err.
    //can however use the name property and switch on that.
    switch (err.name) {
      case "FailedAuthenticationError":
        return {
          status: 401,
          response: { error: err.message },
        } as ErrorResponse
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
        case "HashingError":
            return {
                status: 500,
                response: { error: err.message}
            } as ErrorResponse
    }
  }
  return { status: 500, response: { error: "Unknown Error" } } as ErrorResponse;
};

export default handleError;
