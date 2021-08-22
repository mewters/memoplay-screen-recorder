import FabricDrawingTool, { FabricDrawingToolId } from './fabricDrawingClass';

export class Circle extends FabricDrawingTool {
    origX = 0;
    origY = 0;

    constructor(canvas) {
        super(FabricDrawingToolId.Circle, canvas);
    }

    onMouseUp(o) {
        if (this.isActive && this.mouseMove) {
            var inst = this;
            // this.line.set({
            //     dirty: true,
            //     objectCaching: true,
            // });
            if (inst.isEnable()) {
                inst.canvas.discardActiveObject().renderAll();
            }
            // this.line.hasControls = true;
            // this.line.hasBorders = true;

            inst.canvas.renderAll();
            inst.disable();
            inst.canvas.selectionColor = this.originalSelectionColor;
            inst.canvas.selectionBorderColor = this.originalSelectionBorderColor;
        } else if (this.isActive && !this.mouseMove && this.mouseDown) {
            var inst = this;
            inst.canvas.remove(inst.canvas.getActiveObject());
        }
        this.mouseMove = false;
        this.mouseDown = false;
    }
    onMouseMove(o) {
        if (this.isActive && this.mouseDown) {
            var inst = this;
            if (!inst.isEnable()) {
                return;
            }
            if (this.mouseDown) {
                this.mouseMove = true;
            }

            var pointer = inst.canvas.getPointer(o.e);
            var activeObj = inst.canvas.getActiveObject();

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
        }
    }
    onMouseDown(o) {
        // Check if an arrow can be drawn (not clicking an existing canvas object)
        if (o.target == null && this.isActive) {
            this.mouseDown = true;
            this.mouseMove = false;

            var inst = this;
            inst.enable();
            inst.canvas.selectionColor = 'rgba(0,0,0,0)';
            inst.canvas.selectionBorderColor = 'rgba(0,0,0,0)';

            var pointer = inst.canvas.getPointer(o.e);
            this.origX = pointer.x;
            this.origY = pointer.y;

            var ellipse = new fabric.Ellipse({
                top: this.origY,
                left: this.origX,
                rx: 0,
                ry: 0,
                fill: this.fill,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
                transparentCorners: false,
            });

            inst.canvas.add(ellipse).setActiveObject(ellipse);
        } else {
            this.mouseDown = false;
        }
    }
}

export default Circle;
