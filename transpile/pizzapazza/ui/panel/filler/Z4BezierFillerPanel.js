/**
 * The panel to manage a (multi) bezier filler
 *
 * @author gianpiero.diblasi
 */
class Z4BezierFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(5, new Array(Z4BoundaryBehavior.STOP_AT_BOUNDARY, Z4BoundaryBehavior.FILL_AT_BOUNDARY, Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, Z4BoundaryBehavior.REPEAT_AT_BOUNDARY));
    this.cssAddClass("z4bezierfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(0, 3 * height / 4));
    points.push(new Point(width / 4, height / 8));
    points.push(new Point(3 * width / 4, height / 8));
    points.push(new Point(width, 3 * height / 4));
    points.push(new Point(width / 4, 7 * height / 8));
  }

   needsRescale(option) {
    return true;
  }

   getFiller(gradientColor, points, option) {
    return new Z4BezierFiller(gradientColor, points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y, parseInt(Z4Math.distance(points[0].x, points[0].y, points[4].x, points[4].y)), option);
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
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[4].x, mappedPoints[4].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[4].x, mappedPoints[4].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
