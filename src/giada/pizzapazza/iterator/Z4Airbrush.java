package giada.pizzapazza.iterator;

import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The airbrush
 *
 * @author gianpiero.di.blasi
 */
public class Z4Airbrush extends Z4PointIterator<Z4Airbrush> {

  private int radius = 50;
  private int speed = 50;

  //private int id;
  private int currentSpeed;

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.currentSpeed = 0;
      this.hasNext = true;

      //this.onPaint();
      //this.id = setInternal(() -> this.onPaint(), 500 / this.speed.next());
      return true;
    } else if (action == Z4Action.CONTINUE) {
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.hasNext = true;

      return true;
    } else if (action == Z4Action.STOP) {
      //clearInterval(this.id);
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

  @Override
  public Z4Point next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentSpeed++;
      this.hasNext = this.currentSpeed < this.speed;
      
      double currentRadius = this.radius * Math.random();
      double currenAngle = Z4Math.TWO_PI * Math.random();

      double angle = this.rotation.next(currenAngle);
      this.z4Point.setZ4Vector(Z4Vector.fromVector((Double) this.P.$get("x") + currentRadius * Math.cos(currenAngle), (Double) this.P.$get("y") + currentRadius * Math.sin(currenAngle), 1, angle));
      this.rotation.nextSide(this.z4Point, null);
      this.progression.next(this.z4Point);

      if (this.progression.isRelativeToPath()) {
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(currentRadius / this.radius);
      }

      return this.z4Point;
    }
  }

  @Override
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter<?> painter, Z4GradientColor gradientColor, double width, double height) {
  }

//  private void onPaint() {
//  }
}
