package pizzapazza.math;

import simulation.js.$Object;

/**
 * The fanciful value
 *
 * @author gianpiero.diblasi
 */
public class Z4FancifulValue implements Z4Nextable<Double> {

  private final Z4SignedValue constant;
  private final Z4SignedRandomValue random;
  private final boolean uniformSign;

  /**
   * Creates the object
   *
   * @param constant The constant component
   * @param random The random component
   * @param uniformSign true if the computed sign has to be equals for both
   * components, false otherwise; if true then the constant sign is used
   */
  public Z4FancifulValue(Z4SignedValue constant, Z4SignedRandomValue random, boolean uniformSign) {
    super();
    this.constant = constant;
    this.random = random;
    this.uniformSign = uniformSign;
  }

  /**
   * Returns the the constant component
   *
   * @return The the constant component
   */
  public Z4SignedValue getConstant() {
    return this.constant;
  }

  /**
   * Returns the random component
   *
   * @return The random component
   */
  public Z4SignedRandomValue getRandom() {
    return this.random;
  }

  /**
   * Checks if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @return true if the computed sign has to be equals for both components,
   * false otherwise
   */
  public boolean isUniformSign() {
    return this.uniformSign;
  }

  @Override
  public Double next() {
    if (this.uniformSign) {
      return this.constant.getSign().next() * (this.constant.getValue() + this.random.getValue().next());
    } else {
      return this.constant.next() + this.random.next();
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    json.$set("constant", this.constant.toJSON());
    json.$set("random", this.random.toJSON());
    json.$set("uniform", this.uniformSign);
    return json;
  }

  /**
   * Creates a Z4FancifulValue from a JSON object
   *
   * @param json The JSON object
   * @return the fanciful value
   */
  public static Z4FancifulValue fromJSON($Object json) {
    return new Z4FancifulValue(Z4SignedValue.fromJSON(json.$get("constant")), Z4SignedRandomValue.fromJSON(json.$get("random")), json.$get("uniform"));
  }
}
