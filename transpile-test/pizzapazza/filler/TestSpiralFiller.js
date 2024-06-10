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
      this.ctx.strokeStyle = Z4Constants.getStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(px, py);
      this.ctx.stroke();
    }
  }
}
