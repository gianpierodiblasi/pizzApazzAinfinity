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
