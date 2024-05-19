package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import javascript.awt.GridBagConstraints;
import javascript.awt.Point;
import javascript.swing.JSCheckBox;
import javascript.swing.JSSlider;
import javascript.swing.MnR.DefaultSliderModelAndRenderer;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractBoundaryBehaviorFiller;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.filler.Z4EllipticFiller;
import pizzapazza.filler.Z4PolygonFiller;
import pizzapazza.filler.Z4StarFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.util.Z4Translations;
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
            Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY,
            Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY
    ));

    this.addLabel(Z4Translations.VERTICES, 0, 6, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    this.star.setText(Z4Translations.STAR);
    this.star.setEnabled(false);
    this.star.addActionListener(event -> {
      this.setIcons();
      this.drawPreview(false);
    });

    this.addComponent(this.star, 1, 6, 2, 1, GridBagConstraints.EAST, GridBagConstraints.NONE, null);

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

    this.addComponent(this.vertexCounter, 0, 7, 3, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    this.getChilStyleByQuery("*:nth-child(12) datalist option:nth-child(8)").fontSize = "larger";

    this.regular.setText(Z4Translations.REGULAR);
    this.regular.addActionListener(event -> {
      if (this.regular.isSelected()) {
        this.requestSetPointPosition();
        this.drawPreview(false);
      }
    });

    this.appendChildInTree("*:nth-child(9)", this.regular);

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
    double angle;

    switch (selectedIndex) {
      case 0:
        int offsetX = points.$get(0).x - x;
        int offsetY = points.$get(0).y - y;

        points.$set(0, new Point(x, y));
        points.$set(1, new Point(Math.max(0, Math.min(points.$get(1).x - offsetX, width)), Math.max(0, Math.min(points.$get(1).y - offsetY, height))));
        points.$set(2, new Point(Math.max(0, Math.min(points.$get(2).x - offsetX, width)), Math.max(0, Math.min(points.$get(2).y - offsetY, height))));
        break;
      case 1:
        double ry = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        angle = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;

        double p2x = points.$get(0).x + ry * Math.cos(angle);
        double p2y = points.$get(0).y + ry * Math.sin(angle);
        while (p2x < 0 || p2x > width || p2y < 0 || p2y > height) {
          ry = Math.max(0, ry - 0.5);
          p2x = points.$get(0).x + ry * Math.cos(angle);
          p2y = points.$get(0).y + ry * Math.sin(angle);
        }

        points.$set(1, new Point(x, y));
        points.$set(2, new Point((int) Math.round(p2x), (int) Math.round(p2y)));
        break;
      case 2:
        double rx = Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        angle = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Z4Math.HALF_PI;

        double p1x = points.$get(0).x + rx * Math.cos(angle);
        double p1y = points.$get(0).y + rx * Math.sin(angle);
        while (p1x < 0 || p1x > width || p1y < 0 || p1y > height) {
          rx = Math.max(0, rx - 0.5);
          p1x = points.$get(0).x + rx * Math.cos(angle);
          p1y = points.$get(0).y + rx * Math.sin(angle);
        }

        points.$set(1, new Point((int) Math.round(p1x), (int) Math.round(p1y)));
        points.$set(2, new Point(x, y));
        break;
    }

    if (this.regular.isSelected()) {
      int rx = (int) Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
      int ry = (int) Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);

      if (rx != ry) {
        switch (selectedIndex) {
          case 0:
          case 1:
            angle = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;
            int p2x = (int) Math.max(0, Math.min(Math.round(points.$get(0).x + ry * Math.cos(angle)), width));
            int p2y = (int) Math.max(0, Math.min(Math.round(points.$get(0).y + ry * Math.sin(angle)), height));
            break;
          case 2:
            break;
        }
      }
    }
  }

  @Override
  protected void pushPointPositions(Array<Point> points, int width, int height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
    points.push(new Point(width / 2, 0));
  }

  @Override
  protected boolean needsRescale(Object option) {
    switch ((int) option) {
      case Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY:
      case Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY:
        return false;
      case Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY:
      case Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY:
        return this.vertexCounter.getValue() != 7;
      default:
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
      return new Z4EllipticFiller(gradientColor, points.$get(0).x, points.$get(0).y, rx, ry, angle, (int) option);
    } else if (this.star.isSelected()) {
      return new Z4StarFiller(gradientColor, points.$get(0).x, points.$get(0).y, rx, ry, angle, vertex + 3, (int) option);
    } else {
      return new Z4PolygonFiller(gradientColor, points.$get(0).x, points.$get(0).y, rx, ry, angle, vertex + 3, (int) option);
    }
  }

  @Override
  protected void drawObjects($CanvasRenderingContext2D ctx, Array<Point> mappedPoints) {
    Array<Double> dash = new Array<>();

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    ctx.strokeStyle = this.$getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();

    dash.push(2.5, 2.5);

    ctx.beginPath();
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(1).x, mappedPoints.$get(1).y);
    ctx.moveTo(mappedPoints.$get(0).x, mappedPoints.$get(0).y);
    ctx.lineTo(mappedPoints.$get(2).x, mappedPoints.$get(2).y);
    ctx.strokeStyle = this.$getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

  private String getStrokeStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }
}
