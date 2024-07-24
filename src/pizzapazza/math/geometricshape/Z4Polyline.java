package pizzapazza.math.geometricshape;

import def.js.Array;
import def.js.Number;
import javascript.swing.JSOptionPane;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.math.Z4Vector;
import pizzapazza.util.Z4Translations;
import simulation.js.$Array;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.js.$Path2D;

/**
 * The poyline
 *
 * @author gianpiero.diblasi
 */
public class Z4Polyline extends Z4GeometricShape {

  private final Array<Z4Point> points;
  private final Array<Double> cumLen = new $Array<>();

  /**
   * Creates the object
   *
   * @param points The points
   */
  public Z4Polyline(Array<Z4Point> points) {
    super(Z4GeometricShapeType.POLYLINE);
    this.points = points.map(point -> point);

    this.points.forEach((point, index, array) -> {
      if (index == 0) {
        this.cumLen.push(0.0);
      } else {
        this.cumLen.push(this.cumLen.$get(index - 1) + Z4Math.distance(point.x, point.y, this.points.$get(index - 1).x, this.points.$get(index - 1).y));
      }
    });
  }

  /**
   * Concatenates this polyline with another polyline
   *
   * @param polyline The other polyline
   * @return The concatenation of this polyline with the other polyline
   */
  public Z4Polyline concat(Z4Polyline polyline) {
    return new Z4Polyline((($Array<Z4Point>) this.points).concat(polyline.points));
  }

  @Override
  public boolean isPath() {
    return true;
  }

  @Override
  public $Path2D getPath2D(boolean withDirection) {
    $Path2D path2D = new $Path2D();

    this.points.forEach((point, index, array) -> {
      if ($exists(index)) {
        path2D.lineTo(point.x, point.y);
      } else {
        path2D.moveTo(point.x, point.y);
      }
    });

    if (withDirection) {
      this.cumLen.forEach((value, index, array) -> {
        if ($exists(index)) {
          this.drawDirection(path2D, (this.cumLen.$get(index - 1) + (value - this.cumLen.$get(index - 1)) / 2) / this.getLength());
        }
      });
    }

    return path2D;
  }

  @Override
  public double distance(double x, double y) {
    return this.points.
            map((point, index, array) -> index == 0 ? Number.MAX_VALUE : Z4Math.ptSegDist(point.x, point.y, array.$get(index - 1).x, array.$get(index - 1).y, x, y)).
            reduce((accumulator, current, index, array) -> Math.min(accumulator, current));
  }

  @Override
  public double getLength() {
    return this.cumLen.$get(this.cumLen.length - 1);
  }

  @Override
  public Z4Point getPointAt(double position) {
    double finalPos = position * this.cumLen.$get(this.cumLen.length - 1);
    int index = this.cumLen.findIndex(pos -> pos >= finalPos, null);

    if (this.cumLen.$get(index) == finalPos) {
      return this.points.$get(index);
    } else if (this.cumLen.$get(index - 1) == finalPos) {
      return this.points.$get(index - 1);
    } else {
      double div = (finalPos - this.cumLen.$get(index - 1)) / (this.cumLen.$get(index) - this.cumLen.$get(index - 1));
      double x = (this.points.$get(index).x - this.points.$get(index - 1).x) * div + this.points.$get(index - 1).x;
      double y = (this.points.$get(index).y - this.points.$get(index - 1).y) * div + this.points.$get(index - 1).y;
      return new Z4Point(x, y);
    }
  }

  @Override
  public Z4Vector getTangentAt(double position) {
    double finalPos = position * this.cumLen.$get(this.cumLen.length - 1);
    int index = this.cumLen.findIndex(pos -> pos >= finalPos, null);

    if (this.cumLen.$get(index) == finalPos) {
      if ($exists(index)) {
        return Z4Vector.fromVector(this.points.$get(index).x, this.points.$get(index).y, 1, Z4Math.atan(this.points.$get(index - 1).x, this.points.$get(index - 1).y, this.points.$get(index).x, this.points.$get(index).y));
      } else {
        return Z4Vector.fromPoints(this.points.$get(index).x, this.points.$get(index).y, this.points.$get(index + 1).x, this.points.$get(index + 1).y);
      }
    } else if (this.cumLen.$get(index - 1) == finalPos) {
      return Z4Vector.fromPoints(this.points.$get(index - 1).x, this.points.$get(index - 1).y, this.points.$get(index).x, this.points.$get(index).y);
    } else {
      double div = (finalPos - this.cumLen.$get(index - 1)) / (this.cumLen.$get(index) - this.cumLen.$get(index - 1));
      double x = (this.points.$get(index).x - this.points.$get(index - 1).x) * div + this.points.$get(index - 1).x;
      double y = (this.points.$get(index).y - this.points.$get(index - 1).y) * div + this.points.$get(index - 1).y;
      return Z4Vector.fromPoints(x, y, this.points.$get(index).x, this.points.$get(index).y);
    }
  }

