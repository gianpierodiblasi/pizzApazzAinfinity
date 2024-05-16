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
    let point = new Object();
    let val = Z4Math.TWO_PI / vertexCount * 3 + Math.PI;
    point["x"] = Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION;
    point["y"] = Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION;
    points[0] = point;
    for (let index = 1; index < vertexCount; index++) {
      point = new Object();
      val = Z4Math.TWO_PI / vertexCount * index;
      point["x"] = Math.cos(val);
      point["y"] = Math.sin(val);
      points[index * 2 - 1] = point;
      point = new Object();
      val = Z4Math.TWO_PI / vertexCount * (index + 3) + Math.PI;
      point["x"] = Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION;
      point["y"] = Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION;
      points[index * 2] = point;
    }
    point = new Object();
    point["x"] = Math.cos(0);
    point["y"] = Math.sin(0);
    points.splice(0, 0, point);
    points.push(point);
    let edges = new Array();
    for (let index = 0; index < points.length - 1; index++) {
      let line = new Object();
      line["p1x"] = points[index]["x"];
      line["p1y"] = points[index]["y"];
      line["p2x"] = points[index + 1]["x"];
      line["p2y"] = points[index + 1]["y"];
      edges.push(line);
    }
    return edges;
  }
}
