package giada.pizzapazza.iterator;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The airbrush
 *
 * @author gianpiero.diblasi
 */
public class Z4Airbrush extends Z4PointIterator<Z4Airbrush> {
  @Override
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter<?> painter, Z4GradientColor gradientColor, double width, double height) {
    Z4Painter<?> finalPainter = $exists(painter) ? painter : new Z4ArrowPainter();
    Z4GradientColor finalGradientColor = $exists(gradientColor) ? gradientColor : new Z4GradientColor();

    this.draw(Z4Action.START, width / 2, height / 2);

    Z4Point next;
    while ((next = this.next()) != null) {
      Z4Vector vector = next.getZ4Vector();

      context.save();
      context.translate(vector.getX0(), vector.getY0());
      context.rotate(vector.getPhase());
      finalPainter.draw(context, next, finalGradientColor);
      context.restore();
    }

    this.draw(Z4Action.STOP, width / 2, height / 2);
  }

  /**
   * Returns the multiplicity
   * @return The multiplicity
   */
  public Z4FancifulValue getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the radius
   *
   * @return The radius
   */
  public double getRadius() {
    return this.radius;
  }

  /**
   * Returns the speed
   *
   * @return The speed
   */
  public double getSpeed() {
    return this.speed;
  }
}
