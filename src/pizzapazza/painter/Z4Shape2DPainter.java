package pizzapazza.painter;

import javascript.awt.Color;
import pizzapazza.color.Z4ColorProgression;
import pizzapazza.color.Z4SpatioTemporalColor;
import pizzapazza.math.Z4DrawingPoint;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4Math;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Object;
import simulation.js.$Path2D;

/**
 * The painter of 2D shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4Shape2DPainter extends Z4Painter {

  private final Z4FancifulValue width;
  private final Z4FancifulValue height;
  private final boolean regular;
  private final boolean star;
  private final int vertices;

  private final Z4FancifulValue shadowShiftX;
  private final Z4FancifulValue shadowShiftY;
  private final Color shadowColor;

  private final Z4FancifulValue borderWidth;
  private final Z4FancifulValue borderHeight;
  private final Color borderColor;

  private final $Path2D path = new $Path2D();

  /**
   * Creates the object
   *
   * @param width The width
   * @param height The height
   * @param regular true if the shape is regular (width = height), false
   * otherwise
   * @param star true if the shape is a star, false otherwise
   * @param vertices The number of vertices, -1 for an ellipse
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderWidth The border width
   * @param borderHeight The border height
   * @param borderColor The border color
   */
  public Z4Shape2DPainter(
          Z4FancifulValue width, Z4FancifulValue height, boolean regular, boolean star, int vertices,
          Z4FancifulValue shadowShiftX, Z4FancifulValue shadowShiftY, Color shadowColor,
          Z4FancifulValue borderWidth, Z4FancifulValue borderHeight, Color borderColor) {
    this.width = width;
    this.height = height;
    this.regular = regular;
    this.star = star;
    this.vertices = vertices;

    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;

    this.borderWidth = borderWidth;
    this.borderHeight = borderHeight;
    this.borderColor = borderColor;

    if (vertices == -1) {
      this.path.arc(0, 0, 0.5, 0, Z4Math.TWO_PI);
    } else if (star) {
      Z4Math.getStarVertices(vertices).forEach((point, index, array) -> {
        if ($exists(index)) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    } else {
      Z4Math.getPolygonVertices(vertices).forEach((point, index, array) -> {
        if ($exists(index)) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    }
    this.path.closePath();
  }

  @Override
  public Z4PainterType getType() {
    return Z4PainterType.SHAPE_2D;
  }

  /**
   * Returns the width
   *
   * @return The width
   */
  public Z4FancifulValue getWidth() {
    return this.width;
  }

  /**
   * Returns the height
   *
   * @return The height
   */
  public Z4FancifulValue getHeight() {
    return this.height;
  }

  /**
   * Checks if the shape is regular (width = height)
   *
   * @return true if the shape is regular (width = height), false otherwise
   */
  public boolean isRegular() {
    return this.regular;
  }

  /**
   * Checks if the shape is a star
   *
   * @return true if the shape is a star, false otherwise
   */
  public boolean isStar() {
    return this.star;
  }

  /**
   * Returns the number of vertices, -1 for an ellipse
   *
   * @return The number of vertices, -1 for an ellipse
   */
  public int getVertices() {
    return this.vertices;
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
   * Returns the border width
   *
   * @return The border width
   */
  public Z4FancifulValue getBorderWidth() {
    return this.borderWidth;
  }

  /**
   * Returns the border height
   *
   * @return The border height
   */
  public Z4FancifulValue getBorderHeight() {
    return this.borderHeight;
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
  public void draw($CanvasRenderingContext2D context, Z4DrawingPoint drawingPoint, Z4SpatioTemporalColor spatioTemporalColor, Z4ColorProgression progression) {

  }

  @Override
  public $Object toJSON() {
    $Object json = super.toJSON();

    json.$set("width", this.width.toJSON());
    json.$set("height", this.height.toJSON());
    json.$set("regular", this.regular);
    json.$set("star", this.star);
    json.$set("vertices", this.vertices);

    json.$set("shadowShiftX", this.shadowShiftX.toJSON());
    json.$set("shadowShiftY", this.shadowShiftY.toJSON());

    if ($exists(this.shadowColor)) {
      $Object jsonColor = new $Object();
      jsonColor.$set("red", this.shadowColor.red);
      jsonColor.$set("green", this.shadowColor.green);
      jsonColor.$set("blue", this.shadowColor.blue);
      jsonColor.$set("alpha", this.shadowColor.alpha);
      json.$set("shadowColor", jsonColor);
    }

    json.$set("borderWidth", this.borderWidth.toJSON());
    json.$set("borderHeight", this.borderHeight.toJSON());

    if ($exists(this.borderColor)) {
      $Object jsonColor = new $Object();
      jsonColor.$set("red", this.borderColor.red);
      jsonColor.$set("green", this.borderColor.green);
      jsonColor.$set("blue", this.borderColor.blue);
      jsonColor.$set("alpha", this.borderColor.alpha);
      json.$set("borderColor", jsonColor);
    }

    return json;
  }

  /**
   * Creates a Z4Shape2DPainter from a JSON object
   *
   * @param json The JSON object
   * @return the shape 2D painter
   */
  public static Z4Shape2DPainter fromJSON($Object json) {
    Color shadowColor = null;
    if ($exists(json.$get("shadowColor"))) {
      $Object jsonColor = json.$get("shadowColor");
      shadowColor = new Color(jsonColor.$get("red"), jsonColor.$get("green"), jsonColor.$get("blue"), jsonColor.$get("alpha"));
    }

    Color borderColor = null;
    if ($exists(json.$get("borderColor"))) {
      $Object jsonColor = json.$get("borderColor");
      shadowColor = new Color(jsonColor.$get("red"), jsonColor.$get("green"), jsonColor.$get("blue"), jsonColor.$get("alpha"));
    }

    return new Z4Shape2DPainter(
            Z4FancifulValue.fromJSON(json.$get("width")), Z4FancifulValue.fromJSON(json.$get("height")), json.$get("regular"), json.$get("star"), json.$get("vertices"),
            Z4FancifulValue.fromJSON(json.$get("shadowShiftX")), Z4FancifulValue.fromJSON(json.$get("shadowShiftY")), shadowColor,
            Z4FancifulValue.fromJSON(json.$get("borderWidth")), Z4FancifulValue.fromJSON(json.$get("borderHeight")), borderColor
    );
  }
}
