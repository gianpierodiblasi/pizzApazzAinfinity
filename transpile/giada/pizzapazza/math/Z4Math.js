/**
 * The utility library for math
 *
 * @author gianpiero.diblasi
 */
class Z4Math {

  /**
   * 2*PI value
   */
  static  TWO_PI = 2 * Math.PI;

  /**
   * PI/2 value
   */
  static  HALF_PI = Math.PI / 2;

  /**
   * The gold section
   */
  static  GOLD_SECTION = (1 + Math.sqrt(5)) / 2;

  /**
   * The gold section square
   */
  static  SQUARE_GOLD_SECTION = Z4Math.GOLD_SECTION * Z4Math.GOLD_SECTION;

  /**
   * RAD to DEG conversion
   */
  static  RAD2DEG = 180 / Math.PI;

  /**
   * DEG to RAD conversion
   */
  static  DEG2RAD = Math.PI / 180;

  /**
   * Converts an angle from radiants to degrees
   *
   * @param radians The angle in radians
   * @return The angle in degree
   */
  static  rad2deg(radians) {
    return radians * Z4Math.RAD2DEG;
  }

  /**
   * Converts an angle from degrees to radians
   *
   * @param degrees The angle in degrees
   * @return The angle in radians
   */
  static  deg2rad(degrees) {
    return degrees * Z4Math.DEG2RAD;
  }

  /**
   * Returns the distance between two points
   *
   * @param x1 The x-axis coordinate of the first point
   * @param y1 The y-axis coordinate of the first point
   * @param x2 The x-axis coordinate of the second point
   * @param y2 The y-axis coordinate of the second point
   * @return The distance between two points
   */
  static  distance(x1, y1, x2, y2) {
    let x = x1 - x2;
    let y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Returns the theta component of a point or a vector, in polar coordinates.
   * The value is normalized in the range [0,2*PI]
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x The x-axis coordinate of the end point
   * @param y The y-axis coordinate of the end point
   * @return The theta component of a point or a vector, in polar coordinates
   */
  static  atan(x0, y0, x, y) {
    let a = Math.atan2(y - y0, x - x0);
    return a < 0 ? a + Z4Math.TWO_PI : a;
  }

  /**
   * Generates a ripple around a value
   *
   * @param value The value
   * @param min The minimum allowed value
   * @param max The maximum allowed value
   * @param ripple The ripple (in the range [0,1])
   * @return The rippled value
   */
  static  ripple(value, min, max, ripple) {
    let rnd = (max - min) * ripple * Math.random();
    value += Math.random() > 0.5 ? rnd : -rnd;
    return value < min ? min : value > max ? max : value;
  }

  /**
   * Calculates the control points of a Bezier curve, having coincident starting
   * (S) and ending (E) points, passing through a given point (P), included in a
   * given angle (A) and symmetrical with respect to the straight line passing
   * through the starting point (S) and the given point (P)
   *
   * @param vector The vector starting at the starting point (S) and ending at
   * the given point (P)
   *
   * @param alpha The angle (A) including the Bezier curve, in radians
   * @return An array of two Objects containing the first and second control
   * points of the Bezier curve
   */
  static  butterfly(vector, alpha) {
    let cos = Math.cos(alpha);
    let sin = Math.sin(alpha);
    let controlPoint1 = new Object();
    let val1 = 3 * (cos + 1);
    let val2 = vector.getY0() - 4 * vector.getY();
    controlPoint1["y"] = -(val2 * cos + 4 * (vector.getX() - vector.getX0()) * sin + val2) / val1;
    controlPoint1["x"] = (3 * vector.getX0() * cos + 3 * (controlPoint1["y"] - vector.getY0()) * sin - 5 * vector.getX0() + 8 * vector.getX()) / val1;
    let controlPoint2 = new Object();
    let dx = controlPoint1["x"] - vector.getX0();
    let dy = controlPoint1["y"] - vector.getY0();
    controlPoint2["y"] = dx * sin + dy * cos + vector.getY0();
    controlPoint2["x"] = dx * cos - dy * sin + vector.getX0();
    return new Array(controlPoint1, controlPoint2);
  }

  constructor() {
  }
}
