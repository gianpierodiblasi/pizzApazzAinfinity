package pizzapazza.util;

/**
 * A kaleidoscope
 *
 * @author gianpiero.diblasi
 */
public class Z4Kaleidoscope {

  private final int multiplicity;
  private final int offsetX;
  private final int offsetY;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
  public Z4Kaleidoscope(int multiplicity, int offsetX, int offsetY) {
    this.multiplicity = multiplicity;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
  public int getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the X offset
   *
   * @return The X offset
   */
  public int getOffsetX() {
    return this.offsetX;
  }

  /**
   * Returns the Y offset
   *
   * @return The Y offset
   */
  public int getOffsetY() {
    return this.offsetY;
  }
}
