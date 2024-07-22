/**
 * Common abstract object for geometric frames. A <i>Z4GeometricFrame</i> is a
 * geometric shape representing a frame curve
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricFrame extends Z4GeometricCurve {

  /**
   * The x center location of the frame
   */
   x = 0.0;

  /**
   * The y center location of the frame
   */
   y = 0.0;

  /**
   * The half width of the frame
   */
   w = 0.0;

  /**
   * The half height of the frame
   */
   h = 0.0;

  /**
   * The rotation of the frame
   */
   angle = 0.0;

  /**
   * The x shear of the frame
   */
   sx = 0.0;

  /**
   * The y shear of the frame
   */
   sy = 0.0;

  /**
   * The shearing coefficient
   */
  static  SHEARING_COEFFICIENT = 50;

  /**
   * Creates the object
   *
   * @param type The type
   * @param x The x center location of the frame
   * @param y The y center location of the frame
   * @param w The half width of the frame
   * @param h The half height of the frame
   * @param angle The rotation of the frame
   * @param sx The x shear of the frame
   * @param sy The y shear of the frame
   */
  constructor(type, x, y, w, h, angle, sx, sy) {
    super(type);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = angle;
    this.sx = sx;
    this.sy = sy;
  }

   getControlPoints() {
    let tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
    return new Array(tx.transform(0, 0), tx.transform(this.w, 0), tx.transform(0, this.h));
  }

   getControlPointConnections() {
    return new Array(0, 1, 0, 2);
  }

   getSpinnerConfigurations() {
    return new Array(new Z4GeometricShapeSpinnerConfiguration(Z4Translations.SHEARING, Z4Translations.HORIZONTAL, 0, -200, 200), new Z4GeometricShapeSpinnerConfiguration(Z4Translations.SHEARING, Z4Translations.VERTICAL, 0, -200, 200));
  }

   getButtonConfigurations() {
    return new Array();
  }

  /**
   * Returns a new geometric frame from given parameters
   *
   * @param x The x center location of the frame
   * @param y The y center location of the frame
   * @param w The half width of the frame
   * @param h The half height of the frame
   * @param angle The rotation of the frame
   * @param sx The x shear of the frame
   * @param sy The y shear of the frame
   * @return The new geometric frame
   */
   fromParameters(x, y, w, h, angle, sx, sy) {
  }

   fromDataChanged(controlPoints, x, y, pointIndex, spinnerValue, spinnerIndex, width, height) {
    if (pointIndex === 0) {
      let tx = Z4AffineTransform.translate(x, y).concatenateRotate(this.angle).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      let txInverse = tx.inverse();
      let point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      point1 = txInverse.transform(point1.x, point1.y);
      let point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      point2 = txInverse.transform(point2.x, point2.y);
      return this.fromParameters(x, y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), this.angle, this.sx, this.sy);
    } else if (pointIndex === 1) {
      let angle1 = Z4Math.atan(this.x, this.y, x, y);
      let tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle1).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      let txInverse = tx.inverse();
      let point1 = txInverse.transform(x, y);
      let point2 = this.getPoint(tx, tx.transform(0, this.h), 0, this.h, width, height);
      point2 = txInverse.transform(point2.x, point2.y);
      return this.fromParameters(this.x, this.y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), angle1, this.sx, this.sy);
    } else if (pointIndex === 2) {
      let angle2 = Z4Math.atan(this.x, this.y, x, y) - Z4Math.HALF_PI;
      let tx = Z4AffineTransform.translate(this.x, this.y).concatenateRotate(angle2).concatenateShear(this.sy / Z4GeometricFrame.SHEARING_COEFFICIENT, -this.sx / Z4GeometricFrame.SHEARING_COEFFICIENT);
      let txInverse = tx.inverse();
      let point1 = this.getPoint(tx, tx.transform(this.w, 0), this.w, 0, width, height);
      point1 = txInverse.transform(point1.x, point1.y);
      let point2 = txInverse.transform(x, y);
      return this.fromParameters(this.x, this.y, Z4Math.distance(0, 0, point1.x, point1.y), Z4Math.distance(0, 0, point2.x, point2.y), angle2, this.sx, this.sy);
    } else if (spinnerIndex === 0) {
      return this.fromParameters(this.x, this.y, this.w, this.h, this.angle, spinnerValue, this.sy);
    } else if (spinnerIndex === 1) {
      return this.fromParameters(this.x, this.y, this.w, this.h, this.angle, this.sx, spinnerValue);
    } else {
      return this;
    }
  }

   getPoint(tx, point, w, h, width, height) {
    while ((point.x < 0 || point.x > width || point.y < 0 || point.y > height) && (w > 0 || h > 0)) {
      if (w > 0) {
        w = Math.max(0, w - 0.05);
      }
      if (h > 0) {
        h = Math.max(0, h - 0.05);
      }
      point = tx.transform(w, h);
    }
    return point;
  }

   toJSON() {
    let json = super.toJSON();
    json["x"] = this.x;
    json["y"] = this.y;
    json["w"] = this.w;
    json["h"] = this.h;
    json["angle"] = this.angle;
    json["sx"] = this.sx;
    json["sy"] = this.sy;
    return json;
  }
}
