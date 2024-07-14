/**
 * A 2D affine transform
 *
 * @author gianpiero.diblasi
 */
class Z4AffineTransform {

   m00 = 0.0;

   m10 = 0.0;

   m01 = 0.0;

   m11 = 0.0;

   m02 = 0.0;

   m12 = 0.0;

  constructor(m00, m10, m01, m11, m02, m12) {
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
  static  translate(tx, ty) {
    return new Z4AffineTransform(1, 0, 0, 1, tx, ty);
  }

  /**
   * Returns a transform representing a rotation
   *
   * @param angle The angle (in radians)
   * @return A transform representing a rotation
   */
  static  rotate(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new Z4AffineTransform(cos, sin, sin, -cos, 0, 0);
  }

  /**
   * Returns a transform representing a scaling
   *
   * @param sx The scaling factor along the x-axis direction
   * @param sy The scaling factor along the y-axis direction
   * @return A transform representing a scaling
   */
  static  scale(sx, sy) {
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
  static  shear(shx, shy) {
    return new Z4AffineTransform(1, shx, shy, 1, 0, 0);
  }

  /**
   * Concatenates an affine transform Tx to this affine transform Cx, that is
   * Cx'(p) = Cx(Tx(p))
   *
   * @param Tx the affine transform to concatenate
   * @return This concatenated transform
   */
   concatenate(Tx) {
    let M00 = this.m00;
    let M01 = this.m01;
    let M10 = this.m10;
    let M11 = this.m11;
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
   transform(x, y) {
    return new Z4Point(x * this.m00 + y * this.m01 + this.m02, x * this.m10 + y * this.m11 + this.m12);
  }
}
