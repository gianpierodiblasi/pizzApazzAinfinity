package giada.pizzapazza.math;

import simulation.bezier.$Bezier;

/**
 * A random value with sign
 *
 * @author gianpiero.di.blasi
 */
public class Z4SignedRandomValue {

  private Z4Sign sign = Z4Sign.RANDOM;
  private final double value;
  private final int type;
  private final double length;

  private int step;
  private double prevRandom;
  private double controlRandom;
  private double nextRandom;
  private $Bezier bezierCurve;

  private Z4SignedRandomValue(double value, int type, double length) {
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
   * Checks if this Z4SignedRandomValue generates "classic "random values
   *
   * @return true if this Z4SignedRandomValue generates "classic "random values,
   * false otherwise
   */
  public boolean isClassic() {
    return this.type == 0;
  }

  /**
   * Checks if this Z4SignedRandomValue generates random values on a bezier
   * curve
   *
   * @return true if this Z4SignedRandomValue generates random values on a
   * bezier curve, false otherwise
   */
  public boolean isBezier() {
    return this.type == 1;
  }

  /**
   * Checks if this Z4SignedRandomValue generates random values on a polyline
   *
   * @return true if this Z4SignedRandomValue generates random values on a
   * polyline, false otherwise
   */
  public boolean isPolyline() {
    return this.type == 2;
  }

  /**
   * Returns if this Z4SignedRandomValue generates random values on a stepped
   * line
   *
   * @return true if this Z4SignedRandomValue generates random values on a
   * stepped line, false otherwise
   */
  public boolean isStepped() {
    return this.type == 3;
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
  public Z4Sign getSign() {
    return this.sign;
  }

  /**
   * Sets the sign
   *
   * @param sign The sign
   * @return This Z4SignedRandomValue
   */
  public Z4SignedRandomValue setSign(Z4Sign sign) {
    this.sign = sign;
    return this;
  }

  /**
   * Returns the value
   *
   * @return The (positive) value
   */
  public double getValue() {
    return this.value;
  }

  /**
   * Returns the length
   *
   * @return The length
   */
  public double getLength() {
    return this.length;
  }

  /**
   * Returns the next unsigned random value
   *
   * @return The next unsigned random value (in the range [0,value[)
   */
  public double nextUnsigned() {
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
   * Returns the next signed random value
   *
   * @return The next signed random value (in the range ]-value,value[)
   */
  public double nextSigned() {
    return this.sign.next() * this.nextUnsigned();
  }
  
  /**
   * Returns a Z4SignedRandomValue generating "classic "random values
   *
   * @param value The (positive) value
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue classic(double value) {
    return new Z4SignedRandomValue(value, 0, 1);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a bezier curve
   *
   * @param value The (positive) value
   * @param length The curve length
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue bezier(double value, double length) {
    return new Z4SignedRandomValue(value, 1, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a polyline
   *
   * @param value The (positive) value
   * @param length The polyline length
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue polyline(double value, double length) {
    return new Z4SignedRandomValue(value, 2, length);
  }

  /**
   * Returns a Z4SignedRandomValue generating random values on a stepped line
   *
   * @param value The (positive) value
   * @param length The step length
   * @return The Z4SignedRandomValue
   */
  public static Z4SignedRandomValue stepped(double value, double length) {
    return new Z4SignedRandomValue(value, 3, length);
  }
}
