/**
 * The painter of drops
 *
 * @author gianpiero.diblasi
 */
class Z4DropPainter extends Z4Painter {

   dropPainterType = null;

  // 10
   radius = null;

  // 20
   intensity = 0;

  // 10
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
          this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, currentRadius, drawingPoint.z4Vector.phase, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawWithColors(context, currentRadius, angle, spatioTemporalColor, gradientColor, color, lighting) {
    let val = currentRadius * this.intensity / 2;
    let cos = Z4Math.SQRT_OF_2 * Math.cos(angle);
    let sin = Z4Math.SQRT_OF_2 * Math.sin(angle);
    for (let t = 0; t < val; t++) {
      if (color && lighting === Z4Lighting.NONE) {
      } else {
        let rand = Z4Math.randomCorrected(gaussianCorrection / 10.0);
        if (spatioTemporalColor) {
          color = spatioTemporalColor.getColorAt(-1, rand);
        } else if (gradientColor) {
          color = gradientColor.getColorAt(rand, true);
        }
        if (lighting === Z4Lighting.NONE) {
          this.drawPath(context, currentRadius, rand, cos, sin, color);
        } else if (lighting === Z4Lighting.LIGHTED) {
          this.drawPath(context, currentRadius, rand, cos, sin, color.lighted(rand));
        } else if (lighting === Z4Lighting.DARKENED) {
          this.drawPath(context, currentRadius, rand, cos, sin, color.darkened(rand));
        }
      }
    }
  }

   drawPath(context, currentRadius, rand, cos, sin, color) {
    context.save();
    context.fillStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    let rr = rand * currentRadius;
    let alfa = Math.random() * Z4Math.TWO_PI;
    let rX = rr * Math.cos(alfa);
    let rY = rr * Math.sin(alfa);
    context.beginPath();
    if (this.dropPainterType === Z4DropPainterType.THOUSAND_POINTS) {
      context.arc(rX, rY, 1, 0, Z4Math.TWO_PI);
    } else if (this.dropPainterType === Z4DropPainterType.THOUSAND_LINES) {
      context.moveTo(rX + cos, rY + sin);
      context.lineTo(rX - cos, rY - sin);
    } else if (this.dropPainterType === Z4DropPainterType.THOUSAND_AREAS) {
      context.arc(rX, rY, 2, 0, Z4Math.TWO_PI);
    }
    context.fill();
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
    context.arc(0, 0, currentRadius, 0, Z4Math.TWO_PI);
    context.stroke();
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["dropPainterType"] = this.dropPainterType;
    json["radius"] = this.radius.toJSON();
    json["regular"] = this.intensity;
    json["star"] = this.gaussianCorrection;
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
