/**
 * The abstract panel to manage fillers
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractFillerPanel extends JSPanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   panelOptions = new JSPanel();

   xSlider = new JSSlider();

   xSpinner = new JSSpinner();

   ySlider = new JSSlider();

   ySpinner = new JSSpinner();

   panelRadios = new JSPanel();

   buttonGroupOptions = new ButtonGroup();

   buttonGroupRadios = new ButtonGroup();

   color = new Z4GradientColor();

   radios = new Array();

   points = new Array();

   width = Z4Constants.DEFAULT_IMAGE_SIZE;

   height = Z4Constants.DEFAULT_IMAGE_SIZE;

   selectedIndex = 0;

   selectedOption = 0;

   pressed = false;

  static  SIZE = 180;

  /**
   * Creates the object
   *
   * @param count The number of points managed by this panel
   * @param options The available options
   */
  constructor(count, options) {
    super();
    this.cssAddClass("z4abstractfillerpanel");
    this.setLayout(new GridBagLayout());
    this.addComponent(this.panelOptions, 0, 0, 3, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    this.preview.setProperty("width", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.setProperty("height", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.addComponent(this.preview, 0, 2, 1, 1, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
    this.addLabel("y", 1, 1, 1, 1, GridBagConstraints.CENTER, GridBagConstraints.NONE);
    this.ySpinner.setModel(new SpinnerNumberModel(0, 0, this.height, 1));
    this.ySpinner.getStyle().minWidth = "4rem";
    this.ySpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.ySpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.ySpinner.addChangeListener(event => this.onChange(true, this.ySpinner.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.addComponent(this.ySpinner, 2, 1, 1, 1, GridBagConstraints.EAST, GridBagConstraints.NONE, null);
    this.ySlider.setMaximum(this.height);
    this.ySlider.setOrientation(JSSlider.VERTICAL);
    this.ySlider.setInverted(true);
    this.ySlider.getStyle().minHeight = "20rem";
    this.ySlider.addChangeListener(event => this.onChange(false, this.ySlider.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.addComponent(this.ySlider, 1, 2, 1, 1, GridBagConstraints.NORTH, GridBagConstraints.NONE, null);
    this.addLabel("x", 0, 3, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.xSpinner.setModel(new SpinnerNumberModel(0, 0, this.width, 1));
    this.xSpinner.getStyle().minWidth = "4rem";
    this.xSpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.xSpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.xSpinner.addChangeListener(event => this.onChange(true, this.xSpinner.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.addComponent(this.xSpinner, 2, 3, 1, 1, GridBagConstraints.EAST, GridBagConstraints.NONE, null);
    this.xSlider.setMaximum(this.width);
    this.xSlider.getStyle().minWidth = "20rem";
    this.xSlider.addChangeListener(event => this.onChange(false, this.xSlider.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.addComponent(this.xSlider, 0, 4, 3, 1, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    this.addComponent(this.panelRadios, 0, 5, 3, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    if (options) {
      options.forEach((option, index, array) => {
        let radio = new JSRadioButton();
        radio.setContentAreaFilled(false);
        radio.setToggle();
        radio.setSelected(index === 0);
        radio.setIcon(new DefaultHTMLImageProducer(option.key, option.value));
        radio.addActionListener(event => {
          this.selectedOption = option.key;
          this.drawPreview();
        });
        this.buttonGroupOptions.add(radio);
        this.panelOptions.add(radio, null);
      });
    }
    for (let index = 0; index < count; index++) {
      let idx = index;
      let radio = new JSRadioButton();
      radio.setText("" + (index + 1));
      radio.setSelected(index === 0);
      radio.addActionListener(event => this.onRadio(idx));
      this.radios.push(radio);
      this.buttonGroupRadios.add(radio);
      this.panelRadios.add(radio, null);
    }
    this.pushPointPositions(this.points, this.width, this.height);
    this.setXY();
    this.drawPreview();
  }

   addLabel(text, gridx, gridy, gridwidth, gridheight, anchor, fill) {
    let label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, gridy, gridwidth, gridheight, anchor, fill, null);
  }

   addComponent(component, gridx, gridy, gridwidth, gridheight, anchor, fill, insets) {
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if (insets) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }

   onRadio(index) {
    this.selectedIndex = index;
    this.setXY();
    this.drawPreview();
  }

   onChange(spTosl, adjusting, spinner, slider, isX) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    let p = this.points[this.selectedIndex];
    this.points[this.selectedIndex] = new Point(isX ? slider.getValue() : p.x, !isX ? slider.getValue() : p.y);
    this.drawPreview();
  }

   onMouse(event, type) {
    let w = parseInt(this.preview.getProperty("width"));
    let h = parseInt(this.preview.getProperty("height"));
    switch(type) {
      case "down":
        this.points.map(point => new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) => {
          if (Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) < 5) {
            this.pressed = true;
            this.selectedIndex = index;
            this.radios[this.selectedIndex].setSelected(true);
            this.setXY();
            this.drawPreview();
          }
        });
        break;
      case "move":
        if (this.pressed) {
          this.points[this.selectedIndex] = new Point(parseInt(this.width * event.offsetX / w), parseInt(this.height * event.offsetY / h));
          this.setXY();
          this.drawPreview();
        } else {
          this.preview.getStyle().cursor = "default";
          this.points.map(point => new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) => {
            if (Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) < 5) {
              this.preview.getStyle().cursor = "pointer";
            }
          });
        }
        break;
      case "up":
        this.pressed = false;
        break;
    }
  }

  /**
   * Returns the filler
   *
   * @param gradientColor The color used to fill
   * @param points The points
   * @param option The selected option
   * @return The filler
   */
   getFiller(gradientColor, points, option) {
  }

  /**
   * Pushes the point positions
   *
   * @param points The points
   * @param width The preview width
   * @param height The preview height
   */
   pushPointPositions(points, width, height) {
  }

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
   setSize(width, height) {
    this.width = width;
    this.height = height;
    this.ySpinner.setModel(new SpinnerNumberModel(0, 0, this.height, 1));
    this.ySlider.setMaximum(this.height);
    this.xSpinner.setModel(new SpinnerNumberModel(0, 0, this.width, 1));
    this.xSlider.setMaximum(this.width);
    this.points.length = 0;
    this.pushPointPositions(this.points, this.width, this.height);
    this.setXY();
    let ratio = width / height;
    this.preview.setProperty("width", "" + parseInt(ratio > 1 ? Z4AbstractFillerPanel.SIZE : Z4AbstractFillerPanel.SIZE * ratio));
    this.preview.setProperty("height", "" + parseInt(ratio > 1 ? Z4AbstractFillerPanel.SIZE / ratio : Z4AbstractFillerPanel.SIZE));
    this.drawPreview();
  }

   setXY() {
    this.xSlider.setValue(this.points[this.selectedIndex].x);
    this.xSpinner.setValue(this.points[this.selectedIndex].x);
    this.ySlider.setValue(this.points[this.selectedIndex].y);
    this.ySpinner.setValue(this.points[this.selectedIndex].y);
  }

   drawPreview() {
    let w = parseInt(this.preview.getProperty("width"));
    let h = parseInt(this.preview.getProperty("height"));
    this.ctx.clearRect(0, 0, w, h);
    let map = this.points.map(point => new Point(w * point.x / this.width, h * point.y / this.height));
    let imageData = this.ctx.createImageData(w, h);
    this.getFiller(this.color, map, this.selectedOption).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);
    this.ctx.save();
    map.forEach((point, index, array) => this.drawCircle(point, index));
    this.ctx.restore();
    this.ctx.save();
    this.drawObjects(this.ctx, map);
    this.ctx.restore();
  }

   drawCircle(point, index) {
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle(index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Draws other objects
   *
   * @param ctx The context
   * @param mappedPoints The (mapped) points
   */
   drawObjects(ctx, mappedPoints) {
  }

   getStrokeStyle(style) {
    return style;
  }
}
