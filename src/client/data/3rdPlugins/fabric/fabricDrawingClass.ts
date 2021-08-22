import { fabric } from 'fabric';

export default class FabricDrawingTool {
    toolId: FabricDrawingToolId;

    canvas: typeof fabric.Canvas;
    originalSelectionColor: string;
    originalSelectionBorderColor: string;

    fill = '#FF0000';
    stroke = '#FF0000';
    strokeWidth = 3;

    isActive = false;
    isDrawing = false;
    mouseDown = false;
    mouseMove = false;

    constructor(toolId: FabricDrawingToolId, canvas: typeof fabric.Canvas) {
        this.toolId = toolId;
        this.canvas = canvas;
        this.originalSelectionColor = canvas.selectionColor;
        this.originalSelectionBorderColor = canvas.selectionBorderColor;

        this.bindEvents();
    }

    bindEvents() {
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
    }

    onMouseUp(o) {}
    onMouseMove(o) {}
    onMouseDown(o) {}

    isEnable() {
        return this.isDrawing;
    }
    enable() {
        this.isDrawing = true;
    }
    disable() {
        this.isDrawing = false;
    }
}

export enum FabricDrawingToolId {
    Select,
    Pencil,
    Text,
    Rectange,
    Circle,
    LineArrow,
}
