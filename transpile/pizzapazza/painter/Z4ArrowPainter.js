/**
 * @author gianpiero.diblasi
 */
class Z4ArrowPainter extends Z4Painter {

   module = 15;

   bool = false;

   draw(context, drawingPoint, spatioTemporalColor) {
    this.bool = !this.bool;
    let x = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.module);
    context.save();
    context.lineWidth = 3;
    context.strokeStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.arc(0, 0, 2, 0, Z4Math.TWO_PI);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle(this.bool ? "blue" : "red");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -2.5);
    context.lineTo(x - 5, +2.5);
    context.lineTo(x, 0);
    context.stroke();
    context.restore();
  }

   toJSON() {
    return new Object();
  }
}
