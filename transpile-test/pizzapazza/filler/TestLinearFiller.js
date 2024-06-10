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
      this.ctx.strokeStyle = Z4Constants.getStyle("black");
      this.ctx.beginPath();
      this.ctx.moveTo(p1x, p1y);
      this.ctx.lineTo(p2x, p2y);
      this.ctx.stroke();
      let angle = Z4Math.atan(p1x, p1y, p2x, p2y) + Z4Math.HALF_PI;
      let line1x = (p1x + p2x) / 2;
      let line1y = (p1y + p2y) / 2;
      let line2x = line1x + 500 * Math.cos(angle);
      let line2y = line1y + 500 * Math.sin(angle);
      this.ctx.strokeStyle = Z4Constants.getStyle("red");
      this.ctx.beginPath();
      this.ctx.moveTo(line1x, line1y);
      this.ctx.lineTo(line2x, line2y);
      this.ctx.stroke();
    }
  }
}
