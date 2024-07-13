package pizzapazza.math.geometricshape;

import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

/**
 * The sinusoidal curve
 *
 * @author gianpiero.diblasi
 */
public class Z4SinusoidalCurve implements Z4GeometricShape {

  private final double x;
  private final double y;
  private final double period;
  private final double amplitude;
  private final double angle;

  private final double two_PI_over_period;

  /**
   * Creates the object
   *
   * @param x The x-axis coordinate of the start point of the sinusoid
   * @param y The y-axis coordinate of the start point of the sinusoid
   * @param period The period of the sinusoid
   * @param amplitude The amplitude of the sinusoid
   * @param angle The rotation angle of the sinusoid
   */
  public Z4SinusoidalCurve(double x, double y, double period, double amplitude, double angle) {
    super();

    this.x = x;
    this.y = y;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;

    this.two_PI_over_period = Z4Math.TWO_PI / this.period;
  }

  @Override
  public Z4Polyline getPolyline() {
    throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
  }

  @Override
  public double distance(double x, double y) {
    Z4Point rotated = Z4Math.rotate(x - this.x, y - this.y, this.angle);
    return Math.abs(rotated.y - this.amplitude * Math.sin(rotated.x * this.two_PI_over_period));
  }
}
