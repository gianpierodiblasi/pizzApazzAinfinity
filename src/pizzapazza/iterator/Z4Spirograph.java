package pizzapazza.iterator;

import def.js.Array;
import pizzapazza.color.Z4Lighting;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Vector;

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
  public Z4DrawingPoint next() {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      Z4DrawingPoint clone = this.clones.$get(this.clonePos);
//      clone.setColorPosition(this.clonePos / this.clones.length);
//      clone.setDrawBounds(false);

      this.clonePos--;
      this.hasNext = this.clonePos != -1;
      return clone;
    } else {
      Z4Vector currentVector = Z4Vector.fromPoints(this.center.x, this.center.y, this.currentPoint.x, this.currentPoint.y);
      double angle = this.rotation.next(currentVector.phase);
      Z4Vector vector = Z4Vector.fromVector(this.center.x, this.center.y, currentVector.module, angle);

//      this.progression.next(this.z4Point);
//      if (this.z4Point.isDrawBounds()) {
//        this.clones.push(this.z4Point.clone());
//      }
      this.hasNext = false;

      return new Z4DrawingPoint(
              vector,
              1,
              Z4Lighting.NONE,
              0,
              false,
              this.rotation.computeSide(vector, currentVector),
              true
      );
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
}
