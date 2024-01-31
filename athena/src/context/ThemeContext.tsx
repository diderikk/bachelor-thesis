import { createTheme, ThemeProvider } from "@mui/material"

//Createing a new material ui theme. Only the main color is changed.
const theme = createTheme({
    palette:{
        primary: {
            main: "#EFC88B"
        }
    }
})

/**
 * Creates a provider containing the theme "theme" which is provided as the theme for all children components.
 * @param children React components to get access to the theme.
 * @returns ThemeProvider containting the theme "theme".
 */
const ThemeContext = ({children}: {children?: React.ReactNode}) => {
    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
}

export default ThemeContext