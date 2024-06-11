package pizzapazza.iterator;

import def.js.Array;
import pizzapazza.color.Z4Lighting;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4TracerPath;
import pizzapazza.math.Z4Vector;
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
   * @param rotation
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
  public Z4DrawingPoint next() {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      Z4DrawingPoint clone = this.clones.$get(this.clonePos);
//      clone.setColorPosition(this.clonePos / this.clones.length);
//      clone.setDrawBounds(false);

      this.clonePos++;
      this.hasNext = this.clonePos < this.clones.length;
      return clone;
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

//      this.rotation.nextSide(this.z4Point, this.currentVector);
//      this.progression.next(this.z4Point);
//
//      if (this.z4Point.isDrawBounds() && this.z4Point.getIntensity() > 0) {
//        this.clones.push(this.z4Point.clone());
//      }
//
      this.currentMultiplicityCounter++;
      if (this.currentMultiplicityCounter >= this.currentMultiplicityTotal) {
        this.currentMultiplicityCounter = 0;
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      }

      return new Z4DrawingPoint(
              vector,
              this.nextEnvelope(),
              Z4Lighting.NONE,
              0,
              false,
              new Z4Sign(Z4SignBehavior.POSITIVE),
              false
      );
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

    json.$set("attack", this.attack.toJSON());
    json.$set("sustain", this.sustain.toJSON());
    json.$set("release", this.release.toJSON());
    json.$set("endlessSustain", this.endlessSustain);

    json.$set("step", this.step.toJSON());
    return json;
  }
}
