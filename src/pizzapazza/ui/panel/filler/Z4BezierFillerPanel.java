package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import javascript.awt.Point;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractBoundaryBehaviorFiller;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4BezierFiller;
import pizzapazza.math.Z4Math;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.parseInt;

/**
 * The panel to manage a (multi) bezier filler
 *
 * @author gianpiero.diblasi
 */
public class Z4BezierFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4BezierFillerPanel() {
    super(5, new Array<>(
            Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY
    ));

    this.cssAddClass("z4bezierfillerpanel");
    this.drawPreview(false);
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    points.$set(selectedIndex, new Point(x, y));
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(0, 3 * height / 4));
    points.push(new Point(width / 4, height / 8));
    points.push(new Point(3 * width / 4, height / 8));
    points.push(new Point(width, 3 * height / 4));
    points.push(new Point(width / 4, 7 * height / 8));
  }

  @Override
  protected boolean needsRescale(Object option) {
    return true;
  }

  @Override
  protected Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option) {
    return new Z4BezierFiller(gradientColor,
            points.$get(0).x, points.$get(0).y,
            points.$get(1).x, points.$get(1).y,
            points.$get(2).x, points.$get(2).y,
            points.$get(3).x, points.$get(3).y, parseInt(Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(4).x, points.$get(4).y)), (int) option);
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
    ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    ctx.lineTo(mappedPoints.$get(3).x, mappedPoints.$get(3).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(4).x, mappedPoints.$get(4).y);
    ctx.strokeStyle = this.$getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    ctx.lineTo(mappedPoints.$get(3).x, mappedPoints.$get(3).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(4).x, mappedPoints.$get(4).y);
    ctx.strokeStyle = this.$getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
