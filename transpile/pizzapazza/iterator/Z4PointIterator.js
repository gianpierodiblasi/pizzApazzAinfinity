/**
 * The common parent of all point iterators
 *
 * @author gianpiero.diblasi
 */
class Z4PointIterator extends Z4Nextable {

  /**
   * The rotation
   */
   rotation = null;

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
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   drawAction(action, x, y) {
  }

   next() {
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

   toJSON() {
    let json = new Object();
    json["rotation"] = this.rotation.toJSON();
    return json;
  }
}
