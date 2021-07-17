import { styled } from '@material-ui/core/styles';

export const AppStyled = styled('div')`
    color: ${({ theme }) => theme.palette.text.primary};
    background-color: ${({ theme }) => theme.palette.background.default};
    padding: ${({ theme }) => theme.spacing(2) + ' ' + theme.spacing()};
    height: 100vh;
    max-width: 510px;
    box-sizing: border-box;
`;
