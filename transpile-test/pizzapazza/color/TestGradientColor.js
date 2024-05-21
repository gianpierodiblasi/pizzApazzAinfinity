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
    button.addActionListener(event => this.fill(0));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("WHITE->BLACK RIPPLE");
    button.addActionListener(event => this.fill(1));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("RED-TRANS -> YELLOW");
    button.addActionListener(event => this.fill(2));
    buttons.add(button, null);
    button = new JSButton();
    button.setText("COLORFUL");
    button.addActionListener(event => this.fill(3));
    buttons.add(button, null);
    this.getContentPane().add(buttons, BorderLayout.NORTH);
  }

   fill(bb) {
    let gradientColor = new Z4GradientColor();
    switch(bb) {
      case 0:
        break;
      case 1:
        gradientColor.setRipple(0.3);
        break;
      case 2:
        gradientColor.addColor(new Color(255, 0, 0, 0), 0);
        gradientColor.addColor(new Color(255, 255, 0, 255), 1);
        break;
      case 3:
        gradientColor.addColor(new Color(255, 0, 0, 255), 0);
        gradientColor.addColor(new Color(255, 0, 255, 255), 0.3);
        gradientColor.addColor(new Color(0, 145, 255, 255), 0.7);
        gradientColor.addColor(new Color(255, 255, 0, 255), 1);
        break;
    }
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
