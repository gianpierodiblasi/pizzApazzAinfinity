/**
 * The panel to manage a bigradient color
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

   space = null;

   time = null;

   biGradientColor = new Z4BiGradientColor();

   biSelectedIndex = 0;

   selectedIndex = 0;

   pressed = false;

   width = Z4BiGradientColorPanel.SIZE;

   height = Z4BiGradientColorPanel.SIZE;

  static  SELECTOR_RADIUS = 7;

  static  SIZE = 200;

  static  TOLERANCE = 0.1;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4bigradientcolorpanel");
    this.setLayout(new GridBagLayout());
    this.add(new JSLabel(), new GBC(0, 0).w(3).wy(1));
    this.space = Z4UI.addLabel(this, Z4Translations.SPACE, new GBC(1, 1).w(2).a(GBC.SOUTHEAST));
    this.time = Z4UI.addLabel(this, Z4Translations.TIME, new GBC(0, 2).wh(3, 2).a(GBC.SOUTHEAST));
    this.time.cssAddClass("jslabel-vertical");
    this.preview.setProperty("width", "" + this.width);
    this.preview.setProperty("height", "" + this.height);
    this.preview.addEventListener("mouseenter", event => this.onMouse(event, "enter"));
    this.preview.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.add(this.preview, new GBC(1, 2).wh(2, 2));
    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(3, 3).h(2).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.biRippleSpinner.cssAddClass("jsspinner-vertical");
    this.biRippleSpinner.cssAddClass("jsspinner_h_4rem");
    this.biRippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.biRippleSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.biRippleSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.biRippleSpinner.addChangeListener(event => this.onChange(true, this.biRippleSpinner.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.add(this.biRippleSpinner, new GBC(3, 0).h(3).a(GBC.NORTHEAST).i(0, 5, 0, 0));
    this.biRippleSlider.setValue(0);
    this.biRippleSlider.setOrientation(JSSlider.VERTICAL);
    this.biRippleSlider.setInverted(true);
    this.biRippleSlider.getStyle().minHeight = "20rem";
    this.biRippleSlider.getStyle().minWidth = "1.5rem";
    this.biRippleSlider.addChangeListener(event => this.onChange(false, this.biRippleSlider.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.add(this.biRippleSlider, new GBC(4, 0).h(5).a(GBC.EAST));
    let panel = new JSPanel();
    panel.cssAddClass("jspanel-vertical");
    this.add(panel, new GBC(5, 0).h(5).a(GBC.NORTH).f(GBC.BOTH));
    let button = new JSButton();
    button.cssAddClass("jsbutton-vertical");
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      this.biGradientColor.mirror();
      this.afterOperation(this.biGradientColor.getColorAtIndex(this.biSelectedIndex));
    });
    panel.add(button, null);
    button = new JSButton();
    button.cssAddClass("jsbutton-vertical");
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      this.biGradientColor.reverse();
      this.drawPreview(false);
    });
    panel.add(button, null);
    this.biDelete.cssAddClass("jsbutton-vertical");
    this.biDelete.setText(Z4Translations.DELETE);
    this.biDelete.setEnabled(false);
    this.biDelete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.biGradientColor.removeColor(this.biGradientColor.getColorPositionAtIndex(this.biSelectedIndex));
        this.biSelectedIndex = 0;
        this.afterOperation(this.biGradientColor.getColorAtIndex(this.biSelectedIndex));
      }
    }));
    panel.add(this.biDelete, null);
    this.add(new JSLabel(), new GBC(0, 4).w(3).wy(1));
    Z4UI.addHLine(this, new GBC(0, 5).w(6).a(GBC.WEST).f(GBC.HORIZONTAL).i(2, 1, 2, 1));
    this.colorPreview.setColor(this.biGradientColor.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex));
    this.add(this.colorPreview, new GBC(0, 6).w(2).wx(1).f(GBC.HORIZONTAL));
    button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event => this.selectColor());
    this.add(button, new GBC(2, 6).w(2).a(GBC.WEST).i(0, 5, 0, 0));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        let gradientColor = this.biGradientColor.getColorAtIndex(this.biSelectedIndex);
        gradientColor.removeColor(gradientColor.getColorPositionAtIndex(this.selectedIndex));
        this.selectedIndex = 0;
        this.afterOperation(gradientColor);
      }
    }));
    this.add(this.delete, new GBC(4, 6).w(2).a(GBC.EAST).i(0, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(0, 7).w(2).a(GBC.WEST));
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.addChangeListener(event => this.onChange(true, this.rippleSpinner.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.add(this.rippleSpinner, new GBC(3, 7).w(3).a(GBC.EAST).i(5, 0, 0, 0));
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event => this.onChange(false, this.rippleSlider.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.add(this.rippleSlider, new GBC(0, 8).w(6).a(GBC.NORTH).f(GBC.HORIZONTAL));
    panel = new JSPanel();
    this.add(panel, new GBC(0, 9).w(6).a(GBC.NORTH).f(GBC.HORIZONTAL));
    button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      let gradientColor = this.biGradientColor.getColorAtIndex(this.biSelectedIndex);
      gradientColor.mirror();
      this.afterOperation(gradientColor);
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      let gradientColor = this.biGradientColor.getColorAtIndex(this.biSelectedIndex);
      gradientColor.reverse();
      this.afterOperation(gradientColor);
    });
    panel.add(button, null);
    this.drawPreview(false);
  }

   onMouse(event, type) {
    switch(type) {
      case "enter":
        break;
      case "down":
        for (let biIndex = 0; biIndex < this.biGradientColor.getColorCount(); biIndex++) {
          let biPosition = this.biGradientColor.getColorPositionAtIndex(biIndex);
          let gradientColor = this.biGradientColor.getColorAtIndex(biIndex);
          for (let index = 0; index < gradientColor.getColorCount(); index++) {
            let position = gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * this.width, biPosition * this.height, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
              this.pressed = true;
              this.biSelectedIndex = biIndex;
              this.selectedIndex = index;
              this.afterOperation(gradientColor);
            }
          }
        }
        if (!this.pressed && !this.biGradientColor.isPositionOccupied(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE)) {
          let gradientColor = this.biGradientColor.getColorAt(event.offsetY / this.height, false);
          while (gradientColor.getColorCount() > 2) {
            gradientColor.removeColor(gradientColor.getColorPositionAtIndex(1));
          }
          if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
            gradientColor.addColor(gradientColor.getColorAt(event.offsetX / this.width, false), event.offsetX / this.width);
          }
          gradientColor.mergeOverlapping(Z4BiGradientColorPanel.TOLERANCE);
          this.biGradientColor.addColor(gradientColor, event.offsetY / this.height);
          this.pressed = true;
          this.setPointer(event, true);
        }
        if (!this.pressed) {
          let biPosition = this.biGradientColor.getPosition(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE);
          let gradientColor = this.biGradientColor.getColorAt(biPosition, false);
          if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
            gradientColor.addColor(gradientColor.getColorAt(event.offsetX / this.width, false), event.offsetX / this.width);
            this.setPointer(event, true);
          }
        }
        break;
      case "move":
        if (this.pressed) {
          let biPosition = this.biGradientColor.getColorPositionAtIndex(this.biSelectedIndex);
          let biPositionBefore = this.biGradientColor.getColorPositionAtIndex(this.biSelectedIndex - 1);
          let biPositionAfter = this.biGradientColor.getColorPositionAtIndex(this.biSelectedIndex + 1);
          let newBiPosition = event.offsetY / this.height;
          let gradientColor = this.biGradientColor.getColorAtIndex(this.biSelectedIndex);
          let position = gradientColor.getColorPositionAtIndex(this.selectedIndex);
          let positionBefore = gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
          let positionAfter = gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
          let newPosition = event.offsetX / this.width;
          if (this.biSelectedIndex !== 0 && this.biSelectedIndex !== this.biGradientColor.getColorCount() - 1 && biPositionBefore < newBiPosition - Z4BiGradientColorPanel.TOLERANCE && biPositionAfter > newBiPosition + Z4BiGradientColorPanel.TOLERANCE) {
            this.biGradientColor.removeColor(biPosition);
            this.biGradientColor.addColor(gradientColor, newBiPosition);
            this.drawPreview(true);
          }
          if (this.selectedIndex !== 0 && this.selectedIndex !== gradientColor.getColorCount() - 1 && positionBefore < newPosition - Z4BiGradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4BiGradientColorPanel.TOLERANCE) {
            let color = gradientColor.getColorAtIndex(this.selectedIndex);
            gradientColor.removeColor(position);
            gradientColor.addColor(color, newPosition);
            this.drawPreview(true);
          }
        } else {
          this.preview.getStyle().cursor = "default";
          this.setPointer(event, false);
          if (this.preview.getStyle().cursor === "default" && !this.biGradientColor.isPositionOccupied(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE)) {
            this.preview.getStyle().cursor = "copy";
          }
          if (this.preview.getStyle().cursor === "default") {
            let biPosition = this.biGradientColor.getPosition(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE);
            let gradientColor = this.biGradientColor.getColorAt(biPosition, false);
            if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
              this.preview.getStyle().cursor = "copy";
            }
          }
        }
        break;
      case "up":
      case "leave":
        this.pressed = false;
        this.drawPreview(false);
        break;
    }
  }

   setPointer(event, setOther) {
    for (let biIndex = 0; biIndex < this.biGradientColor.getColorCount(); biIndex++) {
      let biPosition = this.biGradientColor.getColorPositionAtIndex(biIndex);
      let gradientColor = this.biGradientColor.getColorAtIndex(biIndex);
      for (let index = 0; index < gradientColor.getColorCount(); index++) {
        let position = gradientColor.getColorPositionAtIndex(index);
        if (Z4Math.distance(position * this.width, biPosition * this.height, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
          if (setOther) {
            this.biSelectedIndex = biIndex;
            this.selectedIndex = index;
            this.afterOperation(gradientColor);
          }
          this.preview.getStyle().cursor = "pointer";
        }
      }
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

   afterOperation(gradientColor) {
    this.colorPreview.setColor(this.biGradientColor.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex));
    this.biDelete.setEnabled(this.biSelectedIndex !== 0 && this.biSelectedIndex !== this.biGradientColor.getColorCount() - 1);
    this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== gradientColor.getColorCount() - 1);
    this.drawPreview(false);
  }

   drawPreview(adjusting) {
    if (this.width > 0 && this.height > 0) {
      let imageData = this.ctx.createImageData(this.width, this.height);
      let data = imageData.data;
      for (let y = 0; y < this.height; y++) {
        let gradientColor = this.biGradientColor.getColorAt(y / this.height, true);
        for (let x = 0; x < this.width; x++) {
          let color = gradientColor.getColorAt(x / this.width, true);
          let index = (y * this.width + x) * 4;
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
  }

   drawCircle(biPosition, position, biIndex, index) {
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * this.width, biPosition * this.height, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle(biIndex === this.biSelectedIndex && index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * this.width, biPosition * this.height, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

   getStrokeStyle(style) {
    return style;
  }
  /**
   * Sets the visibility of the space and time labels
   *
   * @param b true to show the space and time labels, false otherwise
   */
   setSpaceTimeLabelsVisible(b) {
    this.space.getStyle().visibility = b ? "visible" : "hidden";
    this.time.getStyle().visibility = b ? "visible" : "hidden";
  }

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
   setSize(width, height) {
    let ratio = width / height;
    this.width = parseInt(ratio > 1 ? Z4BiGradientColorPanel.SIZE : Z4BiGradientColorPanel.SIZE * ratio);
    this.height = parseInt(ratio > 1 ? Z4BiGradientColorPanel.SIZE / ratio : Z4BiGradientColorPanel.SIZE);
    this.preview.setProperty("width", "" + this.width);
    this.preview.setProperty("height", "" + this.height);
    this.drawPreview(false);
  }

  /**
   * Returns the selected bigradient color
   *
   * @return The selected bigradient color
   */
   getSelectedBiGradientColor() {
    return this.biGradientColor;
  }
}
