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
