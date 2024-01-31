// https://www.youtube.com/watch?v=f687hBjwFcM
import React, { useState } from "react";

/**
 * Idea from Ben Awad (https://github.com/benawad)
 * Simple hook that simplifies React state
 * 
 * Updates state by calling setState(event)
 * Necessary for Component to define a name equal to state name:
 * 
 * <input name="temp" value={state.temp}></input>
 * 
 * @param initialValues Object of keys and values
 * @returns [state, setState]
 */
export const useForm = <T>(
  initialValues: T
): [T, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [values, setValues] = useState<T>(initialValues);

  return [
    values,
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
  ];
};