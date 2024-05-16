/**
 * A (multi) polygon filler
 *
 * @author gianpiero.diblasi
 */
class Z4PolygonFiller extends Z4AbstractEllipseInscribedFiller {

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
  constructor(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior) {
    super(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior);
  }

   createEdges(vertexCount) {
    let edges = new Array();
    for (let index = 0; index < vertexCount - 1; index++) {
      edges.push(new Z4Line(Math.cos(index * Z4Math.TWO_PI / vertexCount), Math.sin(index * Z4Math.TWO_PI / vertexCount), Math.cos((index + 1) * Z4Math.TWO_PI / vertexCount), Math.sin((index + 1) * Z4Math.TWO_PI / vertexCount)));
    }
    edges.push(new Z4Line(Math.cos((vertexCount - 1) * Z4Math.TWO_PI / vertexCount), Math.sin((vertexCount - 1) * Z4Math.TWO_PI / vertexCount), Math.cos(0), Math.sin(0)));
    return edges;
  }
}
