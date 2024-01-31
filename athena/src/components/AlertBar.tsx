import Alert from '@mui/material/Alert';
import { SnackBarSeverity } from '../context/SnackBarContext';

interface Props {
    severity: SnackBarSeverity
    message: string
    action?: React.ReactNode
}

/**
 * An alert bar to be used inside a SnackBar.
 * Displays different colors and logos based on the severity.
 * @param severity Available types success, info, error and none. If none the AlertBar will not be displayed.
 * @param message The message to be displayed.
 * @param action Optional, the react node to be placed on the right side of the alert bar. E.g., a close button.
 */
const AlertBar = ({severity, message, action}: Props ) => {
    if(severity === "none") return null
    return <Alert severity={severity} action={action}>
        {message}
    </Alert>
}

export default AlertBar