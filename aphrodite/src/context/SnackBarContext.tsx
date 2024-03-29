// Inspired by https://kentcdodds.com/blog/how-to-use-react-context-effectively
import * as React from 'react'
import { createContext, useContext, useMemo, useReducer } from "react";

type Action =
  | { type: "loading" }
  | { type: "success"; description?: string }
  | { type: "error"; error: string }
  | { type: "disabled" };
type Dispatch = (action: Action) => void;
export type SnackBarState = {
  show: boolean;
  fadeOut?: boolean;
  loading: boolean;
  description: string;
  color?: string;
};
type SnackBarProviderProps = { children: React.ReactNode };

const initialState = {
  show: false,
  loading: false,
  description: "",
  fadeOut: false,
} as SnackBarState;

const SnackBarContext = createContext<
  { state: SnackBarState; dispatch: Dispatch } | undefined
>(undefined);

const snackBarReducer = (state: SnackBarState, action: Action): SnackBarState => {
  switch (action.type) {
    case "loading": {
      return {
        show: true,
        description: "",
        loading: true,
        color: "#f2d648",
      };
    }
    case "success": {
      return {
        show: false,
        description: action.description ? action.description : "Success",
        color: "#5cb85c",
        loading: false,
        fadeOut: true,
      };
    }
    case "error": {
      return {
        show: false,
        description: "Error: " + action.error,
        color: "#dc3545",
        loading: false,
        fadeOut: true,
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

const SnackBarProvider = ({ children }: SnackBarProviderProps) => {
  const [state, dispatch] = useReducer(snackBarReducer, initialState);

  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <SnackBarContext.Provider value={value}>
      {children}
    </SnackBarContext.Provider>
  );
};

const useSnackBar = () => {
  const context = useContext(SnackBarContext);
  if (context === undefined) {
    throw new Error("useSnackBar must be used within a SnackBarContext");
  }
  return context;
};

export { useSnackBar, SnackBarProvider };