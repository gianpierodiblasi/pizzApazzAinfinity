/**
 * A (multi) star filler
 *
 * @author gianpiero.diblasi
 */
class Z4StarFiller extends Z4AbstractEllipseInscribedFiller {

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
  constructor(gradientColor, cx, cy, rx, ry, angle, boundaryBehavior) {
    super(gradientColor, cx, cy, rx, ry, angle, 5, boundaryBehavior);
  }

   createEdges(vertexCount) {
    let points = new Array();
    let val = Z4Math.TWO_PI / vertexCount * 3 + Math.PI;
    points[0] = new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION);
    for (let index = 1; index < vertexCount; index++) {
      val = Z4Math.TWO_PI / vertexCount * index;
      points[index * 2 - 1] = new Z4Point(Math.cos(val), Math.sin(val));
      val = Z4Math.TWO_PI / vertexCount * (index + 3) + Math.PI;
      points[index * 2] = new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION);
    }
    points.splice(0, 0, new Z4Point(Math.cos(0), Math.sin(0)));
    points.push(new Z4Point(Math.cos(0), Math.sin(0)));
    let edges = new Array();
    for (let index = 0; index < points.length - 1; index++) {
      edges.push(new Z4Line(points[index].x, points[index].y, points[index + 1].x, points[index + 1].y));
    }
    return edges;
  }
}
