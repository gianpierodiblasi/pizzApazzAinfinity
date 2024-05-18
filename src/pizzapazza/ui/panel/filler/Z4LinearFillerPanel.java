package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import javascript.awt.Point;
import javascript.util.KeyValue;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractBoundaryBehaviorFiller;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4LinearFiller;
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
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY, "./image/filler/linear_stop.png"),
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY, "./image/filler/linear_fill.png"),
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY, "./image/filler/linear_symmetric.png"),
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY, "./image/filler/linear_repeat.png")
    ));
    
    this.drawPreview();
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    points.$set(selectedIndex, new Point(x, y));
  }

  @Override
  protected Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option) {
    return new Z4LinearFiller(gradientColor, points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y, (int) option);
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(0, height / 2));
    points.push(new Point(width, height / 2));
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

  private String getStrokeStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }
}
