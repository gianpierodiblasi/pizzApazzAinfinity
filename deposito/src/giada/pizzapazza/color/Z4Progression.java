package giada.pizzapazza.color;

import giada.pizzapazza.math.Z4Point;

/**
 * The progression of a color
 *
 * @author gianpiero.diblasi
 */
public class Z4Progression {

  /**
   * Sets the next color position in a point
   *
   * @param z4Point The point
   */
  public void next(Z4Point z4Point) {
    if (this.isTemporal()) {
      z4Point.setLighting(this.lighting);
      z4Point.setDrawBounds(false);

      double colorPosition = z4Point.getColorPosition();
      colorPosition = colorPosition == -1 ? 0 : colorPosition + this.temporalStepProgression;
      if (colorPosition > 1) {
        colorPosition -= 1;
      }
      z4Point.setColorPosition(colorPosition);
    } else if (this.isSpatial()) {
      z4Point.setLighting(Z4Lighting.NONE);
      z4Point.setDrawBounds(false);
      z4Point.setColorPosition(-1);
    } else if (this.isRelativeToPath()) {
      z4Point.setLighting(this.lighting);
      z4Point.setDrawBounds(true);
      z4Point.setColorPosition(-1);
    } else if (this.isRandom()) {
      z4Point.setLighting(this.lighting);
      z4Point.setDrawBounds(false);
      z4Point.setColorPosition(Math.random());
    }
  }
}
