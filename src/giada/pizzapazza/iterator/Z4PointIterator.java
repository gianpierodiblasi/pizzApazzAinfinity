package giada.pizzapazza.iterator;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4Vector;
import jsweet.util.union.Union4;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * The common parent of all point iterators
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
public abstract class Z4PointIterator<T extends Z4PointIterator<T>> {

  /**
   * The color progression
   */
  protected Z4Progression progression = Z4Progression.SPATIAL;

  /**
   * The step for temporal progression (in the range [0,1])
   */
  protected double temporalStepProgression = 0.1;

  /**
   * The color lighting
   */
  protected Z4Lighting lighting = Z4Lighting.NONE;

  private Z4FancifulValue rotation = new Z4FancifulValue();
  private Z4Rotation rotationMode = Z4Rotation.FIXED;

  /**
   * The current Z4Point
   */
  protected Z4Point z4Point = new Z4Point();

  /**
   * The current "utility" point
   */
  protected $Object P = new $Object();

  /**
   * true if this Z4PointIterator has another point, false otherwise
   */
  protected boolean hasNext = false;
  private double rotationNext = 0;

  /**
   * Creates a Z4PointIterator
   */
  public Z4PointIterator() {
    this.P.$set("x", 0);
    this.P.$set("y", 0);
  }

  /**
   * Sets the color progression
   *
   * @param progression The color progression
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   * @return This Z4PointIterator
   */
  @SuppressWarnings("unchecked")
  public T seProgression(Z4Progression progression, double temporalStepProgression, Z4Lighting lighting) {
    this.progression = progression;
    this.temporalStepProgression = temporalStepProgression;
    this.lighting = lighting;
    return (T) this;
  }

  /**
   * Sets the rotation
   *
   * @param rotation The rotation
   * @param rotationMode The rotation mode
   * @return This Z4PointIterator
   */
  @SuppressWarnings("unchecked")
  public T setRotation(Z4FancifulValue rotation, Z4Rotation rotationMode) {
    this.rotation = rotation;
    this.rotationMode = rotationMode;
    return (T) this;
  }

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
  public abstract boolean draw(Z4Action action, double x, double y);

  /**
   * Returns the next point of the iterator
   *
   * @return The next point of the iterator, null if the iterator has no more
   * points
   */
  public abstract Z4Point next();

  /**
   * Draws a demo of this Z4PointIterator
   *
   * @param context The context where to draw the demo
   * @param width The width
   * @param height The height
   */
  public abstract void drawDemo($CanvasRenderingContext2D context, double width, double height);

  /**
   * Computes the next rotation
   *
   * @param tangentAngle The tangent angle
   * @return The next rotation (in radians)
   */
  protected double nextRotation(double tangentAngle) {
    double angle = Z4Math.deg2rad(this.rotation.next(0));

    if (this.rotationMode == Z4Rotation.FIXED) {
      return angle;
    } else if (this.rotationMode == Z4Rotation.CUMULATIVE) {
      this.rotationNext += angle;
      return this.rotationNext;
    } else if (this.rotationMode == Z4Rotation.RELATIVE_TO_PATH) {
      return angle + tangentAngle;
    } else {
      return 0;
    }
  }

  /**
   * Computes the next side
   *
   * @param z4Point The current point
   * @param vector The tangent vector
   */
  protected void nextSide(Z4Point z4Point, Z4Vector vector) {
    if (this.rotationMode == Z4Rotation.FIXED || this.rotationMode == Z4Rotation.CUMULATIVE) {
      z4Point.setSide(Z4Sign.POSITIVE);
    } else if (this.rotationMode == Z4Rotation.RELATIVE_TO_PATH) {
      z4Point.setSide($exists(vector) ? vector.direction(z4Point.getZ4Vector()) : Z4Sign.RANDOM);
    }
  }

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
  protected String getColor(String color) {
    return color;
  }

  /**
   * Utility method to simulate the fill style of a canvas
   *
   * @param color The color
   * @return NOTHING
   */
  protected Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getColor(String color) {
    return null;
  }
}
