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
    this.contatenateComponents(Tx.m00, Tx.m10, Tx.m01, Tx.m11, Tx.m02, Tx.m12);
    return this;
  }

  /**
   * Concatenates a translation Tx to this affine transform Cx, that is Cx'(p) =
   * Cx(Tx(p))
   *
   * @param tx The translation in the x-axis direction
   * @param ty The translation in the y-axis direction
   * @return This concatenated transform
   */
  public Z4AffineTransform concatenateTranslate(double tx, double ty) {
    this.contatenateComponents(1, 0, 0, 1, tx, ty);
    return this;
  }

  /**
   * Concatenates a rotation Tx to this affine transform Cx, that is Cx'(p) =
   * Cx(Tx(p))
   *
   * @param angle The angle (in radians)
   * @return This concatenated transform
   */
  public Z4AffineTransform concatenateRotate(double angle) {
    double cos = Math.cos(angle);
    double sin = Math.sin(angle);
    this.contatenateComponents(cos, sin, sin, -cos, 0, 0);
    return this;
  }

  /**
   * Concatenates a scaling Tx to this affine transform Cx, that is Cx'(p) =
   * Cx(Tx(p))
   *
   * @param sx The scaling factor along the x-axis direction
   * @param sy The scaling factor along the y-axis direction
   * @return This concatenated transform
   */
  public Z4AffineTransform concatenateScale(double sx, double sy) {
    this.contatenateComponents(sx, 0, 0, sy, 0, 0);
    return this;
  }

  /**
   * Concatenates a shearing Tx to this affine transform Cx, that is Cx'(p) =
   * Cx(Tx(p))
   *
   * @param shx The shift multiplier in the direction of the positive x-axis as
   * a factor of their y coordinate
   * @param shy The shift multiplier in the direction of the positive y-axis as
   * a factor of their X coordinate
   * @return This concatenated transform
   */
  public Z4AffineTransform concatenateShear(double shx, double shy) {
    this.contatenateComponents(1, shx, shy, 1, 0, 0);
    return this;
  }

  private void contatenateComponents(double T00, double T10, double T01, double T11, double T02, double T12) {
    double M00 = this.m00;
    double M01 = this.m01;
    double M10 = this.m10;
    double M11 = this.m11;

    this.m00 = M00 * T00 + M01 * T10;
    this.m10 = M10 * T00 + M11 * T10;
    this.m01 = M00 * T01 * +M01 * T11;
    this.m11 = M10 * T01 + M11 * T11;
    this.m02 += M00 * T02 + M01 * T12;
    this.m12 += M10 * T02 + M11 * T12;
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
