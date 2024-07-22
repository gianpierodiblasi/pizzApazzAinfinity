package pizzapazza.math.geometricshape;

import def.js.Array;
import pizzapazza.math.Z4Point;
import simulation.js.$Apply_1_Void;
import simulation.js.$Apply_3_Void;

/**
 * The configuration of a button used by a geometrishape
 *
 * @author gianpiero.diblasi
 */
public class Z4GeometricShapeButtonConfiguration {

  public final String label;
  public final $Apply_3_Void<Array<Z4Point>, Integer, $Apply_1_Void<Z4GeometricShape>> onClick;

  /**
   * Creates the object
   *
   * @param label The spinner label
   * @param onClick The action to do on click
   *
   */
  public Z4GeometricShapeButtonConfiguration(String label, $Apply_3_Void<Array<Z4Point>, Integer, $Apply_1_Void<Z4GeometricShape>> onClick) {
    this.label = label;
    this.onClick = onClick;
  }
}
