package giada.pizzapazza.iterator;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;

/**
 * The airbrush
 *
 * @author gianpiero.di.blasi
 */
public class Z4Airbrush extends Z4PointIterator<Z4Airbrush> {

  private double radius = 50;
  private double speed = 50;

  private int currentSpeed;

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.currentSpeed = 0;
      this.hasNext = true;

      return true;
    } else if (action == Z4Action.CONTINUE) {
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.hasNext = true;

      return false;
    } else if (action == Z4Action.STOP) {
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

  @Override
  public Z4Point next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentSpeed++;
      this.hasNext = this.currentSpeed < this.speed;

      double currentRadius = this.radius * Math.random();
      double currenAngle = Z4Math.TWO_PI * Math.random();

      double angle = this.rotation.next(currenAngle);
      this.z4Point.setZ4Vector(Z4Vector.fromVector((Double) this.P.$get("x") + currentRadius * Math.cos(currenAngle), (Double) this.P.$get("y") + currentRadius * Math.sin(currenAngle), 1, angle));
      this.rotation.nextSide(this.z4Point, null);
      this.progression.next(this.z4Point);

      if (this.progression.isRelativeToPath()) {
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(currentRadius / this.radius);
      }

      return this.z4Point;
    }
  }

  @Override
  public boolean isInfinitePointGenerator() {
    return true;
  }

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
   * Sets the radius
   *
   * @param radius The radius
   * @return This Z4Airbrush
   */
  public Z4Airbrush setRadius(double radius) {
    this.radius = radius;
    return this;
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
   * Sets the speed
   *
   * @param speed The speed
   * @return This Z4Airbrush
   */
  public Z4Airbrush setSpeed(double speed) {
    this.speed = speed;
    return this;
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
