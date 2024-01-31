import React, { useContext, useState } from "react"

//TODO maybe handle remove null. But it can be good because it will crash the application rather than some placeholder keys which will destroy the logic but not crash.
const IsPINCodeSetContext = React.createContext<boolean>(false)
const IsPINCodeSetUpdateContext = React.createContext<React.Dispatch<React.SetStateAction<boolean>>|null>(null)

export const useIsPINCodeSetContext = () => useContext(IsPINCodeSetContext)
export const useIsPINCodeSetUpdateContext = () => useContext(IsPINCodeSetUpdateContext)

export const IsPINCodeSetProvider  = ({children}: {children?: React.ReactNode})=> {
    const [isPINCodeSet, setIsPINCodeSet] = useState<boolean>(false)

    return (
        <IsPINCodeSetContext.Provider value={isPINCodeSet}>
            <IsPINCodeSetUpdateContext.Provider value={setIsPINCodeSet}>
                {children}
            </IsPINCodeSetUpdateContext.Provider>
        </IsPINCodeSetContext.Provider>)
}