package pizzapazza.iterator;

import pizzapazza.color.Z4Lighting;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4Vector;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The stamper
 *
 * @author gianpiero.diblasi
 */
public class Z4Stamper extends Z4PointIterator {

  private final Z4FancifulValue multiplicity;
  private final Z4FancifulValue push;

  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param push The push
   * @param rotation The rotation
   */
  public Z4Stamper(Z4FancifulValue multiplicity, Z4FancifulValue push, Z4Rotation rotation) {
    super(rotation);

    this.multiplicity = multiplicity;
    this.push = push;
  }

  @Override
  public boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y) {
    if (action == Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;

      return true;
    } else {
      return false;
    }
  }

  @Override
  public Z4DrawingPoint next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;

//      double angle = this.rotation.next(0.0);
//      double currentPush = this.push.next();
//      if ($exists(currentPush)) {
//        Z4Vector pushed = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, currentPush, angle);
//        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), 1, angle));
//      } else {
//        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), 1, angle));
//      }
//      this.rotation.nextSide(this.z4Point, null);
//      this.progression.next(this.z4Point);
//
//      if (this.progression.isRelativeToPath()) {
//        this.z4Point.setDrawBounds(false);
//        this.z4Point.setColorPosition(Math.random());
//      }
//
      this.z4DrawingPoint = new Z4DrawingPoint(
              Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 1, 0),
              1,
              Z4Lighting.NONE,
              0,
              false,
              new Z4Sign(Z4SignBehavior.POSITIVE),
              false
      );
      return this.z4DrawingPoint;
    }
  }

  @Override
  public boolean isInfinitePointGenerator() {
    return false;
  }

  @Override
  public int getInfinitePointGeneratorSleep() {
    return 0;
  }

  @Override
  public $Object toJSON() {
    throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
  }

}
