import { ValidationError } from "express-validator";

export default class UnprocessableEntityError extends Error {
	public errors: ValidationError[] | undefined = [];
	constructor(message: string, errors?: ValidationError[]){
		super(message);
		this.name = "UnprocessableEntityError";
		this.errors = errors;
	}
}