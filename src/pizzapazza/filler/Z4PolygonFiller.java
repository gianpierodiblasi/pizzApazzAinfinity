package pizzapazza.filler;

import def.js.Array;
import def.js.Math;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.util.Z4Math;
import simulation.js.$Object;

/**
 * A (multi) polygon filler
 *
 * @author gianpiero.diblasi
 */
public class Z4PolygonFiller extends Z4AbstractEllipseInscribedFiller {

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point of the ellipse
   * containing the (regular) polygon
   * @param cy The y-axis coordinate of the center point of the ellipse
   * containing the (regular) polygon
   * @param rx The x-radius of the ellipse containing the (regular) polygon
   * @param ry The y-radius of the ellipse containing the (regular) polygon
   * @param angle The rotation angle of the ellipse containing the (regular)
   * polygon (in radians)
   * @param vertexCount The number of vertices of the polygon
   * @param boundaryBehavior The boundary behavior
   */
  public Z4PolygonFiller(Z4GradientColor gradientColor, int cx, int cy, int rx, int ry, double angle, int vertexCount, int boundaryBehavior) {
    super(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior);

  }

  @Override
  protected Array<$Object> createEdges(int vertexCount) {
    Array<$Object> edges = new Array<>();

    for (int index = 0; index < vertexCount - 1; index++) {
      $Object line = new $Object();
      line.$set("p1x", Math.cos(index * Z4Math.TWO_PI / vertexCount));
      line.$set("p1y", Math.sin(index * Z4Math.TWO_PI / vertexCount));
      line.$set("p2x", Math.cos((index + 1) * Z4Math.TWO_PI / vertexCount));
      line.$set("p2y", Math.sin((index + 1) * Z4Math.TWO_PI / vertexCount));
      edges.push(line);
    }

    $Object line = new $Object();
    line.$set("p1x", Math.cos((vertexCount - 1) * Z4Math.TWO_PI / vertexCount));
    line.$set("p1y", Math.sin((vertexCount - 1) * Z4Math.TWO_PI / vertexCount));
    line.$set("p2x", Math.cos(0));
    line.$set("p2y", Math.sin(0));
    edges.push(line);

    return edges;
  }
}
