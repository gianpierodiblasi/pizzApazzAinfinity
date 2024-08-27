/**
 * The common parent of all point iterators
 *
 * @author gianpiero.diblasi
 */
class Z4PointIterator extends Z4NextableWithTwoParams {

  /**
   * The rotation
   */
   rotation = null;

  /**
   * The next drawing point
   */
   nextdDrawingPoint = null;

  /**
   * true if this Z4PointIterator has another point, false otherwise
   */
   hasNext = false;

  /**
   * The current "utility" point
   */
   currentPoint = null;

  /**
   * Creates the object
   *
   * @param rotation The rotation
   */
  constructor(rotation) {
    super();
    this.rotation = rotation;
  }

  /**
   * Returns the point iterator type
   *
   * @return The point iterator type
   */
   getType() {
  }

  /**
   * Returns the rotation
   *
   * @return The rotation
   */
   getRotation() {
    return this.rotation;
  }

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param progression The color progression
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   drawAction(action, progression, x, y) {
  }

   next(color, progression) {
  }

  /**
   * Returns the count of next points to draw on STOP action
   *
   * @return The count of next points to draw on STOP action
   */
   getNextCountOnSTOP() {
  }

  /**
   * Checks if this Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if this Z4PointIterator is an infinite point generator, false
   * otherwise
   */
   isInfinitePointGenerator() {
  }

  /**
   * Returns the sleeping time between a point generation and the successive
   *
   * @return The sleeping time between a point generation and the successive (in
   * milliseconds)
   */
   getInfinitePointGeneratorSleep() {
  }

  /**
   * Checks if this Z4PointIterator has to draw bounds while moving (for example
   * a Z4Tracer while ruler property equals to true)
   *
   * @return true if this Z4PointIterator has to draw bounds while moving, false
   * otherwise
   */
   isDrawBoundsWhileMoving() {
  }

  /**
   * Draws a demo of this Z4PointIterator
   *
   * @param context The context where to draw the demo
   * @param painter The painter to use, it can be null
   * @param spatioTemporalColor The color to use, it can be null
   * @param progression The color progression to use, it can be null
   * @param width The width
   * @param height The height
   * @param valueIsAdjusting true if the demo is for an adjusting value, false
   * otherwise
   */
   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
  }

   toJSON() {
    let json = new Object();
    json["type"] = this.getType();
    json["rotation"] = this.rotation.toJSON();
    return json;
  }
}
