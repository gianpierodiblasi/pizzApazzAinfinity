package giada.pizzapazza.math;

import def.js.Math;

/**
 * The signs of a value
 *
 * @author gianpiero.di.blasi
 */
public class Z4Sign {

  /**
   * Positive sign
   */
  public final static Z4Sign POSITIVE = new Z4Sign(1);
  /**
   * Negative sign
   */
  public final static Z4Sign NEGATIVE = new Z4Sign(-1);
  /**
   * Random sign
   */
  public final static Z4Sign RANDOM = new Z4Sign(0);

  private int sign;

  private Z4Sign(int sign) {
    this.sign = sign;
  }

  /**
   * Returns the next sign
   *
   * @return The next sign
   */
  public int next() {
    switch (this.sign) {
      case 1:
      case - 1:
        return this.sign;
      case 0:
      default:
        return Math.random() > 0.5 ? 1 : -1;
      case 2:
      case - 2:
        this.sign *= -1;
        return this.sign / 2;
    }
  }

  /**
   * Creates a Z4Sign providing the following sequence 1, -1, 1, -1, ...
   *
   * @return The Z4Sign
   */
  public static Z4Sign alternate() {
    return new Z4Sign(-2);
  }
}
