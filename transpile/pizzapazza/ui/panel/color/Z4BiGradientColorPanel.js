/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColorPanel extends JSPanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   rippleSpinner = new JSSpinner();

   rippleSlider = new JSSlider();

   colorPreview = new Z4ColorPreview();

   delete = new JSButton();

   gradientColor = new Z4GradientColor();

   selectedIndex = 0;

   pressed = false;

  static  SELECTOR_RADIUS = 7;

  static  HEIGHT = 50;

  static  TOLLERANCE = 0.075;

  constructor() {
    super();
    this.cssAddClass("z4gradientcolorpanel");
    this.setLayout(new GridBagLayout());
    this.preview.setProperty("height", "" + Z4BiGradientColorPanel.HEIGHT);
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.addComponent(this.preview, 0, 0, 3, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, new Insets(0, 0, 5, 0));
    this.colorPreview.setColor(this.gradientColor.getColorAtIndex(0));
    this.addComponent(this.colorPreview, 0, 1, 1, 1, 1, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, null);
    let button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event => this.selectColor());
    this.addComponent(button, 1, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => {
      JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
        if (response === JSOptionPane.YES_OPTION) {
          this.gradientColor.removeColor(this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
          this.selectedIndex = 0;
          this.colorPreview.setColor(this.gradientColor.getColorAtIndex(0));
          this.delete.setEnabled(false);
          this.drawPreview(false);
        }
      });
    });
    this.addComponent(this.delete, 2, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
    this.addLabel(Z4Translations.RIPPLE, 0, 3, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.getStyle().minWidth = "4rem";
    this.rippleSpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.rippleSpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.rippleSpinner.addChangeListener(event => this.onChange(true, this.rippleSpinner.getValueIsAdjusting()));
    this.addComponent(this.rippleSpinner, 1, 3, 2, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(5, 0, 0, 0));
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event => this.onChange(false, this.rippleSlider.getValueIsAdjusting()));
    this.addComponent(this.rippleSlider, 0, 4, 3, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    let panel = new JSPanel();
    this.addComponent(panel, 0, 5, 3, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      this.gradientColor.mirror();
      this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
      this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== this.gradientColor.getColorCount() - 1);
      this.drawPreview(false);
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      this.gradientColor.reverse();
      this.drawPreview(false);
    });
    panel.add(button, null);
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
    let w = parseInt(this.preview.getProperty("width"));
    let h = parseInt(this.preview.getProperty("height"));
    switch(type) {
      case "down":
        for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
          let position = this.gradientColor.getColorPositionAtIndex(index);
          if (Z4Math.distance(position * w, h / 2, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
            this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== this.gradientColor.getColorCount() - 1);
            this.drawPreview(false);
          }
        }
        if (!this.pressed && !this.gradientColor.isPositionOccupied(event.offsetX / w, Z4BiGradientColorPanel.TOLLERANCE) && Math.abs(h / 2 - event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
          this.gradientColor.addColor(this.gradientColor.getColorAt(event.offsetX / w, false), event.offsetX / w);
          this.pressed = true;
          for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
            let position = this.gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * w, h / 2, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
              this.selectedIndex = index;
              this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
              this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== this.gradientColor.getColorCount() - 1);
            }
          }
          this.preview.getStyle().cursor = "pointer";
          this.drawPreview(false);
        }
        break;
      case "move":
        if (this.pressed) {
          let position = this.gradientColor.getColorPositionAtIndex(this.selectedIndex);
          let positionBefore = this.gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
          let positionAfter = this.gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
          let newPosition = event.offsetX / w;
          if (this.selectedIndex !== 0 && this.selectedIndex !== this.gradientColor.getColorCount() - 1 && positionBefore < newPosition - Z4BiGradientColorPanel.TOLLERANCE && positionAfter > newPosition + Z4BiGradientColorPanel.TOLLERANCE) {
            let color = this.gradientColor.getColorAtIndex(this.selectedIndex);
            this.gradientColor.removeColor(position);
            this.gradientColor.addColor(color, newPosition);
            this.drawPreview(true);
          }
        } else {
          this.preview.getStyle().cursor = "default";
          for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
            let position = this.gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * w, h / 2, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          }
          if (this.preview.getStyle().cursor === "default") {
            if (!this.gradientColor.isPositionOccupied(event.offsetX / w, Z4BiGradientColorPanel.TOLLERANCE) && Math.abs(h / 2 - event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "copy";
            }
          }
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        break;
    }
  }

   onChange(spTosl, adjusting) {
    if (spTosl) {
      this.rippleSlider.setValue(this.rippleSpinner.getValue());
    } else {
      this.rippleSpinner.setValue(this.rippleSlider.getValue());
    }
    this.gradientColor.setRipple(this.rippleSlider.getValue() / 100);
    this.drawPreview(adjusting);
  }

   selectColor() {
    JSColorChooser.showDialog(Z4Translations.COLOR, this.gradientColor.getColorAtIndex(this.selectedIndex), true, null, c => {
      let position = this.gradientColor.getColorPositionAtIndex(this.selectedIndex);
      this.gradientColor.addColor(c, position);
      this.colorPreview.setColor(c);
      this.drawPreview(false);
    });
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
    for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
      this.drawCircle(w, h, this.gradientColor.getColorPositionAtIndex(index), index);
    }
  }

   drawCircle(w, h, position, index) {
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * w, h / 2, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle(index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * w, h / 2, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

   getStrokeStyle(style) {
    return style;
  }
}