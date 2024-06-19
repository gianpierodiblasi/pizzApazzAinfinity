package pizzapazza.math;

import def.js.Array;
import def.js.Math;

/**
 * The utility library for math
 *
 * @author gianpiero.diblasi
 */
public class Z4Math {

  /**
   * 2*PI value
   */
  public final static double TWO_PI = 2 * Math.PI;

  /**
   * PI/2 value
   */
  public final static double HALF_PI = Math.PI / 2;

  /**
   * The gold section
   */
  public final static double GOLD_SECTION = (1 + Math.sqrt(5)) / 2;

  /**
   * The gold section square
   */
  public final static double SQUARE_GOLD_SECTION = Z4Math.GOLD_SECTION * Z4Math.GOLD_SECTION;

  /**
   * RAD to DEG conversion
   */
  public final static double RAD2DEG = 180 / Math.PI;

  /**
   * DEG to RAD conversion
   */
  public final static double DEG2RAD = Math.PI / 180;

  /**
   * Converts an angle from radiants to degrees
   *
   * @param radians The angle in radians
   * @return The angle in degree
   */
  public static double rad2deg(double radians) {
    return radians * Z4Math.RAD2DEG;
  }

  /**
   * Converts an angle from degrees to radians
   *
   * @param degrees The angle in degrees
   * @return The angle in radians
   */
  public static double deg2rad(double degrees) {
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
  public static double distance(double x1, double y1, double x2, double y2) {
    double x = x1 - x2;
    double y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Returns the distance from a point to a (infinite) line
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The distance
   */
  public static double ptLineDist(double x1, double y1, double x2, double y2, double px, double py) {
    return Math.sqrt(Z4Math.ptLineDistSq(x1, y1, x2, y2, px, py));
  }

  /**
   * Returns the square of the distance from a point to a (infinite) line
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The square of the distance
   */
  public static double ptLineDistSq(double x1, double y1, double x2, double y2, double px, double py) {
    x2 -= x1;
    y2 -= y1;
    px -= x1;
    py -= y1;

    double dotprod = px * x2 + py * y2;
    double projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
    double lenSq = px * px + py * py - projlenSq;
    return lenSq < 0 ? 0 : lenSq;
  }

  /**
   * Returns the distance from a point to a line segment
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The distance
   */
  public static double ptSegDist(double x1, double y1, double x2, double y2, double px, double py) {
    return Math.sqrt(Z4Math.ptSegDistSq(x1, y1, x2, y2, px, py));
  }

  /**
   * Returns the square of the distance from a point to a line segment
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The square of the distance
   */
  public static double ptSegDistSq(double x1, double y1, double x2, double y2, double px, double py) {
    x2 -= x1;
    y2 -= y1;
    px -= x1;
    py -= y1;

    double dotprod = px * x2 + py * y2;
    double projlenSq;
    if (dotprod <= 0.0) {
      projlenSq = 0.0;
    } else {
      px = x2 - px;
      py = y2 - py;
      dotprod = px * x2 + py * y2;
      if (dotprod <= 0.0) {
        projlenSq = 0.0;
      } else {
        projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
      }
    }

    double lenSq = px * px + py * py - projlenSq;
    return lenSq < 0 ? 0 : lenSq;
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
  public static double atan(double x0, double y0, double x, double y) {
    double a = Math.atan2(y - y0, x - x0);
    return a < 0 ? a + Z4Math.TWO_PI : a;
  }

  /**
   * Rotates a point by an angle
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @param angle The angle (in radians)
   * @return The rotated point
   */
  public static Z4Point rotate(double x, double y, double angle) {
    double cos = Math.cos(angle);
    double sin = Math.sin(angle);
    return new Z4Point(x * cos + y * sin, x * sin - y * cos);
  }

  /**
   * Rotates a point by an angle and then translates it
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @param angle The angle (in radians)
   * @param tx The x-axis translation
   * @param ty The y-axis translation
   * @return The rotated point
   */
  public static Z4Point rotoTranslate(double x, double y, double angle, double tx, double ty) {
    double cos = Math.cos(angle);
    double sin = Math.sin(angle);
    return new Z4Point(x * cos + y * sin + tx, x * sin - y * cos + ty);
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
  public static double ripple(double value, double min, double max, double ripple) {
    double rnd = (max - min) * ripple * Math.random();
    value += Math.random() > 0.5 ? rnd : -rnd;
    return value < min ? min : value > max ? max : value;
  }

  /**
   * Returns the vertices of a polygon inscribed in a circle with radius = 1
   *
   * @param vertexCount The vertex count
   * @return The vertices
   */
  public static Array<Z4Point> getPolygonVertices(int vertexCount) {
    Array<Z4Point> vertices = new Array<>();
    for (int index = 0; index < vertexCount; index++) {
      vertices.push(new Z4Point(Math.cos(index * Z4Math.TWO_PI / vertexCount), Math.sin(index * Z4Math.TWO_PI / vertexCount)));
    }
    return vertices;
  }

  /**
   * Returns the vertices of a star inscribed in a circle with radius = 1
   *
   * @param vertexCount The vertex count
   * @return The vertices
   */
  public static Array<Z4Point> getStarVertices(int vertexCount) {
    Array<Z4Point> vertices = new Array<>();
    for (int index = 0; index < vertexCount; index++) {
      double val = index * Z4Math.TWO_PI / vertexCount;
      vertices.push(new Z4Point(Math.cos(val), Math.sin(val)));
      val = (index * Z4Math.TWO_PI + Math.PI) / vertexCount;
      vertices.push(new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION));
    }
    return vertices;
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
   * @return An array of two points containing the first and second control
   * points of the Bezier curve
   */
  public static Array<Z4Point> butterfly(Z4Vector vector, double alpha) {
    double cos = Math.cos(alpha);
    double sin = Math.sin(alpha);

    double val1 = 3 * (cos + 1);
    double val2 = vector.y0 - 4 * vector.y;

    double y = -(val2 * cos + 4 * (vector.x - vector.x0) * sin + val2) / val1;
    double x = (3 * vector.x0 * cos + 3 * (y - vector.y0) * sin - 5 * vector.x0 + 8 * vector.x) / val1;
    Z4Point controlPoint1 = new Z4Point(x, y);

    double dx = controlPoint1.x - vector.x0;
    double dy = controlPoint1.y - vector.y0;

    Z4Point controlPoint2 = new Z4Point(
            dx * cos - dy * sin + vector.x0,
            dx * sin + dy * cos + vector.y0
    );

    return new Array<>(controlPoint1, controlPoint2);
  }

  private Z4Math() {
  }
}
