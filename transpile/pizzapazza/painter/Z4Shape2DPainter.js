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

   path = new Path2D();

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
    if (vertices === -1) {
      this.path.arc(0, 0, 0.5, 0, Z4Math.TWO_PI);
    } else if (star) {
      Z4Math.getStarVertices(vertices).forEach((point, index, array) => {
        if (index) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    } else {
      Z4Math.getPolygonVertices(vertices).forEach((point, index, array) => {
        if (index) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    }
    this.path.closePath();
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
    if (drawingPoint.drawBounds) {
      let scaleW = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? 2 * drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      let scaleH = this.regular ? scaleW : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? 2 * drawingPoint.z4Vector.module : this.height.getConstant().getValue());
      this.drawBounds(context, scaleW, scaleH);
    } else {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? 2 * drawingPoint.z4Vector.module : this.width.next());
      let currentHeight = this.regular ? currentWidth : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? 2 * drawingPoint.z4Vector.module : this.height.next());
      if (currentWidth > 0 && currentHeight > 0) {
        let currentShadowShiftX = this.shadowShiftX.next();
        let currentShadowShiftY = this.shadowShiftY.next();
        let currentBorderWidth = this.borderWidth.next();
        let currentBorderHeight = this.borderHeight.next();
        if (currentShadowShiftX || currentShadowShiftY) {
          context.save();
          context.translate(currentShadowShiftX, currentShadowShiftY);
          this.drawPath(context, currentWidth + (currentBorderWidth > 0 ? currentBorderWidth : 0), currentHeight + (currentBorderHeight > 0 ? currentBorderHeight : 0), this.shadowColor);
          context.restore();
        }
        if (currentBorderWidth > 0 || currentBorderHeight > 0) {
          context.save();
          this.drawPath(context, currentWidth + currentBorderWidth, currentHeight + currentBorderHeight, this.borderColor);
          context.restore();
        }
        let lighting = progression.getLighting();
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(0, 0);
          if (lighting === Z4Lighting.NONE) {
            this.drawPath(context, currentWidth, currentHeight, color);
          } else {
            let currentSize = Math.max(currentWidth, currentHeight);
            for (let scale = currentSize; scale > 0; scale--) {
              if (lighting === Z4Lighting.LIGHTED) {
                this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.lighted(scale / currentSize));
              } else if (lighting === Z4Lighting.DARKENED) {
                this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.darkened(scale / currentSize));
              }
            }
          }
        } else if (spatioTemporalColor.isGradientColor()) {
        } else if (spatioTemporalColor.isBiGradientColor()) {
        }
        // if (drawingPoint.temporalPosition == -1) {
        // double currentSize = Math.max(currentWidth, currentHeight);
        // 
        // for (double scale = currentSize; scale > 0; scale--) {
        // this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, gradientColor.getZ4ColorAt(scale / currentSize, true, true));
        // }
      }
    }
  }

   drawPath(context, scaleW, scaleH, color) {
    context.save();
    context.scale(scaleW, scaleH);
    context.fillStyle = Z4Constants.getStyle(color.getARGB_HEX());
    context.fill(this.path);
    context.restore();
  }

   drawBounds(context, scaleW, scaleH) {
    context.save();
    context.scale(scaleW, scaleH);
    context.lineWidth = 1 / Math.min(scaleW, scaleH);
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.stroke(this.path);
    context.strokeStyle = Z4Constants.getStyle("black");
    context.translate(1 / scaleW, 1 / scaleH);
    context.stroke(this.path);
    context.restore();
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
    let jsonColor = new Object();
    jsonColor["red"] = this.shadowColor.red;
    jsonColor["green"] = this.shadowColor.green;
    jsonColor["blue"] = this.shadowColor.blue;
    jsonColor["alpha"] = this.shadowColor.alpha;
    json["shadowColor"] = jsonColor;
    json["borderWidth"] = this.borderWidth.toJSON();
    json["borderHeight"] = this.borderHeight.toJSON();
    jsonColor = new Object();
    jsonColor["red"] = this.borderColor.red;
    jsonColor["green"] = this.borderColor.green;
    jsonColor["blue"] = this.borderColor.blue;
    jsonColor["alpha"] = this.borderColor.alpha;
    json["borderColor"] = jsonColor;
    return json;
  }

  /**
   * Creates a Z4Shape2DPainter from a JSON object
   *
   * @param json The JSON object
   * @return the shape 2D painter
   */
  static  fromJSON(json) {
    let jsonColor = json["shadowColor"];
    let shadowColor = new Color(jsonColor["red"], jsonColor["green"], jsonColor["blue"], jsonColor["alpha"]);
    jsonColor = json["borderColor"];
    let borderColor = new Color(jsonColor["red"], jsonColor["green"], jsonColor["blue"], jsonColor["alpha"]);
    return new Z4Shape2DPainter(Z4FancifulValue.fromJSON(json["width"]), Z4FancifulValue.fromJSON(json["height"]), json["regular"], json["star"], json["vertices"], Z4FancifulValue.fromJSON(json["shadowShiftX"]), Z4FancifulValue.fromJSON(json["shadowShiftY"]), shadowColor, Z4FancifulValue.fromJSON(json["borderWidth"]), Z4FancifulValue.fromJSON(json["borderHeight"]), borderColor);
  }
}
