/**
 * Styles the message param and presents it as an error message.
 * @param message The message to be displayed.
 */
const ErrorMessage = ({message}: {message: string}) => {
    return <h1 style={{width: "100%", marginLeft:"auto", marginRight: "auto", textAlign: "center"}}>
        {message}
    </h1>
}

export default ErrorMessage