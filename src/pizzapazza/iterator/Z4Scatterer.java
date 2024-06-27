package pizzapazza.iterator;

import def.js.Array;
import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Vector;
import pizzapazza.painter.Z4ArrowPainter;
import pizzapazza.painter.Z4Painter;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The scatterer
 *
 * @author gianpiero.diblasi
 */
public class Z4Scatterer extends Z4PointIterator {

  private final Z4FancifulValue multiplicity;
  private final Z4FancifulValue scattering;

  private Z4Point before;
  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param scattering The scattering
   * @param rotation The rotation
   */
  public Z4Scatterer(Z4FancifulValue multiplicity, Z4FancifulValue scattering, Z4Rotation rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.scattering = scattering;
  }

  @Override
  public Z4PointIteratorType getType() {
    return Z4PointIteratorType.SCATTERER;
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
   * Returns the scattering
   *
   * @return The scattering
   */
  public Z4FancifulValue getScattering() {
    return this.scattering;
  }

  @Override
  public boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y) {
    if (action == Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      this.currentPoint = new Z4Point(x, y);
      this.before = this.currentPoint;
      this.hasNext = false;

      return false;
    } else if (action == Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;

      return true;
    } else if (action == Z4PointIteratorDrawingAction.STOP) {
      return false;
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

      double nextScattering = this.scattering.next() /10;
      Z4Vector currentVector = Z4Vector.fromPoints(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y);
      double angle = this.rotation.next(currentVector.phase);
      Z4Vector vector = Z4Vector.fromVector(this.currentPoint.x + currentVector.module * nextScattering* Math.cos(angle), this.currentPoint.y + currentVector.module * nextScattering * Math.sin(angle), 1, angle);

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
              Z4DrawingPointIntent.DRAW_OBJECTS,
              this.rotation.computeSide(vector, currentVector),
              false
      );
      return this.nextdDrawingPoint;

    }
  }

  @Override
  public int getNextCountOnSTOP() {
    return 0;
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
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter painter, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression, double width, double height) {
    Z4Painter finalPainter = $exists(painter) ? painter : new Z4ArrowPainter();
    Z4SpatioTemporalColor finalSpatioTemporalColor = $exists(spatioTemporalColor) ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    Z4ColorProgression finalColorProgression = $exists(progression) ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, Z4Lighting.NONE);

    this.initDraw(width, height).forEach((point, index, array) -> {
      this.drawAction($exists(index) ? Z4PointIteratorDrawingAction.CONTINUE : Z4PointIteratorDrawingAction.START, point.x, point.y);

      context.save();
      context.lineWidth = 1;
      context.fillStyle = Z4Constants.$getStyle("black");
      context.beginPath();
      context.arc(this.currentPoint.x, this.currentPoint.y, 2, 0, Z4Math.TWO_PI);
      context.fill();
      context.restore();

      Z4DrawingPoint next;
      while ((next = this.next(spatioTemporalColor, finalColorProgression)) != null) {
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        finalPainter.draw(context, next, finalSpatioTemporalColor, finalColorProgression);
        context.restore();
      }
    });
  }

  private Array<Z4Point> initDraw(double w, double h) {
    Array<Z4Point> array = new Array<>();
    Array<Integer> coordinates = new Array<>(1, 49, 2, 48, 4, 47, 7, 42, 10, 40, 12, 38, 15, 42);

    for (int i = 0; i < coordinates.length; i += 2) {
      array.push(new Z4Point(w * coordinates.$get(i) / 50, h * coordinates.$get(i + 1) / 50));
    }

    return array;
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("multiplicity", this.multiplicity.toJSON());
    json.$set("scattering", this.scattering.toJSON());
    return json;
  }

  /**
   * Creates a Z4Scatterer from a JSON object
   *
   * @param json The JSON object
   * @return the scatterer
   */
  public static Z4Scatterer fromJSON($Object json) {
    return new Z4Scatterer(
            Z4FancifulValue.fromJSON(json.$get("multiplicity")),
            Z4FancifulValue.fromJSON(json.$get("scattering")),
            Z4Rotation.fromJSON(json.$get("rotation"))
    );
  }
}
