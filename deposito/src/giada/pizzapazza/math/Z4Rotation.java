package giada.pizzapazza.math;

import static simulation.js.$Globals.$exists;

/**
 * 
 *
 * @author gianpiero.diblasi
 */
public class Z4Rotation {
  /**
   * Computes the next side
   *
   * @param z4Point The current point
   * @param vector The tangent vector
   */
  public void nextSide(Z4Point z4Point, Z4Vector vector) {
    switch (this.type) {
      case 0:
      case 1:
        z4Point.setSide(Z4Sign.POSITIVE);
        break;
      case 2:
        z4Point.setSide($exists(vector) ? vector.direction(z4Point.getZ4Vector()) : Z4Sign.RANDOM);
        break;
    }
  }
}
