/**
 * The gradient color (a gradient between two or more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColor extends Z4AbstractGradientColor {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.addColor(new Color(255, 255, 255, 255), 0);
    this.addColor(new Color(0, 0, 0, 255), 1);
  }

   cloneColor(color) {
    return new Color(color.red, color.green, color.blue, color.alpha);
  }

   getColorAt(position, useRipple) {
    if (useRipple && this.getRipple()) {
      position = Z4Math.ripple(position, 0, 1, this.getRipple());
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
    json["ripple"] = this.getRipple();
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
