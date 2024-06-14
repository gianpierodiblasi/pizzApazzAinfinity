package pizzapazza.color;

import javascript.awt.Color;
import pizzapazza.util.Z4JSONable;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * A spatio-temporal color
 *
 * @author gianpiero.diblasi
 */
public class Z4SpatioTemporalColor implements Z4JSONable {

  private final Color color;
  private final Z4GradientColor gradientColor;
  private final Z4BiGradientColor biGradientColor;

  /**
   * Creates a Z4SpatioTemporalColor from a color
   *
   * @param color The color
   * @return the color aggregator
   */
  public static Z4SpatioTemporalColor fromColor(Color color) {
    return new Z4SpatioTemporalColor(color, null, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a gradient color
   *
   * @param gradientColor The gradient color
   * @return the color aggregator
   */
  public static Z4SpatioTemporalColor fromGradientColor(Z4GradientColor gradientColor) {
    return new Z4SpatioTemporalColor(null, gradientColor, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a bigradient color
   *
   * @param biGradientColor The bigradient color
   * @return the color aggregator
   */
  public static Z4SpatioTemporalColor fromBiGradientColor(Z4BiGradientColor biGradientColor) {
    return new Z4SpatioTemporalColor(null, null, biGradientColor);
  }

  private Z4SpatioTemporalColor(Color color, Z4GradientColor gradientColor, Z4BiGradientColor biGradientColor) {
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
  public boolean isColor() {
    return $exists(this.color);
  }

  /**
   * Checks if this spatio-temporal color is a gradient color
   *
   * @return true if this spatio-temporal color is a gradient color, false
   * otherwise
   */
  public boolean isGradientColor() {
    return $exists(this.gradientColor);
  }

  /**
   * Checks if this spatio-temporal color is a bigradient color
   *
   * @return true if this spatio-temporal color is a bigradient color, false
   * otherwise
   */
  public boolean isBiGradientColor() {
    return $exists(this.biGradientColor);
  }

  /**
   * Returns a color in a time instant and in a space position
   *
   * @param time The time instant
   * @param space The space position
   * @return The color
   */
//  public Color getColorAt(double time, double space) {
//    if ($exists(this.color)) {
//      return this.color;
//    } else if ($exists(this.gradientColor)) {
//      return this.gradientColor.getColorAt(space, true);
//    } else if ($exists(this.biGradientColor)) {
//      return this.biGradientColor.getColorAt(time, true).getColorAt(space, true);
//    } else {
//      return null;
//    }
//  }
  /**
   * Returns a gradient color in a time instant
   *
   * @param time The time instant
   * @return The gradient color
   */
//  public Z4GradientColor getGradientColorAt(double time) {
//    if ($exists(this.color)) {
//      return this.flatGradientColor;
//    } else if ($exists(this.gradientColor)) {
//      return this.gradientColor;
//    } else if ($exists(this.biGradientColor)) {
//      return this.biGradientColor.getColorAt(time, true);
//    } else {
//      return null;
//    }
//  }
  @Override
  public $Object toJSON() {
    $Object json = new $Object();
    if ($exists(this.color)) {
      $Object jsonColor = new $Object();
      jsonColor.$set("red", color.red);
      jsonColor.$set("green", color.green);
      jsonColor.$set("blue", color.blue);
      jsonColor.$set("alpha", color.alpha);
      json.$set("color", jsonColor);
    } else if ($exists(this.gradientColor)) {
      json.$set("gradientColor", this.gradientColor.toJSON());
    } else if ($exists(this.biGradientColor)) {
      json.$set("biGradientColor", this.biGradientColor.toJSON());
    }
    return json;
  }

  /**
   * Creates a Z4SpatioTemporalColor from a JSON object
   *
   * @param json The JSON object
   * @return the color
   */
  public static Z4SpatioTemporalColor fromJSON($Object json) {
    if ($exists(json.$get("color"))) {
      $Object jsonColor = json.$get("color");
      return Z4SpatioTemporalColor.fromColor(new Color(jsonColor.$get("red"), jsonColor.$get("green"), jsonColor.$get("blue"), jsonColor.$get("alpha")));
    } else if ($exists(json.$get("gradientColor"))) {
      return Z4SpatioTemporalColor.fromGradientColor(Z4GradientColor.fromJSON(json.$get("gradientColor")));
    } else if ($exists(json.$get("biGradientColor"))) {
      return Z4SpatioTemporalColor.fromBiGradientColor(Z4BiGradientColor.fromJSON(json.$get("biGradientColor")));
    } else {
      return null;
    }
  }
}
