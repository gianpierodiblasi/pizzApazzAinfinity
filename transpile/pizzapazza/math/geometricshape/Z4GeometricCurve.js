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

   getPolyline() {
    return this.polyline;
  }

   distance(x, y) {
    return this.polyline.distance(x, y);
  }
}
