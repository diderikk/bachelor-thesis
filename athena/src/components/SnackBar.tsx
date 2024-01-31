import { Close } from "@mui/icons-material";
import { CircularProgress, IconButton, Snackbar } from '@mui/material';
import * as React from 'react';
import { useSnackBar } from '../context/SnackBarContext';
import AlertBar from './AlertBar';

/**
 * SnackBar uses the useSnackBar state to keep track of when state it has.
 * Which effects its content and more.
 */
const SnackBar: React.FC = () => {
  const {state, dispatch} = useSnackBar();
 
  const close = (event: Event | React.SyntheticEvent, reason?: string) => {
    if(reason === "clickaway") return
    dispatch({type: "disabled"})
  }

  if(state.severity === "none") return null
  // span is needed between Snackbar and Alertbar. Don't know why but removing it causes errors in material ui.
  return <Snackbar open={state.show} autoHideDuration={state.loading ? null : 5000}  anchorOrigin={{vertical: "bottom", horizontal: "center"}} onClose={close}>
    <span>
      <AlertBar severity={state.severity} message={state.loading ? "Loading..." : state.description} action={
      state.loading ? <CircularProgress size={20} color="info" />:
      <IconButton onClick={close}>
        <Close />
      </IconButton>} />
    </span>
  </Snackbar>;
};

export default SnackBar;
