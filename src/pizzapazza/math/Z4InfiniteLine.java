package pizzapazza.math;

import static simulation.js.$Globals.$exists;

/**
 * The infinite line
 *
 * @author gianpiero.diblasi
 */
public class Z4InfiniteLine {

  private final double a;
  private final double b;
  private final double c;
  private final double pythagoras;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the first point of the infinite line
   * @param y1 The y-axis coordinate of the first point of the infinite line
   * @param x2 The x-axis coordinate of the second point of the infinite line
   * @param y2 The y-axis coordinate of the second point of the infinite line
   */
  public Z4InfiniteLine(double x1, double y1, double x2, double y2) {
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
  public Z4Point getIntersectionPoint(Z4InfiniteLine line) {
    double det = this.a * line.b - line.a * this.b;
    return $exists(det) ? new Z4Point((this.b * line.c - line.b * this.c) / det, (line.a * this.c - this.a * line.c) / det) : null;
  }
}
