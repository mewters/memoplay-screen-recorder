import { useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';
import { useFabricJSEditor } from 'fabricjs-react';
import { useHotkeys } from 'react-hotkeys-hook';
import 'fabric-history';
import FabricCircle from '../../3rdPlugins/fabric/fabricCircle';
import FabricRectangle from '../../3rdPlugins/fabric/fabricRectangle';
import FabricArrow from '../../3rdPlugins/fabric/fabricLineArrow';
import FabricText from '../../3rdPlugins/fabric/fabricText';
import { FabricDrawingToolId } from '../../3rdPlugins/fabric/fabricDrawingClass';
import useLocalStorage from '../useLocalStorage.hook';

export default function useCanvas() {
    const { editor, onReady } = useFabricJSEditor();
    const [isStarted, setStarted] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState(
        FabricDrawingToolId.Select
    );
    const [color, setColor] = useLocalStorage('canvas-fillColor', '#ff0000');
    const [backgroundColor, setBackgroundColor] = useState('#00000000');
    const RectangleDrawingTool = useRef(null);
    const ArrowDrawingTool = useRef(null);
    const CircleDrawingTool = useRef(null);
    const TextDrawingTool = useRef(null);
    const Clipboard = useRef(null);

    useEffect(() => {
        if (!isStarted && editor) {
            setStarted(true);
            editor.canvas.setWidth(window.screen.width);
            editor.canvas.setHeight(window.screen.height);
            editor.canvas.uniformScaling = false;

            RectangleDrawingTool.current = new FabricRectangle(editor.canvas);
            ArrowDrawingTool.current = new FabricArrow(editor.canvas);
            CircleDrawingTool.current = new FabricCircle(editor.canvas);
            TextDrawingTool.current = new FabricText(editor.canvas);
        }
    }, [editor, isStarted]);

    const selectTool = (tool: FabricDrawingToolId | null) => {
        if (tool !== null) {
            switch (tool) {
                case FabricDrawingToolId.Select:
                    startSelectTool();
                    break;
                case FabricDrawingToolId.Pencil:
                    startDrawTool();
                    break;
                case FabricDrawingToolId.LineArrow:
                    startArrowTool();
                    break;
                case FabricDrawingToolId.Circle:
                    startCircleTool();
                    break;
                case FabricDrawingToolId.Rectangle:
                    startRectangleTool();
                    break;
                case FabricDrawingToolId.Text:
                    startTextTool();
                    break;
            }
            setSelectedTool(tool);
        }
    };

    const startSelectTool = () => {
        if (editor) {
            disableAllTools();
        }
    };
    const startDrawTool = () => {
        if (editor) {
            disableAllTools();
            editor.canvas.freeDrawingBrush.color = color;
            editor.canvas.freeDrawingBrush.width = 5;
            editor.canvas.isDrawingMode = true;
        }
    };
    const startArrowTool = () => {
        if (editor) {
            disableAllTools();
            ArrowDrawingTool.current.isActive = true;
        }
    };
    const startRectangleTool = () => {
        if (editor) {
            disableAllTools();
            RectangleDrawingTool.current.isActive = true;
        }
    };
    const startCircleTool = () => {
        if (editor) {
            disableAllTools();
            CircleDrawingTool.current.isActive = true;
        }
    };

    const startTextTool = () => {
        if (editor) {
            selectTool(FabricDrawingToolId.Select);
            TextDrawingTool.current.isActive = true;
        }
    };
    const getAllTools = () => {
        return [
            RectangleDrawingTool.current,
            ArrowDrawingTool.current,
            CircleDrawingTool.current,
            TextDrawingTool.current,
        ];
    };
    const disableAllTools = () => {
        getAllTools().forEach((tool) => {
            tool.isActive = false;
        });
        editor.canvas.isDrawingMode = false;
    };
    const updateColor = (event) => {
        const color = event.target.value;
        setColor(color);
        if (editor) {
            editor.canvas.freeDrawingBrush.color = color;
            // editor.canvas.freeDrawingBrush.width = 5;
            getAllTools().forEach((tool) => {
                tool.stroke = color;
                tool.fill = 'transparent';
            });
            TextDrawingTool.current.fill = color;
        }
    };
    const updateBackgroundColor = (color) => {
        if (editor) {
            const backgroundColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
            setBackgroundColor(backgroundColor);
            editor.canvas.backgroundColor = backgroundColor;
            editor.canvas.renderAll();
        }
    };
    const deleteObject = () => {
        if (editor) {
            var activeObjects = editor.canvas.getActiveObjects();
            editor.canvas.discardActiveObject();
            if (activeObjects.length) {
                editor.canvas.remove.apply(editor.canvas, activeObjects);
            }
        }
    };
    const clearAll = () => {
        if (editor) {
            editor.deleteAll();
        }
    };
    const copy = () => {
        editor?.canvas.getActiveObject()?.clone(function (cloned) {
            Clipboard.current = cloned;
        });
    };
    const paste = () => {
        const canvas = editor.canvas;
        Clipboard.current &&
            Clipboard.current.clone(function (clonedObj) {
                canvas.discardActiveObject();
                clonedObj.set({
                    left: clonedObj.left + 10,
                    top: clonedObj.top + 10,
                    evented: true,
                });
                if (clonedObj.type === 'activeSelection') {
                    // active selection needs a reference to the canvas.
                    clonedObj.canvas = canvas;
                    clonedObj.forEachObject(function (obj) {
                        canvas.add(obj);
                    });
                    // this should solve the unselectability
                    clonedObj.setCoords();
                } else {
                    canvas.add(clonedObj);
                }
                Clipboard.current.top += 10;
                Clipboard.current.left += 10;
                canvas.setActiveObject(clonedObj);
                canvas.requestRenderAll();
            });
    };
    const duplicate = () => {
        const currentClipboard = Clipboard.current;
        copy();
        paste();
        Clipboard.current = currentClipboard;
    };
    const cut = () => {
        copy();
        deleteObject();
    };

    const undo = () => {
        // if (editor.canvas._objects.length > 0) {
        // history.push(editor.canvas._objects.pop());
        // editor.canvas.renderAll();
        // }
        editor?.canvas?.undo();
    };
    const redo = () => {
        // if (history.length > 0) {
        // isRedoing = true;
        // editor.canvas.add(history.pop());
        // }

        editor?.canvas?.redo();
    };

    useHotkeys('shift+delete', clearAll, [editor]);

    useHotkeys('delete', deleteObject, [editor]);
    useHotkeys('backspace', deleteObject, [editor]);

    useHotkeys('ctrl+c', copy, [editor]);
    useHotkeys('command+c', copy, [editor]);

    useHotkeys('ctrl+v', paste, [editor]);
    useHotkeys('command+v', paste, [editor]);

    useHotkeys('ctrl+x', cut, [editor]);
    useHotkeys('command+x', cut, [editor]);

    useHotkeys('ctrl+d', duplicate, [editor]);
    useHotkeys('command+d', duplicate, [editor]);

    useHotkeys('ctrl+z', undo, [editor]);
    useHotkeys('command+z', undo, [editor]);

    useHotkeys('ctrl+y', redo, [editor]);
    useHotkeys('ctrl+shift+z', redo, [editor]);
    useHotkeys('command+shift+z', redo, [editor]);

    useHotkeys('space', () => selectTool(FabricDrawingToolId.Select), [editor]);
    useHotkeys('0', () => selectTool(FabricDrawingToolId.Select), [editor]);

    useHotkeys('1', () => selectTool(FabricDrawingToolId.Pencil), [editor]);

    useHotkeys('2', () => selectTool(FabricDrawingToolId.LineArrow), [editor]);

    useHotkeys('3', () => selectTool(FabricDrawingToolId.Circle), [editor]);

    useHotkeys('4', () => selectTool(FabricDrawingToolId.Rectangle), [editor]);

    useHotkeys('5', startTextTool, [editor]);
    useHotkeys('t', startTextTool, [editor]);

    return {
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
        updateBackgroundColor,
        color,
        backgroundColor,
        editor,
        fabric,
        deleteObject,
        clearAll,
        copy,
        paste,
        cut,
        duplicate,
        undo,
        redo,
        isDialogOpen,
        setDialogOpen,
    };
}
