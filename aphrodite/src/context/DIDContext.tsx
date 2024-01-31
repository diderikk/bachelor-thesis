import React, { useState, useContext  } from "react"

//TODO maybe handle remove null. But it can be good because it will crash the application rather than some placeholder keys which will destroy the logic but not crash.
const DidContext = React.createContext<string|null>(null)
const DidUpdateContext = React.createContext<React.Dispatch<React.SetStateAction<string | null>>|null>(null)

export const useDid = () => useContext(DidContext)
export const useDidUpdate = () => useContext(DidUpdateContext)

export const DidProvider  = ({children}: {children?: React.ReactNode})=> {
    const [did, setDid] = useState<string|null>(null)

    return (
        <DidContext.Provider value={did}>
            <DidUpdateContext.Provider value={setDid}>
                {children}
            </DidUpdateContext.Provider>
        </DidContext.Provider>)
}