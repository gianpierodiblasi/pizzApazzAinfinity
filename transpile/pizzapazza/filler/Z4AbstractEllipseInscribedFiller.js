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
        this.ctx.moveTo(edge.x1, edge.y1);
      } else {
        this.ctx.lineTo(edge.x1, edge.y1);
      }
    });
    this.ctx.closePath();
    this.d00 = this.edges.map(edge => Z4Math.ptSegDist(edge.x1, edge.y1, edge.x2, edge.y2, 0, 0)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }

  /**
   * Creates the polygon edges
   *
   * @param vertexCount The number of vertices of the polygon
   * @return The edges
   */
   createEdges(vertexCount) {
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let xx = rotated.x / this.rx;
    let yy = rotated.y / this.ry;
    if (boundaryBehavior === Z4BoundaryBehavior.STOP_AT_BOUNDARY || boundaryBehavior === Z4BoundaryBehavior.FILL_AT_BOUNDARY) {
      return this.ctx.isPointInPath(xx, yy) ? 1 - this.getDistance(xx, yy, 1) : boundaryBehavior === Z4BoundaryBehavior.STOP_AT_BOUNDARY ? -1 : 1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY || boundaryBehavior === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY) {
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
      return boundaryBehavior === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY ? 1 - distance : divider % 2 ? 1 - distance : distance;
    } else {
      return -1;
    }
  }

   getDistance(x, y, divider) {
    return this.edges.map(edge => edge.distance(x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current)) / (this.d00 / divider);
  }
}
