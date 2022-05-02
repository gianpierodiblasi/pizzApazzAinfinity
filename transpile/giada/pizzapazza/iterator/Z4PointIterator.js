/**
 * The common parent of all point iterators
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4PointIterator {

  /**
   * The color progression
   */
   progression = Z4Progression.SPATIAL;

  /**
   * The step for temporal progression (in the range [0,1])
   */
   temporalStepProgression = 0.1;

  /**
   * The color lighting
   */
   lighting = Z4Lighting.NONE;

  /**
   * The rotation
   */
   rotation = Z4Rotation.fixed();

  /**
   * The current Z4Point
   */
   z4Point = new Z4Point();

  /**
   * The current "utility" point
   */
   P = new Object();

  /**
   * true if this Z4PointIterator has another point, false otherwise
   */
   hasNext = false;

  /**
   * Creates a Z4PointIterator
   */
  constructor() {
    this.P["x"] = 0;
    this.P["y"] = 0;
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
   seProgression(progression, temporalStepProgression, lighting) {
    this.progression = progression;
    this.temporalStepProgression = temporalStepProgression;
    this.lighting = lighting;
    return this;
  }

  /**
   * Sets the rotation
   *
   * @param rotation The rotation
   * @return This Z4PointIterator
   */
   setRotation(rotation) {
    this.rotation = rotation;
    return this;
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
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   draw(action, x, y) {
  }

  /**
   * Returns the next point of the iterator
   *
   * @return The next point of the iterator, null if the iterator has no more
   * points
   */
   next() {
  }

  /**
   * Draws a demo of this Z4PointIterator
   *
   * @param context The context where to draw the demo
   * @param width The width
   * @param height The height
   */
   drawDemo(context, width, height) {
  }

  /**
   * Returns the color parameter
   *
   * @param color The color
   * @return The color
   */
   getColor(color) {
    return color;
  }
}
