/**
 * The chooser for a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorChooser extends JSDropDown {

   colorPreview = new JSComponent(document.createElement("canvas"));

   ctx = this.colorPreview.invoke("getContext('2d')");

   panel = new Z4GradientColorPanel();

   closeOnChange = true;

   changed = false;

   listeners = new Array();

  static  WIDTH = 45;

  static  HEIGHT = 14;

  /**
   * Creates the object
   */
  constructor() {
    super(".z4gradientcolorpanel");
    this.cssAddClass("z4gradientcolorchooser");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
      } else if (this.changed) {
        Z4GradientColor.pushHistory(this.panel.getValue());
      }
    });
    this.colorPreview.setProperty("width", "" + Z4GradientColorChooser.WIDTH);
    this.colorPreview.setProperty("height", "" + Z4GradientColorChooser.HEIGHT);
    this.appendChildInTree("summary", this.colorPreview);
    this.putImageData();
    this.panel.addChangeListener(event => this.onchange());
    this.appendChild(this.panel);
  }

  /**
   * Returns the selected gradient color
   *
   * @return The selected gradient color
   */
   getSelectedColor() {
    return this.panel.getValue();
  }

  /**
   * Sets the selected gradient color
   *
   * @param gradientColor The selected gradient color
   */
   setSelectedColor(gradientColor) {
    this.panel.setValue(gradientColor);
    this.putImageData();
  }

  /**
   * Returns if the selected gradient color is "adjusting"
   *
   * @return true if the selected gradient color is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.panel.getValueIsAdjusting();
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }

   onchange() {
    this.changed = true;
    this.putImageData();
    if (!this.getValueIsAdjusting() && this.closeOnChange) {
      this.removeAttribute("open");
      this.invoke("querySelector('summary').focus()");
    }
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

   putImageData() {
    let gradientColor = this.panel.getValue();
    let imageData = this.ctx.createImageData(Z4GradientColorChooser.WIDTH, Z4GradientColorChooser.HEIGHT);
    let data = imageData.data;
    for (let x = 0; x < Z4GradientColorChooser.WIDTH; x++) {
      let color = gradientColor.getColorAt(x / Z4GradientColorChooser.WIDTH, true);
      for (let y = 0; y < Z4GradientColorChooser.HEIGHT; y++) {
        let idx = (y * Z4GradientColorChooser.WIDTH + x) * 4;
        data[idx] = color.red;
        data[idx + 1] = color.green;
        data[idx + 2] = color.blue;
        data[idx + 3] = color.alpha;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

   setEnabled(b) {
    super.setEnabled(b);
    if (b) {
      this.removeAttribute("tabIndex");
    } else {
      this.setAttribute("tabIndex", "-1");
    }
  }

  /**
   * Sets if the combobox has to be closed on change
   *
   * @param b true to close the combobox on change, false otherwise
   */
   setCloseOnChange(b) {
    this.closeOnChange = b;
  }

  /**
   * Shows a dialog to select the gradient color
   *
   * @param title The title
   * @param gradientColor The initial gradient color (it can be null)
   * @param response The function to call on close
   */
  static  showDialog(title, gradientColor, response) {
    let panel = new Z4GradientColorPanel();
    if (gradientColor) {
      panel.setValue(gradientColor);
    }
    JSOptionPane.showInputDialog(panel, title, (changeListener) => panel.addChangeListener(changeListener), () => true, res => {
      if (res === JSOptionPane.OK_OPTION) {
        let selected = panel.getValue();
        Z4GradientColor.pushHistory(selected);
        response(selected);
      }
    });
  }
}
