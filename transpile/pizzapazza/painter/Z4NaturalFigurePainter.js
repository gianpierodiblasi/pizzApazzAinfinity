/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainter extends Z4Painter {

   naturalFigurePainterType = null;

   controlPointClosure = null;

   size = null;

   internalAngle1 = null;

   externalAngle1 = null;

   internalAngle2 = null;

   externalAngle2 = null;

   internalTension1 = null;

   externalTension1 = null;

   internalTension2 = null;

   externalTension2 = null;

  // Frastagliatura
   indentation = 0;

   externalForceAngle = null;

   externalForceTension = null;

   shadowShiftX = null;

   shadowShiftY = null;

   shadowColor = null;

   borderSize = null;

   borderColor = null;

   path1 = null;

   path2 = null;

   c1e = null;

   c1i = null;

   c2e = null;

   c2i = null;

   pF = null;

   pathForShadowBorder = null;

  /**
   * Creates the object
   *
   * @param naturalFigurePainterType The type of Z4NaturalFigurePainter
   * @param controlPointClosure The control point closure of
   * Z4NaturalFigurePainter
   * @param size The size
   * @param internalAngle1 The angle of the first internal control point
   * @param externalAngle1 The angle of the first external control point
   * @param internalAngle2 The angle of the second internal control point
   * @param externalAngle2 The angle of the second external control point
   * @param internalTension1 The tension of the first internal control point
   * @param externalTension1 The tension of the first external control point
   * @param internalTension2 The tension of the second internal control point
   * @param externalTension2 The tension of the second external control point
   * @param indentation The indentation
   * @param externalForceAngle The angle of the external force
   * @param externalForceTension The tension of the external force
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderSize The border size
   * @param borderColor The border color
   */
  constructor(naturalFigurePainterType, controlPointClosure, size, internalAngle1, externalAngle1, internalAngle2, externalAngle2, internalTension1, externalTension1, internalTension2, externalTension2, indentation, externalForceAngle, externalForceTension, shadowShiftX, shadowShiftY, shadowColor, borderSize, borderColor) {
    super();
    this.naturalFigurePainterType = naturalFigurePainterType;
    this.controlPointClosure = controlPointClosure;
    this.size = size;
    this.internalAngle1 = internalAngle1;
    this.externalAngle1 = externalAngle1;
    this.internalAngle2 = internalAngle2;
    this.externalAngle2 = externalAngle2;
    this.internalTension1 = internalTension1;
    this.externalTension1 = externalTension1;
    this.internalTension2 = internalTension2;
    this.externalTension2 = externalTension2;
    this.indentation = indentation;
    this.externalForceAngle = externalForceAngle;
    this.externalForceTension = externalForceTension;
    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;
    this.borderSize = borderSize;
    this.borderColor = borderColor;
  }

   getType() {
    return Z4PainterType.NATURAL_FIGURE;
  }

  /**
   * Returns the type of Z4NaturalFigurePainter
   *
   * @return The type of Z4NaturalFigurePainter
   */
   getNaturalFigurePainterType() {
    return this.naturalFigurePainterType;
  }

  /**
   * Returns the control point closure of Z4NaturalFigurePainter
   *
   * @return The control point closure of Z4NaturalFigurePainter
   */
   getControlPointClosure() {
    return this.controlPointClosure;
  }

  /**
   * Returns the size
   *
   * @return The size
   */
   getSize() {
    return this.size;
  }

  /**
   * Returns the angle of the first internal control point
   *
   * @return The angle of the first internal control point
   */
   getInternalAngle1() {
    return this.internalAngle1;
  }

  /**
   * Returns the angle of the first external control point
   *
   * @return The angle of the first external control point
   */
   getExternalAngle1() {
    return this.externalAngle1;
  }

  /**
   * Returns the angle of the second internal control point
   *
   * @return The angle of the second internal control point
   */
   getInternalAngle2() {
    return this.internalAngle2;
  }

  /**
   * Returns the angle of the second external control point
   *
   * @return The angle of the second external control point
   */
   getExternalAngle2() {
    return this.externalAngle2;
  }

  /**
   * Returns the tension of the first internal control point
   *
   * @return The tension of the first internal control point
   */
   getInternalTension1() {
    return this.internalTension1;
  }

  /**
   * Returns the tension of the first external control point
   *
   * @return The tension of the first external control point
   */
   getExternalTension1() {
    return this.externalTension1;
  }

  /**
   * Returns the tension of the second internal control point
   *
   * @return The tension of the second internal control point
   */
   getInternalTension2() {
    return this.internalTension2;
  }

  /**
   * Returns the tension of the second external control point
   *
   * @return The tension of the second external control point
   */
   getExternalTension2() {
    return this.externalTension2;
  }

  /**
   * Returns the indentation
   *
   * @return The indentation
   */
   getIndentation() {
    return this.indentation;
  }

  /**
   * Returns the angle of the external force
   *
   * @return The angle of the external force
   */
   getExternalForceAngle() {
    return this.externalForceAngle;
  }

  /**
   * Returns the tension of the external force
   *
   * @return The tension of the external force
   */
   getExternalForceTension() {
    return this.externalForceTension;
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
   * Returns the border size
   *
   * @return The border size
   */
   getBorderSize() {
    return this.borderSize;
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
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.getConstant().getValue());
      let originalAngle = drawingPoint.z4Vector.phase;
      let currentExternalForceAngle = this.externalForceAngle.getConstant().getValue();
      let currentExternalForceTension = this.externalForceTension.getConstant().getValue();
      drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
      this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);
      this.drawBounds(context);
    } else {
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.next());
      if (currentSize > 0) {
        let originalAngle = drawingPoint.z4Vector.phase;
        let currentExternalForceAngle = this.externalForceAngle.next();
        let currentExternalForceTension = this.externalForceTension.next();
        drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
        this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);
        this.c1e = this.setControlPoint(0, Z4Math.deg2rad(this.externalAngle1.next()), 1, this.externalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c1i = this.setControlPoint(0, Z4Math.deg2rad(this.internalAngle1.next()), -1, this.internalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2e = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.externalAngle2.next()), -1, this.externalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2i = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.internalAngle2.next()), 1, this.internalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.evalPointClosure(drawingPoint);
        let currentShadowShiftX = this.shadowShiftX.next();
        let currentShadowShiftY = this.shadowShiftY.next();
        let currentBorderSize = this.borderSize.next();
        let shadowOrBorder = currentShadowShiftX || currentShadowShiftY || currentBorderSize > 0;
        if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_0) {
          this.type0(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_1) {
          this.type1(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_2) {
          this.type2(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_3) {
          this.type3(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
        }
      }
    }
  }

   drawBounds(context) {
    context.save();
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.pF.x, this.pF.y);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle("black");
    context.translate(1, 1);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.pF.x, this.pF.y);
    context.stroke();
    context.restore();
  }

   evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension) {
    if (currentExternalForceTension > 0) {
      let angle = Z4Math.deg2rad(currentExternalForceAngle) - originalAngle;
      let tension = drawingPoint.intensity * currentExternalForceTension;
      this.pF = new Z4Point(drawingPoint.z4Vector.x + tension * Math.cos(angle), drawingPoint.z4Vector.y + tension * Math.sin(angle));
    } else {
      this.pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    }
  }

   setControlPoint(phase, angle, angleSign, tension, intensity, side) {
    return Z4Math.rotate(intensity * tension, 0, phase + angleSign * side * angle);
  }

   evalPointClosure(drawingPoint) {
    if (this.controlPointClosure === Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0) {
      this.c1e = new Z4Point(this.c1e.x + drawingPoint.z4Vector.x, this.c1e.y + drawingPoint.z4Vector.y);
      this.c1i = new Z4Point(this.c1i.x + drawingPoint.z4Vector.x, this.c1i.y + drawingPoint.z4Vector.y);
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure === Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1) {
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure === Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2) {
    }
  }

   type0(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.c2i.x, this.c2i.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
      this.pathForShadowBorder.bezierCurveTo(this.c2i.x, this.c2i.y, this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }
    this.drawFigure(context, drawingPoint, this.c1e, this.c2e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
  }

   type1(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    this.path1 = this.findControlPointPath(this.c1i.x, this.c1i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c1i.x, this.c1i.y, this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, this.c1i, this.c2i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, c1e, c2e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
  }

   type2(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    this.path1 = this.findControlPointPath(this.c2i.x, this.c2i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c2i.x, this.c2i.y, this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, c2i, c1i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
    this.path1 = this.findControlPointPath(this.c2e.x, this.c2e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c2e.x, this.c2e.y, this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, c2e, c1e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
  }

   type3(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.c2e.x, this.c2e.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
      this.pathForShadowBorder.bezierCurveTo(this.c2e.x, this.c2e.y, this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }
    this.drawFigure(context, drawingPoint, c1e, c2i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
  }

   findControlPointPath(p1x, p1y, p2x, p2y) {
    let helpVector = Z4Vector.fromPoints(p1x, p1y, p2x, p2y);
    return Z4Math.rotate(helpVector.module, 0, helpVector.phase);
  }

   drawFigure(context, drawingPoint, c1, c2, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    if (currentShadowShiftX || currentShadowShiftY) {
      this.drawShadow(context, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
    }
    if (currentBorderSize > 0) {
      this.drawBorder(context, currentBorderSize);
    }
    if (spatioTemporalColor.isColor()) {
      let color = spatioTemporalColor.getColorAt(-1, -1);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting());
    } else if (spatioTemporalColor.isGradientColor()) {
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
        this.drawFigureWithColors(context, drawingPoint, c1, c2, spatioTemporalColor, null, null, progression.getLighting());
      } else {
        let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
        this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting());
      }
    } else if (spatioTemporalColor.isBiGradientColor()) {
      let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, gradientColor, null, progression.getLighting());
    }
  }

   drawFigureWithColors(context, drawingPoint, c1, c2, spatioTemporalColor, gradientColor, color, lighting) {
    let length = Math.max(Z4Math.distance(this.path1.x, this.path1.y, 0, 0), Z4Math.distance(this.path2.x, this.path2.y, 0, 0));
    for (let i = 0; i < length; i += 3) {
      let val = i / length;
      let c = null;
      if (color && lighting === Z4Lighting.NONE) {
        c = color;
      } else {
        if (spatioTemporalColor) {
          c = spatioTemporalColor.getColorAt(-1, val);
        } else if (gradientColor) {
          c = gradientColor.getColorAt(val, true);
        }
      }
      if (lighting === Z4Lighting.NONE) {
      } else if (lighting === Z4Lighting.LIGHTED) {
        c = c.lighted(val);
      } else if (lighting === Z4Lighting.DARKENED) {
        c = c.darkened(val);
      }
      let indentationValue = this.indentation * Math.random();
      let indentationAngle = Z4Math.TWO_PI * Math.random();
      let indentX = indentationValue > 0 ? indentationValue * Math.cos(indentationAngle) : 0;
      let indentY = indentationValue > 0 ? indentationValue * Math.sin(indentationAngle) : 0;
      context.save();
      context.lineWidth = 3;
      context.strokeStyle = Z4Constants.getStyle(c.getRGBA_HEX());
      context.beginPath();
      context.moveTo(drawingPoint.z4Vector.x0, 0);
      context.bezierCurveTo(c1.x + this.path1.x * val, c1.y + this.path1.y * val, c2.x + this.path2.x * val, c2.y + this.path2.y * val, this.pF.x + indentX, this.pF.y + indentY);
      context.stroke();
      context.restore();
    }
  }

   drawShadow(context, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    context.save();
    context.translate(currentShadowShiftX, currentShadowShiftY);
    if (currentBorderSize > 0) {
      context.lineWidth = currentBorderSize;
      context.strokeStyle = Z4Constants.getStyle(this.shadowColor.getRGBA_HEX());
      context.stroke(this.pathForShadowBorder);
    }
    context.fillStyle = Z4Constants.getStyle(this.shadowColor.getRGBA_HEX());
    context.fill(this.pathForShadowBorder);
    context.restore();
  }

   drawBorder(context, currentBorderSize) {
    context.save();
    context.lineWidth = currentBorderSize;
    context.strokeStyle = Z4Constants.getStyle(this.borderColor.getRGBA_HEX());
    context.stroke(this.pathForShadowBorder);
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["naturalFigurePainterType"] = this.naturalFigurePainterType;
    json["controlPointClosure"] = this.controlPointClosure;
    json["size"] = this.size.toJSON();
    json["internalAngle1"] = this.internalAngle1.toJSON();
    json["externalAngle1"] = this.externalAngle1.toJSON();
    json["internalAngle2"] = this.internalAngle2.toJSON();
    json["externalAngle2"] = this.externalAngle2.toJSON();
    json["internalTension1"] = this.internalTension1.toJSON();
    json["externalTension1"] = this.externalTension1.toJSON();
    json["internalTension2"] = this.internalTension2.toJSON();
    json["externalTension2"] = this.externalTension2.toJSON();
    json["indentation"] = this.indentation;
    json["externalForceAngle"] = this.externalForceAngle.toJSON();
    json["externalForceTension"] = this.externalForceTension.toJSON();
    json["shadowShiftX"] = this.shadowShiftX.toJSON();
    json["shadowShiftY"] = this.shadowShiftY.toJSON();
    let jsonColor = new Object();
    jsonColor["red"] = this.shadowColor.red;
    jsonColor["green"] = this.shadowColor.green;
    jsonColor["blue"] = this.shadowColor.blue;
    jsonColor["alpha"] = this.shadowColor.alpha;
    json["shadowColor"] = jsonColor;
    json["borderSize"] = this.borderSize.toJSON();
    jsonColor = new Object();
    jsonColor["red"] = this.borderColor.red;
    jsonColor["green"] = this.borderColor.green;
    jsonColor["blue"] = this.borderColor.blue;
    jsonColor["alpha"] = this.borderColor.alpha;
    json["borderColor"] = jsonColor;
    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  static  fromJSON(json) {
    let jsonColor = json["shadowColor"];
    let shadowColor = new Color(jsonColor["red"], jsonColor["green"], jsonColor["blue"], jsonColor["alpha"]);
    jsonColor = json["borderColor"];
    let borderColor = new Color(jsonColor["red"], jsonColor["green"], jsonColor["blue"], jsonColor["alpha"]);
    return new Z4NaturalFigurePainter(json["naturalFigurePainterType"], json["controlPointClosure"], Z4FancifulValue.fromJSON(json["size"]), Z4FancifulValue.fromJSON(json["internalAngle1"]), Z4FancifulValue.fromJSON(json["externalAngle1"]), Z4FancifulValue.fromJSON(json["internalAngle2"]), Z4FancifulValue.fromJSON(json["externalAngle2"]), Z4FancifulValue.fromJSON(json["internalTension1"]), Z4FancifulValue.fromJSON(json["externalTension1"]), Z4FancifulValue.fromJSON(json["internalTension2"]), Z4FancifulValue.fromJSON(json["externalTension2"]), json["indentation"], Z4FancifulValue.fromJSON(json["externalForceAngle"]), Z4FancifulValue.fromJSON(json["externalForceTension"]), Z4FancifulValue.fromJSON(json["shadowShiftX"]), Z4FancifulValue.fromJSON(json["shadowShiftY"]), shadowColor, Z4FancifulValue.fromJSON(json["borderSize"]), borderColor);
  }
}
