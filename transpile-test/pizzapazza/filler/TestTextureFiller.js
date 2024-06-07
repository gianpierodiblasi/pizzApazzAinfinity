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
