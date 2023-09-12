/**
 * The whirlpool
 *
 * @author gianpiero.diblasi
 */
class Z4Whirlpool {

   type = 0;

   angle = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(45).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  constructor(type) {
    this.type = type;
  }

  /**
   * Sets the angle
   *
   * @param angle The angle
   * @return This Z4Whirlpool
   */
   setAngle(angle) {
    this.angle = angle;
    return this;
  }

  /**
   * Returns the angle
   *
   * @return The angle
   */
   getAngle() {
    return this.angle;
  }

  /**
   * Returns a Z4Whirlpool without whirlpool
   *
   * @return The Z4Whirlpool
   */
  static  none() {
    return new Z4Whirlpool(0);
  }

  /**
   * Returns a Z4Whirlpool with forward whirlpool
   *
   * @return The Z4Whirlpool
   */
  static  forward() {
    return new Z4Whirlpool(1);
  }

  /**
   * Returns a Z4Whirlpool with backward whirlpool
   *
   * @return The Z4Whirlpool
   */
  static  backward() {
    return new Z4Whirlpool(2);
  }

  /**
   * Returns if this Z4Whirlpool has no whirlpool
   *
   * @return true if this Z4Whirlpool has no whirlpool
   */
   isNone() {
    return this.type === 0;
  }

  /**
   * Returns if this Z4Whirlpool has a forward whirlpool
   *
   * @return true if this Z4Whirlpool has a forward whirlpool
   */
   isForward() {
    return this.type === 1;
  }

  /**
   * Returns if this Z4Whirlpool has a backward whirlpool
   *
   * @return true if this Z4Whirlpool has a backward whirlpool
   */
   isBackward() {
    return this.type === 2;
  }
}
