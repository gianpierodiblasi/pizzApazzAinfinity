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

/**
 * The stamper
 *
 * @author gianpiero.diblasi
 */
public class Z4Stamper extends Z4PointIterator<Z4Stamper> {

  private Z4FancifulValue multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(1).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue push = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      this.P.$set("x", x);
      this.P.$set("y", y);
      this.hasNext = true;

      return true;
    } else {
      return false;
    }
  }

  @Override
  public Z4Point next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;

      double angle = this.rotation.next(0);
      double currentPush = this.push.next();
      if ($exists(currentPush)) {
        Z4Vector pushed = Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), currentPush, angle);
        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), 1, angle));
      } else {
        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), 1, angle));
      }
      this.rotation.nextSide(this.z4Point, null);
      this.progression.next(this.z4Point);

      if (this.progression.isRelativeToPath()) {
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(Math.random());
      }

      return this.z4Point;
    }
  }

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
