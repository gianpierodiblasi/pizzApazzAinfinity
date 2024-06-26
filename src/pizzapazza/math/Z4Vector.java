package pizzapazza.math;

/**
 * The vector
 *
 * @author gianpiero.diblasi
 */
public class Z4Vector {

  public final double x0;
  public final double y0;
  public final double x;
  public final double y;
  public final double module;
  public final double phase;

  private Z4Vector(double x0, double y0, double x, double y, double module, double phase) {
    this.x0 = x0;
    this.y0 = y0;
    this.x = x;
    this.y = y;
    this.module = module;
    this.phase = phase;
  }

  /**
   * Creates a Z4Vector from points
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x The x-axis coordinate of the end point
   * @param y The y-axis coordinate of the end point
   * @return The Z4Vector
   */
  public static Z4Vector fromPoints(double x0, double y0, double x, double y) {
    return new Z4Vector(x0, y0, x, y, Z4Math.distance(x0, y0, x, y), Z4Math.atan(x0, y0, x, y));
  }

  /**
   * Creates a Z4Vector from a vector
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param module The module
   * @param phase The phase (in radians)
   * @return The Z4Vector
   */
  public static Z4Vector fromVector(double x0, double y0, double module, double phase) {
    return new Z4Vector(x0, y0, x0 + module * Math.cos(phase), y0 + module * Math.sin(phase), module, phase);
  }

  /**
   * Returns the direction in which this vector rotates on another Z4Vector
   *
   * @param vector The other vector
   * @return The direction in which this vector rotates on another Z4Vector
   */
  public Z4SignBehavior direction(Z4Vector vector) {
    double x1 = this.x - this.x0;
    double y1 = this.y - this.y0;
    double x2 = vector.x - vector.x0;
    double y2 = vector.y - vector.y0;

    return Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2) >= 0 ? Z4SignBehavior.POSITIVE : Z4SignBehavior.NEGATIVE;
  }
}
