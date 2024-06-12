package pizzapazza.iterator;

import pizzapazza.color.Z4Lighting;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4Vector;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Object;

/**
 *
 * @author gianpiero.diblasi
 */
public class Z4Scatterer extends Z4PointIterator {

  private final Z4FancifulValue multiplicity;
  private final Z4FancifulValue scattering;

  private Z4Point before;
  private int currentMultiplicityCounter;
  private int currentMultiplicityTotal;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param scattering The scattering
   * @param rotation The rotation
   */
  public Z4Scatterer(Z4FancifulValue multiplicity, Z4FancifulValue scattering, Z4Rotation rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.scattering = scattering;
  }

  @Override
  public boolean drawAction(Z4PointIteratorDrawingAction action, double x, double y) {
    if (action == Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;

      return false;
    } else if (action == Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());

      this.before = this.currentPoint;
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;

      return true;
    } else if (action == Z4PointIteratorDrawingAction.STOP) {
      return false;
    } else {
      return false;
    }
  }

  @Override
  public Z4DrawingPoint next() {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;

      double nextScattering = this.scattering.next();
      Z4Vector currentVector = Z4Vector.fromPoints(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y);
      double angle = this.rotation.next(currentVector.phase);
      Z4Vector vector = Z4Vector.fromVector(this.currentPoint.x + nextScattering * Math.cos(angle), this.currentPoint.y + nextScattering * Math.sin(angle), 1, angle);

//      this.progression.next(this.z4Point);
//point.modeLighting=modeLighting;
//    point.colorPosition=this.evaluateColorPosition(nextScattering/scattering);
      return new Z4DrawingPoint(
              vector,
              1,
              Z4Lighting.NONE,
              0,
              false,
              this.rotation.computeSide(vector, currentVector),
              false
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

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();
    json.$set("multiplicity", this.multiplicity.toJSON());
    json.$set("scattering", this.scattering.toJSON());
    return json;
  }
}
