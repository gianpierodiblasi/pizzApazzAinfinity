package pizzapazza.iterator;

import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
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
  public Z4PointIteratorType getType() {
    return Z4PointIteratorType.STAMPER;
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
  public Z4DrawingPoint next(Z4SpatioTemporalColor color, Z4ColorProgression progression) {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;

      Z4Vector vector;
      double angle = this.rotation.next(0.0);
      double currentPush = this.push.next();
      if ($exists(currentPush)) {
        Z4Vector pushed = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, currentPush, angle);
        vector = Z4Vector.fromVector(pushed.x, pushed.y, 1, angle);
      } else {
        vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 1, angle);
      }

      double temporalPosition = $exists(this.nextdDrawingPoint) ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }

      this.nextdDrawingPoint = new Z4DrawingPoint(
              vector,
              1,
              temporalPosition,
              false,
              this.rotation.computeSide(vector, null),
              false
      );
      return nextdDrawingPoint;
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
    $Object json = super.toJSON();
    json.$set("multiplicity", this.multiplicity.toJSON());
    json.$set("push", this.push.toJSON());
    return json;
  }

  /**
   * Creates a Z4Stamper from a JSON object
   *
   * @param json The JSON object
   * @return the stamper
   */
  public static Z4Stamper fromJSON($Object json) {
    return new Z4Stamper(
            Z4FancifulValue.fromJSON(json.$get("multiplicity")),
            Z4FancifulValue.fromJSON(json.$get("push")),
            Z4Rotation.fromJSON(json.$get("rotation"))
    );
  }
}
