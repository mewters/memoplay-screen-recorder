import React from 'react';
import { FabricJSCanvas } from 'fabricjs-react';
import { Button } from '@material-ui/core';
import { ChromePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faCircle,
    faClone,
    faCopy,
    faCut,
    faEraser,
    faFont,
    faMousePointer,
    faPaste,
    faPen,
    faRedo,
    faSquare,
    faTrash,
    faUndo,
} from '@fortawesome/free-solid-svg-icons';

import { PageContainer, ButtonsContainer } from './canvas.styled';
import useCanvas from '../../../data/hooks/pages/useCanvas.page';

export default function Canvas() {
    const {
        toggleDrawMode,
        startArrow,
        onReady,
        updateColor,
        color,
        backgroundColor,
        updateBackgroundColor,
        editor,
        deleteObject,
        copy,
        paste,
        cut,
        duplicate,
        newTextbox,
        undo,
        redo,
    } = useCanvas();

    return (
        <PageContainer>
            <ButtonsContainer>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={toggleDrawMode}
                >
                    <FontAwesomeIcon icon={faPen} />
                </Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={startArrow}
                >
                    Arrow
                </Button>
                <Button
                    variant={'contained'}
                    onClick={() => editor?.deleteAll()}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button
                    variant={'contained'}
                    color={'error'}
                    onClick={deleteObject}
                >
                    <FontAwesomeIcon icon={faEraser} />
                </Button>
                <input type="color" value={color} onChange={updateColor} />
                <ChromePicker
                    color={backgroundColor}
                    onChange={updateBackgroundColor}
                />
                <Button variant={'contained'} color={'primary'}>
                    <FontAwesomeIcon icon={faMousePointer} />
                </Button>
                <Button variant={'contained'} color={'primary'}>
                    <FontAwesomeIcon icon={faCircle} />
                </Button>
                <Button variant={'contained'} color={'primary'}>
                    <FontAwesomeIcon icon={faSquare} />
                </Button>
                <Button variant={'contained'} color={'primary'}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={copy}>
                    <FontAwesomeIcon icon={faCopy} />
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={paste}>
                    <FontAwesomeIcon icon={faPaste} />
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={cut}>
                    <FontAwesomeIcon icon={faCut} />
                </Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={duplicate}
                >
                    <FontAwesomeIcon icon={faClone} />
                </Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => newTextbox(100, 200)}
                >
                    <FontAwesomeIcon icon={faFont} />
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={undo}>
                    <FontAwesomeIcon icon={faUndo} />
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={redo}>
                    <FontAwesomeIcon icon={faRedo} />
                </Button>
            </ButtonsContainer>
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </PageContainer>
    );
}
