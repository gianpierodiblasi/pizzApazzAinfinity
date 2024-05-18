/**
 * The panel to manage a (multi) (infinite-)vertex filler
 *
 * @author gianpiero.diblasi
 */
class Z4VertexBasedFillerPanel extends Z4AbstractFillerPanel {

   star = new JSCheckBox();

   vertexCounter = new JSSlider();

  /**
   * Creates the object
   */
  constructor() {
    super(3, new Array(new KeyValue(Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY, "image/filler/elliptic_stop.png"), new KeyValue(Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY, "image/filler/elliptic_fill.png"), new KeyValue(Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY, "image/filler/elliptic_symmetric.png"), new KeyValue(Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY, "image/filler/elliptic_repeat.png")));
    let label = new JSLabel();
    label.setText(Z4Translations.VERTICES);
    let constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 6;
    constraints.gridwidth = 1;
    constraints.gridheight = 1;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.fill = GridBagConstraints.NONE;
    this.add(label, constraints);
    this.star.setText(Z4Translations.STAR);
    this.star.setEnabled(false);
    this.star.addActionListener(event => {
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
    let vertexModelAndRenderer = new DefaultSliderModelAndRenderer();
    for (let vertex = 3; vertex < 10; vertex++) {
      vertexModelAndRenderer.addElement("" + vertex);
    }
    vertexModelAndRenderer.addElement("\u221E");
    this.vertexCounter.setModelAndRenderer(vertexModelAndRenderer);
    this.vertexCounter.setValue(7);
    this.vertexCounter.addChangeListener(event => {
      this.star.setEnabled(this.vertexCounter.getValue() !== 7);
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

   setIcons() {
    if (this.vertexCounter.getValue() === 7) {
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

   setPointPosition(points, selectedIndex, x, y, width, height) {
    let angle = 0.0;
    switch(selectedIndex) {
      case 0:
        let offsetX = points[0].x - x;
        let offsetY = points[0].y - y;
        points[0] = new Point(x, y);
        points[1] = new Point(Math.max(0, Math.min(points[1].x - offsetX, width)), Math.max(0, Math.min(points[1].y - offsetY, height)));
        points[2] = new Point(Math.max(0, Math.min(points[2].x - offsetX, width)), Math.max(0, Math.min(points[2].y - offsetY, height)));
        break;
      case 1:
        let ry = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
        let p2x = Math.max(0, Math.min(Math.round(points[0].x + ry * Math.cos(angle)), width));
        let p2y = Math.max(0, Math.min(Math.round(points[0].y + ry * Math.sin(angle)), height));
        points[1] = new Point(x, y);
        points[2] = new Point(p2x, p2y);
        break;
      case 2:
        let rx = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        let p1x = Math.max(0, Math.min(Math.round(points[0].x + rx * Math.cos(angle)), width));
        let p1y = Math.max(0, Math.min(Math.round(points[0].y + rx * Math.sin(angle)), height));
        points[1] = new Point(p1x, p1y);
        points[2] = new Point(x, y);
        break;
    }
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
    points.push(new Point(width / 2, 0));
  }

   needsRescale(option) {
    switch(option) {
      case Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY:
      case Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY:
        return false;
      case Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY:
      case Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY:
        return this.vertexCounter.getValue() !== 7;
      default:
        return true;
    }
  }

   getFiller(gradientColor, points, option) {
    let rx = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
    let ry = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
    let angle = Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y);
    let vertex = this.vertexCounter.getValue();
    if (vertex === 7) {
      return new Z4EllipticFiller(gradientColor, points[0].x, points[0].y, rx, ry, angle, option);
    } else if (this.star.isSelected()) {
      return new Z4StarFiller(gradientColor, points[0].x, points[0].y, rx, ry, angle, vertex + 3, option);
    } else {
      return new Z4PolygonFiller(gradientColor, points[0].x, points[0].y, rx, ry, angle, vertex + 3, option);
    }
  }

   drawObjects(ctx, mappedPoints) {
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.strokeStyle = this.getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.strokeStyle = this.getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

   getStrokeStyle(style) {
    return style;
  }
}
