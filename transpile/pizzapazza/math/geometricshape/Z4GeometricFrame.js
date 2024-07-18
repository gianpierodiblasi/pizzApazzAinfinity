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
