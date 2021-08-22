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

export default Circle;
