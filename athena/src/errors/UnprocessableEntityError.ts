import { ValidationError } from "express-validator";

export default class UnprocessableEntityError extends Error {
	public errors: ValidationError[] | undefined = [];
	constructor(message: string, errors?: ValidationError[]){
		super(message);
		//Name is used in handleError to identify the type of error, since .constructor property does not exist.
		this.name = "UnprocessableEntityError";
		this.errors = errors;
	}
}