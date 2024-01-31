import { Button } from "@mui/material"
import { InferGetServerSidePropsType } from "next"
import ErrorPage from "next/error"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import IdForm from "../../../../components/IdForm"
import ENV from "../../../../config/env"
import { useSnackBar } from "../../../../context/SnackBarContext"
import TextFieldFeedback from "../../../../enum/TextFieldFeedback.enum"
import { IdFormData, toIdFormData } from "../../../../interfaces/ui/IdFormData.interface"

/**
 * Loads the user from the backend before the getServerSideProps page is rendered.
 * @param context The context for the request.
 * @returns Either the users' ids and the host address to be used when reloading the users. Or an object containing null for all values.
 */
export async function getServerSideProps(context: any): Promise<{
    props: {
        idData: IdFormData | null;
        statusCode: number;
    }}> {
    const {id} = context.query
    const response = await fetch(`${ENV.PROTOCOL}://${ENV.SERVER_URL}/api/v1/users/${id}`)
    if(response.status !== 200) return {
        props:{
            idData: null,
            statusCode: response.status
    }}
    const data = await response.json()
    const idData = toIdFormData(data)
    return {
      props: {
          idData,
          statusCode: response.status
      }, 
    }
  }

/**
 * Uses the IdForm component to create a form for editing a user.
 */
const EditId = ({idData, statusCode}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter()
    const {id} = router.query
    const {dispatch} = useSnackBar()
    const [password, setPassword] = useState("")
    const [passwordStatus, setPassworddStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [passwordHelperText, setPasswordHelperText] = useState("Add 12 character password")
    const [personalId, setPersonalId] = useState("")
    const [personalIdStatus, setPersonalIdStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [personalIdHelperText, setPersonalIdHelperText] = useState("11-digit personal ID")
    const [forename, setForename] = useState("")
    const [forenameStatus, setForenamedStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [forenameHelperText, setForenameHelperText] = useState("Add subjects forename")
    const [surname, setSurname] = useState("")
    const [surnameStatus, setSurnamedStatus] = useState(TextFieldFeedback.NEUTRAL)
    const [surnameHelperText, setSurnameHelperText] = useState("Add subjects surname")


    useEffect(() => {
        if(idData){
            setPersonalId(idData.personalId);
            setForename(idData.forename);
            setSurname(idData.surname)
        }
    }, [idData])



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



    const setPasswordError = () => {
        setPassworddStatus(TextFieldFeedback.ERROR)
        setPasswordHelperText("12 character password required")
    }
    const setPasswordNeutral = () => {
        setPassworddStatus(TextFieldFeedback.NEUTRAL)
        setPasswordHelperText("Add 12 character password")
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
        //In this case the password is not changed
        if(password.length <= 0) {
            setPasswordNeutral()
            return true
        }
        setPasswordError()
        return false
    }



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

    const [expirationDate, setExpirationDate] = useState<Date | null>( idData?.expirationDate ? new Date(idData?.expirationDate) : null);
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

    const title = `Edit ID: ${id}`

    const handleEdit = async () => {
        if(!checkForm()) return
        dispatch({type: "loading"})
        const res = await fetch(`/api/v1/users/${id}`, {
            method: "put",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: (password.length >= 12) ? JSON.stringify({
                personalId,
                password,
                forename,
                surname,
                expirationDate: expirationDate?.toISOString()
            }) : JSON.stringify({
                personalId,
                forename,
                surname,
                expirationDate: expirationDate?.toISOString()
            })
        })
        if(!res.ok){
            dispatch({type: "error", error: "Could not update user"})
            return
        }
        dispatch({type: "success", description: "User updated"})
    }

    if(idData === null) {
        return <ErrorPage statusCode={statusCode}></ErrorPage>
    }
    
    return <IdForm 
        title={title}
        passwordInputTitle="New password"
        actionComponents={[
            <Button variant="contained" key='button' style={{color: "white"}} onClick={() => {handleEdit()}}>Confirm</Button>,
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

export default EditId