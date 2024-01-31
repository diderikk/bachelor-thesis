import { TextField } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import TextFieldFeedback from "../enum/TextFieldFeedback.enum"

interface Props {
    personalId: string
    setPersonalId: Dispatch<SetStateAction<string>>
    personalIdHelperText: string
    checkPersonalId: () => void
    personalIdStatus: TextFieldFeedback
}

/**
 * An input field that handles personal id (a number of 11 digits).
 * Only allows numbers as input and a maxiumum of 11 characters.
 * @param checkPersonalId Checks to be done onBlur. Should change the personalIdStatus param and personalIdHelperText param.
 * @param personalIdStatus The status tell the input fields when it should display errors. Since it is an enum and not a boolean expanding it to display sucess messages is also possible.
 * @param personalIdHelperText The helper textto be displayed underneath the input field.
 * @param setPersonalId Defines how personalId is to be changed when data is passed to the input field.
 */
const PersonalIdInput = ({personalId, setPersonalId, personalIdHelperText, checkPersonalId, personalIdStatus}: Props) => {
    return <TextField required value={personalId} onChange={(e) => {
        const text = e.target.value
        if(isNaN(+text) || text.length > 11) return
        setPersonalId(text)
    }}
    label="Personal ID"
    helperText={personalIdHelperText}
    onBlur={checkPersonalId}
    error={personalIdStatus === TextFieldFeedback.ERROR}
    ></TextField>
}

export default PersonalIdInput