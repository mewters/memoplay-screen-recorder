import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useFabricJSEditor } from 'fabricjs-react';
import { useHotkeys } from 'react-hotkeys-hook';
import 'fabric-history';

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

// Extended fabric line class
var arrowmousedown = false;
var arrowmousemove = false;
fabric.LineArrow = fabric.util.createClass(fabric.Line, {
    type: 'lineArrow',
    initialize: function (element, options) {
        options || (options = {});
        this.callSuper('initialize', element, options);
    },
    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'));
    },
    _render: function (ctx) {
        this.ctx = ctx;
        this.callSuper('_render', ctx);
        let p = this.calcLinePoints();
        let xDiff = this.x2 - this.x1;
        let yDiff = this.y2 - this.y1;
        let angle = Math.atan2(yDiff, xDiff);
        this.drawArrow(angle, p.x2, p.y2, this.heads[0]);
        ctx.save();
        xDiff = -this.x2 + this.x1;
        yDiff = -this.y2 + this.y1;
        angle = Math.atan2(yDiff, xDiff);
        this.drawArrow(angle, p.x1, p.y1, this.heads[1]);
    },
    drawArrow: function (angle, xPos, yPos, head) {
        this.ctx.save();
        if (head) {
            this.ctx.translate(xPos, yPos);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(10, 0);
            this.ctx.lineTo(-8, 8);
            this.ctx.lineTo(-8, -8);
            this.ctx.closePath();
        }
        this.ctx.fillStyle = this.stroke;
        this.ctx.fill();
        this.ctx.restore();
    },
});

fabric.LineArrow.fromObject = function (object, callback) {
    callback &&
        callback(
            new fabric.LineArrow(
                [object.x1, object.y1, object.x2, object.y2],
                object
            )
        );
};

fabric.LineArrow.async = true;

