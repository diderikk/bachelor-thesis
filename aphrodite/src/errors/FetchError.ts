export class FetchError extends Error{
    readonly statusCode: number

    constructor(_message: string, _statusCode: number) {
        super(_message)
        this.name = "FetchError"
        this.statusCode = _statusCode
    }

}