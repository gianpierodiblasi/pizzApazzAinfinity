/**
 * @author gianpiero.diblasi
 */
class TestBiGradientColor extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.backgroundImage = "url(../../../image/chessboard.png)";
    let buttons = new JSPanel();
    let button = new JSButton();
    button.setText("WHITE->BLACK");
    button.addActionListener(event => this.fill(new Z4BiGradientColor()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK SPACE RIPPLE");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      biGradientColor.setGradientRipple(0.3);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/WHITE->RED");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let whiteRed = new Z4GradientColor();
      whiteRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(whiteRed, 1);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/WHITE->RED TEMPORAL RIPPLE");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let whiteRed = new Z4GradientColor();
      whiteRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(whiteRed, 1);
      biGradientColor.setRipple(0.3);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED TEMPORAL MIRROR");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      biGradientColor.mirror();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED TEMPORAL REVERSE");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      biGradientColor.reverse();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED SPACE MIRROR");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      biGradientColor.gradientMirror();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED SPACE REVERSE");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      biGradientColor.gradientReverse();
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED TEMPORAL RIPPLE");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      biGradientColor.setRipple(0.3);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/GREEN->RED SPACE/TEMPORAL RIPPLE");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      biGradientColor.setRipple(0.3);
      biGradientColor.setGradientRipple(0.1);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK/WHITE->BLUE->BLACK/GREEN->RED");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let whiteBlueBlack = new Z4GradientColor();
      whiteBlueBlack.addColor(new Color(0, 0, 255, 255), 0.5);
      biGradientColor.addColor(whiteBlueBlack, 0.5);
      let greenRed = new Z4GradientColor();
      greenRed.addColor(new Color(0, 255, 0, 255), 0);
      greenRed.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(greenRed, 1);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("COLORFUL");
    button.addActionListener(event => {
      let biGradientColor = new Z4BiGradientColor();
      let gc = new Z4GradientColor();
      gc.addColor(new Color(0, 0, 255, 255), 0.5);
      biGradientColor.addColor(gc, 0.5);
      gc = new Z4GradientColor();
      gc.addColor(new Color(0, 255, 0, 255), 0);
      gc.addColor(new Color(255, 0, 0, 255), 1);
      biGradientColor.addColor(gc, 1);
      gc = new Z4GradientColor();
      gc.addColor(new Color(0, 255, 255, 255), 0.7);
      biGradientColor.addColor(gc, 0.3);
      gc = new Z4GradientColor();
      gc.addColor(new Color(45, 55, 100, 255), 0.2);
      biGradientColor.addColor(gc, 0.7);
      this.fill(biGradientColor);
    });
    buttons.add(button, null);
  }

   fill(biGradientColor) {
    let json = biGradientColor.toJSON();
    console.log(json);
    biGradientColor = Z4BiGradientColor.fromJSON(json);
    let imageData = this.ctx.createImageData(500, 500);
    let data = imageData.data;
    for (let y = 0; y < 500; y++) {
      let gradientColor = biGradientColor.getColorAt(y / 500, true);
      for (let x = 0; x < 500; x++) {
        let index = (y * 500 + x) * 4;
        let color = gradientColor.getColorAt(x / 500, true);
        data[index] = color.red;
        data[index + 1] = color.green;
        data[index + 2] = color.blue;
        data[index + 3] = color.alpha;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestGradientColor extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "100");
    this.canvas.style.backgroundImage = "url(../../../image/chessboard.png)";
    let buttons = new JSPanel();
    let button = new JSButton();
    button.setText("WHITE->BLACK");
    button.addActionListener(event => this.fill(new Z4GradientColor()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK RIPPLE");
    button.addActionListener(event => {
      let gradientColor = new Z4GradientColor();
      gradientColor.setRipple(0.3);
      this.fill(gradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("RED-TRANS -> YELLOW");
    button.addActionListener(event => {
      let gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 0), 0);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      this.fill(gradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("COLORFUL");
    button.addActionListener(event => {
      let gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 255), 0);
      gradientColor.addColor(new Color(255, 0, 255, 255), 0.1);
      gradientColor.addColor(new Color(0, 145, 255, 255), 0.6);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      this.fill(gradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("COLORFUL MIRROR");
    button.addActionListener(event => {
      let gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 255), 0);
      gradientColor.addColor(new Color(255, 0, 255, 255), 0.1);
      gradientColor.addColor(new Color(0, 145, 255, 255), 0.6);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      gradientColor.mirror();
      this.fill(gradientColor);
    });
    buttons.add(button, null);
    button = new JSButton();
    button.setText("COLORFUL REVERSE");
    button.addActionListener(event => {
      let gradientColor = new Z4GradientColor();
      gradientColor.addColor(new Color(255, 0, 0, 255), 0);
      gradientColor.addColor(new Color(255, 0, 255, 255), 0.1);
      gradientColor.addColor(new Color(0, 145, 255, 255), 0.6);
      gradientColor.addColor(new Color(255, 255, 0, 255), 1);
      gradientColor.reverse();
      this.fill(gradientColor);
    });
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(gradientColor) {
    let json = gradientColor.toJSON();
    console.log(json);
    gradientColor = Z4GradientColor.fromJSON(json);
    let imageData = this.ctx.createImageData(500, 100);
    let data = imageData.data;
    for (let x = 0; x < 500; x++) {
      let color = gradientColor.getColorAt(x / 500, true);
      for (let y = 0; y < 100; y++) {
        let index = (y * 500 + x) * 4;
        data[index] = color.red;
        data[index + 1] = color.green;
        data[index + 2] = color.blue;
        data[index + 3] = color.alpha;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestBezierFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb, showLines) {
    let x1 = 100;
    let y1 = 250;
    let ctrlx1 = 150;
    let ctrly1 = 100;
    let ctrlx2 = 230;
    let ctrly2 = 310;
    let x2 = 300;
    let y2 = 350;
    let radius = 50;
    let imageData = this.ctx.createImageData(500, 500);
    let start = new Date();
    new Z4BezierFiller(new Z4GradientColor(), x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2, radius, bb).fill(imageData);
    let stop = new Date();
    console.log(stop.getTime() - start.getTime());
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      this.ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
      this.ctx.fillRect(ctrlx1 - 2, ctrly1 - 2, 4, 4);
      this.ctx.fillRect(ctrlx2 - 2, ctrly2 - 2, 4, 4);
      this.ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.bezierCurveTo(ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestConicFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("NO SYMMETRIC");
    button.addActionListener(event => this.fill(false, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC");
    button.addActionListener(event => this.fill(true, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(b, showLines) {
    let cx = 200;
    let cy = 250;
    let angle = Math.PI / 3;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4ConicFiller(new Z4GradientColor(), cx, cy, angle, b).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      let px = cx + 50 * Math.cos(angle);
      let py = cy + 50 * Math.sin(angle);
      this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
      this.ctx.fillRect(px - 2, py - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(px, py);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestEllipticFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb, showLines) {
    let cx = 200;
    let cy = 250;
    let rx = 50;
    let ry = 100;
    let angle = Math.PI / 3;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4EllipticFiller(new Z4GradientColor(), cx, cy, rx, ry, angle, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      let p1x = cx + rx * Math.cos(angle);
      let p1y = cy + rx * Math.sin(angle);
      let p2x = cx + ry * Math.cos(angle + Z4Math.HALF_PI);
      let p2y = cy + ry * Math.sin(angle + Z4Math.HALF_PI);
      this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
      this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
      this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(p1x, p1y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(p2x, p2y);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestLinearFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb, showLines) {
    let p1x = 210;
    let p1y = 250;
    let p2x = 250;
    let p2y = 300;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4LinearFiller(new Z4GradientColor(), p1x, p1y, p2x, p2y, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
      this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("black");
      this.ctx.beginPath();
      this.ctx.moveTo(p1x, p1y);
      this.ctx.lineTo(p2x, p2y);
      this.ctx.stroke();
      let angle = Z4Math.atan(p1x, p1y, p2x, p2y) + Z4Math.HALF_PI;
      let line1x = (p1x + p2x) / 2;
      let line1y = (p1y + p2y) / 2;
      let line2x = line1x + 500 * Math.cos(angle);
      let line2y = line1y + 500 * Math.sin(angle);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(line1x, line1y);
      this.ctx.lineTo(line2x, line2y);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestPolygonFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb, showLines) {
    let cx = 200;
    let cy = 250;
    let rx = 50;
    let ry = 100;
    let angle = Math.PI / 3;
    let vertex = 5;
    let imageData = this.ctx.createImageData(500, 500);
    let start = new Date();
    new Z4PolygonFiller(new Z4GradientColor(), cx, cy, rx, ry, angle, vertex, bb).fill(imageData);
    let stop = new Date();
    console.log(stop.getTime() - start.getTime());
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      let p1x = cx + rx * Math.cos(angle);
      let p1y = cy + rx * Math.sin(angle);
      let p2x = cx + ry * Math.cos(angle + Z4Math.HALF_PI);
      let p2y = cy + ry * Math.sin(angle + Z4Math.HALF_PI);
      this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
      this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
      this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);
      for (let index = 0; index < vertex; index++) {
        let x = rx * Math.cos(index * Z4Math.TWO_PI / vertex);
        let y = ry * Math.sin(index * Z4Math.TWO_PI / vertex);
        let rotated = Z4Math.rotate(x, y, angle);
        this.ctx.fillRect(cx + rotated.x - 2, cy + rotated.y - 2, 4, 4);
      }
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(p1x, p1y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(p2x, p2y);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestSinusoidalFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb, showLines) {
    let x = 200;
    let y = 250;
    let angle = Math.PI / 3;
    let waveLength = 100;
    let period = 200;
    let amplitude = 70;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4SinusoidalFiller(new Z4GradientColor(), x, y, waveLength, period, amplitude, angle, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      let px = x + period * Math.cos(angle);
      let py = y + period * Math.sin(angle);
      let ampx = x + amplitude * Math.cos(angle + Z4Math.HALF_PI);
      let ampy = y + amplitude * Math.sin(angle + Z4Math.HALF_PI);
      this.ctx.fillRect(x - 2, y - 2, 4, 4);
      this.ctx.fillRect(px - 2, py - 2, 4, 4);
      this.ctx.fillRect(ampx - 2, ampy - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(px, py);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(ampx, ampy);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestSpiralFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("GEOMETRIC");
    button.addActionListener(event => this.fill(false, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("LOGARITHMIC");
    button.addActionListener(event => this.fill(true, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(b, showLines) {
    let cx = 200;
    let cy = 250;
    let radius = 100;
    let angle = Math.PI / 3;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4SpiralFiller(new Z4GradientColor(), cx, cy, radius, angle, b).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      let px = cx + radius * Math.cos(angle);
      let py = cy + radius * Math.sin(angle);
      this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
      this.ctx.fillRect(px - 2, py - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(px, py);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestStarFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4BoundaryBehavior.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb, showLines) {
    let cx = 200;
    let cy = 250;
    let rx = 50;
    let ry = 100;
    let angle = Math.PI / 3;
    let vertexCount = 7;
    let imageData = this.ctx.createImageData(500, 500);
    let start = new Date();
    new Z4StarFiller(new Z4GradientColor(), cx, cy, rx, ry, angle, vertexCount, bb).fill(imageData);
    let stop = new Date();
    console.log(stop.getTime() - start.getTime());
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      let p1x = cx + rx * Math.cos(angle);
      let p1y = cy + rx * Math.sin(angle);
      let p2x = cx + ry * Math.cos(angle + Z4Math.HALF_PI);
      let p2y = cy + ry * Math.sin(angle + Z4Math.HALF_PI);
      this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
      this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
      this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(p1x, p1y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(p2x, p2y);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestTextureFiller extends JSFrame {

   panel = new JSComponent(document.createElement("div"));

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

  constructor() {
    super();
    this.panel.appendNodeChild(this.canvas);
    this.getContentPane().add(this.panel, BorderLayout.CENTER);
    this.canvas.setAttribute("width", "500");
    this.canvas.setAttribute("height", "500");
    this.canvas.style.background = "gray";
    let buttons = new JSPanel();
    let checkBox = new JSCheckBox();
    checkBox.setSelected(true);
    checkBox.setText("Show Lines");
    buttons.add(checkBox, null);
    let button = new JSButton();
    button.setText("NO SYMMETRIC");
    button.addActionListener(event => this.open(false, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC");
    button.addActionListener(event => this.open(true, checkBox.isSelected()));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
    JSFileChooser.showOpenDialog(".png", JSFileChooser.SINGLE_SELECTION, 0, files => {
    });
  }

   open(b, showLines) {
    JSFileChooser.showOpenDialog(".png", JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => {
      let fileReader = new FileReader();
      fileReader.onload = event => {
        let image = document.createElement("img");
        image.onload = event2 => {
          let offscreen = new OffscreenCanvas(image.width, image.height);
          let offscreenCtx = offscreen.getContext("2d");
          offscreenCtx.drawImage(image, 0, 0);
          this.fill(offscreenCtx.getImageData(0, 0, image.width, image.height), b, showLines);
          return null;
        };
        image.src = fileReader.result;
        return null;
      };
      fileReader.readAsDataURL(file);
    }));
  }

   fill(texture, b, showLines) {
    let cx = 0;
    let cy = 0;
    let px = cx + 500;
    let py = cy + 500;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4TextureFiller(texture, cx, cy, px, py, new Color(255, 255, 255, 255), b).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    if (showLines) {
      this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
      this.ctx.fillRect(px - 2, py - 2, 4, 4);
      this.ctx.strokeStyle = this.getFillStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(px, py);
      this.ctx.stroke();
    }
  }

   getFillStyle(style) {
    return style;
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestColorPanel extends JSFrame {

  constructor(panel) {
    super();
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestFillerPanel extends JSFrame {

  constructor(panel) {
    super();
    let p = new JSPanel();
    p.add(panel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
    panel.setSize(500, 300);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestFancifulValuePanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    p.add(new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL), new GBC(0, 0).wx(1).i(5, 5, 5, 5));
    let labelled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, new GBC(1, 0).wx(1).i(5, 5, 5, 5));
    let disabled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(2, 0).wx(1).i(5, 5, 5, 5));
    p.add(new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL), new GBC(0, 1).w(3).i(5, 5, 5, 5));
    labelled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, new GBC(0, 2).w(3).i(5, 5, 5, 5));
    disabled = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).w(3).i(5, 5, 5, 5));
    let valued = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    valued.setLabel("Valore");
    valued.setConstantRange(20, 80);
    valued.setRandomRange(30, 70);
    valued.setRandomLengthRange(50, 100);
    valued.setValue(Z4FancifulValue.fromJSON(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(20, Z4RandomValueBehavior.BEZIER, 10)), false).toJSON()));
    p.add(valued, new GBC(0, 4).w(3).i(5, 5, 5, 5));
    valued.addChangeListener(event => {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    let valued2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
    valued2.setLabel("Valore");
    valued2.setSignsVisible(false);
    valued2.setConstantRange(20, 80);
    valued2.setRandomRange(30, 70);
    valued2.setRandomLengthRange(50, 100);
    valued2.setValue(Z4FancifulValue.fromJSON(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(20, Z4RandomValueBehavior.BEZIER, 10)), false).toJSON()));
    p.add(valued2, new GBC(0, 5).w(3).i(5, 5, 5, 5));
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestRandomValuePanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    let label = new JSLabel();
    label.setText("UNSIGNED");
    p.add(label, new GBC(0, 0));
    label = new JSLabel();
    label.setText("SIGNED");
    p.add(label, new GBC(1, 0));
    p.add(new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL), new GBC(0, 1).wx(1).i(5, 5, 5, 5));
    p.add(new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL), new GBC(1, 1).wx(1).i(5, 5, 5, 5));
    let labelled = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, new GBC(0, 2).wx(1).i(5, 5, 5, 5));
    labelled = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, new GBC(1, 2).wx(1).i(5, 5, 5, 5));
    let disabled = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).wx(1).i(5, 5, 5, 5));
    disabled = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(1, 3).wx(1).i(5, 5, 5, 5));
    let valued = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    valued.setLabel("Valore");
    valued.cssAddClass("z4abstractvaluepanel-titled");
    valued.setRange(20, 80);
    valued.setLengthRange(50, 100);
    valued.setValue(Z4RandomValue.fromJSON(new Z4RandomValue(30, Z4RandomValueBehavior.POLYLINE, 60).toJSON()));
    p.add(valued, new GBC(0, 4).wx(1).i(5, 5, 5, 5));
    let signedValue = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
    signedValue.setLabel("Valore");
    signedValue.cssAddClass("z4abstractvaluepanel-titled");
    signedValue.setRange(20, 80);
    signedValue.setLengthRange(50, 100);
    signedValue.setValue(Z4SignedRandomValue.fromJSON(new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.NEGATIVE), new Z4RandomValue(30, Z4RandomValueBehavior.POLYLINE, 60)).toJSON()));
    p.add(signedValue, new GBC(1, 4).wx(1).i(5, 5, 5, 5));
    valued.addChangeListener(event => {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    signedValue.addChangeListener(event => {
      if (!signedValue.getValueIsAdjusting()) {
        console.log(signedValue.getValue().toJSON());
      }
    });
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestRotationPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.setLayout(new GridBagLayout());
    p.add(new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL), new GBC(0, 0).wx(1).i(5, 5, 5, 5));
    let labelled = new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, new GBC(1, 0).wx(1).i(5, 5, 5, 5));
    let disabled = new Z4RotationPanel(Z4RotationPanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(2, 0).wx(1).i(5, 5, 5, 5));
    p.add(new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL), new GBC(0, 1).w(3).i(5, 5, 5, 5));
    labelled = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    p.add(labelled, new GBC(0, 2).w(3).i(5, 5, 5, 5));
    disabled = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, new GBC(0, 3).w(3).i(5, 5, 5, 5));
    let valued = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);
    valued.setLabel("Valore");
    valued.cssAddClass("z4abstractvaluepanel-titled");
    valued.setValue(Z4Rotation.fromJSON(new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false).toJSON()));
    p.add(valued, new GBC(0, 4).w(3).i(5, 5, 5, 5));
    valued.addChangeListener(event => {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestSignedValuePanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL), null);
    let labelled = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
    labelled.setLabel("Label");
    labelled.cssAddClass("z4abstractvaluepanel-titled");
    p.add(labelled, null);
    let disabled = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
    disabled.setEnabled(false);
    p.add(disabled, null);
    let valued = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
    valued.setLabel("Valore");
    valued.cssAddClass("z4abstractvaluepanel-titled");
    valued.setRange(20, 80);
    valued.setValue(Z4SignedValue.fromJSON(new Z4SignedValue(new Z4Sign(Z4SignBehavior.ALTERNATE), 30).toJSON()));
    valued.addChangeListener(event => {
      if (!valued.getValueIsAdjusting()) {
        console.log(valued.getValue().toJSON());
      }
    });
    p.add(valued, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestSignPanel extends JSFrame {

  constructor() {
    super();
    let p = new JSPanel();
    p.add(new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL), null);
    p.add(new Z4SignPanel(Z4SignPanelOrientation.VERTICAL), null);
    p.add(new Z4SignPanel(Z4SignPanelOrientation.SQUARED), null);
    let disabled = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
    disabled.setEnabled(false);
    p.add(disabled, null);
    let positive = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
    positive.setValue(Z4Sign.fromJSON(new Z4Sign(Z4SignBehavior.POSITIVE).toJSON()));
    positive.addChangeListener(event => console.log(positive.getValue().toJSON()));
    p.add(positive, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestFillingPanel extends JSFrame {

  constructor() {
    super();
    let fillingPanel = new Z4FillingPanel();
    fillingPanel.setSize(500, 300);
    let p = new JSPanel();
    p.add(fillingPanel, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }
}
/**
 * @author gianpiero.diblasi
 */
class TestPleaseWait extends JSFrame {

   value = 0;

  constructor() {
    super();
    let button = new JSButton();
    button.setText("TEST");
    button.addActionListener(event => Z4UI.pleaseWait(button, true, true, false, true, "", () => this.iterate()));
    let p = new JSPanel();
    p.add(button, null);
    this.getContentPane().add(p, BorderLayout.NORTH);
  }

   iterate() {
    for (let i = 0; i < 200; i++) {
      console.log(i);
    }
    Z4UI.setPleaseWaitProgressBarValue(this.value++);
    if (this.value === 100) {
      this.value = 0;
      Z4UI.pleaseWaitCompleted();
    } else {
      Z4UI.pleaseWaitAdvanced(() => this.iterate());
    }
  }
}
