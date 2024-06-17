package pizzapazza.iterator;

import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Vector;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The airbrush
 *
 * @author gianpiero.diblasi
 */
public class Z4Airbrush extends Z4PointIterator {

  private final Z4FancifulValue multiplicity;
  private final double radius;
  private final double speed;

  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param radius The radius
   * @param speed The speed
   * @param rotation The rotation
   */
  public Z4Airbrush(Z4FancifulValue multiplicity, double radius, double speed, Z4Rotation rotation) {
    super(rotation);

    this.multiplicity = multiplicity;
    this.radius = radius;
    this.speed = speed;
  }

  @Override
  public Z4PointIteratorType getType() {
    return Z4PointIteratorType.AIRBRUSH;
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
   * Returns the radius
   *
   * @return The radius
   */
  public double getRadius() {
    return this.radius;
  }

  /**
   * Returns the speed
   *
   * @return The speed
   */
  public double getSpeed() {
    return this.speed;
  }

  @Override
  public boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y) {
    if (action == Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;

      return true;
    } else if (action == Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;

      return false;
    } else if (action == Z4PointIteratorDrawingAction.STOP) {
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

  @Override
  public Z4DrawingPoint next(Z4SpatioTemporalColor color, Z4ColorProgression progression) {
    if (!this.hasNext) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.hasNext = true;
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;

      double currentRadius = this.radius * Math.random();
      double currenAngle = Z4Math.TWO_PI * Math.random();

      double angle = this.rotation.next(currenAngle);
      Z4Vector vector = Z4Vector.fromVector(this.currentPoint.x + currentRadius * Math.cos(currenAngle), currentRadius * Math.sin(currenAngle) + this.currentPoint.y, 1, angle);

      double temporalPosition = $exists(this.nextdDrawingPoint) ? this.nextdDrawingPoint.temporalPosition : -1;
      double spatialPosition = $exists(this.nextdDrawingPoint) ? this.nextdDrawingPoint.spatialPosition : -1;
      if (color.isColor()) {
      } else if (color.isGradientColor()) {
        switch ("" + progression.getColorProgressionBehavior()) {
          case "SPATIAL":
            break;
          case "TEMPORAL":
            if (this.currentMultiplicityCounter == 1) {
              temporalPosition = progression.next(temporalPosition);
            }
            break;
          case "RELATIVE_TO_PATH":
            temporalPosition = currentRadius / this.radius;
            break;
          case "RANDOM":
            temporalPosition = Math.random();
            break;
        }
      } else if (color.isBiGradientColor()) {
        switch ("" + progression.getColorProgressionBehavior()) {
          case "TEMPORAL":
            if (this.currentMultiplicityCounter == 1) {
              temporalPosition = progression.next(temporalPosition);
            }
            break;
          case "RELATIVE_TO_PATH":
            temporalPosition = currentRadius / this.radius;
            break;
          case "RANDOM":
            temporalPosition = Math.random();
            break;
        }
      }

      this.nextdDrawingPoint = new Z4DrawingPoint(
              vector,
              1,
              temporalPosition,
              spatialPosition,
              false,
              this.rotation.computeSide(vector, null),
              false
      );
      return this.nextdDrawingPoint;
    }
  }

  @Override
  public boolean isInfinitePointGenerator() {
    return true;
  }

  @Override
  public int getInfinitePointGeneratorSleep() {
    return parseInt(250 / this.speed);
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("multiplicity", this.multiplicity.toJSON());
    json.$set("radius", this.radius);
    json.$set("speed", this.speed);
    return json;
  }
}
