/**
 * The painter of arrows, used only for testing purpose
 *
 * @author gianpiero.di.blasi
 */
class Z4ArrowPainter extends Z4Painter {

   draw(context, point, gradientColor) {
    let x = point.getIntensity() * point.getZ4Vector().getModule();
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = this.getColor("gray");
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -3);
    context.lineTo(x - 5, +3);
    context.lineTo(x, 0);
    context.stroke();
    context.strokeStyle = this.getColor("black");
    context.translate(1, 1);
    context.stroke();
    context.restore();
    return this;
  }
}
