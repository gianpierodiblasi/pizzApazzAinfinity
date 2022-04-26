package giada.pizzapazza.iterator;

import giada.pizzapazza.color.Z4Lighting;
import giada.pizzapazza.color.Z4Progression;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Vector;

/**
 * The stamper
 *
 * @author gianpiero.di.blasi
 */
public class Z4Stamper extends Z4PointIterator<Z4Stamper> {

  @Override
  public boolean draw(Z4Action action, double x, double y) {
    if (action == Z4Action.START) {
      this.P.$set("x", x);
      this.P.$set("y", y);
      this.hasNext = true;

      return true;
    } else {
      return false;
    }
  }

  @Override
  public Z4Point next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.hasNext = false;
      double angle = this.nextRotation(0);
      this.z4Point.setZ4Vector(Z4Vector.fromVector(this.P.$get("x"), this.P.$get("y"), 1, angle));
      this.nextSide(this.z4Point, null);

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

      return this.z4Point;
    }
  }
}
