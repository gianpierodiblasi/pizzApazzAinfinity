package pizzapazza.math;

/**
 * The line
 *
 * @author gianpiero.diblasi
 */
public class Z4Line {

  public final double x1;
  public final double y1;
  public final double x2;
  public final double y2;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   */
  public Z4Line(double x1, double y1, double x2, double y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}
