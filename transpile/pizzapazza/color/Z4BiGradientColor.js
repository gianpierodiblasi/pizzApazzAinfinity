/**
 * The bidimensional gradient color (a 2D gradient between four or more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColor {

   gradientColors = new Array();

   gradientColorPositions = new Array();

   rippleX = 0.0;

   rippleY = 0.0;

  /**
   * Creates the object
   */
  constructor() {
    // this.addColor(new Color(255, 255, 255, 255), 0, 0);
    // this.addColor(new Color(255, 255, 255, 255), 0, 1);
    // this.addColor(new Color(0, 0, 0, 255), 1, 0);
    // this.addColor(new Color(0, 0, 0, 255), 1, 1);
  }

  /**
   * Adds a color in a position, if the position is already occupied then
   * replaces the color
   *
   * @param color The color
   * @param x The x-axis coordinate (in the range [0,1])
   * @param y The y-axis coordinate (in the range [0,1])
   */
   addColor(color, x, y) {
    // int index = this.colorPositions.findIndex(point -> point.x == x && point.y == y);
    // 
    // if (index != -1) {
    // this.colors.$set(index, color);
    // } else {
    // this.colors.push(color);
    // this.colorPositions.push(new Z4Point(x, y));
    // }
  }

  /**
   * Removes a color by position, if the position is not occupied then no color
   * is removed
   *
   * @param x The x-axis coordinate (in the range [0,1])
   * @param y The y-axis coordinate (in the range [0,1])
   */
   removeColor(x, y) {
    // int index = this.colorPositions.findIndex(point -> point.x == x && point.y == y);
    // 
    // if (index != -1) {
    // this.colors.splice(index, 1);
    // this.colorPositions.splice(index, 1);
    // }
  }

  /**
   * Checks if a position is occupied
   *
   * @param x The x-axis coordinate (in the range [0,1])
   * @param y The y-axis coordinate (in the range [0,1])
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   * @return true if the position is occupied, false otherwise
   */
   isPositionOccupied(x, y, tolerance) {
    // return $exists(this.colorPositions.filter(point -> Math.abs(point.x - x) <= tolerance && Math.abs(point.y - y) <= tolerance).length);
  }

  /**
   * Returns a position based on another position and a tolerance
   *
   * @param x The x-axis coordinate (in the range [0,1])
   * @param y The y-axis coordinate (in the range [0,1])
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   * @return The position, null if there is no valid position
   */
   getPosition(x, y, tolerance) {
    // Array<Z4Point> positions = this.colorPositions.filter(point -> Math.abs(point.x - x) <= tolerance && Math.abs(point.y - y) <= tolerance);
    // return $exists(positions.length) ? positions.$get(0) : null;
  }

  /**
   * Mirrors this Z4GradientColor
   */
   mirror() {
    // this.colors.slice().splice(this.colors.length - 1, 1).reverse().forEach(color -> this.colors.push(color));
    // 
    // for (int index = 0; index < this.colorPositions.length; index++) {
    // this.colorPositions.$set(index, this.colorPositions.$get(index) / 2);
    // }
    // this.colorPositions.slice().splice(this.colorPositions.length - 1, 1).reverse().map(position -> 1 - position).forEach(position -> this.colorPositions.push(position));
  }

  /**
   * Reverses this Z4GradientColor
   */
   reverse() {
    // this.colors.reverse();
    // 
    // for (int index = 1; index < this.colorPositions.length - 1; index++) {
    // this.colorPositions.$set(index, 1 - this.colorPositions.$get(index));
    // }
  }

  /**
   * Sets the ripple
   *
   * @param rippleX The x-axis ripple (in the range [0,1])
   * @param rippleY The y-axis ripple (in the range [0,1])
   */
   setRipple(rippleX, rippleY) {
    this.rippleX = rippleX;
    this.rippleY = rippleY;
  }

  /**
   * Returns the x-axis ripple
   *
   * @return The x-axis ripple (in the range [0,1])
   */
   getRippleX() {
    return this.rippleX;
  }

  /**
   * Returns the y-axis ripple
   *
   * @return The y-axis ripple (in the range [0,1])
   */
   getRippleY() {
    return this.rippleY;
  }

  /**
   * Returns a Color in a position
   *
   * @param x The x-axis coordinate (in the range [0,1])
   * @param y The y-axis coordinate (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @return The Color
   */
   getColorAt(x, y, useRipple) {
    // if (useRipple && $exists(this.rippleX)) {
    // x = Z4Math.ripple(x, 0, 1, this.rippleX);
    // }
    // if (useRipple && $exists(this.rippleY)) {
    // y = Z4Math.ripple(y, 0, 1, this.rippleY);
    // 
    // }
    // 
    // double xx = x;
    // double yy = y;
    // int index = this.colorPositions.findIndex(point -> point.x == xx && point.y == yy);
    // if (index != -1) {
    // return this.colors.$get(index);
    // } else {
    // Array<$Object> triangle = this.colorPositions.map((point, idx, array) -> {
    // $Object object = new $Object();
    // object.$set("dist", Z4Math.distance(point.x, point.y, xx, yy));
    // object.$set("color", this.colors.$get(idx));
    // return object;
    // }).sort((o1, o2) -> (double) o1.$get("dist") < (double) o2.$get("dist") ? -1 : 1).slice(0, 3);
    // 
    // double red = 0;
    // double green = 0;
    // double blue = 0;
    // double alpha = 0;
    // double sum = triangle.map(obj -> (double) obj.$get("dist")).reduce((accumulator, current, idx, array) -> accumulator + current);
    // 
    // for (int idx = 0; idx < triangle.length; idx++) {
    // red += ((Color) triangle.$get(idx).$get("color")).red * (sum - (double) triangle.$get(idx).$get("dist"));
    // green += ((Color) triangle.$get(idx).$get("color")).green * (sum - (double) triangle.$get(idx).$get("dist"));
    // blue += ((Color) triangle.$get(idx).$get("color")).blue * (sum - (double) triangle.$get(idx).$get("dist"));
    // alpha += ((Color) triangle.$get(idx).$get("color")).alpha * (sum - (double) triangle.$get(idx).$get("dist"));
    // }
    // 
    // return new Color(
    // parseInt(red / (2 * sum)),
    // parseInt(green / (2 * sum)),
    // parseInt(blue / (2 * sum)),
    // parseInt(alpha / (2 * sum))
    // );
    // }
  }

  /**
   * Returns this Z4GradientColor as a JSON object
   *
   * @return This Z4GradientColor as a JSON object
   */
   toJSON() {
    // $Object json = new $Object();
    // 
    // json.$set("rippleX", this.rippleX);
    // json.$set("rippleY", this.rippleY);
    // 
    // json.$set("colorsAndPositions", this.colors.map((color, index, array) -> {
    // $Object jsonColor = new $Object();
    // jsonColor.$set("red", color.red);
    // jsonColor.$set("green", color.green);
    // jsonColor.$set("blue", color.blue);
    // jsonColor.$set("alpha", color.alpha);
    // jsonColor.$set("x", this.colorPositions.$get(index).x);
    // jsonColor.$set("y", this.colorPositions.$get(index).y);
    // return jsonColor;
    // }));
    // 
    // return json;
  }

  /**
   * Creates a Z4GradientColor from a JSON object
   *
   * @param json The JSON object
   * @return the color
   */
  static  fromJSON(json) {
    // Z4BiGradientColor gradientColor = new Z4BiGradientColor();
    // gradientColor.setRipple(json.$get("rippleX"), json.$get("rippleY"));
    // ((Iterable<$Object>) json.$get("colorsAndPositions")).forEach(colorAndPosition -> gradientColor.addColor(new Color(colorAndPosition.$get("red"), colorAndPosition.$get("green"), colorAndPosition.$get("blue"), colorAndPosition.$get("alpha")), colorAndPosition.$get("x"), colorAndPosition.$get("y")));
    // return gradientColor;
  }
}