  @Override
  public Array<Z4Point> getControlPoints() {
    return this.points.map(point -> point);
  }

  @Override
  public Array<Integer> getControlPointConnections() {
    Array<Integer> controlPointConnections = new Array<>();
    this.points.forEach((point, index, array) -> {
      controlPointConnections.push(index);
      if (0 < index && index < this.points.length - 1) {
        controlPointConnections.push(index);
      }
    });
    return controlPointConnections;
  }

  @Override
  public Array<Z4GeometricShapeSpinnerConfiguration> getSpinnerConfigurations() {
    return new Array<>();
  }

  @Override
  public Array<Z4GeometricShapeButtonConfiguration> getButtonConfigurations() {
    return new Array<>(
            new Z4GeometricShapeButtonConfiguration(Z4Translations.ADD, (controlPoints, selectedControlPoint, apply) -> {
              Array<Z4Point> newPoints = new Array<>();
              controlPoints.forEach((controlPoint, index, array) -> {
                if (index != selectedControlPoint) {
                  newPoints.push(controlPoint);
                } else if (index == controlPoints.length - 1) {
                  newPoints.push(new Z4Point((controlPoints.$get(index - 1).x + controlPoints.$get(index).x) / 2, (controlPoints.$get(index - 1).y + controlPoints.$get(index).y) / 2));
                  newPoints.push(controlPoint);
                } else {
                  newPoints.push(controlPoint);
                  newPoints.push(new Z4Point((controlPoints.$get(index).x + controlPoints.$get(index + 1).x) / 2, (controlPoints.$get(index).y + controlPoints.$get(index + 1).y) / 2));
                }
              });
              apply.$apply(new Z4Polyline(newPoints));
            }),
            new Z4GeometricShapeButtonConfiguration(Z4Translations.DELETE, (controlPoints, selectedControlPoint, apply) -> {
              if (controlPoints.length == 2) {
                JSOptionPane.showMessageDialog(Z4Translations.CANNOT_DELETE_POINT_MESSAGE, Z4Translations.DELETE, JSOptionPane.WARNING_MESSAGE, null);
                apply.$apply(this);
              } else {
                JSOptionPane.showConfirmDialog(Z4Translations.DELETE_POINT_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
                  if (response == JSOptionPane.YES_OPTION) {
                    apply.$apply(new Z4Polyline(controlPoints.filter((controlPoint, index, array) -> selectedControlPoint != index)));
                  } else {
                    apply.$apply(this);
                  }
                });
              }
            })
    );
  }

  @Override
  public Z4GeometricShape fromDataChanged(Array<Z4Point> controlPoints, double x, double y, int pointIndex, double spinnerValue, int spinnerIndex, int width, int height) {
    return pointIndex != -1 ? new Z4Polyline(this.points.map((point, index, array) -> index == pointIndex ? new Z4Point(x, y) : point)) : this;
  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    Array<$Object> pointsJSON = new Array<>();
    this.points.forEach(point -> {
      $Object pointJSON = new $Object();
      pointJSON.$set("x", point.x);
      pointJSON.$set("y", point.y);
      pointsJSON.push(pointJSON);
    });
    json.$set("points", pointsJSON);

    return json;
  }

  /**
   * Creates a Z4Polyline from a JSON object
   *
   * @param json The JSON object
   * @return The geometric shape
   */
  @SuppressWarnings("unchecked")
  public static Z4Polyline fromJSON($Object json) {
    Array<Z4Point> points = new Array<>();
    ((Iterable<$Object>) json.$get("points")).forEach(pointJSON -> points.push(new Z4Point(pointJSON.$get("x"), pointJSON.$get("y"))));
    return new Z4Polyline(points);
  }

  /**
   * Creates a Z4Polyline contained in a given size
   *
   * @param width The width
   * @param height The height
   * @return The geometric shape
   */
  public static Z4Polyline fromSize(int width, int height) {
    return new Z4Polyline(new Array<>(
            new Z4Point(width / 4, height / 2),
            new Z4Point(width / 2, height / 4),
            new Z4Point(3 * width / 4, height / 2)
    ));
  }
}