var Arrow = (function () {
    function Arrow(canvas) {
        this.canvas = canvas;
        this.className = 'Arrow';
        this.isDrawing = false;
        this.bindEvents();
        this.originalSelectionColor = canvas.selectionColor;
        this.originalSelectionBorderColor = canvas.selectionBorderColor;
        this.color = 'rgb(255,0,0)';
    }

    // Detect canvas events
    Arrow.prototype.bindEvents = function () {
        var inst = this;
        inst.canvas.on('mouse:down', function (o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function (o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function (o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function (o) {
            inst.disable();
        });
    };

    Arrow.prototype.onMouseUp = function (o) {
        // Check if the user has moved the mouse to prevent accidental arrows
        if (window.arrowon && arrowmousemove) {
            var inst = this;
            this.line.set({
                dirty: true,
                objectCaching: true,
            });
            if (inst.isEnable()) {
                inst.canvas.discardActiveObject().renderAll();
            }
            this.line.hasControls = true;
            this.line.hasBorders = true;
            this.line.setControlsVisibility({
                // bl: true,
                // br: true,
                // tl: true,
                // tr: true,
                // mb: false,
                // ml: false,
                // mr: false,
                // mt: false,
                // mtr: true,
            });
            inst.canvas.renderAll();
            inst.disable();
            inst.canvas.selectionColor = this.originalSelectionColor;
            inst.canvas.selectionBorderColor = this.originalSelectionBorderColor;
        } else if (window.arrowon && !arrowmousemove && arrowmousedown) {
            var inst = this;
            inst.canvas.remove(inst.canvas.getActiveObject());
        }
        arrowmousemove = false;
        arrowmousedown = false;
    };

    Arrow.prototype.onMouseMove = function (o) {
        if (window.arrowon && arrowmousedown) {
            var inst = this;
            if (!inst.isEnable()) {
                return;
            }
            if (arrowmousedown) {
                arrowmousemove = true;
            }
            var pointer = inst.canvas.getPointer(o.e);
            var activeObj = inst.canvas.getActiveObject();
            activeObj.set({
                x2: pointer.x,
                y2: pointer.y,
            });
            activeObj.setCoords();
            inst.canvas.renderAll();
        }
    };

    Arrow.prototype.onMouseDown = function (o) {
        // Check if an arrow can be drawn (not clicking an existing canvas object)
        if (o.target == null && window.arrowon) {
            arrowmousedown = true;
            arrowmousemove = false;
            var inst = this;
            inst.enable();
            inst.canvas.selectionColor = 'rgba(0,0,0,0)';
            inst.canvas.selectionBorderColor = 'rgba(0,0,0,0)';
            var pointer = inst.canvas.getPointer(o.e);
            var points = [pointer.x, pointer.y, pointer.x, pointer.y];
            this.line = new fabric.LineArrow(points, {
                strokeWidth: 3,
                fill: inst.canvas.freeDrawingBrush.color,
                stroke: inst.canvas.freeDrawingBrush.color,
                originX: 'center',
                originY: 'center',
                hasBorders: false,
                hasControls: false,
                autoReposition: false,
                // transparentCorners: false,
                // borderColor: '#0E98FC',
                // cornerColor: '#0E98FC',
                objectCaching: false,
                perPixelTargetFind: true,
                heads: [1, 0],
            });
            inst.canvas.add(this.line).setActiveObject(this.line);
        } else {
            arrowmousedown = false;
        }
    };

    Arrow.prototype.isEnable = function () {
        return this.isDrawing;
    };

    Arrow.prototype.enable = function () {
        this.isDrawing = true;
    };

    Arrow.prototype.disable = function () {
        this.isDrawing = false;
    };
    return Arrow;
})();

var Rectangle = (function () {
    function Rectangle(canvas) {
        var inst = this;
        this.canvas = canvas;
        this.className = 'Rectangle';
        this.isDrawing = false;
        this.bindEvents();
    }

    Rectangle.prototype.bindEvents = function () {
        var inst = this;
        inst.canvas.on('mouse:down', function (o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function (o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function (o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function (o) {
            inst.disable();
        });
    };
    Rectangle.prototype.onMouseUp = function (o) {
        var inst = this;
        inst.disable();
    };

    Rectangle.prototype.onMouseMove = function (o) {
        var inst = this;

        if (!inst.isEnable()) {
            return;
        }

        var pointer = inst.canvas.getPointer(o.e);
        var activeObj = inst.canvas.getActiveObject();

        // (activeObj.stroke = 'red'), (activeObj.strokeWidth = 5);
        // activeObj.fill = 'transparent';

        if (this.origX > pointer.x) {
            activeObj.set({ left: Math.abs(pointer.x) });
        }
        if (this.origY > pointer.y) {
            activeObj.set({ top: Math.abs(pointer.y) });
        }

        activeObj.set({ width: Math.abs(this.origX - pointer.x) });
        activeObj.set({ height: Math.abs(this.origY - pointer.y) });

        activeObj.setCoords();
        inst.canvas.renderAll();
    };

    Rectangle.prototype.onMouseDown = function (o) {
        var inst = this;
        inst.enable();

        var pointer = inst.canvas.getPointer(o.e);
        this.origX = pointer.x;
        this.origY = pointer.y;

        var rect = new fabric.Rect({
            top: this.origY,
            left: this.origX,
            originX: 'left',
            originY: 'top',
            width: pointer.x - this.origX,
            height: pointer.y - this.origY,
            angle: 0,
            fill: 'rgba(255,0,0,0.5)',
            transparentCorners: false,
        });

        inst.canvas.add(rect).setActiveObject(rect);
    };

    Rectangle.prototype.isEnable = function () {
        return this.isDrawing;
    };

    Rectangle.prototype.enable = function () {
        this.isDrawing = true;
    };

    Rectangle.prototype.disable = function () {
        this.isDrawing = false;
    };

    return Rectangle;
})();

var Circle = (function () {
    function Circle(canvas) {
        this.canvas = canvas;
        this.className = 'Circle';
        this.isDrawing = false;
        this.bindEvents();
    }

    Circle.prototype.bindEvents = function () {
        var inst = this;
        inst.canvas.on('mouse:down', function (o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function (o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function (o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function (o) {
            inst.disable();
        });
    };

    Circle.prototype.onMouseUp = function (o) {
        var inst = this;
        inst.disable();
    };

    Circle.prototype.onMouseMove = function (o) {
        var inst = this;

        if (!inst.isEnable()) {
            return;
        }

        var pointer = inst.canvas.getPointer(o.e);
        var activeObj = inst.canvas.getActiveObject();

        // (activeObj.stroke = 'red'), (activeObj.strokeWidth = 5);
        // activeObj.fill = 'red';

        if (this.origX > pointer.x) {
            activeObj.set({ left: Math.abs(pointer.x) });
        }

        if (this.origY > pointer.y) {
            activeObj.set({ top: Math.abs(pointer.y) });
        }

        activeObj.set({
            rx: Math.abs(this.origX - pointer.x) / 2,
        });
        activeObj.set({
            ry: Math.abs(this.origY - pointer.y) / 2,
        });
        activeObj.setCoords();
        inst.canvas.renderAll();
    };

    Circle.prototype.onMouseDown = function (o) {
        var inst = this;
        inst.enable();

        var pointer = inst.canvas.getPointer(o.e);
        this.origX = pointer.x;
        this.origY = pointer.y;

        var ellipse = new fabric.Ellipse({
            top: this.origY,
            left: this.origX,
            rx: 0,
            ry: 0,
            fill: 'transparent',
            stroke: 'rgb(255,0,0)',
            strokeWidth: 5,
            transparentCorners: false,
        });

        inst.canvas.add(ellipse).setActiveObject(ellipse);
    };

    Circle.prototype.isEnable = function () {
        return this.isDrawing;
    };

    Circle.prototype.enable = function () {
        this.isDrawing = true;
    };

    Circle.prototype.disable = function () {
        this.isDrawing = false;
    };

    return Circle;
})();
