package pizzapazza.iterator;

import def.js.Array;
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
import pizzapazza.math.Z4TracerPath;
import pizzapazza.math.Z4Vector;
import pizzapazza.painter.Z4ArrowPainter;
import pizzapazza.painter.Z4Painter;
import pizzapazza.util.Z4Constants;
import simulation.bezier.$Bezier;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The tracer
 *
 * @author gianpiero.diblasi
 */
public class Z4Tracer extends Z4PointIterator {

  private final Z4FancifulValue multiplicity;
  private final Z4FancifulValue push;

  private final Z4FancifulValue attack;
  private final Z4FancifulValue sustain;
  private final Z4FancifulValue release;
  private final boolean endlessSustain;

  private final Z4FancifulValue step;

  private Z4TracerPath path;
  private Z4Point before;

  private double envelopeA;
  private double envelopeS;
  private double envelopeR;
  private double envelopeAS;
  private double envelopeASR;
  private double envelopePosition;
  private double envelopeStep;

  private Array<Z4DrawingPoint> clones = new Array<>();
  private int clonePos;
  private boolean fromClones;

  private double surplus;
  private boolean connect;

  private Z4Vector currentVector;
  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param push The push
   * @param attack The attack
   * @param sustain The sustain
   * @param release The release
   * @param endlessSustain true for an endless sustain, false otherwise
   * @param step The step
   * @param rotation The rotation
   */
  public Z4Tracer(Z4FancifulValue multiplicity, Z4FancifulValue push, Z4FancifulValue attack, Z4FancifulValue sustain, Z4FancifulValue release, boolean endlessSustain, Z4FancifulValue step, Z4Rotation rotation) {
    super(rotation);

    this.multiplicity = multiplicity;
    this.push = push;
    this.attack = attack;
    this.sustain = sustain;
    this.release = release;
    this.endlessSustain = endlessSustain;
    this.step = step;
  }

  @Override
  public Z4PointIteratorType getType() {
    return Z4PointIteratorType.TRACER;
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

  /**
   * Returns the attack
   *
   * @return The attack
   */
  public Z4FancifulValue getAttack() {
    return this.attack;
  }

  /**
   * Returns the release
   *
   * @return The release
   */
  public Z4FancifulValue getRelease() {
    return this.release;
  }

  /**
   * Returns the sustain
   *
   * @return The sustain
   */
  public Z4FancifulValue getSustain() {
    return this.sustain;
  }

  /**
   * Checks if the sustain is endless
   *
   * @return true for an endless sustain, false otherwise
   */
  public boolean isEndlessSustain() {
    return this.endlessSustain;
  }

  /**
   * Returns the step
   *
   * @return The step
   */
  public Z4FancifulValue getStep() {
    return this.step;
  }

  @Override
  public boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y) {
    if (action == Z4PointIteratorDrawingAction.START) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = false;

      this.path = null;
      this.envelopeA = this.attack.next();
      this.envelopeS = this.sustain.next();
      this.envelopeR = this.release.next();
      this.envelopeAS = this.envelopeA + this.envelopeS;
      this.envelopeASR = this.envelopeA + this.envelopeS + this.envelopeR;
      this.envelopePosition = 0;
      this.envelopeStep = this.step.next();

      this.clones = new Array<>();
      this.fromClones = false;

      this.surplus = 0;
      this.connect = false;

      return false;
    } else if (action == Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      double distance = Z4Math.distance(this.currentPoint.x, this.currentPoint.y, x, y);
      if (distance >= 10) {
        double angle = Z4Math.atan(this.currentPoint.x, this.currentPoint.y, x, y);
        Z4Vector vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 2 * distance / 3, angle);
        Z4Point end = new Z4Point(vector.x, vector.y);

        if (this.connect) {
          vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, distance / 3, angle);
          this.path = Z4TracerPath.fromQuadAndLine(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y, vector.x, vector.y, end.x, end.y, this.surplus, this.envelopeStep);
        } else {
          this.path = Z4TracerPath.fromLine(this.currentPoint.x, this.currentPoint.y, vector.x, vector.y, this.surplus, this.envelopeStep);
        }

