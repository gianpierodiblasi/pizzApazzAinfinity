package pizzapazza.filler;

import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import static simulation.js.$Globals.$exists;

/**
 * A (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
public class Z4LinearFiller extends Z4AbstractBoundaryBehaviorFiller {

  private final int p1x;
  private final int p1y;
  private final int p2x;
  private final int p2y;

  private final double angle;
  private final double distance;

  private final double line1x;
  private final double line1y;
  private final double line2x;
  private final double line2y;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param boundaryBehavior The boundary behavior
   */
  public Z4LinearFiller(Z4GradientColor gradientColor, int x1, int y1, int x2, int y2, int boundaryBehavior) {
    super(gradientColor, boundaryBehavior);

    this.p1x = x1;
    this.p1y = y1;
    this.p2x = x2;
    this.p2y = y2;

    this.angle = Z4Math.atan(this.p1x, this.p1y, this.p2x, this.p2y) + Z4Math.HALF_PI;
    this.distance = Z4Math.distance(this.p1x, this.p1y, this.p2x, this.p2y);

    this.line1x = this.p1x + Math.cos(this.angle);
    this.line1y = this.p1y + Math.sin(this.angle);
    this.line2x = this.p2x + Math.cos(this.angle);
    this.line2y = this.p2y + Math.sin(this.angle);
  }

  @Override
  protected double getColorPositionAt(int x, int y) {
    double d1 = Z4Math.ptLineDist(this.p1x, this.p1y, this.line1x, this.line1y, x, y) / this.distance;
    double d2 = Z4Math.ptLineDist(this.p2x, this.p2y, this.line2x, this.line2y, x, y) / this.distance;

    if (d1 <= 1 && d2 <= 1) {
      return d1;
    } else if (this.boundaryBehavior == Z4LinearFiller.STOP_AT_BOUNDARY) {
      return -1;
    } else if (this.boundaryBehavior == Z4LinearFiller.FILL_AT_BOUNDARY) {
      return d1 < d2 ? 0 : 1;
    } else if (this.boundaryBehavior == Z4LinearFiller.SYMMETRIC_AT_BOUNDARY) {
      double position = d1 < d2 ? d1 : d2;
      int step = (int) Math.floor(position);
      position -= step;

      if ((d1 < d2 && $exists((step % 2))) || (d1 > d2 && !$exists((step % 2)))) {
        position = 1 - position;
      }

      return position;
    } else if (this.boundaryBehavior == Z4LinearFiller.REPEAT_AT_BOUNDARY) {
      double position = d1 < d2 ? d1 : d2;
      position -= (int) Math.floor(position);

      if (d1 < d2) {
        position = 1 - position;
      }

      return position;
    } else {
      return -1;
    }
  }
}
