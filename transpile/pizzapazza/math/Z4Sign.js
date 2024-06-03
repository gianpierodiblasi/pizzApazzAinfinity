/**
 * The signs of a value
 *
 * @author gianpiero.diblasi
 */
class Z4Sign {

   signDefinition = null;

   sign = 0;

  /**
   * Creates the object
   *
   * @param signDefinition The sign definition
   */
  constructor(signDefinition) {
    this.signDefinition = signDefinition;
    if (signDefinition === Z4SignDefinition.POSITIVE) {
      this.sign = 1;
    } else if (signDefinition === Z4SignDefinition.NEGATIVE) {
      this.sign = -1;
    } else if (signDefinition === Z4SignDefinition.RANDOM) {
      this.sign = 0;
    } else if (signDefinition === Z4SignDefinition.ALTERNATE) {
      this.sign = -2;
    }
  }

  /**
   * Returns the sign definition
   *
   * @return The sign definition
   */
   getSignDefinition() {
    return signDefinition;
  }

  /**
   * Returns the next sign
   *
   * @return The next sign
   */
   next() {
    switch(this.sign) {
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
