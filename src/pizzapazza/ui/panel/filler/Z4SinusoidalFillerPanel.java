package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import javascript.awt.Point;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractBoundaryBehaviorFiller;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4SinusoidalFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The panel to manage a (multi) sinusoidal filler
 *
 * @author gianpiero.diblasi
 */
public class Z4SinusoidalFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4SinusoidalFillerPanel() {
    super(4, new Array<>(
            Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY
    ));

    this.cssAddClass("z4sinusoidalfillerpanel");
    this.drawPreview(false);
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    double angle1;
    double radius1;
    Z4Point point1;
    double angle2;
    double radius2;
    Z4Point point2;
    double angle3;
    double radius3;
    Z4Point point3;

    switch (selectedIndex) {
      case 0:
        int offsetX = points.$get(0).x - x;
        int offsetY = points.$get(0).y - y;

        radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        radius3 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);
        angle3 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);

        points.$set(0, new Point(x, y));

        point1 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(1).x - offsetX, points.$get(1).y - offsetY, radius1, angle1, width, height);
        points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));

        point2 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(2).x - offsetX, points.$get(2).y - offsetY, radius2, angle2, width, height);
        points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));

        point3 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(3).x - offsetX, points.$get(3).y - offsetY, radius3, angle3, width, height);
        points.$set(3, new Point((int) Math.round(point3.x), (int) Math.round(point3.y)));
        break;
      case 1:
        radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Z4Math.HALF_PI;
        radius3 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);
        angle3 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Math.PI;

        point2 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius2 * Math.cos(angle2), points.$get(0).y + radius2 * Math.sin(angle2),
                radius2, angle2, width, height);

        point3 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius3 * Math.cos(angle3), points.$get(0).y + radius3 * Math.sin(angle3),
                radius3, angle3, width, height);

        points.$set(1, new Point(x, y));
        points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));
        points.$set(3, new Point((int) Math.round(point3.x), (int) Math.round(point3.y)));
        break;
      case 2:
        radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;
        radius3 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y);
        angle3 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Z4Math.HALF_PI;

        point1 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius1 * Math.cos(angle1), points.$get(0).y + radius1 * Math.sin(angle1),
                radius1, angle1, width, height);

        point3 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius3 * Math.cos(angle3), points.$get(0).y + radius3 * Math.sin(angle3),
                radius3, angle3, width, height);

        points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));
        points.$set(2, new Point(x, y));
        points.$set(3, new Point((int) Math.round(point3.x), (int) Math.round(point3.y)));
        break;
      case 3:
        radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Math.PI;
        radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;

        point1 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius1 * Math.cos(angle1), points.$get(0).y + radius1 * Math.sin(angle1),
                radius1, angle1, width, height);

        point2 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius2 * Math.cos(angle2), points.$get(0).y + radius2 * Math.sin(angle2),
                radius2, angle2, width, height);

        points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));
        points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));
        points.$set(3, new Point(x, y));
        break;
    }
  }

  private Z4Point getPoint(double cx, double cy, double x, double y, double radius, double angle, int width, int height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width / 2, height / 8));
    points.push(new Point(width, height / 2));
    points.push(new Point(width / 2, height));
  }

  @Override
  protected boolean needsRescale(Object option) {
    return false;
  }

  @Override
  protected Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option) {
    return new Z4SinusoidalFiller(gradientColor,
            points.$get(0).x, points.$get(0).y,
            Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y),
            Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y),
            Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(3).x, points.$get(3).y),
            Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y), (int) option);
  }

  @Override
  protected boolean isPointEnabled(int index) {
    return true;
  }

  @Override
  protected void drawObjects($CanvasRenderingContext2D ctx, Array<Point> mappedPoints) {
    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(3).x, mappedPoints.$get(3).y);
    ctx.strokeStyle = this.$getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(3).x, mappedPoints.$get(3).y);
    ctx.strokeStyle = this.$getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
