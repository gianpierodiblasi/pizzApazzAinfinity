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
 * @author gianpiero.di.blasi
 */
public class Z4Spirograph extends Z4PointIterator<Z4Spirograph> {

  private final $Object center = new $Object();
  private Array<Z4Point> clones = new Array<>();
  private int clonePos;
  private boolean fromClones;

  /**
   * Creates a Z4Spirograph
   */
  public Z4Spirograph() {
    super();
    this.z4Point.setUseVectorModuleAsSize(true);

    this.P.$set("x", 0);
    this.P.$set("y", 0);
  }

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.center.$set("x", x);
      this.center.$set("y", y);
      this.hasNext = false;

      this.clones = new Array<>();
      this.fromClones = false;

      return false;
    } else if (action == Z4Action.CONTINUE) {
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.hasNext = true;

      return true;
    } else if (action == Z4Action.STOP) {
      this.fromClones = true;
      this.clonePos = this.clones.length - 1;
      this.hasNext = this.clonePos != -1;

      return true;
    } else {
      return false;
    }
  }

  @Override
  public Z4Point next() {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      Z4Point clone = this.clones.$get(this.clonePos);
      clone.setColorPosition(this.clonePos / this.clones.length);
      clone.setDrawBounds(false);

      this.clonePos--;
      this.hasNext = this.clonePos != -1;
      return clone;
    } else {
      Z4Vector vector = Z4Vector.fromPoints(this.center.$get("x"), this.center.$get("y"), this.P.$get("x"), this.P.$get("y"));
      double angle = this.rotation.next(vector.getPhase());
      this.z4Point.setZ4Vector(Z4Vector.fromVector(this.center.$get("x"), this.center.$get("y"), vector.getModule(), angle));
      this.rotation.nextSide(this.z4Point, vector);
      this.progression.next(this.z4Point);

      if (this.z4Point.isDrawBounds()) {
        this.clones.push(this.z4Point.clone());
      }

      this.hasNext = false;
      return this.z4Point;
    }
  }

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
      Z4Vector vector = next.getZ4Vector();

      context.save();
      context.translate(vector.getX0(), vector.getY0());
      context.rotate(vector.getPhase());
      arrowPainter.draw(context, next, gradientColor);
      context.restore();
    }
  }
}
