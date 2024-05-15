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
