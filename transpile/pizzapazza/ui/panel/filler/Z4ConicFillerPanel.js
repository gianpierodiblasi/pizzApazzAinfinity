/**
 * The panel to manage a (multi) conic filler
 *
 * @author gianpiero.diblasi
 */
class Z4ConicFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(false, true));
    this.cssAddClass("z4conicfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4ConicFiller(gradientColor, points[0].x, points[0].y, Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y), option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = this.getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = this.getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
