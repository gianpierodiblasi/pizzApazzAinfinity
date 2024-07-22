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
    return new Z4AffineTransform(cos, sin, -sin, cos, 0, 0);
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
   concatenateTranslate(tx, ty) {
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
   concatenateRotate(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    this.contatenateComponents(cos, sin, -sin, cos, 0, 0);
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
   concatenateScale(sx, sy) {
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
   concatenateShear(shx, shy) {
    this.contatenateComponents(1, shx, shy, 1, 0, 0);
    return this;
  }

   contatenateComponents(T00, T10, T01, T11, T02, T12) {
    let M00 = this.m00;
    let M01 = this.m01;
    let M10 = this.m10;
    let M11 = this.m11;
    this.m00 = M00 * T00 + M01 * T10;
    this.m10 = M10 * T00 + M11 * T10;
    this.m01 = M00 * T01 + M01 * T11;
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
   transform(x, y) {
    return new Z4Point(x * this.m00 + y * this.m01 + this.m02, x * this.m10 + y * this.m11 + this.m12);
  }
}
