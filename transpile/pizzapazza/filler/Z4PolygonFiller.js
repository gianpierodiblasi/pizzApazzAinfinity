/**
 * A (multi) polygon filler
 *
 * @author gianpiero.diblasi
 */
class Z4PolygonFiller extends Z4AbstractFiller {

   cx = 0;

   cy = 0;

   rx = 0;

   ry = 0;

   angle = 0.0;

   vertexCount = 0;

   boundaryBehavior = 0;

   lines = new Array();

   d00 = 0.0;

   ctx = new OffscreenCanvas(1, 1).getContext("2d");

  /**
   * The filler does nothing outside the boundary
   */
  static  STOP_AT_BOUNDARY = 0;

  /**
   * The filler uses the last color outside the boundary
   */
  static  FILL_AT_BOUNDARY = 1;

  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  static  SYMMETRIC_AT_BOUNDARY = 2;

  /**
   * The filler restarts the color outside the boundary
   */
  static  REPEAT_AT_BOUNDARY = 3;

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
  constructor(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior) {
    super(gradientColor);
    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
    this.vertexCount = vertexCount;
    this.boundaryBehavior = boundaryBehavior;
    this.createLines();
    this.d00 = this.lines.map(line => Z4Math.ptSegDist(line["p1x"], line["p1y"], line["p2x"], line["p2y"], 0, 0)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }

   createLines() {
    this.ctx.beginPath();
    for (let index = 0; index < this.vertexCount - 1; index++) {
      let line = new Object();
      line["p1x"] = Math.cos(index * Z4Math.TWO_PI / this.vertexCount);
      line["p1y"] = Math.sin(index * Z4Math.TWO_PI / this.vertexCount);
      line["p2x"] = Math.cos((index + 1) * Z4Math.TWO_PI / this.vertexCount);
      line["p2y"] = Math.sin((index + 1) * Z4Math.TWO_PI / this.vertexCount);
      this.lines.push(line);
      if (index === 0) {
        this.ctx.moveTo(Math.cos(index * Z4Math.TWO_PI / this.vertexCount), Math.sin(index * Z4Math.TWO_PI / this.vertexCount));
      } else {
        this.ctx.lineTo(Math.cos(index * Z4Math.TWO_PI / this.vertexCount), Math.sin(index * Z4Math.TWO_PI / this.vertexCount));
      }
    }
    let line = new Object();
    line["p1x"] = Math.cos((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount);
    line["p1y"] = Math.sin((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount);
    line["p2x"] = Math.cos(0);
    line["p2y"] = Math.sin(0);
    this.lines.push(line);
    this.ctx.lineTo(Math.cos((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount), Math.sin((this.vertexCount - 1) * Z4Math.TWO_PI / this.vertexCount));
    this.ctx.closePath();
  }

   getColorPositionAt(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let xx = rotated["x"] / this.rx;
    let yy = rotated["y"] / this.ry;
    switch(this.boundaryBehavior) {
      case Z4PolygonFiller.STOP_AT_BOUNDARY:
      case Z4PolygonFiller.FILL_AT_BOUNDARY:
        return this.ctx.isPointInPath(xx, yy) ? 1 - this.getDistance(xx, yy, 1) : this.boundaryBehavior === Z4PolygonFiller.STOP_AT_BOUNDARY ? -1 : 1;
      case Z4PolygonFiller.SYMMETRIC_AT_BOUNDARY:
      case Z4PolygonFiller.REPEAT_AT_BOUNDARY:
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
        return this.boundaryBehavior === Z4PolygonFiller.REPEAT_AT_BOUNDARY ? 1 - distance : divider % 2 ? 1 - distance : distance;
      default:
        return -1;
    }
  }

   getDistance(x, y, divider) {
    return this.lines.map(line => Z4Math.ptSegDist(line["p1x"], line["p1y"], line["p2x"], line["p2y"], x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current)) / (this.d00 / divider);
  }
}
