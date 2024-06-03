package pizzapazza.math;

import simulation.bezier.$Bezier;

/**
 * A random value
 *
 * @author gianpiero.diblasi
 */
public class Z4RandomValue implements Z4Nextable<Double> {

  private final double value;
  private final Z4RandomValueBehavior behavior;
  private final double length;

  private int step;
  private double prevRandom;
  private double controlRandom;
  private double nextRandom;
  private $Bezier bezierCurve;

  /**
   * Creates the object
   *
   * @param value The value
   * @param behavior The random value behavior
   * @param length The polyline/curve length
   */
  public Z4RandomValue(double value, Z4RandomValueBehavior behavior, double length) {
    this.value = value;
    this.behavior = behavior;
    this.length = length;

    this.step = 1;
    this.prevRandom = Math.random();
    this.controlRandom = 1;
    this.nextRandom = Math.random();

    if (this.behavior == Z4RandomValueBehavior.BEZIER) {
      this.createBezierCurve();
    }
  }

  private void createBezierCurve() {
    this.bezierCurve = new $Bezier(0, this.prevRandom, this.length / 2, this.controlRandom, 1, this.nextRandom);
  }

  /**
   * Returns the value
   *
   * @return The value
   */
  public double getValue() {
    return this.value;
  }

  /**
   * Returns the random value behavior
   *
   * @return The random value behavior
   */
  public Z4RandomValueBehavior getRandomValueBehavior() {
    return this.behavior;
  }

  /**
   * Returns The polyline/curve length
   *
   * @return The polyline/curve length
   */
  public double getLength() {
    return this.length;
  }

  @Override
  public Double next() {
    if (this.behavior == Z4RandomValueBehavior.CLASSIC) {
      return this.value * Math.random();
    } else if (this.behavior == Z4RandomValueBehavior.BEZIER) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = this.nextRandom;
        this.controlRandom = this.controlRandom == 1 ? 0 : 1;
        this.nextRandom = Math.random();

        this.createBezierCurve();
      } else {
        this.step++;
      }

      return this.value * this.bezierCurve.get(this.step / this.length).y;
    } else if (this.behavior == Z4RandomValueBehavior.POLYLINE) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = this.nextRandom;
        this.nextRandom = Math.random();
      } else {
        this.step++;
      }

      return this.value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
    } else if (this.behavior == Z4RandomValueBehavior.STEPPED) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = Math.random();
      } else {
        this.step++;
      }

      return this.value * this.prevRandom;
    } else {
      return 0.0;
    }
  }
}
