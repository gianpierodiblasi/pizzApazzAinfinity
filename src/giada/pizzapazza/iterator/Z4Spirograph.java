package giada.pizzapazza.iterator;

import def.js.Array;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import simulation.dom.$CanvasRenderingContext2D;
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
  public void drawDemo($CanvasRenderingContext2D context, double width, double height) {
    Z4ArrowPainter arrowPainter = new Z4ArrowPainter();
    Z4GradientColor gradientColor = new Z4GradientColor();

    this.draw(Z4Action.START, width / 2, height / 2);
    this.draw(Z4Action.CONTINUE, 3 * width / 4, 3 * height / 4);

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
