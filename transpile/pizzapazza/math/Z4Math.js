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
  static  ptLineDist(x1, y1, x2, y2, px, py) {
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
  static  ptLineDistSq(x1, y1, x2, y2, px, py) {
    x2 -= x1;
    y2 -= y1;
    px -= x1;
    py -= y1;
    let dotprod = px * x2 + py * y2;
    let projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
    let lenSq = px * px + py * py - projlenSq;
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
  static  ptSegDist(x1, y1, x2, y2, px, py) {
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
  static  ptSegDistSq(x1, y1, x2, y2, px, py) {
    x2 -= x1;
    y2 -= y1;
    px -= x1;
    py -= y1;
    let dotprod = px * x2 + py * y2;
    let projlenSq = 0.0;
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
    let lenSq = px * px + py * py - projlenSq;
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
  static  atan(x0, y0, x, y) {
    let a = Math.atan2(y - y0, x - x0);
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
  static  rotate(x, y, angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new Z4Point(x * cos + y * sin, x * sin - y * cos);
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
   * Returns the vertices of a polygon inscribed in a circle with radius = 1
   *
   * @param vertexCount The vertex count
   * @return The vertices
   */
  static  getPolygonVertices(vertexCount) {
    let vertices = new Array();
    for (let index = 0; index < vertexCount; index++) {
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
  static  getStarVertices(vertexCount) {
    let vertices = new Array();
    for (let index = 0; index < vertexCount; index++) {
      let val = index * Z4Math.TWO_PI / vertexCount;
      vertices.push(new Z4Point(Math.cos(val), Math.sin(val)));
      val = (index * Z4Math.TWO_PI + Math.PI) / vertexCount;
      vertices.push(new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION));
    }
    return vertices;
  }

  constructor() {
  }
}
