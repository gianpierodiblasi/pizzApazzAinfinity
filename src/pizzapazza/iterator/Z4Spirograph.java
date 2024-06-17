package pizzapazza.iterator;

import def.js.Array;
import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4ColorProgressionBehavior;
import pizzapazza.color.Z4Lighting;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Vector;
import pizzapazza.painter.Z4ArrowPainter;
import pizzapazza.painter.Z4Painter;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;

/**
 * The spirograph
 *
 * @author gianpiero.diblasi
 */
public class Z4Spirograph extends Z4PointIterator {

  private Z4Point center;
  private Array<Z4DrawingPoint> clones = new Array<>();
  private int clonePos;
  private boolean fromClones;

  /**
   * Creates the object
   *
   * @param rotation The rotation
   */
  public Z4Spirograph(Z4Rotation rotation) {
    super(rotation);
  }

  @Override
  public Z4PointIteratorType getType() {
    return Z4PointIteratorType.SPIROGRAPH;
  }

  @Override
  public boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y) {
    if (action == Z4PointIteratorDrawingAction.START) {
      this.center = new Z4Point(x, y);
      this.hasNext = false;

      this.clones = new Array<>();
      this.fromClones = false;

      return false;
    } else if (action == Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;

      return true;
    } else if (action == Z4PointIteratorDrawingAction.STOP) {
      this.fromClones = true;
      this.clonePos = this.clones.length - 1;
      this.hasNext = this.clonePos != -1;

      return true;
    } else {
      return false;
    }
  }

  @Override
  public Z4DrawingPoint next(Z4SpatioTemporalColor color, Z4ColorProgression progression) {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      Z4DrawingPoint clone = this.clones.$get(this.clonePos);

      this.clonePos--;
      this.hasNext = this.clonePos != -1;

      return new Z4DrawingPoint(
              clone.z4Vector,
              clone.intensity,
              this.clonePos / this.clones.length,
              false,
              clone.side,
              clone.useVectorModuleAsSize
      );
    } else {
      Z4Vector currentVector = Z4Vector.fromPoints(this.center.x, this.center.y, this.currentPoint.x, this.currentPoint.y);
      double angle = this.rotation.next(currentVector.phase);
      Z4Vector vector = Z4Vector.fromVector(this.center.x, this.center.y, currentVector.module, angle);

      boolean drawBounds = false;
      double temporalPosition = $exists(this.nextdDrawingPoint) ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        drawBounds = true;
      } else if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      
      this.hasNext = false;

      this.nextdDrawingPoint = new Z4DrawingPoint(
              vector,
              1,
              temporalPosition,
              drawBounds,
              this.rotation.computeSide(vector, currentVector),
              true
      );
      if (this.nextdDrawingPoint.drawBounds) {
        this.clones.push(this.nextdDrawingPoint);
      }
      return this.nextdDrawingPoint;
    }
  }

  @Override
  public boolean isInfinitePointGenerator() {
    return false;
  }

  @Override
  public int getInfinitePointGeneratorSleep() {
    return 0;
  }

  @Override
  public void drawDemo($CanvasRenderingContext2D context, Z4Painter painter, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression, double width, double height) {
    Z4Painter finalPainter = $exists(painter) ? painter : new Z4ArrowPainter();
    Z4SpatioTemporalColor finalspSpatioTemporalColor = $exists(spatioTemporalColor) ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    Z4ColorProgression finalColorProgression = $exists(progression) ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, Z4Lighting.NONE);
    
  }
  
  /**
   * Creates a Z4Spirograph from a JSON object
   *
   * @param json The JSON object
   * @return the spirograph
   */
  public static Z4Spirograph fromJSON($Object json) {
    return new Z4Spirograph(Z4Rotation.fromJSON(json.$get("rotation")));
  }
}
