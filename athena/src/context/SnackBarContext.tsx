// Inspired by https://kentcdodds.com/blog/how-to-use-react-context-effectively
import * as React from 'react';
import { createContext, useContext, useMemo, useReducer } from "react";

type Action =
  { type: "loading" }
  | { type: "success"; description?: string }
  | { type: "error"; error: string }
  | { type: "disabled" };
type Dispatch = (action: Action) => void;

export type SnackBarSeverity = "none" | "success" | "error" | "info"

export type SnackBarState = {
  show: boolean;
  loading: boolean;
  description: string;
  severity: SnackBarSeverity;
};
type SnackBarProviderProps = { children: React.ReactNode };

const initialState = {
  show: false,
  loading: false,
  description: "",
  severity: "none"
} as SnackBarState;

// React create context
const SnackBarContext = createContext<
  { state: SnackBarState; dispatch: Dispatch } | undefined
>(undefined);

// Reducer handling action, updates state depending on action type
const snackBarReducer = (state: SnackBarState, action: Action): SnackBarState => {
  switch (action.type) {
    case "loading": {
      return {
        show: true,
        description: "",
        loading: true,
        severity: "info",
      };
    }
    case "success": {
      return {
        show: true,
        description: action.description ?? "Success",
        severity: "success",
        loading: false,
      };
    }
    case "error": {
      return {
        show: true,
        description: "Error: " + action.error,
        severity: "error",
        loading: false,
      };
    }
    case "disabled": {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
};
/**
 * Creates a reducer and Provider
 * 
 * @param param0 React nodes
 * @returns A React Provider for the Context
 */
const SnackBarProvider = ({ children }: SnackBarProviderProps) => {
  // useReducer is used to create a React reducer
  // state is current state of the reducer, equal to state in useState hook
  // dispatch is a function used for updating the state
  const [state, dispatch] = useReducer(snackBarReducer, initialState);

  // Creates a memozation of the reducer
  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <SnackBarContext.Provider value={value}>
      {children}
    </SnackBarContext.Provider>
  );
};
/**
 * Initializes the context and returns it
 * @throws Error if context is used outside of the Provider
 * @returns Returns the context created above
 */
const useSnackBar = () => {
  const context = useContext(SnackBarContext);
  if (context === undefined) {
    throw new Error("useSnackBar must be used within a SnackBarContext");
  }
  return context;
};

export { useSnackBar, SnackBarProvider };
