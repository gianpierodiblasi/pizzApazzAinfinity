package pizzapazza.math;

import simulation.js.$Object;

/**
 * A random value with sign
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedRandomValue implements Z4Nextable<Double> {

  private final Z4Sign sign;
  private final Z4RandomValue value;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The random value
   */
  public Z4SignedRandomValue(Z4Sign sign, Z4RandomValue value) {
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
   * Returns the random value
   *
   * @return The random value
   */
  public Z4RandomValue getValue() {
    return this.value;
  }

  @Override
  public Double next() {
    return this.sign.next() * this.value.next();
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("sign", this.sign.toJSON());
    json.$set("value", this.value.toJSON());
    return json;
  }

  /**
   * Creates a Z4SignedRandomValue from a JSON object
   *
   * @param json The JSON object
   * @return the signed random value
   */
  public static Z4SignedRandomValue fromJSON($Object json) {
    return new Z4SignedRandomValue(Z4Sign.fromJSON(json.$get("sign")), Z4RandomValue.fromJSON(json.$get("value")));
  }
}
