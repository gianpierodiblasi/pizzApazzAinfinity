package pizzapazza.filler;

import def.js.Array;
import def.js.Math;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * A (multi) polygon filler
 *
 * @author gianpiero.diblasi
 */
public class Z4PolygonFiller extends Z4AbstractFiller {

  private final int cx;
  private final int cy;
  private final int rx;
  private final int ry;
  private final double angle;
  private final int vertexCount;
  private final int boundaryBehavior;

  private final Array<$Object> lines = new Array<>();
  private final double d00;
  private final $CanvasRenderingContext2D ctx = new $OffscreenCanvas(1, 1).getContext("2d");

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
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point of the ellipse
   * containing the (regular) polygon
   * @param cy The y-axis coordinate of the center point of the ellipse
   * containing the (regular) polygon
   * @param rx The x-radius of the ellipse containing the (regular) polygon
   * @param ry The y-radius of the ellipse containing the (regular) polygon
   * @param angle The rotation angle of the ellipse containing the (regular)
   * polygon (in radians)
   * @param vertexCount The number of vertices of the polygon
   * @param boundaryBehavior The boundary behavior
   */
  public Z4PolygonFiller(Z4GradientColor gradientColor, int cx, int cy, int rx, int ry, double angle, int vertexCount, int boundaryBehavior) {
    super(gradientColor);

    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
    this.vertexCount = vertexCount;
    this.boundaryBehavior = boundaryBehavior;

    this.createLines();
    this.d00 = this.lines.map(line -> Z4Math.ptSegDist(line.$get("p1x"), line.$get("p1y"), line.$get("p2x"), line.$get("p2y"), 0, 0)).reduce((accumulator, current, index, array) -> Math.min(accumulator, current));
  }

  private void createLines() {
    this.ctx.beginPath();

    for (int index = 0; index < this.vertexCount - 1; index++) {
      $Object line = new $Object();
      line.$set("p1x", Math.cos(index * Z4Math.TWO_PI / this.vertexCount));
      line.$set("p1y", Math.sin(index * Z4Math.TWO_PI / this.vertexCount));
      line.$set("p2x", Math.cos((index + 1) * Z4Math.TWO_PI / this.vertexCount));
      line.$set("p2y", Math.sin((index + 1) * Z4Math.TWO_PI / this.vertexCount));
      this.lines.push(line);

      if (index == 0) {
        this.ctx.moveTo(Math.cos(index * Z4Math.TWO_PI / this.vertexCount), Math.sin(index * Z4Math.TWO_PI / this.vertexCount));
      } else {
        this.ctx.lineTo(Math.cos(index * Z4Math.TWO_PI / this.vertexCount), Math.sin(index * Z4Math.TWO_PI / this.vertexCount));
      }
    }

    $Object line = new $Object();
    line.$set("p1x", Math.cos((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount));
    line.$set("p1y", Math.sin((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount));
    line.$set("p2x", Math.cos(0));
    line.$set("p2y", Math.sin(0));
    this.lines.push(line);

    this.ctx.lineTo(Math.cos((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount), Math.sin((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount));
    this.ctx.closePath();
  }

  @Override
  protected double getColorPositionAt(int x, int y) {
    $Object rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    double xx = (double) rotated.$get("x") / this.rx;
    double yy = (double) rotated.$get("y") / this.ry;

    switch (this.boundaryBehavior) {
      case Z4PolygonFiller.STOP_AT_BOUNDARY:
      case Z4PolygonFiller.FILL_AT_BOUNDARY:
        return this.ctx.isPointInPath(xx, yy) ? 1 - this.getDistance(xx, yy, 1) : this.boundaryBehavior == Z4PolygonFiller.STOP_AT_BOUNDARY ? -1 : 1;
      case Z4PolygonFiller.SYMMETRIC_AT_BOUNDARY:
      case Z4PolygonFiller.REPEAT_AT_BOUNDARY:
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

        return this.boundaryBehavior == Z4PolygonFiller.REPEAT_AT_BOUNDARY ? 1 - distance : $exists(divider % 2) ? 1 - distance : distance;
      default:
        return -1;
    }
  }

  private double getDistance(double x, double y, int divider) {
    return this.lines.
            map(line -> Z4Math.ptSegDist(line.$get("p1x"), line.$get("p1y"), line.$get("p2x"), line.$get("p2y"), x, y)).
            reduce((accumulator, current, index, array) -> Math.min(accumulator, current)) / (this.d00 / divider);
  }
}
