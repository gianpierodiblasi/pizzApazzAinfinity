/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainter extends Z4Painter {

   naturalFigurePainterType = null;

   controlPointClosure = null;

   size = null;

  // = 45
   internalAngle1 = null;

  // = 45;
   externalAngle1 = null;

  // = 45;
   internalAngle2 = null;

  // = 45;
   externalAngle2 = null;

  // = 3;
   internalTension1 = null;

  // = 3;
   externalTension1 = null;

  // = 3;
   internalTension2 = null;

  // = 3;
   externalTension2 = null;

  // Frastagliatura
   indentation = 0;

   externalForceAngle = null;

   externalForceTension = null;

   path1 = null;

   path2 = null;

   c1e = null;

   c1i = null;

   c2e = null;

   c2i = null;

   pF = null;

   pathForShadowBorderE = null;

   pathForShadowBorderI = null;

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
   */
  constructor(naturalFigurePainterType, controlPointClosure, size, internalAngle1, externalAngle1, internalAngle2, externalAngle2, internalTension1, externalTension1, internalTension2, externalTension2, indentation, externalForceAngle, externalForceTension) {
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
        this.c1i = this.setControlPoint(0, Z4Math.deg2rad(internalAngle1.next()), -1, this.internalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2e = this.setControlPoint(-Math.PI, Z4Math.deg2rad(externalAngle2.next()), -1, this.externalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2i = this.setControlPoint(-Math.PI, Z4Math.deg2rad(internalAngle2.next()), 1, this.internalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.evalPointClosure(drawingPoint);
        if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_0) {
          this.type0(context, drawingPoint, spatioTemporalColor, progression);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_1) {
          this.type1(context, drawingPoint, spatioTemporalColor, progression);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_2) {
          this.type2(context, drawingPoint, spatioTemporalColor, progression);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_3) {
          this.type3(context, drawingPoint, spatioTemporalColor, progression);
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

   type0(context, drawingPoint, spatioTemporalColor, progression) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.c2i.x, this.c2i.y);
    // 
    // if (shadow || border) {
    // pathForShadowBorder.reset();
    // pathForShadowBorder.cubicTo(c1e[0], c1e[1], c2e[0], c2e[1], this.pF.x, this.pF.y);
    // pathForShadowBorder.cubicTo(c2i[0], c2i[1], c1i[0], c1i[1], 0, 0);
    // }
    // 
    this.drawFigure(context, drawingPoint, this.c1e, this.c2e, spatioTemporalColor, progression);
  }

   type1(context, drawingPoint, spatioTemporalColor, progression) {
    this.path1 = this.findControlPointPath(this.c1i.x, this.c1i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
    // 
    // if (shadow || border) {
    // pathForShadowBorder.reset();
    // pathForShadowBorder.cubicTo(c1i[0], c1i[1], c2i[0], c2i[1], this.pF.x, this.pF.y);
    // }
    // this.drawFigure(context, drawingPoint, this.c1i, this.c2i, spatioTemporalColor, progression);
    // 
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
    // 
    // if (shadow || border) {
    // pathForShadowBorder.reset();
    // pathForShadowBorder.cubicTo(c1e[0], c1e[1], c2e[0], c2e[1], this.pF.x, this.pF.y);
    // }
    // 
    this.drawFigure(context, drawingPoint, c1e, c2e, spatioTemporalColor, progression);
  }

   type2(context, drawingPoint, spatioTemporalColor, progression) {
    this.path1 = this.findControlPointPath(this.c2i.x, this.c2i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);
    // 
    // if (shadow || border) {
    // pathForShadowBorder.reset();
    // pathForShadowBorder.cubicTo(c2i[0], c2i[1], c1i[0], c1i[1], this.pF.x, this.pF.y);
    // }
    // 
    this.drawFigure(context, drawingPoint, c2i, c1i, spatioTemporalColor, progression);
    this.path1 = this.findControlPointPath(this.c2e.x, this.c2e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);
    // 
    // if (shadow || border) {
    // pathForShadowBorder.reset();
    // pathForShadowBorder.cubicTo(c2e[0], c2e[1], c1e[0], c1e[1], this.pF.x, this.pF.y);
    // }
    // 
    this.drawFigure(context, drawingPoint, c2e, c1e, spatioTemporalColor, progression);
  }

   type3(context, drawingPoint, spatioTemporalColor, progression) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.c2e.x, this.c2e.y);
    // 
    // if (shadow || border) {
    // pathForShadowBorder.reset();
    // pathForShadowBorder.cubicTo(c1e[0], c1e[1], c2i[0], c2i[1], this.pF.x, this.pF.y);
    // pathForShadowBorder.cubicTo(c2e[0], c2e[1], c1i[0], c1i[1], 0, 0);
    // }
    // 
    this.drawFigure(context, drawingPoint, c1e, c2i, spatioTemporalColor, progression);
  }

   findControlPointPath(p1x, p1y, p2x, p2y) {
    let helpVector = Z4Vector.fromPoints(p1x, p1y, p2x, p2y);
    return Z4Math.rotate(helpVector.module, 0, helpVector.phase);
  }

   drawFigure(context, drawingPoint, c1, c2, spatioTemporalColor, progression) {
    // if (shadow) {
    // this.drawShadow();
    // }
    // if (border) {
    // this.drawBorder(point);
    // }
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
    let length = Math.max(Z4Math.distance(path1.x, path1.y, 0, 0), Z4Math.distance(path2.x, path2.y, 0, 0));
    for (let i = 0; i < length; i += 2) {
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
      context.bezierCurveTo(c1.x + path1.x * val, c1.y + path1.y * val, c2.x + path2.x * val, c2.y + path2.y * val, this.pF.x + indentX, this.pF.y + indentY);
      context.stroke();
      context.restore();
    }
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
    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  static  fromJSON(json) {
    return new Z4NaturalFigurePainter(json["naturalFigurePainterType"], json["controlPointClosure"], Z4FancifulValue.fromJSON(json["size"]), Z4FancifulValue.fromJSON(json["internalAngle1"]), Z4FancifulValue.fromJSON(json["externalAngle1"]), Z4FancifulValue.fromJSON(json["internalAngle2"]), Z4FancifulValue.fromJSON(json["externalAngle2"]), Z4FancifulValue.fromJSON(json["internalTension1"]), Z4FancifulValue.fromJSON(json["externalTension1"]), Z4FancifulValue.fromJSON(json["internalTension2"]), Z4FancifulValue.fromJSON(json["externalTension2"]), json["indentation"], Z4FancifulValue.fromJSON(json["externalForceAngle"]), Z4FancifulValue.fromJSON(json["externalForceTension"]));
  }
}
