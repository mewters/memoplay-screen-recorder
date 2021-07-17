import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import '../styles/global.css';

import theme from '../themes/theme';
import Index from './index';
import { AppStyled } from './_app.styled';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppStyled>
                <Router>
                    <Switch>
                        <Route path="/" component={Index} />
                    </Switch>
                </Router>
            </AppStyled>
        </ThemeProvider>
    );
}
