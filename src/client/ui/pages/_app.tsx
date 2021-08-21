import React, { useMemo } from 'react';
import { ThemeProvider } from '@material-ui/core';
import '../styles/global.css';

import theme from '../themes/theme';
import { AppStyled } from './_app.styled';
import Index from './index';
import Canvas from './canvas/canvas';

export default function App() {
    const Page = useMemo(() => {
        const page = new URL(window.location.href).searchParams.get('page');

        switch (page) {
            case 'canvas':
                return <Canvas />;
            default:
                return <Index />;
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AppStyled>{Page}</AppStyled>
        </ThemeProvider>
    );
}
