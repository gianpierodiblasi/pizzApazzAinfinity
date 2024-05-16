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
    let button = new JSButton();
    button.setText("STOP_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4PolygonFiller.STOP_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4PolygonFiller.FILL_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4PolygonFiller.SYMMETRIC_AT_BOUNDARY));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4PolygonFiller.REPEAT_AT_BOUNDARY));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb) {
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

   getFillStyle(style) {
    return style;
  }
}
