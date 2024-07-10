package pizzapazza.painter;

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
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.js.$Path2D;

/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
public class Z4NaturalFigurePainter extends Z4Painter {

  private final Z4NaturalFigurePainterType naturalFigurePainterType;
  private final Z4NaturalFigurePainterControlPointClosure controlPointClosure;

  private final Z4FancifulValue size;

  private final Z4FancifulValue internalAngle1;
  private final Z4FancifulValue externalAngle1;
  private final Z4FancifulValue internalAngle2;
  private final Z4FancifulValue externalAngle2;

  private final Z4FancifulValue internalTension1;
  private final Z4FancifulValue externalTension1;
  private final Z4FancifulValue internalTension2;
  private final Z4FancifulValue externalTension2;

  private final int indentation; //Frastagliatura

  private final Z4FancifulValue externalForceAngle;
  private final Z4FancifulValue externalForceTension;

  private final Z4FancifulValue shadowShiftX;
  private final Z4FancifulValue shadowShiftY;
  private final Color shadowColor;

  private final Z4FancifulValue borderSize;
  private final Color borderColor;

  private Z4Point path1;
  private Z4Point path2;

  private Z4Point c1e;
  private Z4Point c1i;
  private Z4Point c2e;
  private Z4Point c2i;

  private Z4Point pF;

  private $Path2D pathForShadowBorder;

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
  public Z4NaturalFigurePainter(Z4NaturalFigurePainterType naturalFigurePainterType, Z4NaturalFigurePainterControlPointClosure controlPointClosure,
          Z4FancifulValue size,
          Z4FancifulValue internalAngle1, Z4FancifulValue externalAngle1, Z4FancifulValue internalAngle2, Z4FancifulValue externalAngle2,
          Z4FancifulValue internalTension1, Z4FancifulValue externalTension1, Z4FancifulValue internalTension2, Z4FancifulValue externalTension2,
          int indentation,
          Z4FancifulValue externalForceAngle, Z4FancifulValue externalForceTension,
          Z4FancifulValue shadowShiftX, Z4FancifulValue shadowShiftY, Color shadowColor,
          Z4FancifulValue borderSize, Color borderColor) {
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

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.NATURAL_FIGURE;
  }

  /**
   * Returns the type of Z4NaturalFigurePainter
   *
   * @return The type of Z4NaturalFigurePainter
   */
  public Z4NaturalFigurePainterType getNaturalFigurePainterType() {
    return this.naturalFigurePainterType;
  }

