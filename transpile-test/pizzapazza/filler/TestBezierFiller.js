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
    button.addActionListener(event => this.fill(Z4EllipticFiller.STOP_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("FILL_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4EllipticFiller.FILL_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("SYMMETRIC_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4EllipticFiller.SYMMETRIC_AT_BOUNDARY, checkBox.isSelected()));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("REPEAT_AT_BOUNDARY");
    button.addActionListener(event => this.fill(Z4EllipticFiller.REPEAT_AT_BOUNDARY, checkBox.isSelected()));
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
