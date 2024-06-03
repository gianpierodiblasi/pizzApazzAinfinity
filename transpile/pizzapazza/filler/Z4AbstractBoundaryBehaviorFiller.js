/**
 * A Filler with a boundary behavior
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractBoundaryBehaviorFiller extends Z4AbstractGradientColorFiller {

   boundaryBehavior = null;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, boundaryBehavior) {
    super(gradientColor);
    this.boundaryBehavior = boundaryBehavior;
  }

   getColorPositionAt(x, y) {
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
   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
  }
}
