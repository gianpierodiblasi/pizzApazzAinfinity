package giada.pizzapazza.painter;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The painter of arrows, used only for testing purpose
 *
 * @author gianpiero.di.blasi
 */
public class Z4ArrowPainter extends Z4Painter<Z4ArrowPainter> {

  private double module = 15;
  private boolean bool;

  /**
   * Sets the module
   *
   * @param module The module
   * @return This Z4ArrowPainter
   */
  public Z4ArrowPainter setModule(double module) {
    this.module = module;
    return this;
  }

  /**
   * Returns the module
   *
   * @return The module
   */
  public double getModule() {
    return this.module;
  }

  @Override
  public Z4ArrowPainter draw($CanvasRenderingContext2D context, Z4Point point, Z4GradientColor gradientColor) {
    this.bool = !this.bool;
    double x = point.getIntensity() * (point.isUseVectorModuleAsSize() ? point.getZ4Vector().getModule() : this.module);

    context.save();
    context.lineWidth = 1;

    context.strokeStyle = this.$getColor("black");
    context.beginPath();
    context.arc(0, 0, 2, 0, Z4Math.TWO_PI);
    context.stroke();

    context.strokeStyle = this.$getColor(this.bool ? "blue" : "red");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -2.5);
    context.lineTo(x - 5, +2.5);
    context.lineTo(x, 0);
    context.stroke();

    context.restore();
    return this;
  }
}
