package giada.pizzapazza.color;

import giada.pizzapazza.math.Z4Point;

/**
 * The progression of a color
 *
 * @author gianpiero.diblasi
 */
public class Z4Progression {

  private final int type;
  private double temporalStepProgression;
  private Z4Lighting lighting = Z4Lighting.NONE;

  private Z4Progression(double temporalStepProgression, Z4Lighting lighting, int type) {
    this.temporalStepProgression = temporalStepProgression;
    this.lighting = lighting;
    this.type = type;
  }

  /**
   * Checks if this Z4Progression is a spatial progression
   *
   * @return true if this Z4Progression is a spatial progression, false
   * otherwise
   */
  public boolean isSpatial() {
    return this.type == 0;
  }

  /**
   * Checks if this Z4Progression is a temporal progression
   *
   * @return true if this Z4Progression is a temporal progression, false
   * otherwise
   */
  public boolean isTemporal() {
    return this.type == 1;
  }

  /**
   * Checks if this Z4Progression is a progression relative to a path
   *
   * @return true if this Z4Progression is a progression relative to a path,
   * false otherwise
   */
  public boolean isRelativeToPath() {
    return this.type == 2;
  }

  /**
   * Checks if this Z4Progression is a random progression
   *
   * @return true if this Z4Progression is a random progression, false otherwise
   */
  public boolean isRandom() {
    return this.type == 3;
  }

  /**
   * Sets the step for temporal progression (in the range [0,1])
   *
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @return This Z4Progression
   */
  public Z4Progression setTemporalStepProgression(double temporalStepProgression) {
    this.temporalStepProgression = temporalStepProgression;
    return this;
  }

  /**
   * Returns the step for temporal progression (in the range [0,1])
   *
   * @return The step for temporal progression (in the range [0,1])
   */
  public double getTemporalStepProgression() {
    return this.temporalStepProgression;
  }

  /**
   * Sets the color lighting
   *
   * @param lighting The color lighting
   * @return This Z4Progression
   */
  public Z4Progression setLighting(Z4Lighting lighting) {
    this.lighting = lighting;
    return this;
  }

  /**
   * Returns the color lighting
   *
   * @return The color lighting
   */
  public Z4Lighting getLighting() {
    return this.lighting;
  }

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

  /**
   * Returns a spatial progression
   *
   * @param lighting The color lighting
   * @return The Z4Progression
   */
  public static Z4Progression spatial(Z4Lighting lighting) {
    return new Z4Progression(0.1, lighting, 0);
  }

  /**
   * Returns a temporal progression
   *
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param lighting The color lighting
   * @return The Z4Progression
   */
  public static Z4Progression temporal(double temporalStepProgression, Z4Lighting lighting) {
    return new Z4Progression(temporalStepProgression, lighting, 1);
  }

  /**
   * Returns a progression relative to a path
   *
   * @param lighting The color lighting
   * @return The Z4Progression
   */
  public static Z4Progression relativeToPath(Z4Lighting lighting) {
    return new Z4Progression(0.1, lighting, 2);
  }

  /**
   * Returns a random progression
   *
   * @param lighting The color lighting
   * @return The Z4Progression
   */
  public static Z4Progression random(Z4Lighting lighting) {
    return new Z4Progression(0.1, lighting, 3);
  }
}
