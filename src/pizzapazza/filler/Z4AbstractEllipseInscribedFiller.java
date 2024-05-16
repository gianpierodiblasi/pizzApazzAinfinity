package pizzapazza.filler;

import def.js.Array;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * A Filler which can be inscribed in an ellipse
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractEllipseInscribedFiller extends Z4AbstractBoundaryBehaviorFiller {

  private final int cx;
  private final int cy;
  private final int rx;
  private final int ry;
  private final double angle;
  private final int vertexCount;

  private final Array<$Object> edges;
  private final double d00;
  private final $CanvasRenderingContext2D ctx = new $OffscreenCanvas(1, 1).getContext("2d");

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point of the inscribing
   * ellipse
   * @param cy The y-axis coordinate of the center point of the inscribing
   * ellipse
   * @param rx The x-radius of the inscribing ellipse
   * @param ry The y-radius of the inscribing ellipse
   * @param angle The rotation angle of the inscribing ellipse
   * @param vertexCount The number of vertices of the polygon
   * @param boundaryBehavior The boundary behavior
   */
  public Z4AbstractEllipseInscribedFiller(Z4GradientColor gradientColor, int cx, int cy, int rx, int ry, double angle, int vertexCount, int boundaryBehavior) {
    super(gradientColor, boundaryBehavior);

    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
    this.vertexCount = vertexCount;

    this.edges = this.createEdges(this.vertexCount);

    this.ctx.beginPath();
    this.edges.forEach((edge, index, array) -> {
      if (index == 0) {
        this.ctx.moveTo(edge.$get("p1x"), edge.$get("p1y"));
      } else {
        this.ctx.lineTo(edge.$get("p1x"), edge.$get("p1y"));
      }
    });
    this.ctx.closePath();

    this.d00 = this.edges.map(line -> Z4Math.ptSegDist(line.$get("p1x"), line.$get("p1y"), line.$get("p2x"), line.$get("p2y"), 0, 0)).reduce((accumulator, current, index, array) -> def.js.Math.min(accumulator, current));
  }

  /**
   * Creates the polygon edges
   *
   * @param vertexCount The number of vertices of the polygon
   * @return The edges
   */
  protected abstract Array<$Object> createEdges(int vertexCount);

  @Override
  protected double getColorPositionAt(int x, int y) {
    $Object rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    double xx = (double) rotated.$get("x") / this.rx;
    double yy = (double) rotated.$get("y") / this.ry;

    switch (this.boundaryBehavior) {
      case Z4StarFiller.STOP_AT_BOUNDARY:
      case Z4StarFiller.FILL_AT_BOUNDARY:
        return this.ctx.isPointInPath(xx, yy) ? 1 - this.getDistance(xx, yy, 1) : this.boundaryBehavior == Z4StarFiller.STOP_AT_BOUNDARY ? -1 : 1;
      case Z4StarFiller.SYMMETRIC_AT_BOUNDARY:
      case Z4StarFiller.REPEAT_AT_BOUNDARY:
        int divider = 1;
        double xxx = xx / divider;
        double yyy = yy / divider;
        double distance = this.getDistance(xxx, yyy, divider);

        while (distance > 1 || !this.ctx.isPointInPath(xxx, yyy)) {
          divider++;
          xxx = xx / divider;
          yyy = yy / divider;
          distance = this.getDistance(xxx, yyy, divider);
        }

        return this.boundaryBehavior == Z4StarFiller.REPEAT_AT_BOUNDARY ? 1 - distance : $exists(divider % 2) ? 1 - distance : distance;
      default:
        return -1;
    }
  }

  private double getDistance(double x, double y, int divider) {
    return this.edges.
            map(line -> Z4Math.ptSegDist(line.$get("p1x"), line.$get("p1y"), line.$get("p2x"), line.$get("p2y"), x, y)).
            reduce((accumulator, current, index, array) -> def.js.Math.min(accumulator, current)) / (this.d00 / divider);
  }
}
