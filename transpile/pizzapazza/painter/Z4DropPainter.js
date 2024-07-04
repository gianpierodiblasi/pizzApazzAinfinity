/**
 * The painter of drops
 *
 * @author gianpiero.diblasi
 */
class Z4DropPainter extends Z4Painter {

   dropPainterType = null;

   radius = null;

   intensity = 0;

   gaussianCorrection = 0;

  /**
   * Creates the object
   *
   * @param dropPainterType The type of Z4DropPainter
   * @param radius The radius
   * @param intensity The intensity
   * @param gaussianCorrection The gaussian correction
   */
  constructor(dropPainterType, radius, intensity, gaussianCorrection) {
    super();
    this.dropPainterType = dropPainterType;
    this.radius = radius;
    this.intensity = intensity;
    this.gaussianCorrection = gaussianCorrection;
  }

   getType() {
    return Z4PainterType.DROP;
  }

  /**
   * Returns the type of Z4DropPainter
   *
   * @return The type of Z4DropPainter
   */
   getDropPainterType() {
    return this.dropPainterType;
  }

  /**
   * Returns the radius
   *
   * @return The radius
   */
   getRadius() {
    return this.radius;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
   getIntensity() {
    return this.intensity;
  }

  /**
   * Returns the gaussian correction
   *
   * @return The gaussian correction
   */
   getGaussianCorrection() {
    return this.gaussianCorrection;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentRadius = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.radius.getConstant().getValue());
      this.drawBounds(context, currentRadius);
    } else {
      let currentRadius = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.radius.next());
      if (currentRadius > 0) {
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawWithColors(context, currentRadius, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, currentRadius, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, currentRadius, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, currentRadius, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawWithColors(context, currentRadius, spatioTemporalColor, gradientColor, color, lighting) {
    let val = currentRadius * this.intensity / 2;
    for (let t = 0; t < val; t++) {
      let r = currentRadius * Z4Math.randomCorrected(this.gaussianCorrection / 10.0);
      if (color && lighting === Z4Lighting.NONE) {
        this.drawPath(context, r, color);
      } else {
        let c = color;
        if (spatioTemporalColor) {
          c = spatioTemporalColor.getColorAt(-1, r / currentRadius);
        } else if (gradientColor) {
          c = gradientColor.getColorAt(r / currentRadius, true);
        }
        if (lighting === Z4Lighting.NONE) {
          this.drawPath(context, r, c);
        } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
          this.drawPath(context, r, c.lighted(r / currentRadius));
        } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
          this.drawPath(context, r, c.darkened(r / currentRadius));
        } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
          this.drawPath(context, r, c.lighted(1 - r / currentRadius));
        } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
          this.drawPath(context, r, c.darkened(1 - r / currentRadius));
        }
      }
    }
  }

   drawPath(context, radius, color) {
    context.save();
    context.fillStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    context.strokeStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    let alfa = Math.random() * Z4Math.TWO_PI;
    let rX = radius * Math.cos(alfa);
    let rY = radius * Math.sin(alfa);
    context.beginPath();
    if (this.dropPainterType === Z4DropPainterType.THOUSAND_POINTS) {
      context.arc(rX, rY, 1, 0, Z4Math.TWO_PI);
      context.fill();
    } else if (this.dropPainterType === Z4DropPainterType.THOUSAND_LINES) {
      context.moveTo(rX + Z4Math.SQRT_OF_2, rY);
      context.lineTo(rX - Z4Math.SQRT_OF_2, rY);
      context.stroke();
    } else if (this.dropPainterType === Z4DropPainterType.THOUSAND_AREAS) {
      context.arc(rX, rY, 2, 0, Z4Math.TWO_PI);
      context.fill();
    }
    context.restore();
  }

   drawBounds(context, currentRadius) {
    context.save();
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.beginPath();
    context.arc(0, 0, currentRadius, 0, Z4Math.TWO_PI);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.arc(1, 1, currentRadius, 0, Z4Math.TWO_PI);
    context.stroke();
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["dropPainterType"] = this.dropPainterType;
    json["radius"] = this.radius.toJSON();
    json["intensity"] = this.intensity;
    json["gaussianCorrection"] = this.gaussianCorrection;
    return json;
  }

  /**
   * Creates a Z4DropPainter from a JSON object
   *
   * @param json The JSON object
   * @return the drop painter
   */
  static  fromJSON(json) {
    return new Z4DropPainter(json["dropPainterType"], Z4FancifulValue.fromJSON(json["radius"]), json["intensity"], json["gaussianCorrection"]);
  }
}
