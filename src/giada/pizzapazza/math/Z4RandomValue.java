package giada.pizzapazza.math;

import def.js.Math;

/**
 * The random value
 *
 * @author gianpiero.di.blasi
 */
public class Z4RandomValue {

  private final int value;
  private final int type;
  private final int length;

  private int step;
  private double prevRandom;
  private double controlRandom;
  private double nextRandom;
  private $Bezier bezierCurve;

  private Z4RandomValue(int value, int type, int length) {
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
   * Returns the next random value
   *
   * @return The next random value (in the range [0,value[)
   */
  public double next() {
    switch (this.type) {
      case 0:
      default:
        return value * Math.random();
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
  public static Z4RandomValue classic(int value) {
    return new Z4RandomValue(value, 0, 0);
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param value The value
   * @param length The curve length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue bezier(int value, int length) {
    return new Z4RandomValue(value, 1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param value The value
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue polyline(int value, int length) {
    return new Z4RandomValue(value, 2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param value The value
   * @param length The step length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue stepped(int value, int length) {
    return new Z4RandomValue(value, 3, length);
  }

  private static class $Point {

    private double x;
    private double y;
  }

  private static class $Bezier {

    private $Bezier(double x1, double y1, double x2, double y2, double x3, double y3) {
    }

    private $Point get(double t) {
      return null;
    }
  }
}
