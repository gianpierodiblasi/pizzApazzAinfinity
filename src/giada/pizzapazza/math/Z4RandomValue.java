package giada.pizzapazza.math;

import def.js.Math;
import simulation.bezier.$Bezier;

/**
 * The random value
 *
 * @author gianpiero.di.blasi
 */
public class Z4RandomValue {

  private final double value;
  private final int type;
  private final int length;

  private int step;
  private double prevRandom;
  private double controlRandom;
  private double nextRandom;
  private $Bezier bezierCurve;

  private Z4RandomValue(double value, int type, int length) {
    this.value = value;
    this.type = type;
    this.length = length;

    this.step = 0;
    this.prevRandom = Math.random();
    this.controlRandom = 1;
    this.nextRandom = Math.random();

    if (this.type == 1) {
      this.createBezierCurve();
    }
  }

  private void createBezierCurve() {
    this.bezierCurve = new $Bezier(0, this.prevRandom, this.length / 2, this.controlRandom, 1, this.nextRandom);
  }

  /**
   * Returns if this Z4RandomValue generates "classic "random values
   *
   * @return true if this Z4RandomValue generates "classic "random values, false
   * otherwise
   */
  public boolean isClassic() {
    return this.type == 0;
  }

  /**
   * Returns if this Z4RandomValue generates random values on a bezier curve
   *
   * @return true if this Z4RandomValue generates random values on a bezier
   * curve, false otherwise
   */
  public boolean isBezier() {
    return this.type == 1;
  }

  /**
   * Returns if this Z4RandomValue generates random values on a polyline
   *
   * @return true if this Z4RandomValue generates random values on a polyline,
   * false otherwise
   */
  public boolean isPolyline() {
    return this.type == 2;
  }

  /**
   * Returns if this Z4RandomValue generates random values on a stepped line
   *
   * @return true if this Z4RandomValue generates random values on a stepped
   * line, false otherwise
   */
  public boolean isStepped() {
    return this.type == 3;
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
   * Returns the length
   *
   * @return The length
   */
  public int getLength() {
    return this.length;
  }

  /**
   * Returns the next random value
   *
   * @return The next random value (in the range [0,value[)
   */
  public double next() {
    switch (this.type) {
      case 0:
      default:
        return this.value * Math.random();
      case 1:
        if (this.step == this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.controlRandom = this.controlRandom == 1 ? 0 : 1;
          this.nextRandom = Math.random();

          this.createBezierCurve();
        } else {
          this.step++;
        }

        return value * this.bezierCurve.get(this.step / this.length).y;
      case 2:
        if (this.step == this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.nextRandom = Math.random();
        } else {
          this.step++;
        }

        return value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
      case 3:
        if (this.step == this.length) {
          this.step = 0;
          this.prevRandom = Math.random();
        } else {
          this.step++;
        }

        return value * this.prevRandom;
    }
  }

  /**
   * Returns a Z4RandomValue generating "classic "random values
   *
   * @param value The value
   * @return The Z4RandomValue
   */
  public static Z4RandomValue classic(double value) {
    return new Z4RandomValue(value, 0, 0);
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue bezier(double value, int length) {
    return new Z4RandomValue(value, 1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue polyline(double value, int length) {
    return new Z4RandomValue(value, 2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue stepped(double value, int length) {
    return new Z4RandomValue(value, 3, length);
  }
}
