package giada.pizzapazza.math;

/**
 * The vector
 *
 * @author gianpiero.diblasi
 */
public class Z4Vector {

  @Override
  @SuppressWarnings({"CloneInNonCloneableClass", "CloneDeclaresCloneNotSupported"})
  public Z4Vector clone() {
    return new Z4Vector(this.x0, this.y0, this.x, this.y, this.module, this.phase);
  }

  /**
   * Return the x-axis coordinate of the start point
   *
   * @return The x-axis coordinate of the start point
   */
  public double getX0() {
    return this.x0;
  }

  /**
   * Return the y-axis coordinate of the start point
   *
   * @return The y-axis coordinate of the start point
   */
  public double getY0() {
    return this.y0;
  }

  /**
   * Return the x-axis coordinate of the end point
   *
   * @return The x-axis coordinate of the end point
   */
  public double getX() {
    return this.x;
  }

  /**
   * Return the y-axis coordinate of the end point
   *
   * @return The y-axis coordinate of the end point
   */
  public double getY() {
    return this.y;
  }

  /**
   * Returns the module
   *
   * @return The module
   */
  public double getModule() {
    return this.module;
  }

  /**
   * Return the phase (in radians)
   *
   * @return The phase (in radians)
   */
  public double getPhase() {
    return this.phase;
  }
}
