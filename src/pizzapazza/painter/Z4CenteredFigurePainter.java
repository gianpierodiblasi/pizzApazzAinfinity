package pizzapazza.painter;

import def.js.Array;
import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4DrawingPointIntent;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.math.Z4Whirlpool;
import pizzapazza.math.Z4WhirlpoolBehavior;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.js.$Path2D;

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

  private final Z4FancifulValue shadowShiftX;
  private final Z4FancifulValue shadowShiftY;
  private final Color shadowColor;

  private final Z4FancifulValue borderSize;
  private final Color borderColor;

  private Z4Point path1e;
  private Z4Point path1i;
  private Z4Point path2e;
  private Z4Point path2i;

  private Z4Point c1e;
  private Z4Point c1i;
  private Z4Point c2e;
  private Z4Point c2i;

  private Z4Point pF;

  private $Path2D pathForShadowBorderE;
  private $Path2D pathForShadowBorderI;

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
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderSize The border size
   * @param borderColor The border color
   */
  public Z4CenteredFigurePainter(Z4CenteredFigurePainterType centeredFigurePainterType,
          Z4FancifulValue size, Z4FancifulValue angle1, Z4FancifulValue angle2, Z4FancifulValue tension, Z4FancifulValue multiplicity,
          Z4FancifulValue hole, Z4Whirlpool whirlpool, int cover,
          Z4FancifulValue shadowShiftX, Z4FancifulValue shadowShiftY, Color shadowColor,
          Z4FancifulValue borderSize, Color borderColor) {
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

    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;

    this.borderSize = borderSize;
    this.borderColor = borderColor;
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.CENTERED_FIGURE;
  }

  /**
   * Returns the type of Z4CenteredFigurePainter
   *
   * @return The type of Z4CenteredFigurePainter
   */
  public Z4CenteredFigurePainterType getCenteredFigurePainterType() {
    return this.centeredFigurePainterType;
  }

  /**
   * Returns the size
   *
   * @return The size
   */
  public Z4FancifulValue getSize() {
    return this.size;
  }

  /**
   * Returns the first angle
   *
   * @return The first angle
   */
  public Z4FancifulValue getAngle1() {
    return this.angle1;
  }

  /**
   * Returns the second angle
   *
   * @return The second angle
   */
  public Z4FancifulValue getAngle2() {
    return this.angle2;
  }

  /**
   * Returns the tension
   *
   * @return The tension
   */
  public Z4FancifulValue getTension() {
    return this.tension;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
  public Z4FancifulValue getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the hole
   *
   * @return The hole
   */
  public Z4FancifulValue getHole() {
    return this.hole;
  }

  /**
   * Returns the whirlpool
   *
   * @return The whirlpool
   */
  public Z4Whirlpool getWhirlpool() {
    return this.whirlpool;
  }

  /**
   * Returns the cover (in the range [1,100])
   *
   * @return The cover (in the range [1,100])
   */
  public int getCover() {
    return this.cover;
  }

  /**
   * Returns the X shadow shift
   *
   * @return The X shadow shift
   */
  public Z4FancifulValue getShadowShiftX() {
    return this.shadowShiftX;
  }

  /**
   * Returns the Y shadow shift
   *
   * @return The Y shadow shift
   */
  public Z4FancifulValue getShadowShiftY() {
    return this.shadowShiftY;
  }

  /**
   * Returns the shadow color
   *
   * @return The shadow color
   */
  public Color getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border size
   *
   * @return The border size
   */
  public Z4FancifulValue getBorderSize() {
    return this.borderSize;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
  public Color getBorderColor() {
    return this.borderColor;
  }

  @Override
  @SuppressWarnings("null")
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {
    if (drawingPoint.intent != Z4DrawingPointIntent.DRAW_OBJECTS) {
      double currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.getConstant().getValue());
      double currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().getConstant().getValue());
      double currentHole = this.hole.getConstant().getValue();

      Z4Point point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
      this.drawBounds(context, currentHole, point);
    } else {
      double currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.next());

      if (currentSize > 0) {
        double currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().next());
        double currentHole = this.hole.next();
        double currentCover = this.cover / 100;
        double currentMultiplicity = this.multiplicity.next();

        Z4Point point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
        drawingPoint = new Z4DrawingPoint(Z4Vector.fromPoints(currentHole, 0, point.x, point.y), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);

        double currentShadowShiftX = this.shadowShiftX.next();
        double currentShadowShiftY = this.shadowShiftY.next();
        double currentBorderSize = this.borderSize.next();
        boolean shadowOrBorder = $exists(currentShadowShiftX) || $exists(currentShadowShiftY) || currentBorderSize > 0;

        if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_2) {
          this.type0_1_2(drawingPoint, currentCover, shadowOrBorder);
        } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_5) {
          this.type3_4_5(drawingPoint, currentAngle, currentHole, currentCover, shadowOrBorder);
        }

        this.drawFigures(context, drawingPoint, currentMultiplicity, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
      }
    }
  }

  private void drawBounds($CanvasRenderingContext2D context, double currentHole, Z4Point point) {
    for (int i = 0; i < this.multiplicity.getConstant().getValue(); i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / this.multiplicity.getConstant().getValue());

      context.strokeStyle = Z4Constants.$getStyle("gray");
      context.beginPath();
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();

      context.strokeStyle = Z4Constants.$getStyle("black");
      context.translate(1, 1);
      context.beginPath();
      context.moveTo(currentHole, 0);
      context.lineTo(point.x, point.y);
      context.stroke();

      context.restore();
    }
  }

  //One Bezier curve. Start and end point coincide in the fulcrum
  private void type0_1_2(Z4DrawingPoint drawingPoint, double currentCover, boolean shadowOrBorder) {
    this.pF = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);

    Array<Z4Point> ce = Z4Math.butterfly(drawingPoint.z4Vector, Z4Math.deg2rad(this.angle1.next()));
    this.c1e = ce.$get(0);
    this.c2e = ce.$get(1);

    if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_0) {
      // The control points collapse towards the fulcrum
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_1) {
      // The control points collapse towards newPoint
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_2) {
      // The control points collapse towards their midpoint
      double mx = (this.c1e.x + this.c2e.x) / 2;
      double my = (this.c1e.y + this.c2e.y) / 2;
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, mx, my, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, mx, my, currentCover);
    }

    if (shadowOrBorder) {
      this.pathForShadowBorderE = new $Path2D();
      this.pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorderE.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }
  }

  //Two Bezier curves. Start point lies on the fulcrum, end point lies on newPoint
  private void type3_4_5(Z4DrawingPoint drawingPoint, double currentAngle, double currentHole, double currentCover, boolean shadowOrBorder) {
    this.pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);

    if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_3) {
      // One control point collapses towards the fulcrum, the other one collapses towards newPoint
      this.c1e = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), 1, this.tension.next());
      this.c1i = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), -1, this.tension.next());
      this.c2e = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), -1, this.tension.next());
      this.c2i = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), 1, this.tension.next());

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
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_4) {
      // The second control point is fixed on the fulcrum, the first control point collapses towards the fulcrum
      this.c1e = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), 1, this.tension.next());
      this.c1i = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), -1, this.tension.next());
      this.c2e = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.c2i = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);

      this.c1e = this.checkWhirlpool2(drawingPoint, this.c1e, currentAngle, currentHole);
      this.c1i = this.checkWhirlpool2(drawingPoint, this.c1i, currentAngle, currentHole);

      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = new Z4Point(0, 0);
      this.path2i = new Z4Point(0, 0);
    } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_5) {
      // The first control point is fixed on newPoint, the second control point collapses towards newPoint
      this.c1e = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      this.c1i = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      this.c2e = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), -1, this.tension.next());
      this.c2i = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), 1, this.tension.next());

      this.c2e = new Z4Point(drawingPoint.z4Vector.module + this.c2e.x, this.c2e.y);
      this.c2i = new Z4Point(drawingPoint.z4Vector.module + this.c2i.x, this.c2i.y);
      this.c2e = this.checkWhirlpool2(drawingPoint, this.c2e, currentAngle, currentHole);
      this.c2i = this.checkWhirlpool2(drawingPoint, this.c2i, currentAngle, currentHole);

      this.path1e = new Z4Point(0, 0);
      this.path1i = new Z4Point(0, 0);

      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2i = this.findControlPointPath(this.c2i.x, this.c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    }

    if (shadowOrBorder) {
      this.pathForShadowBorderE = new $Path2D();
      this.pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorderE.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);

      this.pathForShadowBorderI = new $Path2D();
      this.pathForShadowBorderI.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorderI.bezierCurveTo(this.c1i.x, this.c1i.y, this.c2i.x, this.c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    }
  }

  private Z4Point findControlPointPath(double p1x, double p1y, double p2x, double p2y, double currentCover) {
    double module = Z4Math.distance(p1x, p1y, p2x, p2y);
    double phase = Z4Math.atan(p1x, p1y, p2x, p2y);

    return new Z4Point(module * currentCover * Math.cos(phase), module * currentCover * Math.sin(phase));
  }

  private Z4Point setControlPoint(Z4DrawingPoint drawingPoint, double currentHole, double phase, double currentAngle, int angleSign, double currentTension) {
    return Z4Math.rotoTranslate(currentTension / 100 * drawingPoint.intensity * drawingPoint.z4Vector.module, 0, phase + angleSign * currentAngle, currentHole, 0);
  }

  private Z4Point checkWhirlpool1(double currentAngle, double currentHole, double currentSize) {
    if (currentHole == 0 || currentAngle == 0 || this.whirlpool.getWhirlpoolBehavior() == Z4WhirlpoolBehavior.NONE) {
      return new Z4Point(currentSize + currentHole, 0);
    } else if (this.whirlpool.getWhirlpoolBehavior() == Z4WhirlpoolBehavior.FORWARD) {
      return Z4Math.rotoTranslate(currentSize, 0, currentAngle, currentHole, 0);
    } else if (this.whirlpool.getWhirlpoolBehavior() == Z4WhirlpoolBehavior.BACKWARD) {
      return Z4Math.rotoTranslate(currentSize, 0, -currentAngle, currentHole, 0);
    } else {
      return null;
    }
  }

  private Z4Point checkWhirlpool2(Z4DrawingPoint point, Z4Point p, double currentAngle, double currentHole) {
    if (currentHole == 0 || currentAngle == 0 || this.whirlpool.getWhirlpoolBehavior() == Z4WhirlpoolBehavior.NONE) {
      return new Z4Point(p.x + point.z4Vector.x0, p.y + point.z4Vector.y0);
    } else if (this.whirlpool.getWhirlpoolBehavior() == Z4WhirlpoolBehavior.FORWARD) {
      return Z4Math.rotoTranslate(p.x, p.y, currentAngle, point.z4Vector.x0, point.z4Vector.y0);
    } else if (this.whirlpool.getWhirlpoolBehavior() == Z4WhirlpoolBehavior.BACKWARD) {
      return Z4Math.rotoTranslate(p.x, p.y, -currentAngle, point.z4Vector.x0, point.z4Vector.y0);
    } else {
      return null;
    }
  }

  private void drawFigures($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint,
          double currentMultiplicity, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression,
          double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize) {
    for (int i = 0; i < currentMultiplicity; i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / currentMultiplicity);

      if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_2) {
        this.drawFigure(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, spatioTemporalColor, progression, this.pathForShadowBorderE, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
      } else if (this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType == Z4CenteredFigurePainterType.TYPE_5) {
        this.drawFigure(context, drawingPoint, this.c1i, this.c2i, this.path1i, this.path2i, spatioTemporalColor, progression, this.pathForShadowBorderI, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
        this.drawFigure(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, spatioTemporalColor, progression, this.pathForShadowBorderE, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
      }

      context.restore();
    }
  }

  private void drawFigure($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint,
          Z4Point c1, Z4Point c2, Z4Point path1, Z4Point path2, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression,
          $Path2D pathForShadowBorder, double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize) {
    if ($exists(currentShadowShiftX) || $exists(currentShadowShiftY)) {
      this.drawShadow(context, pathForShadowBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
    }
    if (currentBorderSize > 0) {
      this.drawBorder(context, pathForShadowBorder, currentBorderSize);
    }

    if (spatioTemporalColor.isColor()) {
      Color color = spatioTemporalColor.getColorAt(-1, -1);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, null, color, progression.getLighting());
    } else if (spatioTemporalColor.isGradientColor()) {
      if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.SPATIAL) {
        this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, spatioTemporalColor, null, null, progression.getLighting());
      } else {
        Color color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
        this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, null, color, progression.getLighting());
      }
    } else if (spatioTemporalColor.isBiGradientColor()) {
      Z4GradientColor gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, gradientColor, null, progression.getLighting());
    }
  }

  @SuppressWarnings("null")
  private void drawFigureWithColors($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4Point c1, Z4Point c2, Z4Point path1, Z4Point path2, Z4SpatioTemporalColor spatioTemporalColor, Z4GradientColor gradientColor, Color color, Z4Lighting lighting) {
    double length = Math.max(Z4Math.distance(path1.x, path1.y, 0, 0), Z4Math.distance(path2.x, path2.y, 0, 0));

    for (int i = 0; i < length; i += 3) {
      double val = i / length;

      if ($exists(color) && lighting == Z4Lighting.NONE) {
        this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, color);
      } else {
        Color c = color;
        if ($exists(spatioTemporalColor)) {
          c = spatioTemporalColor.getColorAt(-1, val);
        } else if ($exists(gradientColor)) {
          c = gradientColor.getColorAt(val, true);
        }

        if (lighting == Z4Lighting.NONE) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, c);
        } else if (lighting == Z4Lighting.LIGHTED) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, c.lighted(val));
        } else if (lighting == Z4Lighting.DARKENED) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, c.darkened(val));
        }
      }
    }
  }

  private void drawBezier($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4Point c1, Z4Point c2, Z4Point path1, Z4Point path2, double val, Color color) {
    context.save();

    context.lineWidth = 3;
    context.strokeStyle = Z4Constants.$getStyle(color.getRGBA_HEX());

    context.beginPath();
    context.moveTo(drawingPoint.z4Vector.x0, 0);
    context.bezierCurveTo(c1.x + path1.x * val, c1.y + path1.y * val, c2.x + path2.x * val, c2.y + path2.y * val, this.pF.x, this.pF.y);
    context.stroke();

    context.restore();
  }

  private void drawShadow($CanvasRenderingContext2D context, $Path2D pathForShadowBorder, double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize) {
    context.save();

    context.translate(currentShadowShiftX, currentShadowShiftY);

    if (currentBorderSize > 0) {
      context.lineWidth = currentBorderSize;
      context.strokeStyle = Z4Constants.$getStyle(this.shadowColor.getRGBA_HEX());
      context.stroke(pathForShadowBorder);
    }

    context.fillStyle = Z4Constants.$getStyle(this.shadowColor.getRGBA_HEX());
    context.fill(pathForShadowBorder);

    context.restore();
  }

  private void drawBorder($CanvasRenderingContext2D context, $Path2D pathForShadowBorder, double currentBorderSize) {
    context.save();
    context.lineWidth = currentBorderSize;
    context.strokeStyle = Z4Constants.$getStyle(this.borderColor.getRGBA_HEX());
    context.stroke(pathForShadowBorder);
    context.restore();
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

    json.$set("shadowShiftX", this.shadowShiftX.toJSON());
    json.$set("shadowShiftY", this.shadowShiftY.toJSON());

    $Object jsonColor = new $Object();
    jsonColor.$set("red", this.shadowColor.red);
    jsonColor.$set("green", this.shadowColor.green);
    jsonColor.$set("blue", this.shadowColor.blue);
    jsonColor.$set("alpha", this.shadowColor.alpha);
    json.$set("shadowColor", jsonColor);

    json.$set("borderSize", this.borderSize.toJSON());

    jsonColor = new $Object();
    jsonColor.$set("red", this.borderColor.red);
    jsonColor.$set("green", this.borderColor.green);
    jsonColor.$set("blue", this.borderColor.blue);
    jsonColor.$set("alpha", this.borderColor.alpha);
    json.$set("borderColor", jsonColor);

    return json;
  }

  /**
   * Creates a Z4CenteredFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the centered figure painter
   */
  public static Z4CenteredFigurePainter fromJSON($Object json) {
    $Object jsonColor = json.$get("shadowColor");
    Color shadowColor = new Color(jsonColor.$get("red"), jsonColor.$get("green"), jsonColor.$get("blue"), jsonColor.$get("alpha"));

    jsonColor = json.$get("borderColor");
    Color borderColor = new Color(jsonColor.$get("red"), jsonColor.$get("green"), jsonColor.$get("blue"), jsonColor.$get("alpha"));

    return new Z4CenteredFigurePainter(
            json.$get("centeredFigurePainterType"),
            Z4FancifulValue.fromJSON(json.$get("size")),
            Z4FancifulValue.fromJSON(json.$get("angle1")), Z4FancifulValue.fromJSON(json.$get("angle2")),
            Z4FancifulValue.fromJSON(json.$get("tension")), Z4FancifulValue.fromJSON(json.$get("multiplicity")),
            Z4FancifulValue.fromJSON(json.$get("hole")), Z4Whirlpool.fromJSON(json.$get("whirlpool")), json.$get("cover"),
            Z4FancifulValue.fromJSON(json.$get("shadowShiftX")), Z4FancifulValue.fromJSON(json.$get("shadowShiftY")), shadowColor,
            Z4FancifulValue.fromJSON(json.$get("borderSize")), borderColor
    );
  }
}
