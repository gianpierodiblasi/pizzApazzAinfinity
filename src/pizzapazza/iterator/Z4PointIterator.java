package pizzapazza.iterator;

import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4NextableWithTwoParams;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.painter.Z4PainterType;
import simulation.js.$Object;

/**
 * The common parent of all point iterators
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4PointIterator implements Z4NextableWithTwoParams<Z4DrawingPoint, Z4SpatioTemporalColor, Z4ColorProgression> {

  /**
   * The rotation
   */
  protected final Z4Rotation rotation;

  /**
   * The next drawing point
   */
  protected Z4DrawingPoint nextdDrawingPoint;

  /**
   * true if this Z4PointIterator has another point, false otherwise
   */
  protected boolean hasNext = false;

  /**
   * The current "utility" point
   */
  protected Z4Point currentPoint;

  /**
   * Creates the object
   *
   * @param rotation The rotation
   */
  public Z4PointIterator(Z4Rotation rotation) {
    super();
    this.rotation = rotation;
  }

  /**
   * Returns the point iterator type
   *
   * @return The point iterator type
   */
  public abstract Z4PointIteratorType getType();

  /**
   * Returns the rotation
   *
   * @return The rotation
   */
  public Z4Rotation getRotation() {
    return this.rotation;
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
  public abstract boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y);

  @Override
  public abstract Z4DrawingPoint next(Z4SpatioTemporalColor color, Z4ColorProgression progression);

  /**
   * Checks if this Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if this Z4PointIterator is an infinite point generator, false
   * otherwise
   */
  public abstract boolean isInfinitePointGenerator();

  /**
   * Returns the sleeping time between a point generation and the successive
   *
   * @return The sleeping time between a point generation and the successive (in
   * milliseconds)
   */
  public abstract int getInfinitePointGeneratorSleep();

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("type", this.getType());
    json.$set("rotation", this.rotation.toJSON());
    return json;
  }
}
