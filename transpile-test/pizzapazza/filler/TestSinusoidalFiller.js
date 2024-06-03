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
