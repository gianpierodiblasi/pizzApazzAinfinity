/**
 * The line
 *
 * @author gianpiero.diblasi
 */
class Z4Line extends Z4GeometricShape {

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   */
  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

   getPolyline() {
    return new Z4Polyline(new Array(new Z4Point(this.x1, this.y1), new Z4Point(this.x2, this.y2)));
  }

   distance(x, y) {
    return Z4Math.ptSegDist(this.x1, this.y1, this.x2, this.y2, x, y);
  }
}
