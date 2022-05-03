package giada.pizzapazza.iterator;

import def.js.Array;
import giada.pizzapazza.color.Z4GradientColor;
import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Math;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4ArrowPainter;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 * The stamper
 *
 * @author gianpiero.di.blasi
 */
public class Z4Stamper extends Z4PointIterator<Z4Stamper> {
  
  private Z4FancifulValue intensity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(15).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue multiplicity = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(1).setSign(Z4Sign.POSITIVE));
  private Z4FancifulValue push = new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(0).setSign(Z4Sign.POSITIVE));
  
  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;
  private double currentPush;
  
  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next(0));
      this.currentPush = this.push.next(0);
      
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.hasNext = true;
      
      return true;
    } else {
      return false;
    }
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
   * @return This Z4Stamper
   */
  public Z4Stamper setIntensity(Z4FancifulValue intensity) {
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
   * @return This Z4Stamper
   */
  public Z4Stamper setMultiplicity(Z4FancifulValue multiplicity) {
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
   * @return This Z4Stamper
   */
  public Z4Stamper setPush(Z4FancifulValue push) {
    this.push = push;
    return this;
  }
  
  @Override
  public Z4Point next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      
      double angle = this.rotation.next(0);
      if ($exists(this.currentPush)) {
        Z4Vector pushed = Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), this.currentPush, angle);
        this.z4Point.setZ4Vector(Z4Vector.fromVector(pushed.getX(), pushed.getY(), 1, angle));
      } else {
        this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), 1, angle));
      }
      this.rotation.nextSide(this.z4Point, null);
      
      if (this.progression == Z4Progression.TEMPORAL) {
        this.z4Point.setLighting(this.lighting);
        
        double colorPosition = this.z4Point.getColorPosition();
        colorPosition = colorPosition == -1 ? 0 : colorPosition + this.temporalStepProgression;
        if (colorPosition > 1) {
          colorPosition -= 1;
        }
        this.z4Point.setColorPosition(colorPosition);
      } else if (this.progression == Z4Progression.SPATIAL) {
        this.z4Point.setLighting(Z4Lighting.NONE);
        this.z4Point.setColorPosition(-1);
      } else if (this.progression == Z4Progression.RELATIVE_TO_PATH || this.progression == Z4Progression.RANDOM) {
        this.z4Point.setLighting(this.lighting);
        this.z4Point.setColorPosition(Math.random());
      }
      
      return this.z4Point.setIntensity(this.intensity.next(0));
    }
  }
  
  @Override
  public void drawDemo($CanvasRenderingContext2D context, double width, double height) {
    Z4ArrowPainter arrowPainter = new Z4ArrowPainter();
    Z4GradientColor gradientColor = new Z4GradientColor();
    
    this.initDraw(width, height).forEach(point -> {
      this.draw(Z4Action.START, point.$get("x"), point.$get("y"));
      
      if ($exists(this.currentPush) && !$exists(this.currentMultiplicityCounter)) {
        context.save();
        context.lineWidth = 1;
        context.fillStyle = this.$getColor("black");
        context.beginPath();
        context.arc(this.P.$get("x"), this.P.$get("y"), 2, 0, Z4Math.TWO_PI);
        context.fill();
        context.restore();
      }
      
      Z4Point next;
      while ((next = this.next()) != null) {
        Z4Vector vector = next.getZ4Vector();
        
        context.save();
        context.translate(vector.getX0(), vector.getY0());
        context.rotate(vector.getPhase());
        arrowPainter.draw(context, next, gradientColor);
        context.restore();
      }
    });
  }
  
  private Array<$Object> initDraw(double w, double h) {
    Array<$Object> array = new Array<>();
    for (int x = 50; x <= w - 50; x += 100) {
      for (int y = 50; y <= h - 50; y += 100) {
        $Object point = new $Object();
        point.$set("x", x);
        point.$set("y", y);
        array.push(point);
      }
    }
    return array;
  }
}
