/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorPanel extends JSPanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   rippleSlider = new JSSlider();

   gradientColor = new Z4GradientColor();

   selectedIndex = 0;

  static  SELECTOR_RADIUS = 7;

  static  HEIGHT = 50;

  constructor() {
    super();
    this.cssAddClass("z4gradientcolorpanel");
    this.setLayout(new GridBagLayout());
    this.preview.setProperty("height", "" + Z4GradientColorPanel.HEIGHT);
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.addComponent(this.preview, 0, 0, 1, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, null);
    this.addLabel(Z4Translations.RIPPLE, 0, 1, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.rippleSlider.setMinimum(0);
    this.rippleSlider.setMaximum(100);
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.setPaintLabels(true);
    this.rippleSlider.setPaintTicks(true);
    this.rippleSlider.setPaintTrack(true);
    this.rippleSlider.setMajorTickSpacing(10);
    this.rippleSlider.addChangeListener(event => this.onChange());
    this.addComponent(this.rippleSlider, 0, 5, 4, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    this.drawPreview(false);
  }

   addLabel(text, gridx, gridy, gridwidth, gridheight, anchor, fill) {
    let label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, null);
  }

   addComponent(component, gridx, gridy, gridwidth, gridheight, weightx, weighty, anchor, fill, insets) {
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if (insets) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }

   onMouse(event, type) {
  }

   onChange() {
    this.gradientColor.setRipple(this.rippleSlider.getValue() / 100);
    this.drawPreview(this.rippleSlider.getValueIsAdjusting());
  }

   drawPreview(adjusting) {
    let w = parseInt(this.preview.getProperty("width"));
    let h = parseInt(this.preview.getProperty("height"));
    let imageData = this.ctx.createImageData(w, h);
    let data = imageData.data;
    for (let x = 0; x < w; x++) {
      let color = this.gradientColor.getColorAt(x / w, true);
      for (let y = 0; y < h; y++) {
        let index = (y * w + x) * 4;
        data[index] = color.red;
        data[index + 1] = color.green;
        data[index + 2] = color.blue;
        data[index + 3] = color.alpha;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
    this.gradientColor.getColorPositions().forEach((position, index, array) => this.drawCircle(w, h, position, index));
  }

   drawCircle(w, h, position, index) {
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * w, h / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle(index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * w, h / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

   getStrokeStyle(style) {
    return style;
  }
}
