package giada.pizzapazza.iterator;

import def.js.Array;
import giada.pizzapazza.color.Z4Color;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.math.Z4TracerPath;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
import simulation.bezier.$Bezier;
import simulation.bezier.$BezierPoint;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The tracer
 *
 * @author gianpiero.diblasi
 */
public class Z4Tracer extends Z4PointIterator<Z4Tracer> {

  @Override
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter<?> painter, Z4GradientColor gradientColor, double width, double height) {
    painter = $exists(painter) ? painter : new Z4ArrowPainter();
    gradientColor = $exists(gradientColor) ? gradientColor : new Z4GradientColor();

    $Bezier bezier = width > height
            ? new $Bezier(width / 10, height / 3, width / 2, 3 * height / 2, width / 2, -height / 2, 9 * width / 10, height / 2)
            : new $Bezier(width / 3, 9 * height / 10, 3 * width / 2, height / 2, -width / 2, height / 2, width / 2, height / 10);

    $BezierPoint p = bezier.get(0);
    this.draw(Z4Action.START, p.x, p.y);

    for (double s = 0.1; s < 1; s += 0.1) {
      p = bezier.get(s);
      this.draw(Z4Action.CONTINUE, p.x, p.y);
      this.drawDemoPoint(context, p, painter, gradientColor);
    }

    p = bezier.get(1);
    this.draw(Z4Action.CONTINUE, p.x, p.y);
    this.drawDemoPoint(context, p, painter, gradientColor);
    this.draw(Z4Action.STOP, p.x, p.y);
    this.drawDemoPoint(context, p, painter, gradientColor);
  }

  private void drawDemoPoint($CanvasRenderingContext2D context, $BezierPoint p, Z4Painter<?> painter, Z4GradientColor gradientColor) {
    context.save();
    context.lineWidth = 1;
    context.fillStyle = Z4Color.$getFillStyle("black");
    context.beginPath();
    context.arc(p.x, p.y, 2, 0, Z4Math.TWO_PI);
    context.fill();
    context.restore();

    Z4Point next;
    while ((next = this.next()) != null) {
      if (!next.isDrawBounds()) {
        Z4Vector vector = next.getZ4Vector();

        context.save();
        context.translate(vector.getX0(), vector.getY0());
        context.rotate(vector.getPhase());
        painter.draw(context, next, gradientColor);
        context.restore();
      }
    }
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
  public Z4FancifulValue getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the push
   *
   * @return The push
   */
  public Z4FancifulValue getPush() {
    return this.push;
  }

  /**
   * Returns the attack
   *
   * @return The attack
   */
  public Z4FancifulValue getAttack() {
    return this.attack;
  }

  /**
   * Returns the release
   *
   * @return The release
   */
  public Z4FancifulValue getRelease() {
    return this.release;
  }

  /**
   * Returns the sustain
   *
   * @return The sustain
   */
  public Z4FancifulValue getSustain() {
    return this.sustain;
  }

  /**
   * Checks if the sustain is endless
   *
   * @return true for an endless sustain, false otherwise
   */
  public boolean isEndlessSustain() {
    return this.endlessSustain;
  }

  /**
   * Returns the step
   *
   * @return The step
   */
  public Z4FancifulValue getStep() {
    return this.step;
  }
}
