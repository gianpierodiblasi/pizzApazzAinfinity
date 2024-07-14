package pizzapazza.math;

/**
 * A 2D affine transform
 *
 * @author gianpiero.diblasi
 */
public class Z4AffineTransform {

  private double m00;
  private double m10;
  private double m01;
  private double m11;
  private double m02;
  private double m12;

  private Z4AffineTransform(double m00, double m10, double m01, double m11, double m02, double m12) {
    this.m00 = m00;
    this.m10 = m10;
    this.m01 = m01;
    this.m11 = m11;
    this.m02 = m02;
    this.m12 = m12;
  }

  /**
   * Returns a transform representing a translation
   *
   * @param tx The translation in the x-axis direction
   * @param ty The translation in the y-axis direction
   * @return A transform representing a translation
   */
  public static Z4AffineTransform translate(double tx, double ty) {
    return new Z4AffineTransform(1, 0, 0, 1, tx, ty);
  }

  /**
   * Returns a transform representing a rotation
   *
   * @param angle The angle (in radians)
   * @return A transform representing a rotation
   */
  public static Z4AffineTransform rotate(double angle) {
    double cos = Math.cos(angle);
    double sin = Math.sin(angle);
    return new Z4AffineTransform(cos, sin, sin, -cos, 0, 0);
  }

  /**
   * Returns a transform representing a scaling
   *
   * @param sx The scaling factor along the x-axis direction
   * @param sy The scaling factor along the y-axis direction
   * @return A transform representing a scaling
   */
  public static Z4AffineTransform scale(double sx, double sy) {
    return new Z4AffineTransform(sx, 0, 0, sy, 0, 0);
  }

  /**
   * Returns a transform representing a shearing
   *
   * @param shx The shift multiplier in the direction of the positive x-axis as
   * a factor of their y coordinate
   * @param shy The shift multiplier in the direction of the positive y-axis as
   * a factor of their X coordinate
   * @return A transform representing a shearing
   */
  public static Z4AffineTransform shear(double shx, double shy) {
    return new Z4AffineTransform(1, shx, shy, 1, 0, 0);
  }

  /**
   * Concatenates an affine transform Tx to this affine transform Cx, that is
   * Cx'(p) = Cx(Tx(p))
   *
   * @param Tx the affine transform to concatenate
   * @return This concatenated transform
   */
  public Z4AffineTransform concatenate(Z4AffineTransform Tx) {
    double M00 = this.m00;
    double M01 = this.m01;
    double M10 = this.m10;
    double M11 = this.m11;

    this.m00 = M00 * Tx.m00 + M01 * Tx.m10;
    this.m01 = M00 * Tx.m01 * +M01 * Tx.m11;
    this.m02 += M00 * Tx.m02 + M01 * Tx.m12;
    this.m10 = M10 * Tx.m00 + M11 * Tx.m10;
    this.m11 = M10 * Tx.m01 + M11 * Tx.m11;
    this.m12 += M10 * Tx.m02 + M11 * Tx.m12;

    return this;
  }

  /**
   * Transforms a point
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The transformed point
   */
  public Z4Point transform(double x, double y) {
    return new Z4Point(x * this.m00 + y * this.m01 + this.m02, x * this.m10 + y * this.m11 + this.m12);
  }
}
