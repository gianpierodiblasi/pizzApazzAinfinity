/**
 * The geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4Shape2D {

  /**
   * A circular geometric shape
   */
  static  CIRCLE = new Z4Shape2D(0);

  /**
   * A triangular geometric shape
   */
  static  TRIANGLE = new Z4Shape2D(3);

  /**
   * A squared geometric shape
   */
  static  SQUARE = new Z4Shape2D(-4);

  /**
   * A diamond geometric shape
   */
  static  DIAMOND = new Z4Shape2D(4);

  /**
   * A five sided geometric shape
   */
  static  PENTAGON = new Z4Shape2D(5);

  /**
   * A six sided geometric shape
   */
  static  HEXAGON = new Z4Shape2D(6);

  /**
   * A seven sided geometric shape
   */
  static  SEPTAGON = new Z4Shape2D(7);

  /**
   * A eight sided geometric shape
   */
  static  HEPTAGON = new Z4Shape2D(8);

  /**
   * A star geometric shape
   */
  static  STAR = new Z4Shape2D(-5);

   path = new Path2D();

  constructor(sides) {
    let size = 1;
    let halfSize = 0.5;
    let val = 0.0;
    let angle = 0.0;
    switch(sides) {
      case 0:
        this.path.arc(0, 0, halfSize, 0, Z4Math.TWO_PI);
        break;
      case -4:
        this.path.rect(-halfSize, -halfSize, size, size);
        break;
      case -5:
        val = -Z4Math.HALF_PI;
        angle = Z4Math.TWO_PI / 5;
        let halfSizeGold = halfSize / Z4Math.SQUARE_GOLD_SECTION;
        this.path.moveTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        val = angle * 3 + Z4Math.HALF_PI;
        this.path.lineTo(Math.cos(val) * halfSizeGold, Math.sin(val) * halfSizeGold);
        for (let i = 1; i < 5; i++) {
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
        for (let i = 1; i < sides; i++) {
          val = angle * i - Z4Math.HALF_PI;
          this.path.lineTo(Math.cos(val) * halfSize, Math.sin(val) * halfSize);
        }
        break;
    }
    this.path.closePath();
  }

  /**
   * Returns the path
   *
   * @return The path
   */
   getPath() {
    return this.path;
  }
}
