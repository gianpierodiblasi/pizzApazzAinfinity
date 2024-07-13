/**
 * The sinusoidal curve
 *
 * @author gianpiero.diblasi
 */
class Z4SinusoidalCurve extends Z4GeometricShape {

   x = 0.0;

   y = 0.0;

   period = 0.0;

   amplitude = 0.0;

   angle = 0.0;

   two_PI_over_period = 0.0;

  /**
   * Creates the object
   *
   * @param x The x-axis coordinate of the start point of the sinusoid
   * @param y The y-axis coordinate of the start point of the sinusoid
   * @param period The period of the sinusoid
   * @param amplitude The amplitude of the sinusoid
   * @param angle The rotation angle of the sinusoid
   */
  constructor(x, y, period, amplitude, angle) {
    super();
    this.x = x;
    this.y = y;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;
    this.two_PI_over_period = Z4Math.TWO_PI / this.period;
  }

   getPolyline() {
    // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    throw new UnsupportedOperationException("Not supported yet.");
  }

   distance(x, y) {
    let rotated = Z4Math.rotate(x - this.x, y - this.y, this.angle);
    return Math.abs(rotated.y - this.amplitude * Math.sin(rotated.x * this.two_PI_over_period));
  }
}
