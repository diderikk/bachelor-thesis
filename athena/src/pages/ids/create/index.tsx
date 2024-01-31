import { Button } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import IdForm from "../../../components/IdForm";
import { useSnackBar } from "../../../context/SnackBarContext";
import TextFieldFeedback from "../../../enum/TextFieldFeedback.enum";

/**
 * Uses the IdForm component to create a form for regeistering a new user.
 */
const CreateId: NextPage = () => {
    const router = useRouter()
    const { dispatch } = useSnackBar()

    const [personalId, setPersonalId] = useState("")
    const [personalIdStatus, setPersonalIdStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [personalIdHelperText, setPersonalIdHelperText] = useState("11-digit personal ID")

    const setPersonalIdError = () => {
        setPersonalIdStatus(TextFieldFeedback.ERROR)
        setPersonalIdHelperText("Entry must be 11 digits")
    }
    const setPersonalIdSuccess = () => {
        setPersonalIdStatus(TextFieldFeedback.SUCCESS)
        setPersonalIdHelperText("Success")
    }
    const checkPersonalId = () => {
         //+ converts to number or NaN
        if(personalId.length === 11 && !isNaN(+personalId)){
            setPersonalIdSuccess()
            return true
        }
        setPersonalIdError()
        return false
    }

    const [password, setPassword] = useState("")
    const [passwordStatus, setPassworddStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [passwordHelperText, setPasswordHelperText] = useState("Add 12 character password")

    const setPasswordError = () => {
        setPassworddStatus(TextFieldFeedback.ERROR)
        setPasswordHelperText("12 character password required")
    }
    const setPasswordSuccess = () => {
        setPassworddStatus(TextFieldFeedback.SUCCESS)
        setPasswordHelperText("Success")
    }

    //Since this is only a mock issuer and not the main priority of the task this is the only password requirement
    const checkPassword = () => {
        if(password.length >= 12){
            setPasswordSuccess()
            return true
        }
        setPasswordError()
        return false
    }

    const [forename, setForename] = useState("")
    const [forenameStatus, setForenamedStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [forenameHelperText, setForenameHelperText] = useState("Add subjects forename")

    const setForenameError = () => {
        setForenamedStatus(TextFieldFeedback.ERROR)
        setForenameHelperText("Forename must be entered")
    }
    const setForenameSuccess = () => {
        setForenamedStatus(TextFieldFeedback.SUCCESS)
        setForenameHelperText("Success")
    }

    const checkForename = () => {
        if(forename.length > 0){
            setForenameSuccess()
            return true
        }
        setForenameError()
        return false
    }

    const [surname, setSurname] = useState("")
    const [surnameStatus, setSurnamedStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [surnameHelperText, setSurnameHelperText] = useState("Add subjects surname")

    const setSurnameError = () => {
        setSurnamedStatus(TextFieldFeedback.ERROR)
        setSurnameHelperText("Surname must be entered")
    }
    const setSurnameSuccess = () => {
        setSurnamedStatus(TextFieldFeedback.SUCCESS)
        setSurnameHelperText("Success")
    }

    const checkSurname = () => {
        if(surname.length > 0){
            setSurnameSuccess()
            return true
        }
        setSurnameError()
        return false
    }

    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [expirationStatus, setExpirationStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [expirationHelperText, setExpirationHelperText] = useState("Add subjects expiration date")

    const setExpirationError = () => {
        setExpirationStatus(TextFieldFeedback.ERROR)
        setExpirationHelperText("Expiration date must be entered")
    }
    const setExpirationSuccess = () => {
        setExpirationStatus(TextFieldFeedback.SUCCESS)
        setExpirationHelperText("Success")
    }

    const checkExpiration = () => {
        if(expirationDate){
            setExpirationSuccess()
            return true
        }
        setExpirationError()
        return false
    }

    const checkForm = () => {
        //Need to check it this way to ensure all checks run and admin gets feedback about all wrong fields at once
        const checks = [checkPersonalId(), checkPassword(), checkForename(), checkSurname(), checkExpiration()]
        if(checks.some(c => !c)) return false
        return true
    }

    const submit = async () => {
        if(!checkForm()) return
        dispatch({type: "loading"})
        const res = await fetch("/api/v1/users", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                personalId,
                password,
                forename,
                surname,
                expirationDate: expirationDate?.toISOString(),
            })
        })
        if(!res.ok){
            dispatch({ type: "error", error: "Could not create user."})
            return
        }
        const data = await res.json()
        dispatch({type: "success", description: `User created and assigned id: ${data.id}`})
        router.push("/ids")
    }

    return <IdForm 
        title="Add ID"
        passwordInputTitle="Password"
        actionComponents={[
            <Button variant="contained" key='button' style={{color: "white"}} onClick={submit}>Add ID</Button>
        ]}
        personalId={personalId}
        password={password}
        forename={forename}
        surname={surname}
        expirationDate={expirationDate}
        setPersonalId={setPersonalId}
        setPassword={setPassword}
        setForename={setForename}
        setSurname={setSurname}
        setExpirationDate={setExpirationDate}
        personalIdHelperText={personalIdHelperText}
        passwordHelperText={passwordHelperText}
        forenameHelperText={forenameHelperText}
        surnameHelperText={surnameHelperText}
        expirationHelperText={expirationHelperText}
        personalIdStatus={personalIdStatus}
        passwordStatus={passwordStatus}
        forenameStatus={forenameStatus}
        surnameStatus={surnameStatus}
        expirationStatus={expirationStatus}
        checkPersonalId={checkPersonalId}
        checkPassword={checkPassword}
        checkForename={checkForename}
        checkSurname={checkSurname}
        checkExpiration={checkExpiration}
    />
}
export default CreateId