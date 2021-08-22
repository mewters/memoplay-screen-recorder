import React from 'react';
import { FabricJSCanvas } from 'fabricjs-react';
import { Button, ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { ChromePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faCircle,
    faFont,
    faMousePointer,
    faPen,
    faSquare,
} from '@fortawesome/free-solid-svg-icons';

import {
    PageContainer,
    ButtonsContainer,
    ButtonGroupStyled,
} from './canvas.styled';
import useCanvas from '../../../data/hooks/pages/useCanvas.page';
import { FabricDrawingToolId } from '../../../data/3rdPlugins/fabric/fabricDrawingClass';

export default function Canvas() {
    const {
        startDrawTool,
        startArrowTool,
        startRectangleTool,
        startCircleTool,
        startSelectTool,
        startTextTool,
        selectTool,
        selectedTool,
        onReady,
        updateColor,
        color,
        backgroundColor,
        updateBackgroundColor,
    } = useCanvas();

    return (
        <PageContainer>
            <ButtonsContainer>
                <input type="color" value={color} onChange={updateColor} />
                {/* <Popover open={true}>
                    <ChromePicker
                        color={backgroundColor}
                        onChange={updateBackgroundColor}
                    />
                </Popover> */}
                <ButtonGroupStyled
                    value={selectedTool}
                    exclusive
                    onChange={(_event, value) => {
                        selectTool(value);
                    }}
                >
                    <ToggleButton value={FabricDrawingToolId.Select}>
                        <FontAwesomeIcon icon={faMousePointer} />
                    </ToggleButton>
                    <ToggleButton value={FabricDrawingToolId.Pencil}>
                        <FontAwesomeIcon icon={faPen} />
                    </ToggleButton>
                    <ToggleButton value={FabricDrawingToolId.LineArrow}>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </ToggleButton>
                    <ToggleButton value={FabricDrawingToolId.Circle}>
                        <FontAwesomeIcon icon={faCircle} />
                    </ToggleButton>
                    <ToggleButton value={FabricDrawingToolId.Rectangle}>
                        <FontAwesomeIcon icon={faSquare} />
                    </ToggleButton>
                </ButtonGroupStyled>

                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={startTextTool}
                >
                    <FontAwesomeIcon icon={faFont} />
                </Button>
            </ButtonsContainer>
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </PageContainer>
    );
}
