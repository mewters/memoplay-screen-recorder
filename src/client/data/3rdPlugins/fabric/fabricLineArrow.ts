import { fabric } from 'fabric';
import FabricDrawingTool, { FabricDrawingToolId } from './fabricDrawingClass';

// Extended fabric line class
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

export class Arrow extends FabricDrawingTool {
    constructor(canvas) {
        super(FabricDrawingToolId.LineArrow, canvas);
    }

    onMouseUp(o) {
        if (this.isActive && this.mouseMove) {
            var inst = this;
            this.newObject.set({
                dirty: true,
                objectCaching: true,
            });
            if (inst.isEnable()) {
                inst.canvas.discardActiveObject().renderAll();
            }
            this.newObject.hasControls = true;
            this.newObject.hasBorders = true;

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
            activeObj.set({
                x2: pointer.x,
                y2: pointer.y,
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
            var points = [pointer.x, pointer.y, pointer.x, pointer.y];
            this.newObject = new fabric.LineArrow(points, {
                strokeWidth: inst.strokeWidth,
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
            inst.canvas.add(this.newObject).setActiveObject(this.newObject);
        } else {
            this.mouseDown = false;
        }
    }
}

export default Arrow;
