package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;

/**
 * A Filler with a boundary behavior
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractBoundaryBehaviorFiller extends Z4AbstractGradientColorFiller {

  private final Z4BoundaryBehavior boundaryBehavior;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param boundaryBehavior The boundary behavior
   */
  public Z4AbstractBoundaryBehaviorFiller(Z4GradientColor gradientColor, Z4BoundaryBehavior boundaryBehavior) {
    super(gradientColor);

    this.boundaryBehavior = boundaryBehavior;
  }

  @Override
  protected double getColorPositionAt(int x, int y) {
    return this.getColorPositionAtWithBoundaryBehavior(x, y, this.boundaryBehavior);
  }

  /**
   * Returns the color position to use for a pixel
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @param boundaryBehavior The boundary behavior
   * @return The color position, -1 if no position is available
   */
  protected abstract double getColorPositionAtWithBoundaryBehavior(int x, int y, Z4BoundaryBehavior boundaryBehavior);
}
