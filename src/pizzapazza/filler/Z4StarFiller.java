package pizzapazza.filler;

import def.js.Array;
import def.js.Math;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Line;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;

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
   * @param boundaryBehavior The boundary behavior
   */
  public Z4StarFiller(Z4GradientColor gradientColor, int cx, int cy, int rx, int ry, double angle, int boundaryBehavior) {
    super(gradientColor, cx, cy, rx, ry, angle, 5, boundaryBehavior);
  }

  @Override
  protected Array<Z4Line> createEdges(int vertexCount) {
    Array<Z4Point> points = new Array<>();

    double val = Z4Math.TWO_PI / vertexCount * 3 + Math.PI;
    points.$set(0, new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION));

    for (int index = 1; index < vertexCount; index++) {
      val = Z4Math.TWO_PI / vertexCount * index;
      points.$set(index * 2 - 1, new Z4Point(Math.cos(val), Math.sin(val)));

      val = Z4Math.TWO_PI / vertexCount * (index + 3) + Math.PI;
      points.$set(index * 2, new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION));
    }

    points.splice(0, 0, new Z4Point(Math.cos(0), Math.sin(0)));
    points.push(new Z4Point(Math.cos(0), Math.sin(0)));

    Array<Z4Line> edges = new Array<>();
    for (int index = 0; index < points.length - 1; index++) {
      edges.push(new Z4Line(points.$get(index).x, points.$get(index).y, points.$get(index + 1).x, points.$get(index + 1).y));
    }
    return edges;
  }
}
