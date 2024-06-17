/**
 * The painter of 2D shapes
 *
 * @author gianpiero.diblasi
 */
class Z4Shape2DPainter extends Z4Painter {

   width = null;

   height = null;

   regular = false;

   star = false;

   vertices = 0;

   shadowShiftX = null;

   shadowShiftY = null;

   shadowColor = null;

   borderWidth = null;

   borderHeight = null;

   borderColor = null;

  /**
   * Creates the object
   *
   * @param width The width
   * @param height The height
   * @param regular true if the shape is regular (width = height), false
   * otherwise
   * @param star true if the shape is a star, false otherwise
   * @param vertices The number of vertices, -1 for an ellipse
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderWidth The border width
   * @param borderHeight The border height
   * @param borderColor The border color
   */
  constructor(width, height, regular, star, vertices, shadowShiftX, shadowShiftY, shadowColor, borderWidth, borderHeight, borderColor) {
    this.width = width;
    this.height = height;
    this.regular = regular;
    this.star = star;
    this.vertices = vertices;
    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;
    this.borderWidth = borderWidth;
    this.borderHeight = borderHeight;
    this.borderColor = borderColor;
  }

   getType() {
    return Z4PainterType.SHAPE_2D;
  }

  /**
   * Returns the width
   *
   * @return The width
   */
   getWidth() {
    return this.width;
  }

  /**
   * Returns the height
   *
   * @return The height
   */
   getHeight() {
    return this.height;
  }

  /**
   * Checks if the shape is regular (width = height)
   *
   * @return true if the shape is regular (width = height), false otherwise
   */
   isRegular() {
    return this.regular;
  }

  /**
   * Checks if the shape is a star
   *
   * @return true if the shape is a star, false otherwise
   */
   isStar() {
    return this.star;
  }

  /**
   * Returns the number of vertices, -1 for an ellipse
   *
   * @return The number of vertices, -1 for an ellipse
   */
   getVertices() {
    return this.vertices;
  }

  /**
   * Returns the X shadow shift
   *
   * @return The X shadow shift
   */
   getShadowShiftX() {
    return this.shadowShiftX;
  }

  /**
   * Returns the Y shadow shift
   *
   * @return The Y shadow shift
   */
   getShadowShiftY() {
    return this.shadowShiftY;
  }

  /**
   * Returns the shadow color
   *
   * @return The shadow color
   */
   getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border width
   *
   * @return The border width
   */
   getBorderWidth() {
    return this.borderWidth;
  }

  /**
   * Returns the border height
   *
   * @return The border height
   */
   getBorderHeight() {
    return this.borderHeight;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
   getBorderColor() {
    return this.borderColor;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
  }

   toJSON() {
    let json = super.toJSON();
    json["width"] = this.width.toJSON();
    json["height"] = this.height.toJSON();
    json["regular"] = this.regular;
    json["star"] = this.star;
    json["vertices"] = this.vertices;
    json["shadowShiftX"] = this.shadowShiftX.toJSON();
    json["shadowShiftY"] = this.shadowShiftY.toJSON();
    if (this.shadowColor) {
      let jsonColor = new Object();
      jsonColor["red"] = this.shadowColor.red;
      jsonColor["green"] = this.shadowColor.green;
      jsonColor["blue"] = this.shadowColor.blue;
      jsonColor["alpha"] = this.shadowColor.alpha;
      json["shadowColor"] = jsonColor;
    }
    json["borderWidth"] = this.borderWidth.toJSON();
    json["borderHeight"] = this.borderHeight.toJSON();
    if (this.borderColor) {
      let jsonColor = new Object();
      jsonColor["red"] = this.borderColor.red;
      jsonColor["green"] = this.borderColor.green;
      jsonColor["blue"] = this.borderColor.blue;
      jsonColor["alpha"] = this.borderColor.alpha;
      json["borderColor"] = jsonColor;
    }
    return json;
  }

  /**
   * Creates a Z4Shape2DPainter from a JSON object
   *
   * @param json The JSON object
   * @return the shape 2D painter
   */
  static  fromJSON(json) {
    let shadowColor = null;
    if (json["shadowColor"]) {
      let jsonColor = json["shadowColor"];
      shadowColor = new Color(jsonColor["red"], jsonColor["green"], jsonColor["blue"], jsonColor["alpha"]);
    }
    let borderColor = null;
    if (json["borderColor"]) {
      let jsonColor = json["borderColor"];
      shadowColor = new Color(jsonColor["red"], jsonColor["green"], jsonColor["blue"], jsonColor["alpha"]);
    }
    return new Z4Shape2DPainter(Z4FancifulValue.fromJSON(json["width"]), Z4FancifulValue.fromJSON(json["height"]), json["regular"], json["star"], json["vertices"], Z4FancifulValue.fromJSON(json["shadowShiftX"]), Z4FancifulValue.fromJSON(json["shadowShiftY"]), shadowColor, Z4FancifulValue.fromJSON(json["borderWidth"]), Z4FancifulValue.fromJSON(json["borderHeight"]), borderColor);
  }
}
