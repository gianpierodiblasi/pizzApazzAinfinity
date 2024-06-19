/**
 * The painter of centered figures
 *
 * @author gianpiero.diblasi
 */
class Z4CenteredFigurePainter extends Z4Painter {

   centeredFigurePainterType = null;

   size = null;

   angle1 = null;

   angle2 = null;

   tension = null;

   multiplicity = null;

   hole = null;

   whirlpool = null;

   cover = 0;

   path1e = null;

   path1i = null;

   path2e = null;

   path2i = null;

   c1e = null;

   c1i = null;

   c2e = null;

   c2i = null;

   pF = null;

  /**
   * Creates the object
   *
   * @param centeredFigurePainterType The type of Z4CenteredFigurePainter
   * @param size The size
   * @param angle1 The first angle
   * @param angle2 The second angle
   * @param tension The tension
   * @param multiplicity The multiplicity
   * @param hole The hole
   * @param whirlpool The whirlpool
   * @param cover The cover (in the range [1,100])
   */
  constructor(centeredFigurePainterType, size, angle1, angle2, tension, multiplicity, hole, whirlpool, cover) {
    super();
    this.centeredFigurePainterType = centeredFigurePainterType;
    this.size = size;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.tension = tension;
    this.multiplicity = multiplicity;
    this.hole = hole;
    this.whirlpool = whirlpool;
    this.cover = cover;
  }

   getType() {
    return Z4PainterType.CENTERED_FIGURE;
  }

