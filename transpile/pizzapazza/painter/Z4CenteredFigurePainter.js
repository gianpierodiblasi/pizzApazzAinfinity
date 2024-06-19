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
   * @param cover The cover
   */
  constructor(centeredFigurePainterType, size, angle1, angle2, tension, multiplicity, hole, whirlpool, cover) {
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

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.drawBounds) {
      let currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().getConstant().getValue());
      let currentHole = this.hole.getConstant().getValue();
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? 2 * drawingPoint.z4Vector.module : this.size.getConstant().getValue());
      let point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
      this.drawBounds(context, currentHole, point);
    } else {
    }
  }

   drawBounds(context, currentHole, point) {
    for (let i = 0; i < this.multiplicity.getConstant().getValue(); i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / this.multiplicity.getConstant().getValue());
      context.strokeStyle = Z4Constants.getStyle("gray");
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.strokeStyle = Z4Constants.getStyle("black");
      context.translate(1, 1);
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.restore();
    }
  }

  // One Bezier curve. Start and end point coincide in the fulcrum
   type0_1_2(drawingPoint, currentCover) {
    let ce = Z4Math.butterfly(drawingPoint.z4Vector, Z4Math.deg2rad(this.angle1.next()));
    let pF = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0) {
      // The control points collapse towards the fulcrum
      this.path1e = this.findControlPointPath(ce[0].x, ce[0].y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(ce[1].x, ce[1].y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1) {
      // The control points collapse towards newPoint
      this.path1e = this.findControlPointPath(ce[0].x, ce[0].y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2e = this.findControlPointPath(ce[1].x, ce[1].y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
      // The control points collapse towards their midpoint
      let mx = (ce[0].x + ce[1].x) / 2;
      let my = (ce[0].y + ce[1].y) / 2;
      this.path1e = this.findControlPointPath(ce[0].x, ce[0].y, mx, my, currentCover);
      this.path2e = this.findControlPointPath(ce[1].x, ce[1].y, mx, my, currentCover);
    }
    // 
    // if (shadow||border)
    // {
    // pathForShadowBorderE.reset();
    // pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
    // pathForShadowBorderE.cubicTo(c1e.x,c1e.y,c2e.x,c2e.y,drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
    // }
    // 
    return pF;
  }

  // Two Bezier curves. Start point lies on the fulcrum, end point lies on newPoint
   type3_4_5(drawingPoint, currentAngle, currentHole, currentCover) {
    let pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3) {
      // One control point collapses towards the fulcrum, the other one collapses towards newPoint
      let c1e = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), 1, this.tension.next());
      let c1i = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), -1, this.tension.next());
      let c2e = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), -1, this.tension.next());
      let c2i = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), 1, this.tension.next());
      c2e = new Z4Point(drawingPoint.z4Vector.module + c2e.x, c2e.y);
      c2i = new Z4Point(drawingPoint.z4Vector.module + c2i.x, c2i.y);
      c1e = this.checkWhirlpool2(drawingPoint, c1e, currentAngle, currentHole);
      c1i = this.checkWhirlpool2(drawingPoint, c1i, currentAngle, currentHole);
      c2e = this.checkWhirlpool2(drawingPoint, c2e, currentAngle, currentHole);
      c2i = this.checkWhirlpool2(drawingPoint, c2i, currentAngle, currentHole);
      this.path1e = this.findControlPointPath(c1e.x, c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(c1i.x, c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(c2e.x, c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2i = this.findControlPointPath(c2i.x, c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4) {
      // The second control point is fixed on the fulcrum, the first control point collapses towards the fulcrum
      let c1e = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), 1, this.tension.next());
      let c1i = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), -1, this.tension.next());
      let c2e = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      let c2i = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      c1e = this.checkWhirlpool2(drawingPoint, c1e, currentAngle, currentHole);
      c1i = this.checkWhirlpool2(drawingPoint, c1i, currentAngle, currentHole);
      this.path1e = this.findControlPointPath(c1e.x, c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(c1i.x, c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = new Z4Point(0, 0);
      this.path2i = new Z4Point(0, 0);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
      // The first control point is fixed on newPoint, the second control point collapses towards newPoint
      let c1e = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      let c1i = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      let c2e = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), -1, this.tension.next());
      let c2i = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), 1, this.tension.next());
      c2e = new Z4Point(drawingPoint.z4Vector.module + c2e.x, c2e.y);
      c2i = new Z4Point(drawingPoint.z4Vector.module + c2i.x, c2i.y);
      c2e = this.checkWhirlpool2(drawingPoint, c2e, currentAngle, currentHole);
      c2i = this.checkWhirlpool2(drawingPoint, c2i, currentAngle, currentHole);
      this.path1e = new Z4Point(0, 0);
      this.path1i = new Z4Point(0, 0);
      this.path2e = this.findControlPointPath(c2e.x, c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2i = this.findControlPointPath(c2i.x, c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
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
    // 
    return pF;
  }

   findControlPointPath(p1x, p1y, p2x, p2y, currentCover) {
    let module = Z4Math.distance(p1x, p1y, p2x, p2y);
    let phase = Z4Math.atan(p1x, p1y, p2x, p2y);
    return new Z4Point(module * currentCover * Math.cos(phase), module * currentCover * Math.sin(phase));
  }

   setControlPoint(drawingPoint, currentHole, phase, currentAngle, angleSign, currenTension) {
    let point = Z4Math.rotate((4 + currenTension) * drawingPoint.intensity * drawingPoint.z4Vector.module, 0, phase + angleSign * currentAngle);
    return new Z4Point(point.x + currentHole, point.y);
  }

   checkWhirlpool1(currentAngle, currentHole, currentSize) {
    if (currentHole === 0 || currentAngle === 0 || this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.NONE) {
      return new Z4Point(currentSize, 0);
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.FORWARD) {
      let point = Z4Math.rotate(currentSize, 0, currentAngle);
      return new Z4Point(point.x + currentHole, point.y);
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.BACKWARD) {
      let point = Z4Math.rotate(currentSize, 0, -currentAngle);
      return new Z4Point(point.x + currentHole, point.y);
    } else {
      return null;
    }
  }

   checkWhirlpool2(point, p, currentAngle, currentHole) {
    if (currentHole === 0 || currentAngle === 0 || this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.NONE) {
      return p;
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.FORWARD) {
      p = Z4Math.rotate(p.x, p.y, currentAngle);
      return new Z4Point(point.z4Vector.x0 + p.x, point.z4Vector.y0 + p.y);
    } else if (this.whirlpool.getBehavior() === Z4WhirlpoolBehavior.BACKWARD) {
      p = Z4Math.rotate(p.x, p.y, -currentAngle);
      return new Z4Point(point.z4Vector.x0 + p.x, point.z4Vector.y0 + p.y);
    } else {
      return null;
    }
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
