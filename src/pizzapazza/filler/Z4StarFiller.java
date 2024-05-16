package pizzapazza.filler;

import def.js.Array;
import def.js.Math;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import simulation.js.$Object;

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
  protected Array<$Object> createEdges(int vertexCount) {
    Array<$Object> points = new Array<>();

    $Object point = new $Object();
    double val = Z4Math.TWO_PI / vertexCount * 3 + Math.PI;
    point.$set("x", Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION);
    point.$set("y", Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION);
    points.$set(0, point);

    for (int index = 1; index < vertexCount; index++) {
      point = new $Object();
      val = Z4Math.TWO_PI / vertexCount * index;
      point.$set("x", Math.cos(val));
      point.$set("y", Math.sin(val));
      points.$set(index * 2 - 1, point);

      point = new $Object();
      val = Z4Math.TWO_PI / vertexCount * (index + 3) + Math.PI;
      point.$set("x", Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION);
      point.$set("y", Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION);
      points.$set(index * 2, point);
    }

    point = new $Object();
    point.$set("x", Math.cos(0));
    point.$set("y", Math.sin(0));
    points.splice(0, 0, point);
    points.push(point);

    Array<$Object> edges = new Array<>();
    for (int index = 0; index < points.length - 1; index++) {
      $Object line = new $Object();
      line.$set("p1x", points.$get(index).$get("x"));
      line.$set("p1y", points.$get(index).$get("y"));
      line.$set("p2x", points.$get(index + 1).$get("x"));
      line.$set("p2y", points.$get(index + 1).$get("y"));
      edges.push(line);
    }
    return edges;
  }
}
