import { styled } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

export const CanvasStyled = styled('canvas')`
    width: 100%;
    height: 100%;
`;

export const CanvasContainer = styled(Button)`
    width: 100px;
    height: 50px;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.3);
    &.MuiButton-root:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;
