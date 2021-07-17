import { createTheme } from '@material-ui/core';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7177ff',
        },
        text: {
            primary: '#aaacb4',
            secondary: '#6272a4',
        },
        error: {
            main: '#ff726f',
        },
        warning: {
            main: '#ffb86f',
        },
        success: {
            main: '#71ff6f',
        },
        grey: {
            50: '#FAFAFA',
            100: '#F0F0F0',
            200: '#D7D9DD',
            300: '#C4C4C4',
            400: '#9B9B9B',
        },
        background: {
            default: '#282a36',
            paper: '#343746',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    shape: {
        borderRadius: '3px',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: 14,
                },
            },
        },
    },
});

export default theme;
