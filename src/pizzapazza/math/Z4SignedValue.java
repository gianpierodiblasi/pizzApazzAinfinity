package pizzapazza.math;

import simulation.js.$Object;

/**
 * A value with sign
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedValue implements Z4Nextable<Double> {

  private final Z4Sign sign;
  private final double value;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The value
   */
  public Z4SignedValue(Z4Sign sign, double value) {
    super();
    this.sign = sign;
    this.value = value;
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
   * Returns the (positive) value
   *
   * @return The (positive) value
   */
  public double getValue() {
    return this.value;
  }

  @Override
  public Double next() {
    return this.sign.next() * this.value;
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("sign", this.sign.toJSON());
    json.$set("value", this.value);
    return json;
  }

  /**
   * Creates a Z4SignedValue from a JSON object
   *
   * @param json The JSON object
   * @return the signed value
   */
  public static Z4SignedValue fromJSON($Object json) {
    return new Z4SignedValue(Z4Sign.fromJSON(json.$get("sign")), json.$get("value"));
  }
}
