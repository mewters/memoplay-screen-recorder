import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useFabricJSEditor } from 'fabricjs-react';
import { useHotkeys } from 'react-hotkeys-hook';
import 'fabric-history';
import FabricCircle from '../../3rdPlugins/fabric/fabricCircle';
import FabricRectangle from '../../3rdPlugins/fabric/fabricRectangle';
import FabricArrow from '../../3rdPlugins/fabric/fabricLineArrow';

let _clipboard;
let isRedoing = false;
let history = [];

export default function useCanvas() {
    const { editor, onReady } = useFabricJSEditor();
    const [isStarted, setStarted] = useState(false);
    const [color, setColor] = useState('#ff0000');
    const [backgroundColor, setBackgroundColor] = useState('#00000000');

    useEffect(() => {
        console.log('onReady', editor);
    }, [editor]);

    const toggleDrawMode = () => {
        if (editor) {
            editor.canvas.freeDrawingBrush.color = color;
            editor.canvas.freeDrawingBrush.width = 5;
            editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
            window.arrowon = false;
        }
    };
    const startArrow = () => {
        if (editor) {
            window.arrowon = true;
        }
    };
    const updateColor = (event) => {
        const color = event.target.value;
        setColor(color);
        if (editor) {
            editor.canvas.freeDrawingBrush.color = color;
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
    const copy = () => {
        editor?.canvas.getActiveObject()?.clone(function (cloned) {
            _clipboard = cloned;
        });
    };
    const paste = () => {
        const canvas = editor.canvas;
        _clipboard &&
            _clipboard.clone(function (clonedObj) {
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
                _clipboard.top += 10;
                _clipboard.left += 10;
                canvas.setActiveObject(clonedObj);
                canvas.requestRenderAll();
            });
    };
    const duplicate = () => {
        copy();
        paste();
    };
    const cut = () => {
        copy();
        deleteObject();
    };

    const saveState = (currentAction) => {};

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
    function newTextbox(x, y) {
        if (typeof x !== 'undefined' && typeof y !== 'undefined') {
            var newtext = new fabric.IText('', {
                left: x,
                top: y,
                fontFamily: 'sans-serif',
                fill: '#ff0000',
                transparentCorners: false,
                lockRotation: true,
                // borderColor: '#0E98FC',
                // cornerColor: '#0E98FC',
                centeredScaling: false,
                borderOpacityWhenMoving: 1,
                hasControls: true,
                hasRotationPoint: false,
                lockScalingFlip: true,
                lockSkewingX: true,
                lockSkewingY: true,
                cursorWidth: 1,
                width: 100,
                cursorDuration: 1,
                cursorDelay: 250,
            });
        }
        // newtext.setControlsVisibility({
        //     bl: true,
        //     br: true,
        //     tl: true,
        //     tr: true,
        //     mb: false,
        //     ml: true,
        //     mr: true,
        //     mt: false,
        //     mtr: false,
        // });
        editor.canvas.add(newtext).setActiveObject(newtext);
        editor.canvas.bringToFront(newtext);
        newtext.enterEditing();
        editor.canvas.renderAll();
        newtext.on('editing:exited', (a) => {
            if (newtext.text.length === 0) {
                editor?.canvas.remove(newtext);
            }
        });
        // textediting = true;
    }
    useEffect(() => {
        // (function () {
        //     var $ = function (id) {
        //         return document.getElementById(id);
        //     };
        //     var canvas = (window.__canvas = new fabric.Canvas('c', {
        //         isDrawingMode: true,
        //         width: window.screen.width,
        //         height: window.screen.height,
        //     }));
        //     var rect = new fabric.Rect({
        //         width: 80,
        //         height: 80,
        //         left: 100,
        //         top: 100,
        //         fill: 'yellow',
        //         angle: 30,
        //     });
        //     canvas.add(rect);
        //     rect.set('selectable', true);
        //     canvas.freeDrawingBrush.color = 'rgb(255,255,255)';
        //     canvas.freeDrawingBrush.width = 5;
        // })();
        if (!isStarted && editor) {
            setStarted(true);
            editor.canvas.setWidth(window.screen.width);
            editor.canvas.setHeight(window.screen.height);
            editor.canvas.uniformScaling = false;
            window.arrowon = false;
            // var arrow = new Arrow(editor.canvas);
            // new Circle(editor.canvas);
            // new Rectangle(editor.canvas);
            console.log(editor, fabric);
            // console.log(arrow);
            // var rect = new Rectangle(editor.canvas);

            // new FabricCircle(editor.canvas);
            // new FabricRectangle(editor.canvas);
            // new FabricArrow(editor.canvas);

            // editor.canvas.on('object:added', function () {
            //     if (!isRedoing) {
            //         history = [];
            //     }
            //     isRedoing = false;
            // });
            // editor.canvas.on('object:modified', function () {
            //     if (!isRedoing) {
            //         history = [];
            //     }
            //     isRedoing = false;
            // });
            editor.canvas.on('mouse:down', function (options) {
                // if (textediting) {
                //     textediting = false;
                // } else if (
                //     texton &&
                //     options.target == null &&
                //     !canvas.getActiveObject()
                // ) {
                //     newTextbox(options.pointer.x, options.pointer.y);
                // }
                // ;;;;;newTextbox(options.pointer.x, options.pointer.y);
            });
        }
    }, [editor, isStarted]);

    useHotkeys('delete', deleteObject, [editor]);
    useHotkeys('ctrl+d', duplicate, [editor]);
    useHotkeys('ctrl+z', undo, [editor]);
    useHotkeys('ctrl+y', redo, [editor]);
    useHotkeys('ctrl+shift+z', redo, [editor]);
    useHotkeys('1', toggleDrawMode, [editor]);

    return {
        toggleDrawMode,
        startArrow,
        onReady,
        updateColor,
        updateBackgroundColor,
        color,
        backgroundColor,
        editor,
        fabric,
        deleteObject,
        copy,
        paste,
        cut,
        duplicate,
        newTextbox,
        undo,
        redo,
    };
}
