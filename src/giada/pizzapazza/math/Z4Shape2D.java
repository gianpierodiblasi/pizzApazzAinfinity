package giada.pizzapazza.math;

import simulation.js.$Path2D;

/**
 * The geometric shapes
 *
 * @author gianpiero.di.blasi
 */
public class Z4Shape2D {

  /**
   * A circular geometric shape
   */
  public final static Z4Shape2D CIRCLE = new Z4Shape2D(0);
  /**
   * A triangular geometric shape
   */
  public final static Z4Shape2D TRIANGLE = new Z4Shape2D(3);
  /**
   * A squared geometric shape
   */
  public final static Z4Shape2D SQUARE = new Z4Shape2D(-4);
  /**
   * A diamond geometric shape
   */
  public final static Z4Shape2D DIAMOND = new Z4Shape2D(4);
  /**
   * A five sided geometric shape
   */
  public final static Z4Shape2D PENTAGON = new Z4Shape2D(5);
  /**
   * A six sided geometric shape
   */
  public final static Z4Shape2D HEXAGON = new Z4Shape2D(6);
  /**
   * A seven sided geometric shape
   */
  public final static Z4Shape2D SEPTAGON = new Z4Shape2D(7);
  /**
   * A eight sided geometric shape
   */
  public final static Z4Shape2D HEPTAGON = new Z4Shape2D(8);
  /**
   * A star geometric shape
   */
  public final static Z4Shape2D STAR = new Z4Shape2D(-5);

  private final $Path2D path = new $Path2D();

  private Z4Shape2D(int sides) {
    double size = 1;
    double halfSize = 0.5;
    double val;
    double angle;

    switch (sides) {
      case 0:
        this.path.arc(0, 0, halfSize, 0, Z4Math.TWO_PI);
        break;
      case -4:
        this.path.rect(-halfSize, -halfSize, size, size);
        break;
      case -5:
        val = -Z4Math.HALF_PI;
        angle = Z4Math.TWO_PI / 5;

        double halfSizeGold = halfSize / Z4Math.SQUARE_GOLD_SECTION;

        this.path.moveTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        val = angle * 3 + Z4Math.HALF_PI;
        this.path.lineTo(Math.cos(val) * halfSizeGold, Math.sin(val) * halfSizeGold);

        for (int i = 1; i < 5; i++) {
          val = angle * i - Z4Math.HALF_PI;
          this.path.lineTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
          val = angle * (i + 3) + Z4Math.HALF_PI;
          this.path.lineTo(Math.cos(val) * halfSizeGold, Math.sin(val) * halfSizeGold);
        }
        break;
      default:
        val = -Z4Math.HALF_PI;
        angle = Z4Math.TWO_PI / sides;

        this.path.moveTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        for (int i = 1; i < sides; i++) {
          val = angle * i - Z4Math.HALF_PI;
          this.path.lineTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        }
        break;
    }

    this.path.closePath();
  }
}
