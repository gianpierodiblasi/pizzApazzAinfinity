package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;

/**
 * A Filler with a boundary behavior
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractBoundaryBehaviorFiller extends Z4AbstractFiller {

  /**
   * The filler does nothing outside the boundary
   */
  public final static int STOP_AT_BOUNDARY = 0;

  /**
   * The filler uses the last color outside the boundary
   */
  public final static int FILL_AT_BOUNDARY = 1;

  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  public final static int SYMMETRIC_AT_BOUNDARY = 2;

  /**
   * The filler restarts the color outside the boundary
   */
  public final static int REPEAT_AT_BOUNDARY = 3;

  /**
   * The boundary behavior
   */
  protected final int boundaryBehavior;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param boundaryBehavior The boundary behavior
   */
  public Z4AbstractBoundaryBehaviorFiller(Z4GradientColor gradientColor, int boundaryBehavior) {
    super(gradientColor);

    this.boundaryBehavior = boundaryBehavior;
  }
}
