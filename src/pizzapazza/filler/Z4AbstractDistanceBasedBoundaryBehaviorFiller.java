package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;
import static simulation.js.$Globals.$exists;

/**
 * A Filler with a boundary behavior based on a distance
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractDistanceBasedBoundaryBehaviorFiller extends Z4AbstractBoundaryBehaviorFiller {

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param boundaryBehavior The boundary behavior
   */
  public Z4AbstractDistanceBasedBoundaryBehaviorFiller(Z4GradientColor gradientColor, int boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
  }

  /**
   * Returns the distance of a point
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The distance
   */
  protected abstract double getDistance(int x, int y);

  @Override
  protected double getColorPositionAtWithBoundaryBehavior(int x, int y, int boundaryBehavior) {
    double d = this.getDistance(x, y);

    if (d <= 1) {
      return d;
    } else if (boundaryBehavior == Z4AbstractDistanceBasedBoundaryBehaviorFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior == Z4AbstractDistanceBasedBoundaryBehaviorFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior == Z4AbstractDistanceBasedBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY) {
      int step = (int) Math.floor(d);
      d -= step;

      if ($exists((step % 2))) {
        d = 1 - d;
      }

      return d;
    } else if (boundaryBehavior == Z4AbstractDistanceBasedBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY) {
      return d - (int) Math.floor(d);
    } else {
      return -1;
    }
  }
}
