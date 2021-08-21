import { styled } from '@material-ui/core/styles';

export const PageContainer = styled('div')`
    max-width: 510px;
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
    padding: ${({ theme }) => theme.spacing(2) + ' ' + theme.spacing()};
    height: 100vh;
    box-sizing: border-box;
`;

export const MainContainer = styled('div', {
    shouldForwardProp: (prop) => prop != 'isRecording',
})<{ isRecording: boolean }>`
    display: grid;

    align-items: center;

    gap: ${({ theme }) => theme.spacing()};

    ${({ isRecording }) => {
        if (isRecording) {
            return `
                grid-template-columns: 100px 1fr;
                grid-template-areas: 'previews controls';
            `;
        }
        return `
            grid-template-columns: 100px 1fr 80px;
            grid-template-areas: 'previews sources controls';
        `;
    }}
`;

export const PreviewsContainer = styled('div')`
    grid-area: previews;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing()};
`;

export const SourceSelectorContainer = styled('div', {
    shouldForwardProp: (prop) => prop != 'isRecording',
})<{ isRecording: boolean }>`
    grid-area: sources;
    display: ${({ isRecording }) => (isRecording ? 'none' : 'flex')};
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing()};
`;

export const ControlsContainer = styled('div', {
    shouldForwardProp: (prop) => prop != 'isRecording',
})<{ isRecording: boolean }>`
    display: flex;
    gap: ${({ theme }) => theme.spacing(2)};
    grid-area: controls;
    justify-self: center;
    justify-content: space-between;
    width: ${({ isRecording }) => (isRecording ? '100%' : '')};
`;

export const ButtonsContainer = styled('div')`
    display: flex;
    gap: ${({ theme }) => theme.spacing(2)};
`;

export const FileNameContainer = styled('div')`
    display: grid;
    grid-template-columns: 1fr 160px 80px;
    gap: ${({ theme }) => theme.spacing()};
    margin-top: ${({ theme }) => theme.spacing()};
    align-items: center;
`;
