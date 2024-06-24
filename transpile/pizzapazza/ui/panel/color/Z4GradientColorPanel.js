/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorPanel extends JSPanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   rippleSpinner = new JSSpinner();

   rippleSlider = new JSSlider();

   colorPanel = new Z4ColorPanel();

   delete = new JSButton();

   gradientColor = new Z4GradientColor();

   selectedIndex = 0;

   pressed = false;

   listeners = new Array();

   valueIsAdjusting = false;

  static  SELECTOR_RADIUS = 7;

  static  WIDTH = 200;

  static  HEIGHT = 50;

  static  TOLERANCE = 0.1;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4gradientcolorpanel");
    this.setLayout(new GridBagLayout());
    this.preview.setProperty("width", "" + Z4GradientColorPanel.WIDTH);
    this.preview.setProperty("height", "" + Z4GradientColorPanel.HEIGHT);
    this.preview.addEventListener("mouseenter", event => this.onMouse(event, "enter"));
    this.preview.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.add(this.preview, new GBC(0, 0).w(3).i(0, 0, 5, 0));
    this.colorPanel.setValue(this.gradientColor.getColorAtIndex(this.selectedIndex));
    this.colorPanel.addChangeListener(event => {
      this.gradientColor.addColor(this.colorPanel.getValue(), this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
      this.drawPreview(false);
      this.fireOnChange();
    });
    this.add(this.colorPanel, new GBC(0, 1).w(2).wx(1).f(GBC.HORIZONTAL));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.gradientColor.removeColor(this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
        this.selectedIndex = 0;
        this.afterOperation();
        this.fireOnChange();
      }
    }));
    this.add(this.delete, new GBC(2, 1).a(GBC.WEST).i(0, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(0, 3).a(GBC.WEST));
    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.addChangeListener(event => this.onChange(true, this.rippleSpinner.getValueIsAdjusting()));
    this.add(this.rippleSpinner, new GBC(1, 3).w(2).a(GBC.EAST).i(5, 0, 0, 0));
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event => this.onChange(false, this.rippleSlider.getValueIsAdjusting()));
    this.add(this.rippleSlider, new GBC(0, 4).w(3).a(GBC.NORTH).f(GBC.HORIZONTAL));
    let panel = new JSPanel();
    this.add(panel, new GBC(0, 5).w(3).a(GBC.NORTH).f(GBC.HORIZONTAL));
    let button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      this.gradientColor.mirror();
      this.afterOperation();
      this.fireOnChange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      this.gradientColor.reverse();
      this.drawPreview(false);
      this.fireOnChange();
    });
    panel.add(button, null);
    this.drawPreview(false);
  }

   onMouse(event, type) {
    switch(type) {
      case "enter":
        break;
      case "down":
        for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
          let position = this.gradientColor.getColorPositionAtIndex(index);
          if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.afterOperation();
          }
        }
        if (!this.pressed && !this.gradientColor.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE) && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
          this.gradientColor.addColor(this.gradientColor.getColorAt(event.offsetX / Z4GradientColorPanel.WIDTH, false), event.offsetX / Z4GradientColorPanel.WIDTH);
          this.pressed = true;
          for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
            let position = this.gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.selectedIndex = index;
              this.afterOperation();
              this.fireOnChange();
            }
          }
          this.preview.getStyle().cursor = "pointer";
        }
        break;
      case "move":
        if (this.pressed) {
          let position = this.gradientColor.getColorPositionAtIndex(this.selectedIndex);
          let positionBefore = this.gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
          let positionAfter = this.gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
          let newPosition = event.offsetX / Z4GradientColorPanel.WIDTH;
          if (this.selectedIndex !== 0 && this.selectedIndex !== this.gradientColor.getColorCount() - 1 && positionBefore < newPosition - Z4GradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4GradientColorPanel.TOLERANCE) {
            let color = this.gradientColor.getColorAtIndex(this.selectedIndex);
            this.gradientColor.removeColor(position);
            this.gradientColor.addColor(color, newPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.fireOnChange();
          }
        } else {
          this.preview.getStyle().cursor = "default";
          for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
            let position = this.gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          }
          if (this.preview.getStyle().cursor === "default" && !this.gradientColor.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE) && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.preview.getStyle().cursor = "copy";
          }
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        this.valueIsAdjusting = false;
        this.fireOnChange();
        break;
      case "leave":
        if (this.pressed) {
          this.pressed = false;
          this.drawPreview(false);
          this.valueIsAdjusting = false;
          this.fireOnChange();
        }
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
    this.valueIsAdjusting = adjusting;
    this.fireOnChange();
  }

   afterOperation() {
    this.colorPanel.setValue(this.gradientColor.getColorAtIndex(this.selectedIndex));
    this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== this.gradientColor.getColorCount() - 1);
    this.drawPreview(false);
  }

   drawPreview(adjusting) {
    let imageData = this.ctx.createImageData(Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT);
    let data = imageData.data;
    for (let x = 0; x < Z4GradientColorPanel.WIDTH; x++) {
      let color = this.gradientColor.getColorAt(x / Z4GradientColorPanel.WIDTH, true);
      for (let y = 0; y < Z4GradientColorPanel.HEIGHT; y++) {
        let index = (y * Z4GradientColorPanel.WIDTH + x) * 4;
        data[index] = color.red;
        data[index + 1] = color.green;
        data[index + 2] = color.blue;
        data[index + 3] = color.alpha;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
    for (let index = 0; index < this.gradientColor.getColorCount(); index++) {
      this.drawCircle(this.gradientColor.getColorPositionAtIndex(index), index);
    }
  }

   drawCircle(position, index) {
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = Z4Constants.getStyle(index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = Z4Constants.getStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Returns the managed gradient color
   *
   * @return The managed gradient color
   */
   getGradientColor() {
    return this.gradientColor;
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }

   fireOnChange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }
}
