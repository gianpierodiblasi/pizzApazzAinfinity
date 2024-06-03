package pizzapazza.math;

import def.js.Math;

/**
 * The signs of a value
 *
 * @author gianpiero.diblasi
 */
public class Z4Sign implements Z4Nextable<Integer> {

  private final Z4SignBehavior behavior;
  private int sign;

  /**
   * Creates the object
   *
   * @param behavior The sign behavior
   */
  public Z4Sign(Z4SignBehavior behavior) {
    this.behavior = behavior;

    if (behavior == Z4SignBehavior.POSITIVE) {
      this.sign = 1;
    } else if (behavior == Z4SignBehavior.NEGATIVE) {
      this.sign = -1;
    } else if (behavior == Z4SignBehavior.RANDOM) {
      this.sign = 0;
    } else if (behavior == Z4SignBehavior.ALTERNATE) {
      this.sign = -2;
    }
  }

  /**
   * Returns the sign behavior
   *
   * @return The sign behavior
   */
  public Z4SignBehavior getSignBehavior() {
    return this.behavior;
  }

  @Override
  public Integer next() {
    switch (this.sign) {
      case 1:
      case -1:
        return this.sign;
      case 0:
      default:
        return Math.random() > 0.5 ? 1 : -1;
      case 2:
      case -2:
        this.sign *= -1;
        return this.sign / 2;
    }
  }
}
