/**
 * The bidimensional gradient color (a bidimensional gradient between four or
 * more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColor extends Z4AbstractGradientColor {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.addColor(new Z4GradientColor(), 0);
    this.addColor(new Z4GradientColor(), 1);
  }

   cloneColor(color) {
    return Z4GradientColor.fromJSON(color.toJSON());
  }

  /**
   * Sets the ripple of each gradient color
   *
   * @param rippleGradient The ripple of each gradient color (in the range
   * [0,1])
   */
   setGradientRipple(rippleGradient) {
    this.colors.forEach(gradientColor => gradientColor.setRipple(rippleGradient));
  }

  /**
   * Returns the ripple of each gradient color
   *
   * @return The ripple of each gradient color (in the range [0,1])
   */
   getGradientRipple() {
    return this.colors[0].getRipple();
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
      let before = this.colors[index - 1];
      let after = this.colors[index];
      let gradientColor = new Z4GradientColor();
      gradientColor.setRipple(this.getGradientRipple());
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
    json["ripple"] = this.getRipple();
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
    gradientColor.setRipple(json["ripple"]);
    (json["colorsAndPositions"]).forEach(colorAndPosition => gradientColor.addColor(Z4GradientColor.fromJSON(colorAndPosition["gradientColor"]), colorAndPosition["position"]));
    return gradientColor;
  }
}