        this.connect = true;
        this.before = end;
        this.currentPoint = new Z4Point(x, y);

        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      } else {
        this.hasNext = false;
      }

      return true;
    } else if (action == Z4PointIteratorDrawingAction.STOP) {
      this.fromClones = true;
      this.clonePos = 0;
      this.hasNext = this.clonePos < this.clones.length;
      return true;
    } else {
      return false;
    }
  }

  @Override
  public Z4DrawingPoint next(Z4SpatioTemporalColor color, Z4ColorProgression progression) {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      Z4DrawingPoint clone = this.clones.$get(this.clonePos);

      this.clonePos++;
      this.hasNext = this.clonePos < this.clones.length;

      return new Z4DrawingPoint(
              clone.z4Vector,
              clone.intensity,
              this.clonePos / this.clones.length,
              false,
              clone.side,
              clone.useVectorModuleAsSize
      );
    } else {
      if (!$exists(this.currentMultiplicityCounter)) {
        this.currentVector = this.path.next();
      }

      Z4Vector vector;
      double angle = this.rotation.next(this.currentVector.phase);
      double currentPush = this.push.next();
      if ($exists(currentPush)) {
        Z4Vector pushed = Z4Vector.fromVector(this.currentVector.x0, this.currentVector.y0, currentPush, angle);
        vector = Z4Vector.fromVector(pushed.x, pushed.y, 1, angle);
      } else {
        vector = Z4Vector.fromVector(this.currentVector.x0, this.currentVector.y0, 1, angle);
      }

      boolean drawBounds = false;
      double temporalPosition = $exists(this.nextdDrawingPoint) ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        drawBounds = true;
      } else if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }

      this.currentMultiplicityCounter++;
      if (this.currentMultiplicityCounter >= this.currentMultiplicityTotal) {
        this.currentMultiplicityCounter = 0;
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      }

      this.nextdDrawingPoint = new Z4DrawingPoint(
              vector,
              this.nextEnvelope(),
              temporalPosition,
              drawBounds,
              this.rotation.computeSide(vector, this.currentVector),
              false
      );
      if (this.nextdDrawingPoint.drawBounds && this.nextdDrawingPoint.intensity > 0) {
        this.clones.push(this.nextdDrawingPoint);
      }
      return this.nextdDrawingPoint;
    }
  }

  private double nextEnvelope() {
    if (this.envelopePosition < this.envelopeA) {
      this.envelopePosition++;
      return this.envelopePosition / this.envelopeA;
    } else if (this.envelopePosition < this.envelopeAS || this.endlessSustain) {
      this.envelopePosition++;
      return 1;
    } else if (this.envelopePosition < this.envelopeASR) {
      this.envelopePosition++;
      return 1 - (this.envelopePosition - this.envelopeAS) / this.envelopeR;
    } else {
      return 0;
    }
  }

  @Override
  public int getNextCountOnSTOP() {
    return this.clones.length;
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
    painter = $exists(painter) ? painter : new Z4ArrowPainter();
    spatioTemporalColor = $exists(spatioTemporalColor) ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    progression = $exists(progression) ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, Z4Lighting.NONE);

    $Bezier bezier = width > height
            ? new $Bezier(width / 10, height / 3, width / 2, 3 * height / 2, width / 2, -height / 2, 9 * width / 10, height / 2)
            : new $Bezier(width / 3, 9 * height / 10, 3 * width / 2, height / 2, -width / 2, height / 2, width / 2, height / 10);

    Z4Point p = bezier.get(0);
    this.drawAction(Z4PointIteratorDrawingAction.START, p.x, p.y);

    for (double s = 0.1; s < 1; s += 0.1) {
      p = bezier.get(s);
      this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, p.x, p.y);
      this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression);
    }

    p = bezier.get(1);
    this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, p.x, p.y);
    this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression);
    this.drawAction(Z4PointIteratorDrawingAction.STOP, p.x, p.y);
    this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression);
  }

  private void drawDemoPoint($CanvasRenderingContext2D context, Z4Point p, Z4Painter painter, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    context.save();
    context.lineWidth = 1;
    context.fillStyle = Z4Constants.$getStyle("black");
    context.beginPath();
    context.arc(p.x, p.y, 2, 0, Z4Math.TWO_PI);
    context.fill();
    context.restore();

    Z4DrawingPoint next;
    while ((next = this.next(spatioTemporalColor, progression)) != null) {
      if (!next.drawBounds) {
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        painter.draw(context, next, spatioTemporalColor, progression);
        context.restore();
      }
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("multiplicity", this.multiplicity.toJSON());
    json.$set("push", this.push.toJSON());

    json.$set("attack", this.attack.toJSON());
    json.$set("sustain", this.sustain.toJSON());
    json.$set("release", this.release.toJSON());
    json.$set("endlessSustain", this.endlessSustain);

    json.$set("step", this.step.toJSON());
    return json;
  }

  /**
   * Creates a Z4Tracer from a JSON object
   *
   * @param json The JSON object
   * @return the tracer
   */
  public static Z4Tracer fromJSON($Object json) {
    return new Z4Tracer(
            Z4FancifulValue.fromJSON(json.$get("multiplicity")),
            Z4FancifulValue.fromJSON(json.$get("push")),
            Z4FancifulValue.fromJSON(json.$get("attack")),
            Z4FancifulValue.fromJSON(json.$get("sustain")),
            Z4FancifulValue.fromJSON(json.$get("release")),
            json.$get("endlessSustain"),
            Z4FancifulValue.fromJSON(json.$get("step")),
            Z4Rotation.fromJSON(json.$get("rotation"))
    );
  }
}
