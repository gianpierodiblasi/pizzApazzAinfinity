/**
 * The infinite line
 *
 * @author gianpiero.diblasi
 */
class Z4InfiniteLine {

   a = 0.0;

   b = 0.0;

   c = 0.0;

   pythagoras = 0.0;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the first point of the infinite line
   * @param y1 The y-axis coordinate of the first point of the infinite line
   * @param x2 The x-axis coordinate of the second point of the infinite line
   * @param y2 The y-axis coordinate of the second point of the infinite line
   */
  constructor(x1, y1, x2, y2) {
    this.a = y2 - y1;
    this.b = x1 - x2;
    this.c = x2 * y1 - x1 * y2;
    this.pythagoras = Math.sqrt(this.a * this.a + this.b * this.b);
  }

  /**
   * Returns the intersection point between this and another infinite line, if
   * the point exists (the two lines are not parallels)
   *
   * @param line The other line
   * @return The intersection point, null if the point does not exist
   */
   getIntersectionPoint(line) {
    let det = this.a * line.b - line.a * this.b;
    return det ? new Z4Point((this.b * line.c - line.b * this.c) / det, (line.a * this.c - this.a * line.c) / det) : null;
  }
}
