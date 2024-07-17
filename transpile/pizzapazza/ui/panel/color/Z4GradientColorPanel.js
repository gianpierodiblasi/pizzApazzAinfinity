/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorPanel extends Z4AbstractValuePanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   rippleLabel = null;

   rippleSpinner = new JSSpinner();

   rippleSlider = new JSSlider();

   colorPanel = new Z4ColorPanel();

   delete = new JSButton();

   selectedIndex = 0;

   pressed = false;

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
    this.colorPanel.addChangeListener(event => {
      this.value.addColor(this.colorPanel.getValue(), this.value.getColorPositionAtIndex(this.selectedIndex));
      this.drawPreview(false);
      this.onchange();
    });
    this.add(this.colorPanel, new GBC(0, 1).w(2).wx(1).f(GBC.HORIZONTAL));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.value.removeColor(this.value.getColorPositionAtIndex(this.selectedIndex));
        this.selectedIndex = 0;
        this.afterOperation();
        this.onchange();
      }
    }));
    this.add(this.delete, new GBC(2, 1).a(GBC.WEST).i(0, 5, 0, 0));
    this.rippleLabel = Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(0, 2).a(GBC.WEST));
    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.addChangeListener(event => this.onRippleChange(true, this.rippleSpinner.getValueIsAdjusting()));
    this.add(this.rippleSpinner, new GBC(1, 2).w(2).a(GBC.EAST).i(5, 0, 0, 0));
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event => this.onRippleChange(false, this.rippleSlider.getValueIsAdjusting()));
    this.add(this.rippleSlider, new GBC(0, 3).w(3).a(GBC.NORTH).f(GBC.HORIZONTAL));
    let panel = new JSPanel();
    this.add(panel, new GBC(0, 4).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    let button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      this.value.mirror();
      this.afterOperation();
      this.onchange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      this.value.reverse();
      this.drawPreview(false);
      this.onchange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.cssAddClass("z4gradientcolorpanel-history");
    button.setIcon(new Z4EmptyImageProducer(""));
    button.setTooltip(Z4Translations.HISTORY);
    button.addActionListener(event => this.showHistory());
    this.add(button, new GBC(2, 4).a(GBC.EAST));
    this.setValue(new Z4GradientColor());
  }

   onMouse(event, type) {
    switch(type) {
      case "enter":
        break;
      case "down":
        for (let index = 0; index < this.value.getColorCount(); index++) {
          let position = this.value.getColorPositionAtIndex(index);
          if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.afterOperation();
          }
        }
        if (!this.pressed && !this.value.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE) && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
          this.value.addColor(this.value.getColorAt(event.offsetX / Z4GradientColorPanel.WIDTH, false), event.offsetX / Z4GradientColorPanel.WIDTH);
          this.pressed = true;
          for (let index = 0; index < this.value.getColorCount(); index++) {
            let position = this.value.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.selectedIndex = index;
              this.afterOperation();
              this.onchange();
            }
          }
          this.preview.getStyle().cursor = "pointer";
        }
        break;
      case "move":
        if (this.pressed) {
          let position = this.value.getColorPositionAtIndex(this.selectedIndex);
          let positionBefore = this.value.getColorPositionAtIndex(this.selectedIndex - 1);
          let positionAfter = this.value.getColorPositionAtIndex(this.selectedIndex + 1);
          let newPosition = event.offsetX / Z4GradientColorPanel.WIDTH;
          if (this.selectedIndex !== 0 && this.selectedIndex !== this.value.getColorCount() - 1 && positionBefore < newPosition - Z4GradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4GradientColorPanel.TOLERANCE) {
            let color = this.value.getColorAtIndex(this.selectedIndex);
            this.value.removeColor(position);
            this.value.addColor(color, newPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.onchange();
          }
        } else {
          this.preview.getStyle().cursor = "default";
          for (let index = 0; index < this.value.getColorCount(); index++) {
            let position = this.value.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          }
          if (this.preview.getStyle().cursor === "default" && !this.value.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE) && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.preview.getStyle().cursor = "copy";
          }
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        this.valueIsAdjusting = false;
        this.onchange();
        break;
      case "leave":
        if (this.pressed) {
          this.pressed = false;
          this.drawPreview(false);
          this.valueIsAdjusting = false;
          this.onchange();
        }
        break;
    }
  }

   onRippleChange(spTosl, adjusting) {
    if (spTosl) {
      this.rippleSlider.setValue(this.rippleSpinner.getValue());
    } else {
      this.rippleSpinner.setValue(this.rippleSlider.getValue());
    }
    this.value.setRipple(this.rippleSlider.getValue() / 100);
    this.drawPreview(adjusting);
    this.valueIsAdjusting = adjusting;
    this.onchange();
  }

   afterOperation() {
    this.colorPanel.setValue(this.value.getColorAtIndex(this.selectedIndex));
    this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== this.value.getColorCount() - 1);
    this.drawPreview(false);
  }

   showHistory() {
    let scrollPanel = new JSPanel();
    scrollPanel.cssAddClass("z4gradientcolorpanel-scrollpanel");
    scrollPanel.getStyle().height = ((Z4GradientColorPanel.HEIGHT + 6) * 8 + 5) + "px";
    let historyPanel = new JSPanel();
    historyPanel.setLayout(new GridBagLayout());
    historyPanel.cssAddClass("z4gradientcolorpanel-historypanel");
    scrollPanel.add(historyPanel, null);
    let radios = new Array();
    let previews = new Array();
    let buttonGroup = new ButtonGroup();
    Z4GradientColor.getHistory().forEach((gradientColor, index, array) => {
      let radio = new JSRadioButton();
      buttonGroup.add(radio);
      radios.push(radio);
      let previewHistory = new JSComponent(document.createElement("canvas"));
      previewHistory.setProperty("width", "" + Z4GradientColorPanel.WIDTH);
      previewHistory.setProperty("height", "" + Z4GradientColorPanel.HEIGHT);
      previewHistory.getStyle().height = Z4GradientColorPanel.HEIGHT + "px";
      previews.push(previewHistory);
      this.putImageData(previewHistory.invoke("getContext('2d')"), gradientColor);
      historyPanel.add(radio, new GBC((index % 2) * 2, parseInt(index / 2)));
      historyPanel.add(previewHistory, new GBC((index % 2) * 2 + 1, parseInt(index / 2)).i(2, 0, 2, 20).wx(1).f(GBC.HORIZONTAL));
    });
    JSOptionPane.showInputDialog(scrollPanel, Z4Translations.HISTORY, listener => {
      radios.forEach(radio => radio.addActionListener(event => listener(new ChangeEvent())));
      previews.forEach((previewHistory, index, array) => previewHistory.addEventListener("mousedown", event => {
        radios[index].setSelected(true);
        listener(new ChangeEvent());
      }));
      previews.forEach((previewHistory, index, array) => previewHistory.addEventListener("dblclick", event => {
        radios[index].setSelected(true);
        listener(new ChangeEvent());
        ((document.querySelector(".z4gradientcolorpanel-historypanel")).closest(".jsdialog").querySelector(".jsoptionpane-option-0")).click();
      }));
    }, () => radios.some((radio, index, array) => radio.isSelected()), response => {
      if (response === JSOptionPane.OK_OPTION) {
        this.setValue(Z4GradientColor.getHistory()[radios.findIndex(radio => radio.isSelected())]);
        this.onchange();
      }
    });
  }

   drawPreview(adjusting) {
    this.putImageData(this.ctx, this.value);
    for (let index = 0; index < this.value.getColorCount(); index++) {
      this.drawCircle(this.value.getColorPositionAtIndex(index), index);
    }
  }

   putImageData(ctx, gradientColor) {
    let imageData = ctx.createImageData(Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT);
    let data = imageData.data;
    for (let x = 0; x < Z4GradientColorPanel.WIDTH; x++) {
      let color = gradientColor.getColorAt(x / Z4GradientColorPanel.WIDTH, true);
      for (let y = 0; y < Z4GradientColorPanel.HEIGHT; y++) {
        let idx = (y * Z4GradientColorPanel.WIDTH + x) * 4;
        data[idx] = color.red;
        data[idx + 1] = color.green;
        data[idx + 2] = color.blue;
        data[idx + 3] = color.alpha;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

   drawCircle(position, index) {
    this.ctx.lineWidth = 3;
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.getStyle(index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.getStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the visibility of the ripple
   *
   * @param b true to show the ripple, false otherwise
   */
   setRippleVisible(b) {
    this.rippleLabel.getStyle().display = b ? "block" : "none";
    this.rippleSpinner.getStyle().display = b ? "grid" : "none";
    this.rippleSlider.getStyle().display = b ? "flex" : "none";
  }

   getValue() {
    return Z4GradientColor.fromJSON(this.value.toJSON());
  }

   setValue(value) {
    this.value = Z4GradientColor.fromJSON(value.toJSON());
    if (this.rippleLabel.getStyle().display === "none") {
      this.value.setRipple(0);
    }
    this.colorPanel.setValue(this.value.getColorAtIndex(this.selectedIndex));
    this.drawPreview(false);
  }
}
