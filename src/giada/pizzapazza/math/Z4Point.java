package giada.pizzapazza.math;

import giada.pizzapazza.color.Z4Lighting;

/**
 * The point where to perform a drawing
 *
 * @author gianpiero.di.blasi
 */
public class Z4Point {

  private Z4Vector z4Vector = Z4Vector.fromPoints(0, 0, 1, 1);
  private double intensity = 1;
  private Z4Lighting lighting = Z4Lighting.NONE;
  private double colorPosition = -1;
  private boolean drawBounds = false;
  private Z4Sign side = Z4Sign.RANDOM;
  private boolean useVectorModuleAsSize = false;

  @Override
  public Z4Point clone() throws CloneNotSupportedException {
    Z4Point clone = new Z4Point();
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
  public Z4Vector getZ4Vector() {
    return this.z4Vector;
  }

  /**
   * Sets the Z4Vector
   *
   * @param z4Vector The Z4Vector
   * @return This Z4Point
   */
  public Z4Point setZ4Vector(Z4Vector z4Vector) {
    this.z4Vector = z4Vector;
    return this;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
  public double getIntensity() {
    return this.intensity;
  }

  /**
   * Returns the lighting
   *
   * @return The lighting
   */
  public Z4Lighting getLighting() {
    return this.lighting;
  }

  /**
   * Sets the lighting
   *
   * @param lighting The lighting
   * @return This Z4Point
   */
  public Z4Point setLighting(Z4Lighting lighting) {
    this.lighting = lighting;
    return this;
  }

  /**
   * Returns the color position
   *
   * @return The color position (in the range [0,1]), -1 if this point has no
   * color position
   */
  public double getColorPosition() {
    return this.colorPosition;
  }

  /**
   * Sets the color position
   *
   * @param colorPosition The color position (in the range [0,1]), -1 if this
   * point has no color position
   * @return This Z4Point
   */
  public Z4Point setColorPosition(double colorPosition) {
    this.colorPosition = colorPosition;
    return this;
  }

  /**
   * Checks if this point has to be used to draw bounds or real objects
   *
   * @return true if this point has to be used to draw bounds, false otherwise
   */
  public boolean isDrawBounds() {
    return this.drawBounds;
  }

  /**
   * Sets the side
   *
   * @param side the side
   * @return This Z4Point
   */
  public Z4Point setSide(Z4Sign side) {
    this.side = side;
    return this;
  }

  /**
   * Checks if the vector module of this point has to be used has size
   *
   * @return true if the vector module of this point has to be used has size,
   * false otherwise
   */
  public boolean isUseVectorModuleAsSize() {
    return this.useVectorModuleAsSize;
  }
}
