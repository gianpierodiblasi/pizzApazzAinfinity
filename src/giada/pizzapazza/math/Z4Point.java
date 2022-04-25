package giada.pizzapazza.math;

import giada.pizzapazza.color.Z4Lighting;

/**
 * The point where to perform a drawing
 *
 * @author gianpiero.di.blasi
 */
public class Z4Point implements Cloneable {

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
   * @return The Z4Vector
   */
  public Z4Vector getZ4Vector() {
    return z4Vector;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
  public double getIntensity() {
    return intensity;
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
}
