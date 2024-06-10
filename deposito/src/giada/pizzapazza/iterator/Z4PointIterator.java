package giada.pizzapazza.iterator;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

public abstract class Z4PointIterator {

  /**
   * The color progression
   */
  protected Z4Progression progression = Z4Progression.spatial(Z4Lighting.NONE);

  /**
   * The rotation
   */
  protected Z4Rotation rotation = Z4Rotation.fixed();

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
   */
  @SuppressWarnings("unchecked")
  public void setProgression(Z4Progression progression) {
    this.progression = progression;
  }

  /**
   * Returns the color progression
   *
   * @return The color progression
   */
  public Z4Progression getProgression() {
    return this.progression;
  }

  /**
   * Sets the rotation
   *
   * @param rotation The rotation
   */
  @SuppressWarnings("unchecked")
  public void setRotation(Z4Rotation rotation) {
    this.rotation = rotation;
  }

  /**
   * Returns the rotation
   *
   * @return The rotation
   */
  public Z4Rotation getRotation() {
    return this.rotation;
  }

  /**
   * Returns the next point of the iterator
   *
   * @return The next point of the iterator, null if the iterator has no more
   * points
   */
  public abstract Z4Point next();

  /**
   * Checks if this Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if this Z4PointIterator is an infinite point generator, false
   * otherwise
   */
  public boolean isInfinitePointGenerator() {
    return false;
  }

  /**
   * Returns the sleeping time between a point generation and the successive
   *
   * @return The sleeping time between a point generation and the successive (in
   * milliseconds)
   */
  public double getInfinitePointGeneratorSleep() {
    return 0;
  }

  /**
   * Draws a demo of this Z4PointIterator
   *
   * @param context The context where to draw the demo
   * @param painter The painter to use, it can be null
   * @param gradientColor The color to use, it can be null
   * @param width The width
   * @param height The height
   */
  public abstract void drawDemo($CanvasRenderingContext2D context, Z4Painter<?> painter, Z4GradientColor gradientColor, double width, double height);
}
