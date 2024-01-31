import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import TextFieldFeedback from "../enum/TextFieldFeedback.enum";
import PersonalIdInput from "./PersonalIdInput";
import SpacedGrid from "./SpacedGrid";


interface Props{
    title:string
    passwordInputTitle: string
    actionComponents: JSX.Element[]
    checkPersonalId: () => void
    checkPassword: () => void
    checkForename: () => void
    checkSurname: () => void
    checkExpiration: () => void
    personalIdStatus: TextFieldFeedback
    passwordStatus: TextFieldFeedback
    forenameStatus: TextFieldFeedback
    surnameStatus: TextFieldFeedback
    expirationStatus: TextFieldFeedback
    personalIdHelperText: string
    passwordHelperText: string
    forenameHelperText: string
    surnameHelperText: string
    expirationHelperText: string
    personalId: string
    password: string
    forename: string
    surname: string
    expirationDate: Date | null
    setPersonalId: Dispatch<SetStateAction<string>>
    setPassword: Dispatch<SetStateAction<string>>
    setForename: Dispatch<SetStateAction<string>>
    setSurname: Dispatch<SetStateAction<string>>
    setExpirationDate: Dispatch<SetStateAction<Date | null>>
}

/**
 * A form for handling ID data.
 * The by default the personalId input only accepts numbers as strings, and hinders the user from entering more than 11. The checkPersonalId function should therefore check that the string is 11 characters long.
 * The expirationData input has a date table, stores a Date.
 * The rest are normal input fields that handle strings.
 * The param types not mentioned in the list (e.g., forename) are the state of the input fields.
 * @param title The title of the form.
 * @param passwordInputTitle The title of the password input field.
 * @param actionComponents The components at the bottom of a form. Responsible for a action, e.g., a submit button.
 * @param check The check params are checks to be done onBlur and e.g., when pressing the submit button. The should change their corresponding status param and helper text param.
 * @param status The status params tell the form which input fields should display errors. Since it is an enum and not a boolean expanding it to display sucess messages is also possible.
 * @param helperText Each helper text param is displayed underneath its corresponding input field.
 * @param set Each set param defines how its corresponding value is to be changed when data is passed to the corresponding input field.
 */
const IdForm = ({title, passwordInputTitle, actionComponents, 
    checkPersonalId, checkPassword, checkForename, checkSurname, checkExpiration,
    personalIdStatus, passwordStatus, forenameStatus, surnameStatus, expirationStatus,
    personalIdHelperText, passwordHelperText, forenameHelperText, surnameHelperText, expirationHelperText,
    personalId, password, forename, surname, expirationDate,
    setPersonalId, setPassword, setForename, setSurname, setExpirationDate
}: Props
    ) => {
    const components = [
        <h1 key='h1'>{title}</h1>,
        //TODO add success colors. Can be done by adding som styling to the input components. As the status enum contains a success variant. This has not been prioritized.
        <PersonalIdInput personalId={personalId}
            setPersonalId={setPersonalId}
            checkPersonalId={checkPersonalId}
            personalIdStatus={personalIdStatus}
            personalIdHelperText={personalIdHelperText}
            key='personalInput'
        ></PersonalIdInput>,
        <TextField label={passwordInputTitle} required
        type="password"
        value={password} onChange={(e) => setPassword(e.target.value)}
        onBlur={checkPassword}
        helperText={passwordHelperText}
        error={passwordStatus === TextFieldFeedback.ERROR}
        key='passwordInput'
        ></TextField>,
        <TextField label="Forename" required
        value={forename} onChange={(e) => setForename(e.target.value)}
        onBlur={checkForename}
        helperText={forenameHelperText}
        error={forenameStatus === TextFieldFeedback.ERROR}
        key='forenameInput'
        ></TextField>,
        <TextField label="Surname" required
        value={surname} onChange={(e) => setSurname(e.target.value)}
        onBlur={checkSurname}
        helperText={surnameHelperText}
        error={surnameStatus === TextFieldFeedback.ERROR}
        key='surnameInput'
        ></TextField>,
        <LocalizationProvider key='datePicker' dateAdapter={AdapterDateFns}>
            <DatePicker 
            label='Expiration date'
            value={expirationDate}
            minDate={Date.now()}
            onChange={(e) => {setExpirationDate(new Date(e!))}}
            renderInput={(params) => 
            <TextField 
                required
                onBlur={checkExpiration} 
                error={expirationStatus=== TextFieldFeedback.ERROR}
                helperText={expirationHelperText}
                {...params} />}
            />
      </LocalizationProvider>,
        ...actionComponents
    ]


    return (
        <SpacedGrid components={components} containerStyle={{marginTop: "20px"}} size={12} verticalSpacingPixels={20} />
    )
}

export default IdForm