import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { NextPage } from "next";
import { useForm } from "../utils/useForm";
import { InputAdornment } from "@mui/material";
import { useRouter } from "next/router";
import { createClient } from "redis";
import { verify } from "../utils/jwt";
import { CreateIssuerParams } from "../../interfaces/issuers/create.interface";

enum Response {
  SUCCESS,
  ERROR,
  NONE,
}

interface RegisterForm {
  name: string;
  url: string;
  did: string;
}

/**
 * Fetches API key from the URL and validates it
 *
 * @param ctx Context object
 * @returns API key
 */
export const getServerSideProps = async (ctx: any) => {
  // Key from URL param
  const key = ctx.params.key;

  // Verifies key against secret and max expiration
  if (!(await verify(key)))
    return {
      notFound: true,
    };

  // Connect to Redis cache
  const cache = createClient({
    url: process.env.REDIS_URL!,
  });
  await cache.connect();

  // Checks if key is not already cached
  const isKeyBlacklisted = await cache.get(key);
  cache.disconnect();
  if (isKeyBlacklisted)
    return {
      notFound: true,
    };

  return {
    props: {
      key,
    },
  };
};

const Registration: NextPage = () => {
  const router = useRouter();

  // Could be replaced by three useState()
  const [inputValues, setInputValues] = useForm<RegisterForm>({
    name: "",
    url: "",
    did: "",
  });
  const [nameError, setNameError] = React.useState<string>("");
  const [urlError, setUrlError] = React.useState<string>("");
  const [didError, setDidError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<Response>(Response.NONE);

  const validateName = () => {
    if (inputValues.name.length === 0) {
      setNameError("Name is missing");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const validateUrl = () => {
    if (inputValues.url.length === 0) {
      setUrlError("URL is missing");
      return false;
    } else {
      setUrlError("");
      return true;
    }
  };

  const validateDid = () => {
    if (inputValues.did.length === 0) {
      setDidError("DID is missing");
      return false;
    } else if (!inputValues.did.startsWith("did:key")) {
      setDidError("Invalid DID");
      return false;
    } else {
      setDidError("");
      return true;
    }
  };

  const validateAll = () => {
    let valid = true;

    valid = validateName();
    valid = validateUrl();
    valid = validateDid();

    return valid;
  };

  const handleSubmit = async () => {
    // Nothing happens if validations fail
    setLoading(true);
    if (!validateAll()) {
      setLoading(false);
      return;
    }

    // API Key
    const key =
      typeof router.query.key !== "string"
        ? router.query.key![0]
        : router.query.key;

    const issuer: CreateIssuerParams = {
      issuerName: inputValues.name,
      url: `https://${inputValues.url}`,
      did: inputValues.did,
    };
    try {
      // Call to API for registering the DID on the blockchain
      const response = await fetch("/api/v1/issuers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issuer, token: key }),
      });

      const json = await response.json();

      if (json.error) setResponse(Response.ERROR);
      else setResponse(Response.SUCCESS);
    } catch (error) {
      setResponse(Response.ERROR);
    }

    setLoading(false);
  };

  const getTitle = () => {
    if (response === Response.ERROR) return "Error, try again!";
    if (response == Response.SUCCESS) return "Registered!";
    return "Issuer Registration";
  };

  const getColor = () => {
    if (response === Response.ERROR) return "red";
    if (response == Response.SUCCESS) return "lightgreen";
    return "";
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        paddingX: "30%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <Typography color={getColor()} variant="h4" component="h1">
        {getTitle()}
      </Typography>
      <TextField
        name="name"
        value={inputValues.name}
        onChange={setInputValues}
        label="Name"
        variant="outlined"
        fullWidth
        helperText={
          nameError.length === 0 ? "Please enter Issuer name" : nameError
        }
        error={nameError.length > 0}
        disabled={loading || response === Response.SUCCESS}
      />
      <TextField
        name="url"
        value={inputValues.url}
        onChange={setInputValues}
        label="URL"
        variant="outlined"
        fullWidth
        helperText={
          urlError.length === 0 ? "Please enter Issuer URL" : urlError
        }
        error={urlError.length > 0}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">https://</InputAdornment>
          ),
        }}
        disabled={loading || response === Response.SUCCESS}
      />
      <TextField
        name="did"
        value={inputValues.did}
        onChange={setInputValues}
        multiline
        label="DID"
        variant="outlined"
        fullWidth
        helperText={
          didError.length === 0 ? "Please enter Issuer DID" : didError
        }
        error={didError.length > 0}
        disabled={loading || response === Response.SUCCESS}
      />
      <LoadingButton
        loading={loading}
        onClick={handleSubmit}
        variant="contained"
        size="large"
        disabled={response === Response.SUCCESS}
      >
        Register
      </LoadingButton>
    </Box>
  );
};

export default Registration;
