package giada.pizzapazza.iterator;

import def.js.Array;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The spirograph
 *
 * @author gianpiero.diblasi
 */
public class Z4Spirograph extends Z4PointIterator<Z4Spirograph> {

  @Override
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter<?> painter, Z4GradientColor gradientColor, double width, double height) {
    Z4Painter<?> finalPainter = $exists(painter) ? painter : new Z4ArrowPainter();
    Z4GradientColor finalGradientColor = $exists(gradientColor) ? gradientColor : new Z4GradientColor();

    Array<$Object> points = this.initDraw(width, height);
    $Object start = points.$get(0);
    this.draw(Z4Action.START, start.$get("x"), start.$get("y"));

    points.slice(1).forEach(point -> {
      this.draw(Z4Action.CONTINUE, point.$get("x"), point.$get("y"));
      this.drawDemoPoint(context, finalPainter, finalGradientColor);
    });

    $Object stop = points.$get(points.length - 1);
    this.draw(Z4Action.STOP, stop.$get("x"), stop.$get("y"));
    this.drawDemoPoint(context, finalPainter, finalGradientColor);
  }

  private Array<$Object> initDraw(double w, double h) {
    double w2 = w / 2;
    double h2 = h / 2;
    double wh8 = Math.min(w, h) / 16;
    Array<$Object> array = new Array<>();
    int size = parseInt(w * h / (100 * 100));

    for (int i = 0; i < size; i++) {
      double theta = Z4Math.TWO_PI * i / size;
      $Object point = new $Object();
      point.$set("x", w2 + wh8 * theta * Math.cos(theta));
      point.$set("y", h2 + wh8 * theta * Math.sin(theta));
      array.push(point);
    }

    return array;
  }

  private void drawDemoPoint($CanvasRenderingContext2D context, Z4Painter<?> arrowPainter, Z4GradientColor gradientColor) {
    Z4Point next;
    while ((next = this.next()) != null) {
      if (!next.isDrawBounds()) {
        Z4Vector vector = next.getZ4Vector();

        context.save();
        context.translate(vector.getX0(), vector.getY0());
        context.rotate(vector.getPhase());
        arrowPainter.draw(context, next, gradientColor);
        context.restore();
      }
    }
  }
}
