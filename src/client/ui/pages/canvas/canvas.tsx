import React from 'react';
import { Button } from '@material-ui/core';
import { FabricJSCanvas } from 'fabricjs-react';

import { PageContainer, ButtonsContainer } from './canvas.styled';
import useCanvas from '../../../data/hooks/pages/useCanvas.page';

export default function Canvas() {
    const {
        onAddCircle,
        onAddRectangle,
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
        duplicate,
        newTextbox,
        undo,
        redo,
    } = useCanvas();

    return (
        <PageContainer>
            <ButtonsContainer>
                <button onClick={onAddCircle}>Add circle</button>
                <button onClick={onAddRectangle}>Add Rectangle</button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={toggleDrawMode}
                >
                    Toggle Draw
                </Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={startArrow}
                >
                    Arrow
                </Button>
                <Button onClick={() => editor?.deleteAll()}>CLEAR</Button>
                <Button
                    variant={'contained'}
                    color={'error'}
                    onClick={deleteObject}
                >
                    APAGAR
                </Button>
                <input type="color" value={color} onChange={updateColor} />
                <input
                    type="color"
                    value={backgroundColor}
                    onChange={updateBackgroundColor}
                />
                <Button variant={'contained'} color={'primary'} onClick={copy}>
                    Copy
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={paste}>
                    Paste
                </Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={duplicate}
                >
                    Duplicate
                </Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => newTextbox(100, 200)}
                >
                    Novo Texto
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={undo}>
                    Undo
                </Button>
                <Button variant={'contained'} color={'primary'} onClick={redo}>
                    Redo
                </Button>
            </ButtonsContainer>
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </PageContainer>
    );
}
