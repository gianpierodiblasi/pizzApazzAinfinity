package pizzapazza.filler;

import def.js.Array;
import def.js.Math;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.geometricshape.Z4Line;

/**
 * A (multi) star filler
 *
 * @author gianpiero.diblasi
 */
public class Z4StarFiller extends Z4AbstractEllipseInscribedFiller {

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point of the ellipse
   * containing the (regular) star
   * @param cy The y-axis coordinate of the center point of the ellipse
   * containing the (regular) star
   * @param rx The x-radius of the ellipse containing the (regular) star
   * @param ry The y-radius of the ellipse containing the (regular) star
   * @param angle The rotation angle of the ellipse containing the (regular)
   * star (in radians)
   * @param vertexCount The number of vertices of the star
   * @param boundaryBehavior The boundary behavior
   */
  public Z4StarFiller(Z4GradientColor gradientColor, int cx, int cy, int rx, int ry, double angle, int vertexCount, Z4BoundaryBehavior boundaryBehavior) {
    super(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior);
  }

  @Override
  protected Array<Z4Line> createEdges(int vertexCount) {
    Array<Z4Point> points = new Array<>();
    for (int index = 0; index < vertexCount; index++) {
      double val = index * Z4Math.TWO_PI / vertexCount;
      points.push(new Z4Point(Math.cos(val), Math.sin(val)));
      val = (index * Z4Math.TWO_PI + Math.PI) / vertexCount;
      points.push(new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION));
    }
    points.push(new Z4Point(Math.cos(0), Math.sin(0)));

    Array<Z4Line> edges = new Array<>();
    for (int index = 0; index < points.length - 1; index++) {
      edges.push(new Z4Line(points.$get(index).x, points.$get(index).y, points.$get(index + 1).x, points.$get(index + 1).y));
    }
    return edges;
  }
}
