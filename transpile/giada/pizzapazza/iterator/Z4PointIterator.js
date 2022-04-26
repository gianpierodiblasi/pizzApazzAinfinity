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

   rotation = new Z4FancifulValue();

   rotationMode = Z4Rotation.FIXED;

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

   rotationNext = 0;

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
   * Computes the next rotation
   *
   * @param tangentAngle The tangent angle
   * @return The next rotation (in radians)
   */
   nextRotation(tangentAngle) {
    let angle = Z4Math.deg2rad(this.rotation.next(0));
    if (this.rotationMode === Z4Rotation.FIXED) {
      return angle;
    } else if (this.rotationMode === Z4Rotation.CUMULATIVE) {
      this.rotationNext += angle;
      return this.rotationNext;
    } else if (this.rotationMode === Z4Rotation.RELATIVE_TO_PATH) {
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
   nextSide(z4Point, vector) {
    if (this.rotationMode === Z4Rotation.FIXED || this.rotationMode === Z4Rotation.CUMULATIVE) {
      z4Point.setSide(Z4Sign.POSITIVE);
    } else if (this.rotationMode === Z4Rotation.RELATIVE_TO_PATH) {
      z4Point.setSide(vector ? vector.direction(z4Point.getZ4Vector()) : Z4Sign.RANDOM);
    }
  }
}
