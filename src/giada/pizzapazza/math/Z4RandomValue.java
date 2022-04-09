package giada.pizzapazza.math;

import def.bezier_js.bezierjs.Bezier;
import def.bezier_js.bezierjs.Point;
import def.js.Math;

/**
 * The random value
 *
 * @author gianpiero.di.blasi
 */
public class Z4RandomValue {

  /**
   * The classic random behaviour
   */
  public final static Z4RandomValue CLASSIC = new Z4RandomValue(0, 0);

  private final int type;
  private final int length;

  private int step;
  private double prevRandom;
  private double controlRandom;
  private double nextRandom;
  private Bezier bezierCurve;

  private Z4RandomValue(int type, int length) {
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
    Point p1 = new Point() {
    };
    p1.x = 0;
    p1.y = this.prevRandom;
    Point p2 = new Point() {
    };
    p2.x = this.length / 2;
    p2.y = this.controlRandom;
    Point p3 = new Point() {
    };
    p3.x = 1;
    p3.y = this.nextRandom;

    this.bezierCurve = new Bezier(p1, p2, p3);
  }

  /**
   * Returns the next random value
   *
   * @return
   */
  public double next() {
    switch (this.type) {
      case 0:
      default:
        return Math.random();
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

        return this.bezierCurve.get(this.step / this.length).y;
      case 2:
        if (this.step == this.length) {
          this.step = 0;
          this.prevRandom = this.nextRandom;
          this.nextRandom = Math.random();
        } else {
          this.step++;
        }

        return (this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom;
      case 3:
        if (this.step == this.length) {
          this.step = 0;
          this.prevRandom = Math.random();
        } else {
          this.step++;
        }

        return this.prevRandom;
    }
  }

  /**
   * Returns a Z4RandomValue generating random values on a bezier curve
   *
   * @param length The curve length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue bezier(int length) {
    return new Z4RandomValue(1, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a polyline
   *
   * @param length The polyline length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue polyline(int length) {
    return new Z4RandomValue(2, length);
  }

  /**
   * Returns a Z4RandomValue generating random values on a stepped line
   *
   * @param length The step length
   * @return The Z4RandomValue
   */
  public static Z4RandomValue stepped(int length) {
    return new Z4RandomValue(3, length);
  }
}
