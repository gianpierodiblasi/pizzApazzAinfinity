/**
 * The ruler
 *
 * @author gianpiero.diblasi
 */
class Z4Ruler extends Z4PointIterator {

  // private final boolean drawWhileMoving;
  // 
  // private Z4Point center;
  // private Array<Z4DrawingPoint> clones = new Array<>();
  // private int clonePos;
  // private boolean fromClones;
  /**
   * Creates the object
   *
   * @param drawWhileMoving true to draw while moving, false otherwise
   * @param rotation The rotation
   */
  constructor(drawWhileMoving, rotation) {
    super(rotation);
    // this.drawWhileMoving = drawWhileMoving;
  }

   getType() {
    return Z4PointIteratorType.RULER;
  }

  /**
   * Checks if this painter has to draw while moving
   *
   * @return true if this painter has to draw while moving, false otherwise
   */
  // public boolean isDrawWhileMoving() {
  // return this.drawWhileMoving;
  // }
   drawAction(action, progression, x, y) {
    // if (action == Z4PointIteratorDrawingAction.START) {
    // this.center = new Z4Point(x, y);
    // this.hasNext = false;
    // 
    // this.clones = new Array<>();
    // this.fromClones = false;
    // 
    // if (progression.isResetOnStartMoving()) {
    // this.nextdDrawingPoint = null;
    // }
    // 
    // return false;
    // } else if (action == Z4PointIteratorDrawingAction.CONTINUE) {
    // this.currentPoint = new Z4Point(x, y);
    // this.hasNext = true;
    // 
    // return true;
    // } else if (action == Z4PointIteratorDrawingAction.STOP) {
    // this.fromClones = true;
    // this.clonePos = this.clones.length - 1;
    // this.hasNext = this.clonePos != -1;
    // 
    // return true;
    // } else {
    // return false;
    // }
    return false;
  }

   next(color, progression) {
    // if (!this.hasNext) {
    // return null;
    // } else if (this.fromClones) {
    // Z4DrawingPoint clone = this.clones.$get(this.clonePos);
    // 
    // this.nextdDrawingPoint = new Z4DrawingPoint(
    // clone.z4Vector,
    // clone.intensity,
    // this.clonePos / this.clones.length,
    // Z4DrawingPointIntent.DRAW_OBJECTS,
    // clone.side,
    // clone.useVectorModuleAsSize
    // );
    // 
    // this.clonePos--;
    // this.hasNext = this.clonePos != -1;
    // 
    // return this.nextdDrawingPoint;
    // } else {
    // Z4Vector currentVector = Z4Vector.fromPoints(this.center.x, this.center.y, this.currentPoint.x, this.currentPoint.y);
    // double angle = this.rotation.next(currentVector.phase);
    // Z4Vector vector = Z4Vector.fromVector(this.center.x, this.center.y, currentVector.module, angle);
    // 
    // Z4DrawingPointIntent intent = this.drawWhileMoving ? Z4DrawingPointIntent.DRAW_OBJECTS : Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS;
    // double temporalPosition = $exists(this.nextdDrawingPoint) ? this.nextdDrawingPoint.temporalPosition : -1;
    // 
    // if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.TEMPORAL) {
    // temporalPosition = progression.next(temporalPosition);
    // } else if (this.drawWhileMoving && progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
    // intent = Z4DrawingPointIntent.DRAW_BOUNDS;
    // } else if (progression.getColorProgressionBehavior() == Z4ColorProgressionBehavior.RANDOM) {
    // temporalPosition = Math.random();
    // }
    // 
    // this.hasNext = false;
    // 
    // this.nextdDrawingPoint = new Z4DrawingPoint(
    // vector,
    // 1,
    // temporalPosition,
    // intent,
    // this.rotation.computeSide(vector, currentVector),
    // true
    // );
    // 
    // if (this.nextdDrawingPoint.intent == Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
    // this.clones = new Array<>(this.nextdDrawingPoint);
    // } else if (this.nextdDrawingPoint.intent == Z4DrawingPointIntent.DRAW_BOUNDS) {
    // this.clones.push(this.nextdDrawingPoint);
    // }
    // return this.nextdDrawingPoint;
    // }
    return null;
  }

   getNextCountOnSTOP() {
    // return this.clones.length;
    return 0;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    // Z4Painter finalPainter = $exists(painter) ? painter : new Z4ArrowPainter();
    // Z4SpatioTemporalColor finalSpatioTemporalColor = $exists(spatioTemporalColor) ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    // Z4ColorProgression finalColorProgression = $exists(progression) ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    // 
    // Array<Z4Point> points = this.initDraw(width, height);
    // Z4Point start = points.$get(0);
    // this.drawAction(Z4PointIteratorDrawingAction.START,finalColorProgression, start.x, start.y);
    // 
    // points.slice(1).forEach(point -> {
    // this.drawAction(Z4PointIteratorDrawingAction.CONTINUE,finalColorProgression, point.x, point.y);
    // this.drawDemoPoint(context, finalPainter, finalSpatioTemporalColor, finalColorProgression, valueIsAdjusting);
    // });
    // 
    // Z4Point stop = points.$get(points.length - 1);
    // this.drawAction(Z4PointIteratorDrawingAction.STOP,finalColorProgression, stop.x, stop.y);
    // this.drawDemoPoint(context, finalPainter, finalSpatioTemporalColor, finalColorProgression, valueIsAdjusting);
  }

  // private Array<Z4Point> initDraw(double w, double h) {
  // double w2 = w / 2;
  // double h2 = h / 2;
  // double wh8 = Math.min(w, h) / 16;
  // int size = parseInt(w * h / (100 * 100));
  // 
  // Array<Z4Point> array = new Array<>();
  // for (int i = 0; i < size; i++) {
  // double theta = Z4Math.TWO_PI * i / size;
  // array.push(new Z4Point(w2 + wh8 * theta * Math.cos(theta), h2 + wh8 * theta * Math.sin(theta)));
  // }
  // return array;
  // }
  // private void drawDemoPoint($CanvasRenderingContext2D context, Z4Painter arrowPainter, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression, boolean valueIsAdjusting) {
  // Z4DrawingPoint next;
  // while ((next = this.next(spatioTemporalColor, progression)) != null) {
  // if (valueIsAdjusting) {
  // next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
  // }
  // 
  // if (next.intent == Z4DrawingPointIntent.DRAW_OBJECTS || valueIsAdjusting) {
  // context.save();
  // context.translate(next.z4Vector.x0, next.z4Vector.y0);
  // context.rotate(next.z4Vector.phase);
  // arrowPainter.draw(context, next, spatioTemporalColor, progression);
  // context.restore();
  // }
  // }
  // }
   toJSON() {
    let json = super.toJSON();
    // json.$set("drawWhileMoving", this.drawWhileMoving);
    return json;
  }

  /**
   * Creates a Z4Ruler from a JSON object
   *
   * @param json The JSON object
   * @return the ruler
   */
  static  fromJSON(json) {
    return new Z4Ruler(json["drawWhileMoving"], Z4Rotation.fromJSON(json["rotation"]));
  }
}
