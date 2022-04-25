/**
 * The point where to perform a drawing
 *
 * @author gianpiero.di.blasi
 */
class Z4Point extends Cloneable {

   z4Vector = Z4Vector.fromPoints(0, 0, 1, 1);

   intensity = 1;

   lighting = Z4Lighting.NONE;

   colorPosition = -1;

   drawBounds = false;

   side = Z4Sign.RANDOM;

   useVectorModuleAsSize = false;

   clone() {
    let clone = new Z4Point();
    clone.z4Vector = this.z4Vector.clone();
    clone.intensity = this.intensity;
    clone.lighting = this.lighting;
    clone.colorPosition = this.colorPosition;
    clone.drawBounds = this.drawBounds;
    clone.side = this.side;
    clone.useVectorModuleAsSize = this.useVectorModuleAsSize;
    return clone;
  }

  /**
   * Returns the Z4Vector
   *
   * @return The Z4Vector
   */
   getZ4Vector() {
    return z4Vector;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
   getIntensity() {
    return intensity;
  }

  /**
   * Returns the lighting
   * @return The lighting
   */
   getLighting() {
    return lighting;
  }

  /**
   * Returns the color position
   *
   * @return The color position (in the range [0,1]), -1 if this point has no
   * color position
   */
   getColorPosition() {
    return colorPosition;
  }

  /**
   * Checks if this point has to be used to draw bounds or real objects
   *
   * @return true if this point has to be used to draw bounds, false otherwise
   */
   isDrawBounds() {
    return drawBounds;
  }

  /**
   * Sets the side
   *
   * @param side the side
   * @return This Z4Point
   */
   setSide(side) {
    this.side = side;
    return this;
  }

  /**
   * Checks if the vector module of this point has to be used has size
   *
   * @return true if the vector module of this point has to be used has size,
   * false otherwise
   */
   isUseVectorModuleAsSize() {
    return useVectorModuleAsSize;
  }
}
