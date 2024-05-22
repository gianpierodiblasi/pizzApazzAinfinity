/**
 * The gradient color (a gradient between two or more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColor extends Z4AbstractGradientColor {

   ripple = 0.0;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.addColor(new Color(255, 255, 255, 255), 0);
    this.addColor(new Color(0, 0, 0, 255), 1);
  }

  /**
   * Mirrors this Z4GradientColor
   */
   mirror() {
    this.colors.slice().splice(this.colors.length - 1, 1).reverse().forEach(color => this.colors.push(color));
    for (let index = 0; index < this.colorPositions.length; index++) {
      this.colorPositions[index] = this.colorPositions[index] / 2;
    }
    this.colorPositions.slice().splice(this.colorPositions.length - 1, 1).reverse().map(position => 1 - position).forEach(position => this.colorPositions.push(position));
  }

  /**
   * Reverses this Z4GradientColor
   */
   reverse() {
    this.colors.reverse();
    for (let index = 1; index < this.colorPositions.length - 1; index++) {
      this.colorPositions[index] = 1 - this.colorPositions[index];
    }
  }

  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   */
   setRipple(ripple) {
    this.ripple = ripple;
  }

  /**
   * Returns the ripple
   *
   * @return The ripple (in the range [0,1])
   */
   getRipple() {
    return this.ripple;
  }

   getColorAt(position, useRipple) {
    if (useRipple && this.ripple) {
      position = Z4Math.ripple(position, 0, 1, this.ripple);
    }
    let finalPos = position;
    let index = this.colorPositions.findIndex(pos => pos >= finalPos, null);
    if (this.colorPositions[index] === position) {
      return this.colors[index];
    } else if (this.colorPositions[index - 1] === position) {
      return this.colors[index - 1];
    } else {
      let div = (position - this.colorPositions[index - 1]) / (this.colorPositions[index] - this.colorPositions[index - 1]);
      return new Color(parseInt((this.colors[index].red - this.colors[index - 1].red) * div + this.colors[index - 1].red), parseInt((this.colors[index].green - this.colors[index - 1].green) * div + this.colors[index - 1].green), parseInt((this.colors[index].blue - this.colors[index - 1].blue) * div + this.colors[index - 1].blue), parseInt((this.colors[index].alpha - this.colors[index - 1].alpha) * div + this.colors[index - 1].alpha));
    }
  }

   toJSON() {
    let json = new Object();
    json["ripple"] = this.ripple;
    json["colorsAndPositions"] = this.colors.map((color, index, array) => {
      let jsonColor = new Object();
      jsonColor["red"] = color.red;
      jsonColor["green"] = color.green;
      jsonColor["blue"] = color.blue;
      jsonColor["alpha"] = color.alpha;
      jsonColor["position"] = this.colorPositions[index];
      return jsonColor;
    });
    return json;
  }

  /**
   * Creates a Z4GradientColor from a JSON object
   *
   * @param json The JSON object
   * @return the color
   */
  static  fromJSON(json) {
    let gradientColor = new Z4GradientColor();
    gradientColor.setRipple(json["ripple"]);
    (json["colorsAndPositions"]).forEach(colorAndPosition => gradientColor.addColor(new Color(colorAndPosition["red"], colorAndPosition["green"], colorAndPosition["blue"], colorAndPosition["alpha"]), colorAndPosition["position"]));
    return gradientColor;
  }
}
