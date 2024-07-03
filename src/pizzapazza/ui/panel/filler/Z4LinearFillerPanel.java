package pizzapazza.ui.panel.filler;

import def.js.Array;
import javascript.awt.Point;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4BoundaryBehavior;
import pizzapazza.filler.Z4LinearFiller;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The panel to manage a (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
public class Z4LinearFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4LinearFillerPanel() {
    super(2, new Array<>(
            Z4BoundaryBehavior.STOP_AT_BOUNDARY,
            Z4BoundaryBehavior.FILL_AT_BOUNDARY,
            Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY,
            Z4BoundaryBehavior.REPEAT_AT_BOUNDARY
    ));

    this.cssAddClass("z4linearfillerpanel");
    this.drawPreview(false);
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    points.$set(selectedIndex, new Point(x, y));
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(0, height / 2));
    points.push(new Point(width, height / 2));
  }

  @Override
  protected boolean needsRescale(Object option) {
    return false;
  }

  @Override
  protected Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option) {
    return new Z4LinearFiller(gradientColor, points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y, (Z4BoundaryBehavior) option);
  }

  @Override
  protected boolean isPointEnabled(int index) {
    return true;
  }

  @Override
  protected void drawObjects($CanvasRenderingContext2D ctx, Array<Point> mappedPoints) {
    ctx.lineWidth = 3;
    
    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.strokeStyle = Z4Constants.$getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
