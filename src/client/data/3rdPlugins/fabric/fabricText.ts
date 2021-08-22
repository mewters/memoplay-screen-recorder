import { fabric } from 'fabric';
import { LocalStorage } from '../../services/StorageService';
import FabricDrawingTool, { FabricDrawingToolId } from './fabricDrawingClass';

export class Text extends FabricDrawingTool {
    origX = 0;
    origY = 0;

    constructor(canvas) {
        super(FabricDrawingToolId.Text, canvas);
        this.fill = LocalStorage.get('canvas-fillColor', '#FF0000');
    }

    bindEvents() {
        super.bindEvents();
    }

    onMouseUp(o) {
        // if (this.isActive && this.mouseMove) {
        //     var inst = this;
        //     // this.line.set({
        //     //     dirty: true,
        //     //     objectCaching: true,
        //     // });
        //     if (inst.isEnable()) {
        //         inst.canvas.discardActiveObject().renderAll();
        //     }
        //     // this.line.hasControls = true;
        //     // this.line.hasBorders = true;
        //     inst.canvas.renderAll();
        //     inst.disable();
        //     inst.canvas.selectionColor = this.originalSelectionColor;
        //     inst.canvas.selectionBorderColor = this.originalSelectionBorderColor;
        // } else if (this.isActive && !this.mouseMove && this.mouseDown) {
        //     var inst = this;
        //     inst.canvas.remove(inst.canvas.getActiveObject());
        // }
        // this.mouseMove = false;
        // this.mouseDown = false;
    }
    onMouseMove(o) {}
    onMouseDown(options) {
        if (
            this.isActive &&
            options.target === null &&
            !this.canvas.getActiveObject()
        ) {
            this.isActive = false;
            this.newTextbox(options.pointer.x, options.pointer.y);
        }
    }

    newTextbox(x: number, y: number) {
        if (typeof x !== 'undefined' && typeof y !== 'undefined') {
            const newtext = new fabric.IText('', {
                left: x,
                top: y,
                fontFamily: 'sans-serif',
                fill: this.fill,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
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

            this.canvas.add(newtext).setActiveObject(newtext);
            this.canvas.bringToFront(newtext);
            newtext.enterEditing();
            this.canvas.renderAll();

            newtext.on('editing:exited', (a) => {
                if (newtext.text.length === 0) {
                    this.canvas.remove(newtext);
                }
            });
        }
    }
}

export default Text;
