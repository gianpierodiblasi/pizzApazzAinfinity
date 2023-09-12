package giada.pizzapazza.math;

/**
 * The whirlpool
 *
 * @author gianpiero.diblasi
 */
public class Z4Whirlpool {

  private final int type;
  private Z4FancifulValue angle = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(45).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  private Z4Whirlpool(int type) {
    this.type = type;
  }

  /**
   * Sets the angle
   *
   * @param angle The angle
   * @return This Z4Whirlpool
   */
  public Z4Whirlpool setAngle(Z4FancifulValue angle) {
    this.angle = angle;
    return this;
  }

  /**
   * Returns the angle
   *
   * @return The angle
   */
  public Z4FancifulValue getAngle() {
    return this.angle;
  }

  /**
   * Returns a Z4Whirlpool without whirlpool
   *
   * @return The Z4Whirlpool
   */
  public static Z4Whirlpool none() {
    return new Z4Whirlpool(0);
  }

  /**
   * Returns a Z4Whirlpool with forward whirlpool
   *
   * @return The Z4Whirlpool
   */
  public static Z4Whirlpool forward() {
    return new Z4Whirlpool(1);
  }

  /**
   * Returns a Z4Whirlpool with backward whirlpool
   *
   * @return The Z4Whirlpool
   */
  public static Z4Whirlpool backward() {
    return new Z4Whirlpool(2);
  }

  /**
   * Returns if this Z4Whirlpool has no whirlpool
   *
   * @return true if this Z4Whirlpool has no whirlpool
   */
  public boolean isNone() {
    return this.type == 0;
  }

  /**
   * Returns if this Z4Whirlpool has a forward whirlpool
   *
   * @return true if this Z4Whirlpool has a forward whirlpool
   */
  public boolean isForward() {
    return this.type == 1;
  }

  /**
   * Returns if this Z4Whirlpool has a backward whirlpool
   *
   * @return true if this Z4Whirlpool has a backward whirlpool
   */
  public boolean isBackward() {
    return this.type == 2;
  }
}
