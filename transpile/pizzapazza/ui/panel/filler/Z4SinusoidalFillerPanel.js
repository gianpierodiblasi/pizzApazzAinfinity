/**
 * The panel to manage a (multi) sinusoidal filler
 *
 * @author gianpiero.diblasi
 */
class Z4SinusoidalFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(4, new Array(Z4BoundaryBehavior.STOP_AT_BOUNDARY, Z4BoundaryBehavior.FILL_AT_BOUNDARY, Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, Z4BoundaryBehavior.REPEAT_AT_BOUNDARY));
    this.cssAddClass("z4sinusoidalfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    let angle1 = 0.0;
    let radius1 = 0.0;
    let point1 = null;
    let angle2 = 0.0;
    let radius2 = 0.0;
    let point2 = null;
    let angle3 = 0.0;
    let radius3 = 0.0;
    let point3 = null;
    switch(selectedIndex) {
      case 0:
        let offsetX = points[0].x - x;
        let offsetY = points[0].y - y;
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y);
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, points[2].x, points[2].y);
        radius3 = Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y);
        angle3 = Z4Math.atan(points[0].x, points[0].y, points[3].x, points[3].y);
        points[0] = new Point(x, y);
        point1 = this.getPoint(points[0].x, points[0].y, points[1].x - offsetX, points[1].y - offsetY, radius1, angle1, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        point2 = this.getPoint(points[0].x, points[0].y, points[2].x - offsetX, points[2].y - offsetY, radius2, angle2, width, height);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        point3 = this.getPoint(points[0].x, points[0].y, points[3].x - offsetX, points[3].y - offsetY, radius3, angle3, width, height);
        points[3] = new Point(Math.round(point3.x), Math.round(point3.y));
        break;
      case 1:
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        radius3 = Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y);
        angle3 = Z4Math.atan(points[0].x, points[0].y, x, y) + Math.PI;
        point2 = this.getPoint(points[0].x, points[0].y, points[0].x + radius2 * Math.cos(angle2), points[0].y + radius2 * Math.sin(angle2), radius2, angle2, width, height);
        point3 = this.getPoint(points[0].x, points[0].y, points[0].x + radius3 * Math.cos(angle3), points[0].y + radius3 * Math.sin(angle3), radius3, angle3, width, height);
        points[1] = new Point(x, y);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        points[3] = new Point(Math.round(point3.x), Math.round(point3.y));
        break;
      case 2:
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
        radius3 = Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y);
        angle3 = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        point1 = this.getPoint(points[0].x, points[0].y, points[0].x + radius1 * Math.cos(angle1), points[0].y + radius1 * Math.sin(angle1), radius1, angle1, width, height);
        point3 = this.getPoint(points[0].x, points[0].y, points[0].x + radius3 * Math.cos(angle3), points[0].y + radius3 * Math.sin(angle3), radius3, angle3, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        points[2] = new Point(x, y);
        points[3] = new Point(Math.round(point3.x), Math.round(point3.y));
        break;
      case 3:
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, x, y) + Math.PI;
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
        point1 = this.getPoint(points[0].x, points[0].y, points[0].x + radius1 * Math.cos(angle1), points[0].y + radius1 * Math.sin(angle1), radius1, angle1, width, height);
        point2 = this.getPoint(points[0].x, points[0].y, points[0].x + radius2 * Math.cos(angle2), points[0].y + radius2 * Math.sin(angle2), radius2, angle2, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        points[3] = new Point(x, y);
        break;
    }
  }

   getPoint(cx, cy, x, y, radius, angle, width, height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width / 2, height / 8));
    points.push(new Point(width, height / 2));
    points.push(new Point(width / 2, height));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4SinusoidalFiller(gradientColor, points[0].x, points[0].y, Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y), Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y), Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y), Z4Math.atan(points[0].x, points[0].y, points[2].x, points[2].y), option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
