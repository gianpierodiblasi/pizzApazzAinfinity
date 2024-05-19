/**
 * The panel to manage a (multi) (infinite-)vertex filler
 *
 * @author gianpiero.diblasi
 */
class Z4VertexBasedFillerPanel extends Z4AbstractFillerPanel {

   star = new JSCheckBox();

   vertexCounter = new JSSlider();

   regular = new JSCheckBox();

  /**
   * Creates the object
   */
  constructor() {
    super(3, new Array(Z4AbstractBoundaryBehaviorFiller.STOP_AT_BOUNDARY, Z4AbstractBoundaryBehaviorFiller.FILL_AT_BOUNDARY, Z4AbstractBoundaryBehaviorFiller.SYMMETRIC_AT_BOUNDARY, Z4AbstractBoundaryBehaviorFiller.REPEAT_AT_BOUNDARY));
    this.addLabel(Z4Translations.VERTICES, 0, 7, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.star.setText(Z4Translations.STAR);
    this.star.setEnabled(false);
    this.star.addActionListener(event => {
      this.setIcons();
      this.drawPreview(false);
    });
    this.addComponent(this.star, 1, 7, 2, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, null);
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
    this.addComponent(this.vertexCounter, 0, 8, 3, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    this.getChilStyleByQuery("*:nth-child(13) datalist option:nth-child(8)").fontSize = "larger";
    this.regular.setText(Z4Translations.REGULAR);
    this.regular.addActionListener(event => {
      this.setPointsEnabled();
      this.drawPreview(false);
    });
    this.appendChildInTree("*:nth-child(10)", this.regular);
    this.cssAddClass("z4ellipticfillerpanel");
    this.drawPreview(false);
  }

   setIcons() {
    this.cssRemoveClass("z4ellipticfillerpanel");
    this.cssRemoveClass("z4starfillerpanel");
    this.cssRemoveClass("z4polygonfillerpanel");
    if (this.vertexCounter.getValue() === 7) {
      this.cssAddClass("z4ellipticfillerpanel");
    } else if (this.star.isSelected()) {
      this.cssAddClass("z4starfillerpanel");
    } else {
      this.cssAddClass("z4polygonfillerpanel");
    }
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    let angle1 = 0.0;
    let radius1 = 0.0;
    let point1 = null;
    let angle2 = 0.0;
    let radius2 = 0.0;
    let point2 = null;
    switch(selectedIndex) {
      case 0:
        let offsetX = points[0].x - x;
        let offsetY = points[0].y - y;
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y);
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, points[2].x, points[2].y);
        points[0] = new Point(x, y);
        point1 = this.getPoint(points[0].x, points[0].y, points[1].x - offsetX, points[1].y - offsetY, radius1, angle1, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        point2 = this.getPoint(points[0].x, points[0].y, points[2].x - offsetX, points[2].y - offsetY, radius2, angle2, width, height);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        break;
      case 1:
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
        point2 = this.getPoint(points[0].x, points[0].y, points[0].x + radius2 * Math.cos(angle2), points[0].y + radius2 * Math.sin(angle2), radius2, angle2, width, height);
        points[1] = new Point(x, y);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        break;
      case 2:
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        point1 = this.getPoint(points[0].x, points[0].y, points[0].x + radius1 * Math.cos(angle1), points[0].y + radius1 * Math.sin(angle1), radius1, angle1, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        points[2] = new Point(x, y);
        break;
    }
  }

   getPoint(cx, cy, x, y, radius, angle, width, height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
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
      return new Z4EllipticFiller(gradientColor, points[0].x, points[0].y, rx, this.regular.isSelected() ? rx : ry, angle, option);
    } else if (this.star.isSelected()) {
      return new Z4StarFiller(gradientColor, points[0].x, points[0].y, rx, this.regular.isSelected() ? rx : ry, angle, vertex + 3, option);
    } else {
      return new Z4PolygonFiller(gradientColor, points[0].x, points[0].y, rx, this.regular.isSelected() ? rx : ry, angle, vertex + 3, option);
    }
  }

   isPointEnabled(index) {
    return index !== 2 || !this.regular.isSelected();
  }

   drawObjects(ctx, mappedPoints) {
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    if (!this.regular.isSelected()) {
      ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
      ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    }
    ctx.strokeStyle = this.getStrokeStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    if (!this.regular.isSelected()) {
      ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
      ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    }
    ctx.strokeStyle = this.getStrokeStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }

   getStrokeStyle(style) {
    return style;
  }
}