  /**
   * Returns the type of Z4CenteredFigurePainter
   *
   * @return The type of Z4CenteredFigurePainter
   */
   getCenteredFigurePainterType() {
    return this.centeredFigurePainterType;
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
   * Returns the first angle
   *
   * @return The first angle
   */
   getAngle1() {
    return this.angle1;
  }

  /**
   * Returns the second angle
   *
   * @return The second angle
   */
   getAngle2() {
    return this.angle2;
  }

  /**
   * Returns the tension
   *
   * @return The tension
   */
   getTension() {
    return this.tension;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the hole
   *
   * @return The hole
   */
   getHole() {
    return this.hole;
  }

  /**
   * Returns the whirlpool
   *
   * @return The whirlpool
   */
   getWhirlpool() {
    return this.whirlpool;
  }

  /**
   * Returns the cover (in the range [1,100])
   *
   * @return The cover (in the range [1,100])
   */
   getCover() {
    return this.cover;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.drawBounds) {
      let currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().getConstant().getValue());
      let currentHole = this.hole.getConstant().getValue();
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.getConstant().getValue());
      let point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
      this.drawBounds(context, currentHole, point);
    } else {
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.next());
      if (currentSize > 0) {
        let currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().next());
        let currentHole = this.hole.next();
        let currentCover = this.cover / 100;
        let currentMultiplicity = this.multiplicity.next();
        let point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
        drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(currentHole, 0, point.x, point.y), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.drawBounds, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
        if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
          this.type0_1_2(drawingPoint, currentCover);
        } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
          this.type3_4_5(drawingPoint, currentAngle, currentHole, currentCover);
        }
        this.drawFigures(context, drawingPoint, currentMultiplicity, spatioTemporalColor, progression);
      }
    }
  }

   drawBounds(context, currentHole, point) {
    for (let i = 0; i < this.multiplicity.getConstant().getValue(); i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / this.multiplicity.getConstant().getValue());
      context.strokeStyle = Z4Constants.getStyle("gray");
      context.beginPath();
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.strokeStyle = Z4Constants.getStyle("black");
      context.translate(1, 1);
      context.beginPath();
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.restore();
    }
  }

  // One Bezier curve. Start and end point coincide in the fulcrum
   type0_1_2(drawingPoint, currentCover) {
    this.pF = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    let ce = Z4Math.butterfly(drawingPoint.z4Vector, Z4Math.deg2rad(this.angle1.next()));
    this.c1e = ce[0];
    this.c2e = ce[1];
    if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0) {
      // The control points collapse towards the fulcrum
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1) {
      // The control points collapse towards newPoint
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
      // The control points collapse towards their midpoint
      let mx = (this.c1e.x + this.c2e.x) / 2;
      let my = (this.c1e.y + this.c2e.y) / 2;
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, mx, my, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, mx, my, currentCover);
    }
    // 
    // if (shadow||border)
    // {
    // pathForShadowBorderE.reset();
    // pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
    // pathForShadowBorderE.cubicTo(c1e.x,c1e.y,c2e.x,c2e.y,drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
    // }
  }

  // Two Bezier curves. Start point lies on the fulcrum, end point lies on newPoint
   type3_4_5(drawingPoint, currentAngle, currentHole, currentCover) {
    this.pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3) {
      // One control point collapses towards the fulcrum, the other one collapses towards newPoint
      this.c1e = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), 1, this.tension.next());
      this.c1i = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), -1, this.tension.next());
      this.c2e = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), -1, this.tension.next());
      this.c2i = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), 1, this.tension.next());
      this.c2e = new Z4Point(drawingPoint.z4Vector.module + this.c2e.x, this.c2e.y);
      this.c2i = new Z4Point(drawingPoint.z4Vector.module + this.c2i.x, this.c2i.y);
      this.c1e = this.checkWhirlpool2(drawingPoint, this.c1e, currentAngle, currentHole);
      this.c1i = this.checkWhirlpool2(drawingPoint, this.c1i, currentAngle, currentHole);
      this.c2e = this.checkWhirlpool2(drawingPoint, this.c2e, currentAngle, currentHole);
      this.c2i = this.checkWhirlpool2(drawingPoint, this.c2i, currentAngle, currentHole);
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2i = this.findControlPointPath(this.c2i.x, this.c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4) {
      // The second control point is fixed on the fulcrum, the first control point collapses towards the fulcrum
      this.c1e = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), 1, this.tension.next());
      this.c1i = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), -1, this.tension.next());
      this.c2e = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.c2i = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.c1e = this.checkWhirlpool2(drawingPoint, this.c1e, currentAngle, currentHole);
      this.c1i = this.checkWhirlpool2(drawingPoint, this.c1i, currentAngle, currentHole);
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = new Z4Point(0, 0);
      this.path2i = new Z4Point(0, 0);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
      // The first control point is fixed on newPoint, the second control point collapses towards newPoint
      this.c1e = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      this.c1i = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      this.c2e = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), -1, this.tension.next());
      this.c2i = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), 1, this.tension.next());
      this.c2e = new Z4Point(drawingPoint.z4Vector.module + this.c2e.x, this.c2e.y);
      this.c2i = new Z4Point(drawingPoint.z4Vector.module + this.c2i.x, this.c2i.y);
      this.c2e = this.checkWhirlpool2(drawingPoint, this.c2e, currentAngle, currentHole);
      this.c2i = this.checkWhirlpool2(drawingPoint, this.c2i, currentAngle, currentHole);
      this.path1e = new Z4Point(0, 0);
      this.path1i = new Z4Point(0, 0);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2i = this.findControlPointPath(this.c2i.x, this.c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    }
    // 
    // if (shadow || border) {
    // pathForShadowBorderE.reset();
    // pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
    // pathForShadowBorderE.cubicTo(c1e.x,c1e.y,c2e.x,c2e.y,drawingPoint.z4Vector.x,drawingPoint.z4Vector.y);
    // pathForShadowBorderI.reset();
    // pathForShadowBorderI.moveTo(drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
    // pathForShadowBorderI.cubicTo(c1i.x,c1i.y,c2i.x,c2i.y,drawingPoint.z4Vector.x,drawingPoint.z4Vector.y);
    // }
  }

   findControlPointPath(p1x, p1y, p2x, p2y, currentCover) {
    let module = Z4Math.distance(p1x, p1y, p2x, p2y);
    let phase = Z4Math.atan(p1x, p1y, p2x, p2y);
    return new Z4Point(module * currentCover * Math.cos(phase), module * currentCover * Math.sin(phase));
  }

   setControlPoint(drawingPoint, currentHole, phase, currentAngle, angleSign, currenTension) {
    return Z4Math.rotoTranslate(currenTension * drawingPoint.intensity * drawingPoint.z4Vector.module, 0, phase + angleSign * currentAngle, currentHole, 0);
  }

   checkWhirlpool1(currentAngle, currentHole, currentSize) {
    if (currentHole === 0 || currentAngle === 0 || this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.NONE) {
      return new Z4Point(currentSize, 0);
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.FORWARD) {
      return Z4Math.rotoTranslate(currentSize, 0, currentAngle, currentHole, 0);
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.BACKWARD) {
      return Z4Math.rotoTranslate(currentSize, 0, -currentAngle, currentHole, 0);
    } else {
      return null;
    }
  }

   checkWhirlpool2(point, p, currentAngle, currentHole) {
    if (currentHole === 0 || currentAngle === 0 || this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.NONE) {
      return p;
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.FORWARD) {
      return Z4Math.rotoTranslate(p.x, p.y, currentAngle, point.z4Vector.x0, point.z4Vector.y0);
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.BACKWARD) {
      return Z4Math.rotoTranslate(p.x, p.y, -currentAngle, point.z4Vector.x0, point.z4Vector.y0);
    } else {
      return null;
    }
  }

   drawFigures(context, drawingPoint, currentMultiplicity, spatioTemporalColor, progression) {
    for (let i = 0; i < currentMultiplicity; i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / currentMultiplicity);
      if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
        this.drawFigure(context, drawingPoint, /*,pathForShadowBorderE*/
        this.c1e, this.c2e, this.path1e, this.path2e, spatioTemporalColor, progression);
      } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
        this.drawFigure(context, drawingPoint, /*,pathForShadowBorderI*/
        this.c1i, this.c2i, this.path1i, this.path2i, spatioTemporalColor, progression);
        this.drawFigure(context, drawingPoint, /*,pathForShadowBorderE*/
        this.c1e, this.c2e, this.path1e, this.path2e, spatioTemporalColor, progression);
      }
      context.restore();
    }
  }

   drawFigure(context, drawingPoint, /*, Path pathForShadowBorder*/
  c1, c2, path1, path2, spatioTemporalColor, progression) {
    // if (shadow) this.drawShadow(pathForShadowBorder);
    // 
    if (spatioTemporalColor.isColor()) {
      let color = spatioTemporalColor.getColorAt(-1, -1);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, null, color, progression.getLighting());
    } else if (spatioTemporalColor.isGradientColor()) {
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
        this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, spatioTemporalColor, null, null, progression.getLighting());
      } else {
        let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
        this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, null, color, progression.getLighting());
      }
    } else if (spatioTemporalColor.isBiGradientColor()) {
      let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, gradientColor, null, progression.getLighting());
    }
    // 
    // if (border) this.drawBorder(point,pathForShadowBorder);
  }

   drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, spatioTemporalColor, gradientColor, color, lighting) {
    let length = Math.max(Z4Math.distance(path1.x, path1.y, 0, 0), Z4Math.distance(path2.x, path2.y, 0, 0));
    for (let i = 0; i < length; i += 3) {
      let val = i / length;
      if (color && lighting === Z4Lighting.NONE) {
        this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, color);
      } else {
        let c = null;
        if (spatioTemporalColor) {
          c = spatioTemporalColor.getColorAt(-1, val);
        } else if (gradientColor) {
          c = gradientColor.getColorAt(val, true);
        }
        if (lighting === Z4Lighting.NONE) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, c);
        } else if (lighting === Z4Lighting.LIGHTED) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, c.lighted(val));
        } else if (lighting === Z4Lighting.DARKENED) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, c.darkened(val));
        }
      }
    }
  }

   drawBezier(context, drawingPoint, c1, c2, path1, path2, val, color) {
    context.save();
    context.lineWidth = 2;
    context.strokeStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    context.beginPath();
    context.moveTo(drawingPoint.z4Vector.x0, 0);
    context.bezierCurveTo(c1.x + path1.x * val, c1.y + path1.y * val, c2.x + path2.x * val, c2.y + path2.y * val, this.pF.x, this.pF.y);
    context.stroke();
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["centeredFigurePainterType"] = this.centeredFigurePainterType;
    json["size"] = this.size.toJSON();
    json["angle1"] = this.angle1.toJSON();
    json["angle2"] = this.angle2.toJSON();
    json["tension"] = this.tension.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["hole"] = this.hole.toJSON();
    json["whirlpool"] = this.whirlpool.toJSON();
    json["cover"] = this.cover;
    return json;
  }

  /**
   * Creates a Z4CenteredFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the centered figure painter
   */
  static  fromJSON(json) {
    return new Z4CenteredFigurePainter(json["centeredFigurePainterType"], Z4FancifulValue.fromJSON(json["size"]), Z4FancifulValue.fromJSON(json["angle1"]), Z4FancifulValue.fromJSON(json["angle2"]), Z4FancifulValue.fromJSON(json["tension"]), Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["hole"]), Z4Whirlpool.fromJSON(json["whirlpool"]), json["cover"]);
  }
}
