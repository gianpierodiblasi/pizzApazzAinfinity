/**
 * Common abstract object for geometric curves. A <i>Z4GeometricCurve</i> is a
 * geometric shape representing a generic curve
 *
 * @author gianpiero.diblasi
 */
class Z4GeometricCurve extends Z4GeometricShape {

  /**
   * The nearest polyline representing the curve
   */
   polyline = null;

  /**
   * The number of segments to approximate the curve with a polyline
   */
  static  APPROX_SEGMENTS = 64;

  /**
   * Creates the object
   *
   * @param type The type
   */
  constructor(type) {
    super(type);
  }

   distance(x, y) {
    return this.polyline.distance(x, y);
  }

   getLength() {
    return this.polyline.getLength();
  }

   getPointAt(position) {
    return this.polyline.getPointAt(position);
  }

   getTangentAt(position) {
    return this.polyline.getTangentAt(position);
  }
}
