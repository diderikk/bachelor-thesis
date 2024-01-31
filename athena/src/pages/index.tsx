
import { Button, Container, TextField } from '@mui/material'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import PersonalIdInput from '../components/PersonalIdInput'
import SpacedGrid from '../components/SpacedGrid'
import { useSnackBar } from '../context/SnackBarContext'
import TextFieldFeedback from '../enum/TextFieldFeedback.enum'
import PostLogin from '../interfaces/api/v1/login/PostLogin.interface'

/**
 * Web page that handles logging in to get a VC sent to the user vie websocket.
 * Is mainly used as an embedded web page in the mobile application Aphrodite when adding an ID.
 * The web page requires the query param did. Which is the did of the VC subject to be used when creating an agreement and the VC.
 * When used as an embedded web page in Aphrodite the walletDid is sent as the query param.
 * @returns ErrorMessage component if the did is not sent in the query. The login form if the did is in the query.
 */
const Home: NextPage = () => {
  const router = useRouter();
  const { state, dispatch } = useSnackBar()
  const { query } = useRouter()
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

  // Guards ensuring that the correct url params are entered
  if(typeof query.did !== "string") return <ErrorMessage message="Need to provide a DID as string in url query"/>

  const submit = async () => {
      const details: PostLogin = {
          personalId,
          password,
          //Since type is checked for above, the params can be assumed as strings
          did: query.did as string
      }
      dispatch({type:"loading"})
      const res = await fetch("/api/v1/login", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(details),
      })
      if(!res.ok) {
        if(res.status === 401) { dispatch({type: "error", error: "Personal id or password is wrong"}) }
        else { dispatch({type: "error", error: "Could not create verifiable credential"}) }
        return
      }
      const data = await res.json()
      dispatch({type:"success", description: "Credentials sent."})
      router.push("/success")
  }

  const components = [
        <h1 key='h1'>Log in</h1>,
        <PersonalIdInput personalId={personalId}
              setPersonalId={setPersonalId}
              checkPersonalId={checkPersonalId}
              personalIdStatus={personalIdStatus}
              personalIdHelperText={personalIdHelperText}
              key='personalInput'
          ></PersonalIdInput>,
        <TextField label="Password" required
          type="password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          key='textInput'
          ></TextField>,
        <Button disabled={state.loading} variant="contained" key='button' style={{color:"white"}} onClick={submit}>Submit</Button>
  ]

  return (
    <Container maxWidth="md" style={{marginTop:"30px"}}>
      <SpacedGrid components={components} containerStyle={{marginTop: "20px"}} size={12} verticalSpacingPixels={20} />
    </Container>  
  )
}

export default Home
