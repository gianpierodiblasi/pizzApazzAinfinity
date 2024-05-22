/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColorPanel extends JSPanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   biRippleSpinner = new JSSpinner();

   biRippleSlider = new JSSlider();

   rippleSpinner = new JSSpinner();

   rippleSlider = new JSSlider();

   colorPreview = new Z4ColorPreview();

   biDelete = new JSButton();

   delete = new JSButton();

   biGradientColor = new Z4BiGradientColor();

   biSelectedIndex = 0;

   selectedIndex = 0;

   pressed = false;

  static  SELECTOR_RADIUS = 7;

  static  WIDTH = 200;

  static  HEIGHT = 200;

  static  TOLLERANCE = 0.075;

  constructor() {
    super();
    this.cssAddClass("z4bigradientcolorpanel");
    this.setLayout(new GridBagLayout());
    this.preview.setProperty("width", "" + Z4BiGradientColorPanel.WIDTH);
    this.preview.setProperty("height", "" + Z4BiGradientColorPanel.HEIGHT);
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.addComponent(this.preview, 0, 0, 2, 2, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
    this.addLabel(Z4Translations.RIPPLE, 2, 1, 1, 1, GridBagConstraints.SOUTH, GridBagConstraints.NONE);
    this.getChilStyleByQuery("label").writingMode = "vertical-lr";
    this.getChilStyleByQuery("label").transform = "rotate(180deg)";
    this.biRippleSpinner.cssAddClass("bispinner");
    this.biRippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.biRippleSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.biRippleSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.biRippleSpinner.addChangeListener(event => this.onChange(true, this.biRippleSpinner.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.addComponent(this.biRippleSpinner, 2, 0, 1, 1, 0, 0, GridBagConstraints.NORTHEAST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
    this.biRippleSlider.setValue(0);
    this.biRippleSlider.setOrientation(JSSlider.VERTICAL);
    this.biRippleSlider.setInverted(true);
    this.biRippleSlider.getStyle().minHeight = "20rem";
    this.biRippleSlider.addChangeListener(event => this.onChange(false, this.biRippleSlider.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.addComponent(this.biRippleSlider, 3, 0, 1, 2, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, null);
    let panel = new JSPanel();
    panel.getStyle().writingMode = "vertical-lr";
    panel.getStyle().transform = "rotate(180deg)";
    this.addComponent(panel, 4, 0, 1, 2, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.BOTH, null);
    let button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      // this.gradientColor.mirror();
      // this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
      // this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1);
      // this.drawPreview(false);
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      // this.gradientColor.reverse();
      // this.drawPreview(false);
    });
    panel.add(button, null);
    this.biDelete.setText(Z4Translations.DELETE);
    this.biDelete.setEnabled(false);
    this.biDelete.addActionListener(event => {
      // JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      // if (response == JSOptionPane.YES_OPTION) {
      // this.gradientColor.removeColor(this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
      // this.selectedIndex = 0;
      // this.colorPreview.setColor(this.gradientColor.getColorAtIndex(0));
      // this.delete.setEnabled(false);
      // this.drawPreview(false);
      // }
      // });
    });
    panel.add(this.biDelete, null);
    this.addHLine(0, 2, 6, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL);
    this.colorPreview.setColor(this.biGradientColor.getColorAtIndex(0).getColorAtIndex(0));
    this.addComponent(this.colorPreview, 0, 3, 1, 1, 1, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, null);
    button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event => this.selectColor());
    this.addComponent(button, 1, 3, 2, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => {
      // JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      // if (response == JSOptionPane.YES_OPTION) {
      // this.gradientColor.removeColor(this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
      // this.selectedIndex = 0;
      // this.colorPreview.setColor(this.gradientColor.getColorAtIndex(0));
      // this.delete.setEnabled(false);
      // this.drawPreview(false);
      // }
      // });
    });
    this.addComponent(this.delete, 3, 3, 3, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
    this.addLabel(Z4Translations.RIPPLE, 0, 4, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.getStyle().minWidth = "4rem";
    this.rippleSpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.rippleSpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.rippleSpinner.addChangeListener(event => this.onChange(true, this.rippleSpinner.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.addComponent(this.rippleSpinner, 2, 4, 3, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(5, 0, 0, 0));
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event => this.onChange(false, this.rippleSlider.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.addComponent(this.rippleSlider, 0, 5, 5, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    panel = new JSPanel();
    this.addComponent(panel, 0, 6, 5, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
    button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      // this.gradientColor.mirror();
      // this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
      // this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1);
      // this.drawPreview(false);
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      // this.gradientColor.reverse();
      // this.drawPreview(false);
    });
    panel.add(button, null);
    this.drawPreview(false);
  }

   addLabel(text, gridx, gridy, gridwidth, gridheight, anchor, fill) {
    let label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, null);
  }

   addHLine(gridx, gridy, gridwidth, gridheight, anchor, fill) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().background = "var(--main-action-bgcolor";
    this.addComponent(div, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, new Insets(2, 1, 2, 1));
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
    switch(type) {
      case "down":
        for (let biIndex = 0; biIndex < this.biGradientColor.getColorCount(); biIndex++) {
          let biPosition = this.biGradientColor.getColorPositionAtIndex(biIndex);
          let gradientColor = this.biGradientColor.getColorAtIndex(biIndex);
          for (let index = 0; index < gradientColor.getColorCount(); index++) {
            let position = gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4BiGradientColorPanel.WIDTH, biPosition * Z4BiGradientColorPanel.WIDTH, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
              this.pressed = true;
              this.biSelectedIndex = biIndex;
              this.selectedIndex = index;
              this.colorPreview.setColor(this.biGradientColor.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex));
              this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== gradientColor.getColorCount() - 1);
              this.drawPreview(false);
            }
          }
        }
        // 
        // if (!this.pressed && !this.gradientColor.isPositionOccupied(event.offsetX / w, Z4BiGradientColorPanel.TOLLERANCE) && Math.abs(h / 2 - event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
        // this.gradientColor.addColor(this.gradientColor.getColorAt(event.offsetX / w, false), event.offsetX / w);
        // this.pressed = true;
        // 
        // for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
        // double position = this.gradientColor.getColorPositionAtIndex(index);
        // if (Z4Math.distance(position * w, h / 2, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
        // this.selectedIndex = index;
        // this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
        // this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1);
        // }
        // }
        // 
        // this.preview.getStyle().cursor = "pointer";
        // this.drawPreview(false);
        // }
        break;
      case "move":
        if (this.pressed) {
          // double position = this.gradientColor.getColorPositionAtIndex(this.selectedIndex);
          // double positionBefore = this.gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
          // double positionAfter = this.gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
          // double newPosition = event.offsetX / w;
          // 
          // if (this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1
          // && positionBefore < newPosition - Z4BiGradientColorPanel.TOLLERANCE && positionAfter > newPosition + Z4BiGradientColorPanel.TOLLERANCE) {
          // Color color = this.gradientColor.getColorAtIndex(this.selectedIndex);
          // this.gradientColor.removeColor(position);
          // this.gradientColor.addColor(color, newPosition);
          // this.drawPreview(true);
          // }
        } else {
          this.preview.getStyle().cursor = "default";
          for (let biIndex = 0; biIndex < this.biGradientColor.getColorCount(); biIndex++) {
            let biPosition = this.biGradientColor.getColorPositionAtIndex(biIndex);
            let gradientColor = this.biGradientColor.getColorAtIndex(biIndex);
            for (let index = 0; index < gradientColor.getColorCount(); index++) {
              let position = gradientColor.getColorPositionAtIndex(index);
              if (Z4Math.distance(position * Z4BiGradientColorPanel.WIDTH, biPosition * Z4BiGradientColorPanel.WIDTH, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
                this.preview.getStyle().cursor = "pointer";
              }
            }
          }
          if (this.preview.getStyle().cursor === "default") {
            // if (!this.gradientColor.isPositionOccupied(event.offsetX / w, Z4BiGradientColorPanel.TOLLERANCE) && Math.abs(h / 2 - event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
            // this.preview.getStyle().cursor = "copy";
            // }
          }
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        break;
    }
  }

   onChange(spTosl, adjusting, spinner, slider, isBi) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    if (isBi) {
      this.biGradientColor.setRipple(slider.getValue() / 100);
    } else {
      this.biGradientColor.setGradientRipple(slider.getValue() / 100);
    }
    this.drawPreview(adjusting);
  }

   selectColor() {
    JSColorChooser.showDialog(Z4Translations.COLOR, this.biGradientColor.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex), true, null, c => {
      let gradientColor = this.biGradientColor.getColorAtIndex(this.biSelectedIndex);
      gradientColor.addColor(c, gradientColor.getColorPositionAtIndex(this.selectedIndex));
      this.colorPreview.setColor(c);
      this.drawPreview(false);
    });
  }

   drawPreview(adjusting) {
    let imageData = this.ctx.createImageData(Z4BiGradientColorPanel.WIDTH, Z4BiGradientColorPanel.HEIGHT);
    let data = imageData.data;
    for (let y = 0; y < Z4BiGradientColorPanel.HEIGHT; y++) {
      let gradientColor = this.biGradientColor.getColorAt(y / Z4BiGradientColorPanel.HEIGHT, true);
      for (let x = 0; x < Z4BiGradientColorPanel.WIDTH; x++) {
        let color = gradientColor.getColorAt(x / Z4BiGradientColorPanel.WIDTH, true);
        let index = (y * Z4BiGradientColorPanel.WIDTH + x) * 4;
        data[index] = color.red;
        data[index + 1] = color.green;
        data[index + 2] = color.blue;
        data[index + 3] = color.alpha;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
    for (let biIndex = 0; biIndex < this.biGradientColor.getColorCount(); biIndex++) {
      let biPosition = this.biGradientColor.getColorPositionAtIndex(biIndex);
      let gradientColor = this.biGradientColor.getColorAtIndex(biIndex);
      for (let index = 0; index < gradientColor.getColorCount(); index++) {
        this.drawCircle(biPosition, gradientColor.getColorPositionAtIndex(index), biIndex, index);
      }
    }
  }

   drawCircle(biPosition, position, biIndex, index) {
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * Z4BiGradientColorPanel.WIDTH, biPosition * Z4BiGradientColorPanel.HEIGHT, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle(biIndex === this.biSelectedIndex && index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * Z4BiGradientColorPanel.WIDTH, biPosition * Z4BiGradientColorPanel.HEIGHT, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

   getStrokeStyle(style) {
    return style;
  }
}
