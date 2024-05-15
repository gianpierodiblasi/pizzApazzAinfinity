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
    let button = new JSButton();
    button.setText("NO SYMMETRIC");
    button.addActionListener(event => this.fill(false));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC");
    button.addActionListener(event => this.fill(true));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(b) {
    let cx = 0.4;
    let cy = 0.5;
    let angle = Math.PI / 3;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4ConicFiller(new Z4GradientColor(), cx, cy, angle, b).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    cx *= 500;
    cy *= 500;
    let px = cx + 50 * Math.cos(angle);
    let py = cy + 50 * Math.sin(angle);
    this.ctx.strokeStyle = this.getFillStyle("red");
    this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
    this.ctx.fillRect(px - 2, py - 2, 4, 4);
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(px, py);
    this.ctx.stroke();
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
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4EllipticFiller.STOP_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4EllipticFiller.FILL_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4EllipticFiller.REPEAT_AT_BOUNDARY));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb) {
    let cx = 0.4;
    let cy = 0.5;
    let rx = 0.1;
    let ry = 0.2;
    let angle = Math.PI / 3;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4EllipticFiller(new Z4GradientColor(), cx, cy, rx, ry, angle, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    cx *= 500;
    cy *= 500;
    rx *= 500;
    ry *= 500;
    let p1x = cx + rx * Math.cos(angle);
    let p1y = cy + rx * Math.sin(angle);
    let p2x = cx + ry * Math.cos(angle + Z4Math.HALF_PI);
    let p2y = cy + ry * Math.sin(angle + Z4Math.HALF_PI);
    this.ctx.strokeStyle = this.getFillStyle("red");
    this.ctx.fillRect(cx - 2, cy - 2, 4, 4);
    this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
    this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(p1x, p1y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(p2x, p2y);
    this.ctx.stroke();
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
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4LinearFiller.STOP_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4LinearFiller.FILL_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4LinearFiller.SYMMETRIC_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4LinearFiller.REPEAT_AT_BOUNDARY));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb) {
    let p1x = 0.42;
    let p1y = 0.5;
    let p2x = 0.5;
    let p2y = 0.6;
    let imageData = this.ctx.createImageData(500, 500);
    new Z4LinearFiller(new Z4GradientColor(), p1x, p1y, p2x, p2y, bb).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    p1x *= 500;
    p1y *= 500;
    p2x *= 500;
    p2y *= 500;
    this.ctx.strokeStyle = this.getFillStyle("black");
    this.ctx.fillRect(p1x - 2, p1y - 2, 4, 4);
    this.ctx.fillRect(p2x - 2, p2y - 2, 4, 4);
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

   getFillStyle(style) {
    return style;
  }
}
