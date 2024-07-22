package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Point;
import simulation.js.$Apply_2_V;

/**
 * The configuration of a button used by a geometrishape
 *
 * @author gianpiero.diblasi
 */
public class Z4GeometricShapeButtonConfiguration {

  public final String label;
  public final $Apply_2_V<Array<Z4Point>, Integer, Z4GeometricShape> onClick;

  /**
   * Creates the object
   *
   * @param label The spinner label
   * @param onClick The action to do on click
   *
   */
  public Z4GeometricShapeButtonConfiguration(String label, $Apply_2_V<Array<Z4Point>, Integer, Z4GeometricShape> onClick) {
    this.label = label;
    this.onClick = onClick;
  }
}
