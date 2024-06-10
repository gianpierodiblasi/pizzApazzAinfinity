package pizzapazza.ui.panel.filler;

import def.js.Array;
import javascript.awt.GBC;
import javascript.awt.Point;
import javascript.swing.JSCheckBox;
import javascript.swing.JSSlider;
import javascript.swing.MnR.DefaultSliderModelAndRenderer;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4BoundaryBehavior;
import pizzapazza.filler.Z4EllipticFiller;
import pizzapazza.filler.Z4PolygonFiller;
import pizzapazza.filler.Z4StarFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.math.Z4Point;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;

/**
 * The panel to manage a (multi) (infinite-)vertex filler
 *
 * @author gianpiero.diblasi
 */
public class Z4VertexBasedFillerPanel extends Z4AbstractFillerPanel {

  private final JSCheckBox star = new JSCheckBox();
  private final JSSlider vertexCounter = new JSSlider();
  private final JSCheckBox regular = new JSCheckBox();

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4VertexBasedFillerPanel() {
    super(3, new Array<>(
            Z4BoundaryBehavior.STOP_AT_BOUNDARY,
            Z4BoundaryBehavior.FILL_AT_BOUNDARY,
            Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY,
            Z4BoundaryBehavior.REPEAT_AT_BOUNDARY
    ));

    Z4UI.addLabel(this, Z4Translations.VERTICES, new GBC(0, 7).a(GBC.WEST));

    this.star.setText(Z4Translations.STAR);
    this.star.setEnabled(false);
    this.star.addActionListener(event -> {
      this.setIcons();
      this.drawPreview(false);
    });

    this.add(this.star, new GBC(1, 7).w(3).a(GBC.EAST));

    DefaultSliderModelAndRenderer<String> vertexModelAndRenderer = new DefaultSliderModelAndRenderer<>();
    for (int vertex = 3; vertex < 10; vertex++) {
      vertexModelAndRenderer.addElement("" + vertex);
    }
    vertexModelAndRenderer.addElement("\u221E");
    this.vertexCounter.setModelAndRenderer(vertexModelAndRenderer);
    this.vertexCounter.setValue(7);
    this.vertexCounter.addChangeListener(event -> {
      this.star.setEnabled(this.vertexCounter.getValue() != 7);
      this.setIcons();
      this.drawPreview(false);
    });

    this.add(this.vertexCounter, new GBC(0, 8).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));
    this.getChilStyleByQuery("*:nth-child(13) datalist option:nth-child(8)").fontSize = "larger";

    this.regular.setText(Z4Translations.REGULAR);
    this.regular.addActionListener(event -> {
      this.setPointsEnabled();
      this.drawPreview(false);
    });

    this.appendChildInTree("*:nth-child(10)", this.regular);

    this.cssAddClass("z4ellipticfillerpanel");
    this.drawPreview(false);
  }

  private void setIcons() {
    this.cssRemoveClass("z4ellipticfillerpanel");
    this.cssRemoveClass("z4starfillerpanel");
    this.cssRemoveClass("z4polygonfillerpanel");

    if (this.vertexCounter.getValue() == 7) {
      this.cssAddClass("z4ellipticfillerpanel");
    } else if (this.star.isSelected()) {
      this.cssAddClass("z4starfillerpanel");
    } else {
      this.cssAddClass("z4polygonfillerpanel");
    }
  }

  @Override
  protected void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height) {
    double angle1;
    double radius1;
    Z4Point point1;
    double angle2;
    double radius2;
    Z4Point point2;

    switch (selectedIndex) {
      case 0:
        int offsetX = points.$get(0).x - x;
        int offsetY = points.$get(0).y - y;

        radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);

        points.$set(0, new Point(x, y));

        point1 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(1).x - offsetX, points.$get(1).y - offsetY, radius1, angle1, width, height);
        points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));

        point2 = this.getPoint(points.$get(0).x, points.$get(0).y, points.$get(2).x - offsetX, points.$get(2).y - offsetY, radius2, angle2, width, height);
        points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));
        break;
      case 1:
        radius2 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        angle2 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;

        point2 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius2 * Math.cos(angle2), points.$get(0).y + radius2 * Math.sin(angle2),
                radius2, angle2, width, height);

        points.$set(1, new Point(x, y));
        points.$set(2, new Point((int) Math.round(point2.x), (int) Math.round(point2.y)));
        break;
      case 2:
        radius1 = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        angle1 = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Z4Math.HALF_PI;

        point1 = this.getPoint(
                points.$get(0).x, points.$get(0).y,
                points.$get(0).x + radius1 * Math.cos(angle1), points.$get(0).y + radius1 * Math.sin(angle1),
                radius1, angle1, width, height);

        points.$set(1, new Point((int) Math.round(point1.x), (int) Math.round(point1.y)));
        points.$set(2, new Point(x, y));
        break;
    }
  }

  private Z4Point getPoint(double cx, double cy, double x, double y, double radius, double angle, int width, int height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
    points.push(new Point(width / 2, 0));
  }

  @Override
  protected boolean needsRescale(Object option) {
    if (option == Z4BoundaryBehavior.STOP_AT_BOUNDARY || option == Z4BoundaryBehavior.FILL_AT_BOUNDARY) {
      return false;
    } else if (option == Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY || option == Z4BoundaryBehavior.REPEAT_AT_BOUNDARY) {
      return this.vertexCounter.getValue() != 7;
    } else {
      return true;
    }
  }

  @Override
  protected Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option) {
    int rx = (int) Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
    int ry = (int) Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
    double angle = Z4Math.atan(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);

    int vertex = this.vertexCounter.getValue();
    if (vertex == 7) {
      return new Z4EllipticFiller(gradientColor, points.$get(0).x, points.$get(0).y, rx, this.regular.isSelected() ? rx : ry, angle, (Z4BoundaryBehavior) option);
    } else if (this.star.isSelected()) {
      return new Z4StarFiller(gradientColor, points.$get(0).x, points.$get(0).y, rx, this.regular.isSelected() ? rx : ry, angle, vertex + 3, (Z4BoundaryBehavior) option);
    } else {
      return new Z4PolygonFiller(gradientColor, points.$get(0).x, points.$get(0).y, rx, this.regular.isSelected() ? rx : ry, angle, vertex + 3, (Z4BoundaryBehavior) option);
    }
  }

  @Override
  protected boolean isPointEnabled(int index) {
    return index != 2 || !this.regular.isSelected();
  }

  @Override
  protected void drawObjects($CanvasRenderingContext2D ctx, Array<Point> mappedPoints) {
    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    if (!this.regular.isSelected()) {
      ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
      ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    }
    ctx.strokeStyle = Z4Constants.$getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    if (!this.regular.isSelected()) {
      ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
      ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    }
    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
