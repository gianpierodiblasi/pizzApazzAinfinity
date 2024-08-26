/**
 * A kaleidoscope
 *
 * @author gianpiero.diblasi
 */
class Z4Kaleidoscope {

   multiplicity = 0;

   offsetX = 0;

   offsetY = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
  constructor(multiplicity, offsetX, offsetY) {
    this.multiplicity = multiplicity;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the X offset
   *
   * @return The X offset
   */
   getOffsetX() {
    return this.offsetX;
  }

  /**
   * Returns the Y offset
   *
   * @return The Y offset
   */
   getOffsetY() {
    return this.offsetY;
  }
}
