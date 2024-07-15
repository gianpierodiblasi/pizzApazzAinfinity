/**
 * The chooser for a bigradient color
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColorChooser extends JSDropDown {

   colorPreview = new JSComponent(document.createElement("canvas"));

   ctx = this.colorPreview.invoke("getContext('2d')");

   panel = new Z4BiGradientColorPanel();

   closeOnChange = true;

   changed = false;

   listeners = new Array();

  static  WIDTH = 45;

  static  HEIGHT = 28;

  /**
   * Creates the object
   */
  constructor() {
    super(".z4bigradientcolorpanel");
    this.cssAddClass("z4bigradientcolorchooser");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
      } else if (this.changed) {
        Z4BiGradientColor.pushHistory(this.panel.getValue());
      }
    });
    this.colorPreview.setProperty("width", "" + Z4BiGradientColorChooser.WIDTH);
    this.colorPreview.setProperty("height", "" + Z4BiGradientColorChooser.HEIGHT);
    this.appendChildInTree("summary", this.colorPreview);
    this.putImageData();
    this.panel.addChangeListener(event => this.onchange());
    this.appendChild(this.panel);
  }

  /**
   * Returns the selected bigradient color
   *
   * @return The selected bigradient color
   */
   getSelectedColor() {
    return this.panel.getValue();
  }

  /**
   * Sets the selected bigradient color
   *
   * @param bigradientColor The selected bigradient color
   */
   setSelectedColor(bigradientColor) {
    this.panel.setValue(bigradientColor);
    this.putImageData();
  }

  /**
   * Sets the visibility of the space and time labels
   *
   * @param b true to show the space and time labels, false otherwise
   */
   setSpaceTimeLabelsVisible(b) {
    this.panel.setSpaceTimeLabelsVisible(b);
  }

  /**
   * Returns if the selected bigradient color is "adjusting"
   *
   * @return true if the selected bigradient color is adjusting, false otherwise
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
    let bigradientColor = this.panel.getValue();
    let imageData = this.ctx.createImageData(Z4BiGradientColorChooser.WIDTH, Z4BiGradientColorChooser.HEIGHT);
    let data = imageData.data;
    for (let y = 0; y < Z4BiGradientColorChooser.HEIGHT; y++) {
      let gradientColor = bigradientColor.getColorAt(y / Z4BiGradientColorChooser.HEIGHT, true);
      for (let x = 0; x < Z4BiGradientColorChooser.WIDTH; x++) {
        let color = gradientColor.getColorAt(x / Z4BiGradientColorChooser.WIDTH, true);
        let index = (y * Z4BiGradientColorChooser.WIDTH + x) * 4;
        data[index] = color.red;
        data[index + 1] = color.green;
        data[index + 2] = color.blue;
        data[index + 3] = color.alpha;
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
   * Shows a dialog to select the bigradient color
   *
   * @param title The title
   * @param bigradientColor The initial bigradient color (it can be null)
   * @param spaceTimeLabelsVisible true to show the space and time labels, false
   * otherwise
   * @param response The function to call on close
   */
  static  showDialog(title, bigradientColor, spaceTimeLabelsVisible, response) {
    let panel = new Z4BiGradientColorPanel();
    if (bigradientColor) {
      panel.setValue(bigradientColor);
    }
    panel.setSpaceTimeLabelsVisible(spaceTimeLabelsVisible);
    JSOptionPane.showInputDialog(panel, title, (changeListener) => panel.addChangeListener(changeListener), () => true, res => {
      if (res === JSOptionPane.OK_OPTION) {
        let selected = panel.getValue();
        Z4BiGradientColor.pushHistory(selected);
        response(selected);
      }
    });
  }
}
