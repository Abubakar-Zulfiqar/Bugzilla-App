import { createContext, useMemo, useState } from "react";

import { createTheme, ThemeProvider } from "@mui/material";

export const ColorModeContext = createContext({
    toggleMode: () => { },
    mode: 'light'
})

const themeobj = {
    dark: {
        background: {
            default: 'black'
        }
    }
}

export const ColorModeContextProvider = ({ children }) => {
    const [mode, setMode] = useState('light')

    const colorMode = useMemo(
        () => ({
            toggleMode: () =>
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')),
            mode,
        }),
        [mode])

    const theme = useMemo(() => createTheme({
        palette: {
            mode: mode,
            ...themeobj[mode]
        }
    }), [mode])

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}