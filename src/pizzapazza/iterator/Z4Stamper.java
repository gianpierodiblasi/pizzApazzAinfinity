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
              Z4DrawingPointIntent.DRAW_OBJECTS,
              this.rotation.computeSide(vector, null),
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

    this.initDraw(width, height).forEach(point -> {
      this.drawAction(Z4PointIteratorDrawingAction.START, point.x, point.y);

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
    for (int x = 50; x <= w; x += 100) {
      for (int y = 50; y <= h; y += 100) {
        array.push(new Z4Point(x, y));
      }
    }
    return array;
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
