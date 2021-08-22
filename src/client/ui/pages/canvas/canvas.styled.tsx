import { styled } from '@material-ui/core/styles';

export const PageContainer = styled('div')`
    canvas {
        position: relative;
        border: 5px solid rgba(0, 0, 255, 0.5);
        box-sizing: border-box;
    }
`;

export const ButtonsContainer = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
`;
