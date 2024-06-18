package pizzapazza.painter;

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

      Z4Point point = this.checkWhirlpool(currentAngle, currentHole, currentSize);
      this.drawBounds(context, currentHole, point);
    } else {
    }
  }

  private Z4Point checkWhirlpool(double currentAngle, double currentHole, double currentSize) {
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

  private Z4Point findControlPointPath(double p1x, double p1y, double p2x, double p2y, double currentCover) {
    double module = Z4Math.distance(p1x, p1y, p2x, p2y);
    double phase = Z4Math.atan(p1x, p1y, p2x, p2y);

    return new Z4Point(module * currentCover * Math.cos(phase), module * currentCover * Math.sin(phase));
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
