package giada.pizzapazza.iterator;

import def.js.Array;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.math.Z4TracerPath;
import giada.pizzapazza.math.Z4Vector;
import simulation.bezier.$Bezier;
import simulation.bezier.$BezierPoint;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * The tracer
 *
 * @author gianpiero.di.blasi
 */
public class Z4Tracer extends Z4PointIterator<Z4Tracer> {

  private Z4FancifulValue intensity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(15).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(1).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue push = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE)).setRandom(Z4SignedRandomValue.classic(0).setSign(Z4Sign.POSITIVE));

  private Z4FancifulValue attack = new Z4FancifulValue();
  private Z4FancifulValue sustain = new Z4FancifulValue();
  private Z4FancifulValue release = new Z4FancifulValue();
  private boolean endlessSustain = true;

  private Z4FancifulValue step = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(10).setSign(Z4Sign.POSITIVE));

  private Z4TracerPath path;
  private $Object before = new $Object();

  private double envelopeA;
  private double envelopeS;
  private double envelopeR;
  private double envelopeAS;
  private double envelopeASR;
  private double envelopePosition;
  private double envelopeStep;

  private Array<Z4Point> clones = new Array<>();
  private int clonePos;
  private int cloneSize;
  private boolean fromClones;

  private double surplus;
  private boolean connect;

  public Z4Tracer() {
    super();

    this.before.$set("x", 0);
    this.before.$set("y", 0);
  }

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.P.$set("x", x);
      this.P.$set("y", y);
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
    } else if (action == Z4Action.CONTINUE) {
      double distance = Z4Math.distance(this.P.$get("x"), this.P.$get("y"), x, y);
      if (distance >= 10) {
        double angle = Z4Math.atan(this.P.$get("x"), this.P.$get("y"), x, y);
        Z4Vector vector = Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), 2 * distance / 3, angle);
        $Object end = new $Object();
        end.$set("x", vector.getX());
        end.$set("y", vector.getY());

        if (this.connect) {
          vector = Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), distance / 3, angle);
          this.path = Z4TracerPath.fromQuadAndLine(this.before.$get("x"), this.before.$get("y"), this.P.$get("x"), this.P.$get("y"), vector.getX(), vector.getY(), end.$get("x"), end.$get("y"), this.surplus, this.envelopeStep);
        } else {
          this.path = Z4TracerPath.fromLine(this.P.$get("x"), this.P.$get("y"), vector.getX(), vector.getY(), this.surplus, this.envelopeStep);
        }

        this.connect = true;
        this.before = end;
        this.P.$set("x", x);
        this.P.$set("y", y);

        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      } else {
        this.hasNext = false;
      }

      return true;
    } else if (action == Z4Action.STOP) {
      this.fromClones = true;
      this.clonePos = 0;
      this.hasNext = this.clonePos < this.clones.length;

      return true;
    } else {
      return false;
    }
  }

  @Override
  public Z4Point next() {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      Z4Point clone = this.clones.$get(this.clonePos);
      clone.setColorPosition(this.clonePos / this.clones.length);
      clone.setDrawBounds(false);

      this.clonePos++;
      this.hasNext = this.clonePos < this.clones.length;
      return clone;
    } else {
      Z4Vector vector = this.path.next();
      double angle = this.rotation.next(vector.getPhase());
      this.z4Point.setZ4Vector(Z4Vector.fromVector(vector.getX0(), vector.getY0(), 1, angle));
      this.z4Point.setIntensity(this.nextEnvelope());
      this.rotation.nextSide(this.z4Point, vector);

      if (this.progression == Z4Progression.TEMPORAL) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setDrawBounds(false);
        this.nextColorPosition();
      } else if (this.progression == Z4Progression.SPATIAL) {
        this.z4Point.setLighting(Z4Lighting.NONE);
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression == Z4Progression.RELATIVE_TO_PATH) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setDrawBounds(true);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression == Z4Progression.RANDOM) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setDrawBounds(false);
        this.z4Point.setColorPosition(Math.random());
      }

      if (this.z4Point.isDrawBounds() && this.z4Point.getIntensity() > 0) {
        this.clones.push(this.z4Point.clone());
      }

      this.hasNext = this.path.hasNext();
      if (!this.hasNext) {
        this.surplus = this.path.getNewSurplus();
      }

      return this.z4Point;
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
  public void drawDemo($CanvasRenderingContext2D context, double width, double height) {
    throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
  }

  private Array<$Object> initDraw(double w, double h) {
    Array<$Object> array = new Array<>();

    $Bezier bezier = w > h
            ? new $Bezier(w / 10, h / 3, w / 2, 3 * h / 2, w / 2, -h / 2, 9 * w / 10, h / 2)
            : new $Bezier(w / 3, 9 * h / 10, 3 * w / 2, h / 2, -w / 2, h / 2, w / 2, h / 10);

    for (int t = 0; t < bezier.length(); t++) {
      $BezierPoint p = bezier.get(t);
      $Object point = new $Object();
      point.$set("x", p.x);
      point.$set("y", p.y);
      array.push(point);
    }
    return array;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
  public Z4FancifulValue getIntensity() {
    return this.intensity;
  }

  /**
   * Sets the intensity
   *
   * @param intensity The intensity
   * @return This Z4Tracer
   */
  public Z4Tracer setIntensity(Z4FancifulValue intensity) {
    this.intensity = intensity;
    return this;
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
   * Sets the multiplicity
   *
   * @param multiplicity The multiplicity
   * @return This Z4Tracer
   */
  public Z4Tracer setMultiplicity(Z4FancifulValue multiplicity) {
    this.multiplicity = multiplicity;
    return this;
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
   * Sets the push
   *
   * @param push The push
   * @return This Z4Tracer
   */
  public Z4Tracer setPush(Z4FancifulValue push) {
    this.push = push;
    return this;
  }

  /**
   * Sets the envelope
   *
   * @param attack The attack
   * @param sustain The sustain
   * @param release The release
   * @param endlessSustain true for an endless sustain, false otherwise
   * @return This Z4Tracer
   */
  public Z4Tracer setEnvelope(Z4FancifulValue attack, Z4FancifulValue sustain, Z4FancifulValue release, boolean endlessSustain) {
    this.attack = attack;
    this.sustain = sustain;
    this.release = release;
    this.endlessSustain = endlessSustain;
    return this;
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
   * Sets the step
   *
   * @param step The step
   * @return This Z4Tracer
   */
  public Z4Tracer setStep(Z4FancifulValue step) {
    this.step = step;
    return this;
  }

  /**
   * Returns the step
   *
   * @return The step
   */
  public Z4FancifulValue getStep() {
    return this.step;
  }
}
