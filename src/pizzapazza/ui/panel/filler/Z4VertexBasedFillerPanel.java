package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.js.Array;
import javascript.awt.GridBagConstraints;
import javascript.awt.Point;
import javascript.swing.JSCheckBox;
import javascript.swing.JSLabel;
import javascript.swing.JSSlider;
import javascript.swing.MnR.DefaultSliderModelAndRenderer;
import javascript.util.KeyValue;
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

  /**
   * Creates the object
   */
  @SuppressWarnings("unchecked")
  public Z4VertexBasedFillerPanel() {
    super(3, new Array<>(
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY, "image/filler/elliptic_stop.png"),
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY, "image/filler/elliptic_fill.png"),
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY, "image/filler/elliptic_symmetric.png"),
            new KeyValue<>(Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY, "image/filler/elliptic_repeat.png")
    ));

    JSLabel label = new JSLabel();
    label.setText(Z4Translations.VERTICES);
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 6;
    constraints.gridwidth = 1;
    constraints.gridheight = 1;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.fill = GridBagConstraints.NONE;
    this.add(label, constraints);

    this.star.setText(Z4Translations.STAR);
    this.star.setEnabled(false);
    this.star.addActionListener(event -> {
      this.setIcons();
      this.drawPreview(false);
    });

    constraints = new GridBagConstraints();
    constraints.gridx = 1;
    constraints.gridy = 6;
    constraints.gridwidth = 2;
    constraints.gridheight = 1;
    constraints.anchor = GridBagConstraints.EAST;
    constraints.fill = GridBagConstraints.NONE;
    this.add(this.star, constraints);

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

    constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 7;
    constraints.gridwidth = 3;
    constraints.gridheight = 1;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    this.add(this.vertexCounter, constraints);
    this.getChilStyleByQuery("*:nth-child(12) datalist option:nth-child(8)").fontSize = "larger";

    this.drawPreview(false);
  }

  private void setIcons() {
    if (this.vertexCounter.getValue() == 7) {
      this.setChildAttributeByQuery("div label:nth-child(1) img", "src", "image/filler/elliptic_stop.png");
      this.setChildAttributeByQuery("div label:nth-child(2) img", "src", "image/filler/elliptic_fill.png");
      this.setChildAttributeByQuery("div label:nth-child(3) img", "src", "image/filler/elliptic_symmetric.png");
      this.setChildAttributeByQuery("div label:nth-child(4) img", "src", "image/filler/elliptic_repeat.png");
    } else if (this.star.isSelected()) {
      this.setChildAttributeByQuery("div label:nth-child(1) img", "src", "image/filler/star_stop.png");
      this.setChildAttributeByQuery("div label:nth-child(2) img", "src", "image/filler/star_fill.png");
      this.setChildAttributeByQuery("div label:nth-child(3) img", "src", "image/filler/star_symmetric.png");
      this.setChildAttributeByQuery("div label:nth-child(4) img", "src", "image/filler/star_repeat.png");
    } else {
      this.setChildAttributeByQuery("div label:nth-child(1) img", "src", "image/filler/polygon_stop.png");
      this.setChildAttributeByQuery("div label:nth-child(2) img", "src", "image/filler/polygon_fill.png");
      this.setChildAttributeByQuery("div label:nth-child(3) img", "src", "image/filler/polygon_symmetric.png");
      this.setChildAttributeByQuery("div label:nth-child(4) img", "src", "image/filler/polygon_repeat.png");
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
        int ry = (int) Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(2).x, points.$get(2).y);
        angle = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) - Z4Math.HALF_PI;

        int p2x = (int) Math.max(0, Math.min(Math.round(points.$get(0).x + ry * Math.cos(angle)), width));
        int p2y = (int) Math.max(0, Math.min(Math.round(points.$get(0).y + ry * Math.sin(angle)), height));

        points.$set(1, new Point(x, y));
        points.$set(2, new Point(p2x, p2y));
        break;
      case 2:
        int rx = (int) Z4Math.distance(points.$get(0).x, points.$get(0).y, points.$get(1).x, points.$get(1).y);
        angle = Z4Math.atan(points.$get(0).x, points.$get(0).y, x, y) + Z4Math.HALF_PI;

        int p1x = (int) Math.max(0, Math.min(Math.round(points.$get(0).x + rx * Math.cos(angle)), width));
        int p1y = (int) Math.max(0, Math.min(Math.round(points.$get(0).y + rx * Math.sin(angle)), height));

        points.$set(1, new Point(p1x, p1y));
        points.$set(2, new Point(x, y));
        break;
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
