package pizzapazza.painter;

import def.js.Array;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Whirlpool;
import pizzapazza.math.Z4WhirlpoolBehavior;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Object;

/**
 * The painter of centered figures
 *
 * @author gianpiero.diblasi
 */
public class Z4CenteredFigurePainter extends Z4Painter {

  private final Z4CenteredFigurePainterType centeredFigurePainterType;

  private final Z4FancifulValue size;
  private final Z4FancifulValue angle1;
  private final Z4FancifulValue angle2;
  private final Z4FancifulValue tension;
  private final Z4FancifulValue multiplicity;

  private final Z4FancifulValue hole;
  private final Z4Whirlpool whirlpool;
  private final int cover;

  private Z4Point path1e;
  private Z4Point path1i;
  private Z4Point path2e;
  private Z4Point path2i;

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
  public Z4CenteredFigurePainter(Z4CenteredFigurePainterType centeredFigurePainterType,
          Z4FancifulValue size, Z4FancifulValue angle1, Z4FancifulValue angle2, Z4FancifulValue tension, Z4FancifulValue multiplicity,
          Z4FancifulValue hole, Z4Whirlpool whirlpool, int cover) {
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

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.CENTERED_FIGURE;
  }

  @Override
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    if (drawingPoint.drawBounds) {
      double currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().getConstant().getValue());
      double currentHole = this.hole.getConstant().getValue();
      double currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? 2 * drawingPoint.z4Vector.module : this.size.getConstant().getValue());

      Z4Point point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
      this.drawBounds(context, currentHole, point);
    } else {
    }
  }

  private void drawBounds($CanvasRenderingContext2D context, double currentHole, Z4Point point) {
    for (int i = 0; i < this.multiplicity.getConstant().getValue(); i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / this.multiplicity.getConstant().getValue());

      context.strokeStyle = Z4Constants.$getStyle("gray");
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();

      context.strokeStyle = Z4Constants.$getStyle("black");
      context.translate(1, 1);
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();

      context.restore();
    }
  }

  //One Bezier curve. Start and end point coincide in the fulcrum
  private Z4Point type0_1_2(Z4DrawingPoint drawingPoint, double currentCover) {

    Array<Z4Point> ce = Z4Math.butterfly(drawingPoint.z4Vector, Z4Math.deg2rad(this.angle1.next()));
    Z4Point pF = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);

    if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_0) {
      // The control points collapse towards the fulcrum
      this.path1e = this.findControlPointPath(ce.$get(0).x, ce.$get(0).y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(ce.$get(1).x, ce.$get(1).y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_1) {
      // The control points collapse towards newPoint
      this.path1e = this.findControlPointPath(ce.$get(0).x, ce.$get(0).y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2e = this.findControlPointPath(ce.$get(1).x, ce.$get(1).y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_2) {
      // The control points collapse towards their midpoint
      double mx = (ce.$get(0).x + ce.$get(1).x) / 2;
      double my = (ce.$get(0).y + ce.$get(1).y) / 2;
      this.path1e = this.findControlPointPath(ce.$get(0).x, ce.$get(0).y, mx, my, currentCover);
      this.path2e = this.findControlPointPath(ce.$get(1).x, ce.$get(1).y, mx, my, currentCover);
    }
//
//    if (shadow||border)
//    {
//      pathForShadowBorderE.reset();
//      pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
//      pathForShadowBorderE.cubicTo(c1e.x,c1e.y,c2e.x,c2e.y,drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
//    }
//
    return pF;
  }

  //Two Bezier curves. Start point lies on the fulcrum, end point lies on newPoint
  private Z4Point type3_4_5(Z4DrawingPoint drawingPoint, double currentAngle, double currentHole, double currentCover) {
    Z4Point pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);

    if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_3) {
      // One control point collapses towards the fulcrum, the other one collapses towards newPoint
      Z4Point c1e = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), 1, this.tension.next());
      Z4Point c1i = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), -1, this.tension.next());
      Z4Point c2e = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), -1, this.tension.next());
      Z4Point c2i = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), 1, this.tension.next());

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
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_4) {
      // The second control point is fixed on the fulcrum, the first control point collapses towards the fulcrum
      Z4Point c1e = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), 1, this.tension.next());
      Z4Point c1i = this.setControlPoint(drawingPoint, currentHole, 0, this.angle1.next(), -1, this.tension.next());
      Z4Point c2e = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      Z4Point c2i = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);

      c1e = this.checkWhirlpool2(drawingPoint, c1e, currentAngle, currentHole);
      c1i = this.checkWhirlpool2(drawingPoint, c1i, currentAngle, currentHole);

      this.path1e = this.findControlPointPath(c1e.x, c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(c1i.x, c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = new Z4Point(0, 0);
      this.path2i = new Z4Point(0, 0);
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_5) {
      // The first control point is fixed on newPoint, the second control point collapses towards newPoint
      Z4Point c1e = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      Z4Point c1i = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      Z4Point c2e = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), -1, this.tension.next());
      Z4Point c2i = this.setControlPoint(drawingPoint, currentHole, -180, this.angle2.next(), 1, this.tension.next());

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
//    if (shadow || border) {
//      pathForShadowBorderE.reset();
//      pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
//      pathForShadowBorderE.cubicTo(c1e.x,c1e.y,c2e.x,c2e.y,drawingPoint.z4Vector.x,drawingPoint.z4Vector.y);
//      pathForShadowBorderI.reset();
//      pathForShadowBorderI.moveTo(drawingPoint.z4Vector.x0,drawingPoint.z4Vector.y0);
//      pathForShadowBorderI.cubicTo(c1i.x,c1i.y,c2i.x,c2i.y,drawingPoint.z4Vector.x,drawingPoint.z4Vector.y);
//    }
//
    return pF;
  }

  private Z4Point findControlPointPath(double p1x, double p1y, double p2x, double p2y, double currentCover) {
    double module = Z4Math.distance(p1x, p1y, p2x, p2y);
    double phase = Z4Math.atan(p1x, p1y, p2x, p2y);

    return new Z4Point(module * currentCover * Math.cos(phase), module * currentCover * Math.sin(phase));
  }

  private Z4Point setControlPoint(Z4DrawingPoint drawingPoint, double currentHole, double phase, double currentAngle, int angleSign, double currenTension) {
    Z4Point point = Z4Math.rotate((4 + currenTension) * drawingPoint.intensity * drawingPoint.z4Vector.module, 0, phase + angleSign * currentAngle);
    return new Z4Point(point.x + currentHole, point.y);
  }

  private Z4Point checkWhirlpool1(double currentAngle, double currentHole, double currentSize) {
    if (currentHole == 0 || currentAngle == 0 || this.whirlpool.getBehavior() == Z4WhirlpoolBehavior.NONE) {
      return new Z4Point(currentSize, 0);
    } else if (this.whirlpool.getBehavior() == Z4WhirlpoolBehavior.FORWARD) {
      Z4Point point = Z4Math.rotate(currentSize, 0, currentAngle);
      return new Z4Point(point.x + currentHole, point.y);
    } else if (this.whirlpool.getBehavior() == Z4WhirlpoolBehavior.BACKWARD) {
      Z4Point point = Z4Math.rotate(currentSize, 0, -currentAngle);
      return new Z4Point(point.x + currentHole, point.y);
    } else {
      return null;
    }
  }

  private Z4Point checkWhirlpool2(Z4DrawingPoint point, Z4Point p, double currentAngle, double currentHole) {
    if (currentHole == 0 || currentAngle == 0 || this.whirlpool.getBehavior() == Z4WhirlpoolBehavior.NONE) {
      return p;
    } else if (this.whirlpool.getBehavior() == Z4WhirlpoolBehavior.FORWARD) {
      p = Z4Math.rotate(p.x, p.y, currentAngle);
      return new Z4Point(point.z4Vector.x0 + p.x, point.z4Vector.y0 + p.y);
    } else if (this.whirlpool.getBehavior() == Z4WhirlpoolBehavior.BACKWARD) {
      p = Z4Math.rotate(p.x, p.y, -currentAngle);
      return new Z4Point(point.z4Vector.x0 + p.x, point.z4Vector.y0 + p.y);
    } else {
      return null;
    }
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("centeredFigurePainterType", this.centeredFigurePainterType);

    json.$set("size", this.size.toJSON());
    json.$set("angle1", this.angle1.toJSON());
    json.$set("angle2", this.angle2.toJSON());
    json.$set("tension", this.tension.toJSON());
    json.$set("multiplicity", this.multiplicity.toJSON());

    json.$set("hole", this.hole.toJSON());
    json.$set("whirlpool", this.whirlpool.toJSON());
    json.$set("cover", this.cover);
    return json;
  }

  /**
   * Creates a Z4CenteredFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the centered figure painter
   */
  public static Z4CenteredFigurePainter fromJSON($Object json) {
    return new Z4CenteredFigurePainter(
            json.$get("centeredFigurePainterType"),
            Z4FancifulValue.fromJSON(json.$get("size")),
            Z4FancifulValue.fromJSON(json.$get("angle1")), Z4FancifulValue.fromJSON(json.$get("angle2")),
            Z4FancifulValue.fromJSON(json.$get("tension")), Z4FancifulValue.fromJSON(json.$get("multiplicity")),
            Z4FancifulValue.fromJSON(json.$get("hole")), Z4Whirlpool.fromJSON(json.$get("whirlpool")), json.$get("cover")
    );
  }
}