  /**
   * Returns the control point closure of Z4NaturalFigurePainter
   *
   * @return The control point closure of Z4NaturalFigurePainter
   */
  public Z4NaturalFigurePainterControlPointClosure getControlPointClosure() {
    return this.controlPointClosure;
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
   * Returns the angle of the first internal control point
   *
   * @return The angle of the first internal control point
   */
  public Z4FancifulValue getInternalAngle1() {
    return this.internalAngle1;
  }

  /**
   * Returns the angle of the first external control point
   *
   * @return The angle of the first external control point
   */
  public Z4FancifulValue getExternalAngle1() {
    return this.externalAngle1;
  }

  /**
   * Returns the angle of the second internal control point
   *
   * @return The angle of the second internal control point
   */
  public Z4FancifulValue getInternalAngle2() {
    return this.internalAngle2;
  }

  /**
   * Returns the angle of the second external control point
   *
   * @return The angle of the second external control point
   */
  public Z4FancifulValue getExternalAngle2() {
    return this.externalAngle2;
  }

  /**
   * Returns the tension of the first internal control point
   *
   * @return The tension of the first internal control point
   */
  public Z4FancifulValue getInternalTension1() {
    return this.internalTension1;
  }

  /**
   * Returns the tension of the first external control point
   *
   * @return The tension of the first external control point
   */
  public Z4FancifulValue getExternalTension1() {
    return this.externalTension1;
  }

  /**
   * Returns the tension of the second internal control point
   *
   * @return The tension of the second internal control point
   */
  public Z4FancifulValue getInternalTension2() {
    return this.internalTension2;
  }

  /**
   * Returns the tension of the second external control point
   *
   * @return The tension of the second external control point
   */
  public Z4FancifulValue getExternalTension2() {
    return this.externalTension2;
  }

  /**
   * Returns the indentation
   *
   * @return The indentation
   */
  public int getIndentation() {
    return this.indentation;
  }

  /**
   * Returns the angle of the external force
   *
   * @return The angle of the external force
   */
  public Z4FancifulValue getExternalForceAngle() {
    return this.externalForceAngle;
  }

  /**
   * Returns the tension of the external force
   *
   * @return The tension of the external force
   */
  public Z4FancifulValue getExternalForceTension() {
    return this.externalForceTension;
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
      double originalAngle = drawingPoint.z4Vector.phase;
      double currentExternalForceAngle = this.externalForceAngle.getConstant().getValue();
      double currentExternalForceTension = this.externalForceTension.getConstant().getValue();

      drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
      this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);

      this.c1e = this.setControlPoint(0, Z4Math.deg2rad(this.externalAngle1.getConstant().getValue()), 1, this.externalTension1.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.c1i = this.setControlPoint(0, Z4Math.deg2rad(this.internalAngle1.getConstant().getValue()), -1, this.internalTension1.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.c2e = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.externalAngle2.getConstant().getValue()), -1, this.externalTension2.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.c2i = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.internalAngle2.getConstant().getValue()), 1, this.internalTension2.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.evalPointClosure(drawingPoint);

      if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_0) {
        this.type0(context, drawingPoint, null, null, false, 0, 0, 0, true);
      } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_1) {
        this.type1(context, drawingPoint, null, null, false, 0, 0, 0, true);
      } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_2) {
        this.type2(context, drawingPoint, null, null, false, 0, 0, 0, true);
      } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_3) {
        this.type3(context, drawingPoint, null, null, false, 0, 0, 0, true);
      }
    } else {
      double currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.next());

      if (currentSize > 0) {
        double originalAngle = drawingPoint.z4Vector.phase;
        double currentExternalForceAngle = this.externalForceAngle.next();
        double currentExternalForceTension = this.externalForceTension.next();

        drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
        this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);

        this.c1e = this.setControlPoint(0, Z4Math.deg2rad(this.externalAngle1.next()), 1, this.externalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c1i = this.setControlPoint(0, Z4Math.deg2rad(this.internalAngle1.next()), -1, this.internalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2e = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.externalAngle2.next()), -1, this.externalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2i = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.internalAngle2.next()), 1, this.internalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.evalPointClosure(drawingPoint);

        double currentShadowShiftX = this.shadowShiftX.next();
        double currentShadowShiftY = this.shadowShiftY.next();
        double currentBorderSize = this.borderSize.next();
        boolean shadowOrBorder = $exists(currentShadowShiftX) || $exists(currentShadowShiftY) || currentBorderSize > 0;

        if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_0) {
          this.type0(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_1) {
          this.type1(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_2) {
          this.type2(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        } else if (this.naturalFigurePainterType == Z4NaturalFigurePainterType.TYPE_3) {
          this.type3(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        }
      }
    }
  }

  private void evalForce(Z4DrawingPoint drawingPoint, double originalAngle, double currentExternalForceAngle, double currentExternalForceTension) {
    if (currentExternalForceTension > 0) {
      double angle = Z4Math.deg2rad(currentExternalForceAngle) - originalAngle;
      double tension = drawingPoint.intensity * currentExternalForceTension;

      this.pF = new Z4Point(drawingPoint.z4Vector.x + tension * Math.cos(angle), drawingPoint.z4Vector.y + tension * Math.sin(angle));
    } else {
      this.pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    }
  }

  private Z4Point setControlPoint(double phase, double angle, int angleSign, double tension, double intensity, int side) {
    return Z4Math.rotate(intensity * tension, 0, phase + angleSign * side * angle);
  }

  private void evalPointClosure(Z4DrawingPoint drawingPoint) {
    if (this.controlPointClosure == Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0) {
      this.c1e = new Z4Point(this.c1e.x + drawingPoint.z4Vector.x, this.c1e.y + drawingPoint.z4Vector.y);
      this.c1i = new Z4Point(this.c1i.x + drawingPoint.z4Vector.x, this.c1i.y + drawingPoint.z4Vector.y);
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure == Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1) {
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure == Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2) {
    }
  }

  private void type0($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression,
          boolean shadowOrBorder, double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize,
          boolean drawBounds) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.c2i.x, this.c2i.y);

    if (shadowOrBorder) {
      this.pathForShadowBorder = new $Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
      this.pathForShadowBorder.bezierCurveTo(this.c2i.x, this.c2i.y, this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }

    this.drawFigure(context, drawingPoint, this.c1e, this.c2e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

  private void type1($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression,
          boolean shadowOrBorder, double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize,
          boolean drawBounds) {
    this.path1 = this.findControlPointPath(this.c1i.x, this.c1i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);

    if (shadowOrBorder) {
      this.pathForShadowBorder = new $Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c1i.x, this.c1i.y, this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
    }

    this.drawFigure(context, drawingPoint, this.c1i, this.c2i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);

    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);

    if (shadowOrBorder) {
      this.pathForShadowBorder = new $Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
    }

    this.drawFigure(context, drawingPoint, this.c1e, this.c2e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

  private void type2($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression,
          boolean shadowOrBorder, double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize,
          boolean drawBounds) {
    this.path1 = this.findControlPointPath(this.c2i.x, this.c2i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);

    if (shadowOrBorder) {
      this.pathForShadowBorder = new $Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c2i.x, this.c2i.y, this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);
    }

    this.drawFigure(context, drawingPoint, this.c2i, this.c1i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);

    this.path1 = this.findControlPointPath(this.c2e.x, this.c2e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);

    if (shadowOrBorder) {
      this.pathForShadowBorder = new $Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c2e.x, this.c2e.y, this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);
    }

    this.drawFigure(context, drawingPoint, this.c2e, this.c1e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

  private void type3($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression,
          boolean shadowOrBorder, double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize,
          boolean drawBounds) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.c2e.x, this.c2e.y);

    if (shadowOrBorder) {
      this.pathForShadowBorder = new $Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
      this.pathForShadowBorder.bezierCurveTo(this.c2e.x, this.c2e.y, this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }

    this.drawFigure(context, drawingPoint, this.c1e, this.c2i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

  private Z4Point findControlPointPath(double p1x, double p1y, double p2x, double p2y) {
    Z4Vector helpVector = Z4Vector.fromPoints(p1x, p1y, p2x, p2y);
    return Z4Math.rotate(helpVector.module, 0, helpVector.phase);
  }

  private void drawFigure($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4Point c1, Z4Point c2, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression,
          double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize,
          boolean drawBounds) {
    if ($exists(currentShadowShiftX) || $exists(currentShadowShiftY)) {
      this.drawShadow(context, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
    }
    if (currentBorderSize > 0) {
      this.drawBorder(context, currentBorderSize);
    }

    if (drawBounds) {
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, null, null, drawBounds);
    } else if (spatioTemporalColor.isColor()) {
      Color color = spatioTemporalColor.getColorAt(-1, -1);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting(), drawBounds);
    } else if (spatioTemporalColor.isGradientColor()) {
      if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.SPATIAL) {
        this.drawFigureWithColors(context, drawingPoint, c1, c2, spatioTemporalColor, null, null, progression.getLighting(), drawBounds);
      } else {
        Color color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
        this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting(), drawBounds);
      }
    } else if (spatioTemporalColor.isBiGradientColor()) {
      Z4GradientColor gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, gradientColor, null, progression.getLighting(), drawBounds);
    }
  }

  @SuppressWarnings("null")
  private void drawFigureWithColors($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4Point c1, Z4Point c2, Z4SpatioTemporalColor spatioTemporalColor, Z4GradientColor gradientColor, Color color, Z4Lighting lighting, boolean drawBounds) {
    double length = Math.max(Z4Math.distance(this.path1.x, this.path1.y, 0, 0), Z4Math.distance(this.path2.x, this.path2.y, 0, 0));

    if (drawBounds) {
      double indentationValue = this.indentation * Math.random();
      double indentationAngle = Z4Math.TWO_PI * Math.random();

      context.save();

      this.drawBezier(context, drawingPoint, c1, c2, 0, indentationValue, indentationAngle, 1, new Color(128, 128, 128, 255));
      this.drawBezier(context, drawingPoint, c1, c2, 1, indentationValue, indentationAngle, 1, new Color(128, 128, 128, 255));

      context.translate(1, 1);
      this.drawBezier(context, drawingPoint, c1, c2, 0, indentationValue, indentationAngle, 1, new Color(0, 0, 0, 255));
      this.drawBezier(context, drawingPoint, c1, c2, 1, indentationValue, indentationAngle, 1, new Color(0, 0, 0, 255));

      context.restore();
    } else {
      for (int i = 0; i < length; i += 3) {
        double val = i / length;
        Color c = color;
        if ($exists(color) && lighting == Z4Lighting.NONE) {
        } else {
          if ($exists(spatioTemporalColor)) {
            c = spatioTemporalColor.getColorAt(-1, val);
          } else if ($exists(gradientColor)) {
            c = gradientColor.getColorAt(val, true);
          }
        }

        if (lighting == Z4Lighting.NONE) {
        } else if (lighting == Z4Lighting.LIGHTED_IN_OUT) {
          c = c.lighted(1 - val);
        } else if (lighting == Z4Lighting.DARKENED_IN_OUT) {
          c = c.darkened(1 - val);
        } else if (lighting == Z4Lighting.LIGHTED_OUT_IN) {
          c = c.lighted(val);
        } else if (lighting == Z4Lighting.DARKENED_OUT_IN) {
          c = c.darkened(val);
        }

        this.drawBezier(context, drawingPoint, c1, c2, val, this.indentation * Math.random(), Z4Math.TWO_PI * Math.random(), 3, c);
      }
    }
  }

  private void drawBezier($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4Point c1, Z4Point c2, double val, double indentationValue, double indentationAngle, double lineWidth, Color c) {
    double indentX = indentationValue > 0 ? indentationValue * Math.cos(indentationAngle) : 0;
    double indentY = indentationValue > 0 ? indentationValue * Math.sin(indentationAngle) : 0;

    context.save();

    context.lineWidth = lineWidth;
    context.strokeStyle = Z4Constants.$getStyle(c.getRGBA_HEX());

    context.beginPath();
    context.moveTo(drawingPoint.z4Vector.x0, 0);
    context.bezierCurveTo(c1.x + this.path1.x * val, c1.y + this.path1.y * val, c2.x + this.path2.x * val, c2.y + this.path2.y * val, this.pF.x + indentX, this.pF.y + indentY);
    context.stroke();

    context.restore();
  }

  private void drawShadow($CanvasRenderingContext2D context, double currentShadowShiftX, double currentShadowShiftY, double currentBorderSize) {
    context.save();

    context.translate(currentShadowShiftX, currentShadowShiftY);

    if (currentBorderSize > 0) {
      context.lineWidth = currentBorderSize;
      context.strokeStyle = Z4Constants.$getStyle(this.shadowColor.getRGBA_HEX());
      context.stroke(this.pathForShadowBorder);
    }

    context.fillStyle = Z4Constants.$getStyle(this.shadowColor.getRGBA_HEX());
    context.fill(this.pathForShadowBorder);

    context.restore();
  }

  private void drawBorder($CanvasRenderingContext2D context, double currentBorderSize) {
    context.save();
    context.lineWidth = currentBorderSize;
    context.strokeStyle = Z4Constants.$getStyle(this.borderColor.getRGBA_HEX());
    context.stroke(this.pathForShadowBorder);
    context.restore();
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    json.$set("naturalFigurePainterType", this.naturalFigurePainterType);
    json.$set("controlPointClosure", this.controlPointClosure);

    json.$set("size", this.size.toJSON());

    json.$set("internalAngle1", this.internalAngle1.toJSON());
    json.$set("externalAngle1", this.externalAngle1.toJSON());
    json.$set("internalAngle2", this.internalAngle2.toJSON());
    json.$set("externalAngle2", this.externalAngle2.toJSON());

    json.$set("internalTension1", this.internalTension1.toJSON());
    json.$set("externalTension1", this.externalTension1.toJSON());
    json.$set("internalTension2", this.internalTension2.toJSON());
    json.$set("externalTension2", this.externalTension2.toJSON());

    json.$set("indentation", this.indentation);

    json.$set("externalForceAngle", this.externalForceAngle.toJSON());
    json.$set("externalForceTension", this.externalForceTension.toJSON());

    json.$set("shadowShiftX", this.shadowShiftX.toJSON());
    json.$set("shadowShiftY", this.shadowShiftY.toJSON());
    json.$set("shadowColor", this.shadowColor.getJSON());

    json.$set("borderSize", this.borderSize.toJSON());
    json.$set("borderColor", this.borderColor.getJSON());

    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  public static Z4NaturalFigurePainter fromJSON($Object json) {
    return new Z4NaturalFigurePainter(
            json.$get("naturalFigurePainterType"),
            json.$get("controlPointClosure"),
            Z4FancifulValue.fromJSON(json.$get("size")),
            Z4FancifulValue.fromJSON(json.$get("internalAngle1")), Z4FancifulValue.fromJSON(json.$get("externalAngle1")), Z4FancifulValue.fromJSON(json.$get("internalAngle2")), Z4FancifulValue.fromJSON(json.$get("externalAngle2")),
            Z4FancifulValue.fromJSON(json.$get("internalTension1")), Z4FancifulValue.fromJSON(json.$get("externalTension1")), Z4FancifulValue.fromJSON(json.$get("internalTension2")), Z4FancifulValue.fromJSON(json.$get("externalTension2")),
            json.$get("indentation"),
            Z4FancifulValue.fromJSON(json.$get("externalForceAngle")), Z4FancifulValue.fromJSON(json.$get("externalForceTension")),
            Z4FancifulValue.fromJSON(json.$get("shadowShiftX")), Z4FancifulValue.fromJSON(json.$get("shadowShiftY")), Color.fromJSON(json.$get("shadowColor")),
            Z4FancifulValue.fromJSON(json.$get("borderSize")), Color.fromJSON(json.$get("borderColor"))
    );
  }
}
