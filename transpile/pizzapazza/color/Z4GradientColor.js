/**
 * The gradient color (a gradient between two or more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColor extends Z4AbstractGradientColor {

  static  history = new Array();

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

   mapColor(color, index) {
    let jsonColor = color.getJSON();
    jsonColor["position"] = this.colorPositions[index];
    return jsonColor;
  }

  /**
   * Merges overlapping colors based on a tolerance
   *
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   */
   mergeOverlapping(tolerance) {
    for (let index = this.colorPositions.length - 1; index > 0; index--) {
      let beforePosition = this.colorPositions[index - 1];
      let afterPosition = this.colorPositions[index];
      if (Math.abs(afterPosition - beforePosition) <= tolerance) {
        let position = (beforePosition + afterPosition) / 2;
        let color = this.getColorAt(position, false);
        this.removeColor(beforePosition);
        this.removeColor(afterPosition);
        this.addColor(color, position);
      }
    }
  }

  /**
   * Creates a linear gradient
   *
   * @param context The context to use to create the linear gradient
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x1 The x-axis coordinate of the end point
   * @param y1 The y-axis coordinate of the end point
   * @return The linear gradient
   */
   createLinearGradient(context, x0, y0, x1, y1) {
    let linearGradient = context.createLinearGradient(x0, y0, x1, y1);
    this.colors.forEach((color, index, array) => linearGradient.addColorStop(this.colorPositions[index], color.getRGBA_HEX()));
    return linearGradient;
  }

  /**
   * Returns a gradient color obtained as a sub portion of this gradient color
   *
   * @param start The start position (in the range [0,1])
   * @param end The end position (in the range [0,1])
   * @return The sub portion of this gradient color
   */
   subGradientColor(start, end) {
    let diff = end - start;
    let subGradientColor = new Z4GradientColor();
    subGradientColor.addColor(this.getColorAt(start, false), 0);
    this.colorPositions.filter(position => start <= position && position <= end).forEach(position => subGradientColor.addColor(this.getColorAt(position, false), (position - start) / diff));
    subGradientColor.addColor(this.getColorAt(end, false), 1);
    subGradientColor.setRipple(this.getRipple());
    return subGradientColor;
  }

  /**
   * Lights up this Z4GradientColor, the transparency is not changed
   *
   * @param inOut true for an in-out lighting, false for an out-in lighting
   * @return This lighted Z4GradientColor
   */
   lighted(inOut) {
    let lighted = new Z4GradientColor();
    this.colors.forEach((color, index, array) => lighted.addColor(color.lighted(inOut ? this.colorPositions[index] : 1 - this.colorPositions[index]), this.colorPositions[index]));
    return lighted;
  }

  /**
   * Darkens this Z4GradientColor, the transparency is not changed
   *
   * @param inOut true for an in-out lighting, false for an out-in lighting
   * @return This darkened Z4GradientColor
   */
   darkened(inOut) {
    let darkened = new Z4GradientColor();
    this.colors.forEach((color, index, array) => darkened.addColor(color.darkened(inOut ? this.colorPositions[index] : 1 - this.colorPositions[index]), this.colorPositions[index]));
    return darkened;
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
    (json["colorsAndPositions"]).forEach(colorAndPosition => gradientColor.addColor(Color.fromJSON(colorAndPosition), colorAndPosition["position"]));
    return gradientColor;
  }

  /**
   * Pushes a gradient color in the gradient color history (if not already
   * present)
   *
   * @param color The gradient color
   */
  static  pushHistory(color) {
    let index = Z4GradientColor.history.findIndex(element => JSON.stringify(element.toJSON()) === JSON.stringify(color.toJSON()));
    if (index !== -1) {
      Z4GradientColor.history.splice(index, 1);
    }
    Z4GradientColor.history.unshift(color);
    Z4GradientColor.history.splice(48);
  }

  /**
   * Returns the gradient color history
   *
   * @return The gradient color history
   */
  static  getHistory() {
    return Z4GradientColor.history.map(color => color);
  }

  /**
   * Resets the gradient color history
   */
  static  resetHistory() {
    Z4GradientColor.history.length = 0;
  }
}
