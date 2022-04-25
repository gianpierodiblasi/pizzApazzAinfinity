package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The painter of arrows, used only for testing purpose
 *
 * @author gianpiero.di.blasi
 */
public class Z4ArrowPainter extends Z4Painter<Z4ArrowPainter> {

  @Override
  public Z4ArrowPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    double x = point.getIntensity() * point.getZ4Vector().getModule();

    context.save();
    context.lineWidth = 1;

    context.strokeStyle = this.$getColor("white");
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -3);
    context.lineTo(x - 5, +3);
    context.lineTo(x, 0);
    context.stroke();

    context.strokeStyle = this.$getColor("black");
    context.translate(1, 1);
    context.stroke();

    context.restore();
    return this;
  }
}
