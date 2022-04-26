package giada.pizzapazza.iterator;

import def.js.Array;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The stamper
 *
 * @author gianpiero.di.blasi
 */
public class Z4Stamper extends Z4PointIterator<Z4Stamper> {

  private final Z4FancifulValue intensity = new Z4FancifulValue().setConstant(Z4Sign.POSITIVE, 15);
  private final Z4FancifulValue multiplicity = new Z4FancifulValue().setConstant(Z4Sign.POSITIVE, 1);
  private final Z4FancifulValue push = new Z4FancifulValue();

  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;
  private double currentPush;

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next(0));
      this.currentPush = this.push.next(0);

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
      this.hasNext = this.currentMultiplicityCounter == this.currentMultiplicityTotal;

      double angle = this.nextRotation(0);
      if ($exists(currentPush)) {
        Z4Vector pushed = Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), currentPush, angle);
        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), this.intensity.next(0), angle));
      } else {
        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), this.intensity.next(0), angle));
      }
      this.nextSide(this.z4Point, null);

      if (this.progression == Z4Progression.TEMPORAL) {
        this.z4Point.setLighting(this.lighting);

        double colorPosition = this.z4Point.getColorPosition();
        colorPosition = colorPosition == -1 ? 0 : colorPosition + this.temporalStepProgression;
        if (colorPosition > 1) {
          colorPosition -= 1;
        }
        this.z4Point.setColorPosition(colorPosition);
      } else if (this.progression == Z4Progression.SPATIAL) {
        this.z4Point.setLighting(Z4Lighting.NONE);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression == Z4Progression.RELATIVE_TO_PATH || this.progression == Z4Progression.RANDOM) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setColorPosition(Math.random());
      }

      return this.z4Point;
    }
  }

  @Override
  public void drawDemo($CanvasRenderingContext2D context, double width, double height) {
    Z4ArrowPainter arrowPainter = new Z4ArrowPainter();
    Z4GradientColor gradientColor = new Z4GradientColor();

    this.initDraw(width, height).forEach(point -> {
      this.draw(Z4Action.START, point.$get("x"), point.$get("y"));
      Z4Point next = this.next();
      Z4Vector vector = next.getZ4Vector();

      context.save();
      context.translate(vector.getX0(), vector.getY0());
      context.rotate(vector.getPhase());
      arrowPainter.draw(context, next, gradientColor);
      context.restore();
    });
  }

  private Array<$Object> initDraw(double w, double h) {
    int size = parseInt(0.0005 * w * h);
    Array<$Object> array = new Array<>();
    for (int i = 0; i < size; i++) {
      $Object point = new $Object();
      point.$set("x", 10 + (w - 20) * Math.random());
      point.$set("y", 10 + (h - 20) * Math.random());
      array.push(point);
    }
    return array;
  }
}
