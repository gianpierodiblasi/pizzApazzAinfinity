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
    this.addLabel(Z4Translations.VERTICES, 0, 6, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.star.setText(Z4Translations.STAR);
    this.star.setEnabled(false);
    this.star.addActionListener(event => {
      this.setIcons();
      this.drawPreview(false);
    });
    this.addComponent(this.star, 1, 6, 2, 1, GridBagConstraints.EAST, GridBagConstraints.NONE, null);
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
    this.addComponent(this.vertexCounter, 0, 7, 3, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    this.getChilStyleByQuery("*:nth-child(12) datalist option:nth-child(8)").fontSize = "larger";
    this.regular.setText(Z4Translations.REGULAR);
    this.regular.addActionListener(event => {
      if (this.regular.isSelected()) {
        this.requestSetPointPosition();
        this.drawPreview(false);
      }
    });
    this.appendChildInTree("*:nth-child(9)", this.regular);
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
        let p2x = points[0].x + ry * Math.cos(angle);
        let p2y = points[0].y + ry * Math.sin(angle);
        while (p2x < 0 || p2x > width || p2y < 0 || p2y > height) {
          ry = Math.max(0, ry - 0.5);
          p2x = points[0].x + ry * Math.cos(angle);
          p2y = points[0].y + ry * Math.sin(angle);
        }
        points[1] = new Point(x, y);
        points[2] = new Point(Math.round(p2x), Math.round(p2y));
        break;
      case 2:
        let rx = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        let p1x = points[0].x + rx * Math.cos(angle);
        let p1y = points[0].y + rx * Math.sin(angle);
        while (p1x < 0 || p1x > width || p1y < 0 || p1y > height) {
          rx = Math.max(0, rx - 0.5);
          p1x = points[0].x + rx * Math.cos(angle);
          p1y = points[0].y + rx * Math.sin(angle);
        }
        points[1] = new Point(Math.round(p1x), Math.round(p1y));
        points[2] = new Point(x, y);
        break;
    }
    if (this.regular.isSelected()) {
      let rx = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
      let ry = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
      if (rx !== ry) {
        switch(selectedIndex) {
          case 0:
          case 1:
            angle = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
            let p2x = Math.max(0, Math.min(Math.round(points[0].x + ry * Math.cos(angle)), width));
            let p2y = Math.max(0, Math.min(Math.round(points[0].y + ry * Math.sin(angle)), height));
            break;
          case 2:
            break;
        }
      }
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
