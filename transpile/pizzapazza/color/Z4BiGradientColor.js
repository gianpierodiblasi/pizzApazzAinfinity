/**
 * The bidimensional gradient color (a bidimensional gradient between four or
 * more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColor extends Z4AbstractGradientColor {

   ripple = 0.0;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.addColor(new Z4GradientColor(), 0);
    this.addColor(new Z4GradientColor(), 1);
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
   * @param rippleGradient The ripple of each gradient color (in the range
   * [0,1])
   * @param rippleBiGradient The ripple (in the range [0,1])
   */
   setRipple(rippleGradient, rippleBiGradient) {
    this.colors.forEach(gradientColor => gradientColor.setRipple(rippleGradient));
    this.ripple = rippleBiGradient;
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
      let before = this.colors[index - 1];
      let after = this.colors[index];
      let gradientColor = new Z4GradientColor();
      gradientColor.setRipple(before.getRipple());
      before.colors.forEach((beforeColor, idx, array) => {
        let beforePosition = before.colorPositions[idx];
        let afterColor = after.getColorAt(beforePosition, false);
        this.addInGradientColor(gradientColor, beforeColor, afterColor, div, beforePosition);
      });
      after.colors.forEach((afterColor, idx, array) => {
        let afterPosition = after.colorPositions[idx];
        if (gradientColor.colorPositions.findIndex(pos => pos === afterPosition) === -1) {
          let beforeColor = before.getColorAt(afterPosition, false);
          this.addInGradientColor(gradientColor, beforeColor, afterColor, div, afterPosition);
        }
      });
      return gradientColor;
    }
  }

   addInGradientColor(gradientColor, beforeColor, afterColor, div, position) {
    gradientColor.addColor(new Color(parseInt((afterColor.red - beforeColor.red) * div + beforeColor.red), parseInt((afterColor.green - beforeColor.green) * div + beforeColor.green), parseInt((afterColor.blue - beforeColor.blue) * div + beforeColor.blue), parseInt((afterColor.alpha - beforeColor.alpha) * div + beforeColor.alpha)), position);
  }

   toJSON() {
    let json = new Object();
    json["ripple"] = this.ripple;
    json["colorsAndPositions"] = this.colors.map((color, index, array) => {
      let jsonColor = new Object();
      jsonColor["gradientColor"] = color.toJSON();
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
    let gradientColor = new Z4BiGradientColor();
    gradientColor.setRipple(json["ripple"], 0);
    (json["colorsAndPositions"]).forEach(colorAndPosition => gradientColor.addColor(Z4GradientColor.fromJSON(colorAndPosition["gradientColor"]), colorAndPosition["position"]));
    return gradientColor;
  }
}
