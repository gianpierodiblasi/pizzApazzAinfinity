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
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import giada.pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

public class Z4Stamper extends Z4PointIterator<Z4Stamper> {

  @Override
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter<?> painter, Z4GradientColor gradientColor, double width, double height) {
    Z4Painter<?> finalPainter = $exists(painter) ? painter : new Z4ArrowPainter();
    Z4GradientColor finalGradientColor = $exists(gradientColor) ? gradientColor : new Z4GradientColor();

    this.initDraw(width, height).forEach(point -> {
      this.draw(Z4Action.START, point.$get("x"), point.$get("y"));

      context.save();
      context.lineWidth = 1;
      context.fillStyle = Z4Color.$getFillStyle("black");
      context.beginPath();
      context.arc(this.P.$get("x"), this.P.$get("y"), 2, 0, Z4Math.TWO_PI);
      context.fill();
      context.restore();

      Z4Point next;
      while ((next = this.next()) != null) {
        Z4Vector vector = next.getZ4Vector();

        context.save();
        context.translate(vector.getX0(), vector.getY0());
        context.rotate(vector.getPhase());
        finalPainter.draw(context, next, finalGradientColor);
        context.restore();
      }
    });
  }

  private Array<$Object> initDraw(double w, double h) {
    Array<$Object> array = new Array<>();
    for (int x = 50; x <= w; x += 100) {
      for (int y = 50; y <= h; y += 100) {
        $Object point = new $Object();
        point.$set("x", x);
        point.$set("y", y);
        array.push(point);
      }
    }
    return array;
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
   * Sets the multiplicity
   *
   * @param multiplicity The multiplicity
   * @return This Z4Stamper
   */
  public Z4Stamper setMultiplicity(Z4FancifulValue multiplicity) {
    this.multiplicity = multiplicity;
    return this;
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
   * Sets the push
   *
   * @param push The push
   * @return This Z4Stamper
   */
  public Z4Stamper setPush(Z4FancifulValue push) {
    this.push = push;
    return this;
  }
}
