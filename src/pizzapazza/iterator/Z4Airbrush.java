package pizzapazza.iterator;

import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Vector;
import pizzapazza.painter.Z4ArrowPainter;
import pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
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
      if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL && this.currentMultiplicityCounter == 1) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        temporalPosition = currentRadius / this.radius;
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
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter painter, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression, double width, double height) {
    Z4Painter finalPainter = $exists(painter) ? painter : new Z4ArrowPainter();
    Z4SpatioTemporalColor finalspSpatioTemporalColor = $exists(spatioTemporalColor) ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    Z4ColorProgression finalColorProgression = $exists(progression) ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, Z4Lighting.NONE);
    
  }
  
  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("multiplicity", this.multiplicity.toJSON());
    json.$set("radius", this.radius);
    json.$set("speed", this.speed);
    return json;
  }

  /**
   * Creates a Z4Airbrush from a JSON object
   *
   * @param json The JSON object
   * @return the airbrush
   */
  public static Z4Airbrush fromJSON($Object json) {
    return new Z4Airbrush(
            Z4FancifulValue.fromJSON(json.$get("multiplicity")),
            json.$get("radius"),
            json.$get("speed"),
            Z4Rotation.fromJSON(json.$get("rotation"))
    );
  }
}
