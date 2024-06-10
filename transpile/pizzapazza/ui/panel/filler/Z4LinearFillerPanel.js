/**
 * The panel to manage a (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
class Z4LinearFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(Z4BoundaryBehavior.STOP_AT_BOUNDARY, Z4BoundaryBehavior.FILL_AT_BOUNDARY, Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, Z4BoundaryBehavior.REPEAT_AT_BOUNDARY));
    this.cssAddClass("z4linearfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(0, height / 2));
    points.push(new Point(width, height / 2));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4LinearFiller(gradientColor, points[0].x, points[0].y, points[1].x, points[1].y, option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
