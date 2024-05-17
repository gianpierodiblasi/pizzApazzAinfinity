/**
 * A (multi) sinusoidal filler
 *
 * @author gianpiero.diblasi
 */
class Z4SinusoidalFiller extends Z4AbstractBoundaryBehaviorFiller {

   x = 0;

   y = 0;

   waveLength = 0.0;

   period = 0.0;

   amplitude = 0.0;

   angle = 0.0;

   two_PI_over_period = 0.0;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x The x-axis coordinate of the start point of the sinusoid
   * @param y The y-axis coordinate of the start point of the sinusoid
   * @param waveLength The wave lenght of the sinusoid
   * @param period The period of the sinusoid
   * @param amplitude The amplitude of the sinusoid
   * @param angle The rotation angle of the sinusoid
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, x, y, waveLength, period, amplitude, angle, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.x = x;
    this.y = y;
    this.waveLength = waveLength;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;
    this.two_PI_over_period = Z4Math.TWO_PI / this.period;
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let rotated = Z4Math.rotate(x - this.x, y - this.y, this.angle);
    let d = Math.abs(rotated.y - this.amplitude * Math.sin(rotated.x * this.two_PI_over_period)) / this.waveLength;
    if (d <= 1) {
      return d;
    } else if (boundaryBehavior === Z4SinusoidalFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior === Z4SinusoidalFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior === Z4SinusoidalFiller.SYMMETRIC_AT_BOUNDARY) {
      let step = Math.floor(d);
      d -= step;
      if ((step % 2)) {
        d = 1 - d;
      }
      return d;
    } else if (boundaryBehavior === Z4SinusoidalFiller.REPEAT_AT_BOUNDARY) {
      return d - Math.floor(d);
    } else {
      return -1;
    }
  }
}
