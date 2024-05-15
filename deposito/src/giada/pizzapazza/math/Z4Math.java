package giada.pizzapazza.math;

import def.js.Array;

import simulation.js.$Object;

public class Z4Math {

  /**
   * Calculates the control points of a Bezier curve, having coincident starting
   * (S) and ending (E) points, passing through a given point (P), included in a
   * given angle (A) and symmetrical with respect to the straight line passing
   * through the starting point (S) and the given point (P)
   *
   * @param vector The vector starting at the starting point (S) and ending at
   * the given point (P)
   *
   * @param alpha The angle (A) including the Bezier curve, in radians
   * @return An array of two Objects containing the first and second control
   * points of the Bezier curve
   */
  public static Array<$Object> butterfly(Z4Vector vector, double alpha) {
    double cos = Math.cos(alpha);
    double sin = Math.sin(alpha);

    $Object controlPoint1 = new $Object();
    double val1 = 3 * (cos + 1);
    double val2 = vector.getY0() - 4 * vector.getY();
    controlPoint1.$set("y", -(val2 * cos + 4 * (vector.getX() - vector.getX0()) * sin + val2) / val1);
    controlPoint1.$set("x", (3 * vector.getX0() * cos + 3 * ((double) controlPoint1.$get("y") - vector.getY0()) * sin - 5 * vector.getX0() + 8 * vector.getX()) / val1);

    $Object controlPoint2 = new $Object();
    double dx = (double) controlPoint1.$get("x") - vector.getX0();
    double dy = (double) controlPoint1.$get("y") - vector.getY0();
    controlPoint2.$set("y", dx * sin + dy * cos + vector.getY0());
    controlPoint2.$set("x", dx * cos - dy * sin + vector.getX0());

    return new Array<>(controlPoint1, controlPoint2);
  }
}
