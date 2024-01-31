import React from 'react';
import App from './App';
import { IsPINCodeSetProvider } from './context/isPINCodeSetContext';

const AppWrapper = () => {
    return (<IsPINCodeSetProvider>
        <App></App>
    </IsPINCodeSetProvider>)

}

export default AppWrapper