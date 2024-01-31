export default class NotFoundError extends Error {
	constructor(message: string){
		super(message);
		//Name is used in handleError to identify the type of error, since .constructor property does not exist.
		this.name = "NotFoundError";
	}
}