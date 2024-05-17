/**
 * A Filler with a boundary behavior based on a distance
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractDistanceBasedBoundaryBehaviorFiller extends Z4AbstractBoundaryBehaviorFiller {

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
  }

  /**
   * Returns the distance of a point
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The distance
   */
   getDistance(x, y) {
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let d = this.getDistance(x, y);
    if (d <= 1) {
      return d;
    } else if (boundaryBehavior === Z4AbstractDistanceBasedBoundaryBehaviorFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior === Z4AbstractDistanceBasedBoundaryBehaviorFiller.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior === Z4AbstractDistanceBasedBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY) {
      let step = Math.floor(d);
      d -= step;
      if ((step % 2)) {
        d = 1 - d;
      }
      return d;
    } else if (boundaryBehavior === Z4AbstractDistanceBasedBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY) {
      return d - Math.floor(d);
    } else {
      return -1;
    }
  }
}
