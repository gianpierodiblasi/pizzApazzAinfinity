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
 * @author gianpiero.di.blasi
 */
public class Z4Airbrush extends Z4PointIterator<Z4Airbrush> {

  private Z4FancifulValue multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(50).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private double radius = 50;
  private double speed = 5;

  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
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
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.hasNext = true;
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;

      double currentRadius = this.radius * Math.random();
      double currenAngle = Z4Math.TWO_PI * Math.random();

      double angle = this.rotation.next(currenAngle);
      this.z4Point.setZ4Vector(Z4Vector.fromVector((Double) this.P.$get("x") + currentRadius * Math.cos(currenAngle), (Double) this.P.$get("y") + currentRadius * Math.sin(currenAngle), 1, angle));
      this.rotation.nextSide(this.z4Point, null);

      if (!this.progression.isTemporal() || this.currentMultiplicityCounter == 1) {
        this.progression.next(this.z4Point);
      } else {
        this.z4Point.setLighting(this.progression.getLighting());
        this.z4Point.setDrawBounds(false);
      }

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
  public double getInfinitePointGeneratorSleep() {
    return 250 / this.speed;
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
   * sets the multiplicity
   * @param multiplicity The multiplicity
   * @return This Z4Airbrush
   */
  public Z4Airbrush setMultiplicity(Z4FancifulValue multiplicity) {
    this.multiplicity = multiplicity;
    return this;
  }

  /**
   * Returns the multiplicity
   * @return The multiplicity
   */
  public Z4FancifulValue getMultiplicity() {
    return this.multiplicity;
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
