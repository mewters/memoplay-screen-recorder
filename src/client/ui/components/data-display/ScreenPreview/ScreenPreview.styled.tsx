import { styled } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

export const VideoStyled = styled('video')`
    width: 100%;
    height: 100%;
    &:picture-in-picture {
        width: 350px;
        background-color: red;
    }
`;

export const VideoContainer = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'isPip',
})<{ isPip: boolean }>`
    display: flex;
    width: 100px;
    aspect-ratio: 9/16;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    overflow: hidden;
    padding: 0;
    &.MuiButton-root:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    ${handlePip}
`;

function handlePip({ isPip }: { isPip: boolean }): string {
    if (isPip) {
        return `
            video{
                visibility: hidden;
            }
        `;
    }
    return '';
}
