export default class ExpiredEntityError extends Error {
	constructor(message: string){
		super(message);
		this.name = "ExpiredEntityError";
	}
}