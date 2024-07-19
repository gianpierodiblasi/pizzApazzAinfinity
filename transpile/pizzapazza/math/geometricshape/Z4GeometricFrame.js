/**
 * Common abstract object for geometric frames. A <i>Z4GeometricFrame</i> is a
 * geometric shape representing a frame curve
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricFrame extends Z4GeometricCurve {

   x = 0.0;

   y = 0.0;

   w = 0.0;

   h = 0.0;

   angle = 0.0;

   sx = 0.0;

   sy = 0.0;

  /**
   * Creates the object
   *
   * @param type The type
   * @param x The x location of the frame
   * @param y The y location of the frame
   * @param w The width of the frame
   * @param h The height of the frame
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
    return new Array(new Z4Point(this.x + this.w / 2, this.y + this.h / 2), new Z4Point(this.x + this.w / 2 + Math.cos(this.angle), this.y + this.h / 2 + Math.sin(angle)), new Z4Point(this.x + this.w / 2 + Math.cos(this.angle - Z4Math.HALF_PI), this.y + this.h / 2 + Math.sin(angle - Z4Math.HALF_PI)));
  }

   getControlPointConnections() {
    return new Array(0, 1, 0, 2);
  }

   getSpinnerConfigurations() {
    return new Array(new Z4GeometricShapeSpinnerConfiguration(Z4Translations.SHEARING, Z4Translations.HORIZONTAL, 0, 0, 200), new Z4GeometricShapeSpinnerConfiguration(Z4Translations.SHEARING, Z4Translations.VERTICAL, 0, 0, 200));
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
