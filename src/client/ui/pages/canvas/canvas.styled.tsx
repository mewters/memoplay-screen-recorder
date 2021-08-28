import { Tabs, ToggleButtonGroup } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Theme } from '@material-ui/system';

export const PageContainer = styled('div')`
    canvas {
        position: relative;
        /* border: 5px solid rgba(0, 0, 255, 0.5); */
        box-sizing: border-box;
    }
`;

export const ButtonsContainer = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
    width: max-content;
`;

export const ButtonGroupStyled = styled(ToggleButtonGroup)`
    gap: 1px;

    .MuiToggleButton-root {
        background-color: ${({ theme }) => theme.palette.primary.main};
        &:hover {
            background-color: ${({ theme }) => theme.palette.primary.light};
            opacity: 0.8;
        }
        &.Mui-selected {
            background-color: ${({ theme }) => theme.palette.primary.dark};
        }
    }
`;

export const DialogTabs = styled(Tabs)`
    .MuiButtonBase-root,
    .MuiButtonBase-root.Mui-selected,
    .MuiSlider-sizeMedium.MuiSlider-root {
        color: white;
    }

    .MuiTabs-indicator {
        background-color: white;
    }
`;

export const BrushPreview = styled('div')<{
    strokeWidth: number;
    color: string;
}>`
    position: relative;
    text-align: center;
    background-color: ${handleBrushPreviewBackground};
    padding: ${({ theme }) => theme.spacing()};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
    transition: all 0.2s ease-in-out;

    &::after {
        content: '';
        display: inline-block;
        width: ${({ strokeWidth }) => strokeWidth}px;
        height: ${({ strokeWidth }) => strokeWidth}px;
        background-color: ${({ color }) => color};
        border-radius: 100%;
        transition: all 0.2s ease-in-out;
    }
`;

function handleBrushPreviewBackground(props: { theme: Theme; color: string }) {
    return isDark(props.color) ? 'white' : props.theme.palette.background.paper;
}

function isDark(color: string) {
    const rgb = color.match(
        /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
    );
    return (
        rgb &&
        rgb.length === 4 &&
        (parseInt(rgb[1], 10) + parseInt(rgb[2], 10) + parseInt(rgb[3], 10)) /
            3 <
            128
    );
}
