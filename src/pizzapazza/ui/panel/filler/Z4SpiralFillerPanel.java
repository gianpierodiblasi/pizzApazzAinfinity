package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import javascript.awt.Point;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4SpiralFiller;
import pizzapazza.math.Z4Math;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The panel to manage a (multi) spiral filler
 *
 * @author gianpiero.diblasi
 */
public class Z4SpiralFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4SpiralFillerPanel() {
    super(2, new Array<>(false, true));

    this.cssAddClass("z4spiralfillerpanel");
    this.drawPreview(false);
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    points.$set(selectedIndex, new Point(x, y));
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
  }

  @Override
  protected boolean needsRescale(Object option) {
    return false;
  }

  @Override
  protected Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option) {
    return new Z4SpiralFiller(gradientColor, points.$get(0).x, points.$get(0).y, Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y), Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y), (boolean) option);
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
    ctx.strokeStyle = this.$getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.strokeStyle = this.$getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
