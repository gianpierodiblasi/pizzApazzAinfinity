/**
 * A Filler which can be inscribed in an ellipse
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractEllipseInscribedFiller extends Z4AbstractBoundaryBehaviorFiller {

   cx = 0;

   cy = 0;

   rx = 0;

   ry = 0;

   angle = 0.0;

  /**
   * The number of vertices of the polygon
   */
   vertexCount = 0;

   edges = null;

   d00 = 0.0;

   ctx = new OffscreenCanvas(1, 1).getContext("2d");

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
  constructor(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
    this.vertexCount = vertexCount;
    this.edges = this.createEdges(this.vertexCount);
    this.ctx.beginPath();
    this.edges.forEach((edge, index, array) => {
      if (index === 0) {
        this.ctx.moveTo(edge["p1x"], edge["p1y"]);
      } else {
        this.ctx.lineTo(edge["p1x"], edge["p1y"]);
      }
    });
    this.ctx.closePath();
    this.d00 = this.edges.map(line => Z4Math.ptSegDist(line["p1x"], line["p1y"], line["p2x"], line["p2y"], 0, 0)).reduce((accumulator, current, index, array) => def.js.Math.min(accumulator, current));
  }

  /**
   * Creates the polygon edges
   *
   * @param vertexCount The number of vertices of the polygon
   * @return The edges
   */
   createEdges(vertexCount) {
  }

   getColorPositionAt(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let xx = rotated["x"] / this.rx;
    let yy = rotated["y"] / this.ry;
    switch(this.boundaryBehavior) {
      case Z4StarFiller.STOP_AT_BOUNDARY:
      case Z4StarFiller.FILL_AT_BOUNDARY:
        return this.ctx.isPointInPath(xx, yy) ? 1 - this.getDistance(xx, yy, 1) : this.boundaryBehavior === Z4StarFiller.STOP_AT_BOUNDARY ? -1 : 1;
      case Z4StarFiller.SYMMETRIC_AT_BOUNDARY:
      case Z4StarFiller.REPEAT_AT_BOUNDARY:
        let divider = 1;
        let xxx = xx / divider;
        let yyy = yy / divider;
        let distance = this.getDistance(xxx, yyy, divider);
        while (distance > 1 || !this.ctx.isPointInPath(xxx, yyy)) {
          divider++;
          xxx = xx / divider;
          yyy = yy / divider;
          distance = this.getDistance(xxx, yyy, divider);
        }
        return this.boundaryBehavior === Z4StarFiller.REPEAT_AT_BOUNDARY ? 1 - distance : divider % 2 ? 1 - distance : distance;
      default:
        return -1;
    }
  }

   getDistance(x, y, divider) {
    return this.edges.map(line => Z4Math.ptSegDist(line["p1x"], line["p1y"], line["p2x"], line["p2y"], x, y)).reduce((accumulator, current, index, array) => def.js.Math.min(accumulator, current)) / (this.d00 / divider);
  }
}
