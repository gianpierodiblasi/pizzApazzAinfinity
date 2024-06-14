/**
 * A spatio-temporal color
 *
 * @author gianpiero.diblasi
 */
class Z4SpatioTemporalColor extends Z4JSONable {

   color = null;

   gradientColor = null;

   biGradientColor = null;

  /**
   * Creates a Z4SpatioTemporalColor from a color
   *
   * @param color The color
   * @return the color aggregator
   */
  static  fromColor(color) {
    return new Z4SpatioTemporalColor(color, null, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a gradient color
   *
   * @param gradientColor The gradient color
   * @return the color aggregator
   */
  static  fromGradientColor(gradientColor) {
    return new Z4SpatioTemporalColor(null, gradientColor, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a bigradient color
   *
   * @param biGradientColor The bigradient color
   * @return the color aggregator
   */
  static  fromBiGradientColor(biGradientColor) {
    return new Z4SpatioTemporalColor(null, null, biGradientColor);
  }

  constructor(color, gradientColor, biGradientColor) {
    super();
    this.color = color;
    this.gradientColor = gradientColor;
    this.biGradientColor = biGradientColor;
  }

  /**
   * Checks if this spatio-temporal color is a (flat) color
   *
   * @return true if this spatio-temporal color is a (flat) color, false
   * otherwise
   */
   isColor() {
    return !!(this.color);
  }

  /**
   * Checks if this spatio-temporal color is a gradient color
   *
   * @return true if this spatio-temporal color is a gradient color, false
   * otherwise
   */
   isGradientColor() {
    return !!(this.gradientColor);
  }

  /**
   * Checks if this spatio-temporal color is a bigradient color
   *
   * @return true if this spatio-temporal color is a bigradient color, false
   * otherwise
   */
   isBiGradientColor() {
    return !!(this.biGradientColor);
  }

  /**
   * Returns a color in a time instant and in a space position
   *
   * @param time The time instant
   * @param space The space position
   * @return The color
   */
  // public Color getColorAt(double time, double space) {
  // if ($exists(this.color)) {
  // return this.color;
  // } else if ($exists(this.gradientColor)) {
  // return this.gradientColor.getColorAt(space, true);
  // } else if ($exists(this.biGradientColor)) {
  // return this.biGradientColor.getColorAt(time, true).getColorAt(space, true);
  // } else {
  // return null;
  // }
  // }
  /**
   * Returns a gradient color in a time instant
   *
   * @param time The time instant
   * @return The gradient color
   */
  // public Z4GradientColor getGradientColorAt(double time) {
  // if ($exists(this.color)) {
  // return this.flatGradientColor;
  // } else if ($exists(this.gradientColor)) {
  // return this.gradientColor;
  // } else if ($exists(this.biGradientColor)) {
  // return this.biGradientColor.getColorAt(time, true);
  // } else {
  // return null;
  // }
  // }
   toJSON() {
    let json = new Object();
    if (this.color) {
      let jsonColor = new Object();
      jsonColor["red"] = color.red;
      jsonColor["green"] = color.green;
      jsonColor["blue"] = color.blue;
      jsonColor["alpha"] = color.alpha;
      json["color"] = jsonColor;
    } else if (this.gradientColor) {
      json["gradientColor"] = this.gradientColor.toJSON();
    } else if (this.biGradientColor) {
      json["biGradientColor"] = this.biGradientColor.toJSON();
    }
    return json;
  }

  /**
   * Creates a Z4SpatioTemporalColor from a JSON object
   *
   * @param json The JSON object
   * @return the color
   */
  static  fromJSON(json) {
    if (json["color"]) {
      let jsonColor = json["color"];
      return Z4SpatioTemporalColor.fromColor(new Color(jsonColor["red"], jsonColor["green"], jsonColor["blue"], jsonColor["alpha"]));
    } else if (json["gradientColor"]) {
      return Z4SpatioTemporalColor.fromGradientColor(Z4GradientColor.fromJSON(json["gradientColor"]));
    } else if (json["biGradientColor"]) {
      return Z4SpatioTemporalColor.fromBiGradientColor(Z4BiGradientColor.fromJSON(json["biGradientColor"]));
    } else {
      return null;
    }
  }
}
