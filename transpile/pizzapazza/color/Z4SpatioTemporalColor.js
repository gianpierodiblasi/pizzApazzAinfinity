/**
 * A spatio-temporal color
 *
 * @author gianpiero.diblasi
 */
class Z4SpatioTemporalColor extends Z4JSONable {

   color = null;

   gradientColor = null;

   gradientColorProgression = null;

   biGradientColor = null;

   flatGradientColor = null;

  constructor(color, gradientColor, gradientColorProgression, biGradientColor) {
    this.color = color;
    this.gradientColor = gradientColor;
    this.gradientColorProgression = gradientColorProgression;
    this.biGradientColor = biGradientColor;
    if (color) {
      this.flatGradientColor = new Z4GradientColor();
      this.flatGradientColor.addColor(this.color, 0);
      this.flatGradientColor.addColor(this.color, 1);
    }
  }

  /**
   * Creates a Z4SpatioTemporalColor from a color
   *
   * @param color The color
   * @return the color aggregator
   */
  static  fromColor(color) {
    return new Z4SpatioTemporalColor(color, null, null, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a gradient color
   *
   * @param gradientColor The gradient color
   * @param gradientColorProgression The gradient color progression
   * @return the color aggregator
   */
  static  fromGradientColor(gradientColor, gradientColorProgression) {
    return new Z4SpatioTemporalColor(null, gradientColor, gradientColorProgression, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a bigradient color
   *
   * @param biGradientColor The bigradient color
   * @return the color aggregator
   */
  static  fromBiGradientColor(biGradientColor) {
    return new Z4SpatioTemporalColor(null, null, null, biGradientColor);
  }

  /**
   * Returns a color in a time instant and in a space position
   *
   * @param time The time instant
   * @param space The space position
   * @return The color
   */
   getColorAt(time, space) {
    if (this.color) {
      return this.color;
    } else if (this.gradientColor) {
      return this.gradientColor.getColorAt(space, true);
    } else if (this.biGradientColor) {
      return this.biGradientColor.getColorAt(time, true).getColorAt(space, true);
    } else {
      return null;
    }
  }

  /**
   * Returns a gradient color in a time instant
   *
   * @param time The time instant
   * @return The gradient color
   */
   getGradientColorAt(time) {
    if (this.color) {
      return this.flatGradientColor;
    } else if (this.gradientColor) {
      return this.gradientColor;
    } else if (this.biGradientColor) {
      return this.biGradientColor.getColorAt(time, true);
    } else {
      return null;
    }
  }

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
      json["gradientColorProgression"] = this.gradientColorProgression.toJSON();
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
      return Z4SpatioTemporalColor.fromGradientColor(Z4GradientColor.fromJSON(json["gradientColor"]), Z4GradientColorProgression.fromJSON(json["gradientColorProgression"]));
    } else if (json["biGradientColor"]) {
      return Z4SpatioTemporalColor.fromBiGradientColor(Z4BiGradientColor.fromJSON(json["biGradientColor"]));
    } else {
      return null;
    }
  }
}
