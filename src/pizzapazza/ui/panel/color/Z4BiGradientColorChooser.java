package pizzapazza.ui.panel.color;

import static def.dom.Globals.document;
import def.dom.ImageData;
import def.js.Array;
import javascript.awt.Color;
import javascript.swing.JSComponent;
import javascript.swing.JSDropDown;
import javascript.swing.JSOptionPane;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import simulation.js.$Uint8Array;

/**
 * The chooser for a bigradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4BiGradientColorChooser extends JSDropDown {

  private final JSComponent colorPreview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.colorPreview.invoke("getContext('2d')");
  private final Z4BiGradientColorPanel panel = new Z4BiGradientColorPanel();

  private boolean closeOnChange = true;
  private boolean changed;

  private final Array<ChangeListener> listeners = new Array<>();

  private static final int WIDTH = 45;
  private static final int HEIGHT = 28;

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4BiGradientColorChooser() {
    super(".z4bigradientcolorpanel");
    this.cssAddClass("z4bigradientcolorchooser");

    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
      } else if (this.changed) {
        Z4BiGradientColor.pushHistory(this.panel.getValue());
      }
    });

    this.colorPreview.setProperty("width", "" + Z4BiGradientColorChooser.WIDTH);
    this.colorPreview.setProperty("height", "" + Z4BiGradientColorChooser.HEIGHT);
    this.appendChildInTree("summary", this.colorPreview);
    this.putImageData();

    this.panel.addChangeListener(event -> this.onchange());
    this.appendChild(this.panel);
  }

  /**
   * Returns the selected bigradient color
   *
   * @return The selected bigradient color
   */
  public Z4BiGradientColor getSelectedColor() {
    return this.panel.getValue();
  }

  /**
   * Sets the selected bigradient color
   *
   * @param bigradientColor The selected bigradient color
   */
  public void setSelectedColor(Z4BiGradientColor bigradientColor) {
    this.panel.setValue(bigradientColor);
    this.putImageData();
  }

  /**
   * Sets the visibility of the space and time labels
   *
   * @param b true to show the space and time labels, false otherwise
   */
  public void setSpaceTimeLabelsVisible(boolean b) {
    this.panel.setSpaceTimeLabelsVisible(b);
  }

  /**
   * Returns if the selected bigradient color is "adjusting"
   *
   * @return true if the selected bigradient color is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.panel.getValueIsAdjusting();
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }

  private void onchange() {
    this.changed = true;

    this.putImageData();

    if (!this.getValueIsAdjusting() && this.closeOnChange) {
      this.removeAttribute("open");
      this.invoke("querySelector('summary').focus()");
    }

    ChangeEvent event = new ChangeEvent();

    this.listeners.forEach(listener -> {
      if ($typeof(listener, "function")) {
        listener.$apply(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

  private void putImageData() {
    Z4BiGradientColor bigradientColor = this.panel.getValue();

    ImageData imageData = this.ctx.createImageData(Z4BiGradientColorChooser.WIDTH, Z4BiGradientColorChooser.HEIGHT);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < Z4BiGradientColorChooser.HEIGHT; y++) {
      Z4GradientColor gradientColor = bigradientColor.getColorAt(y / Z4BiGradientColorChooser.HEIGHT, true);
      for (int x = 0; x < Z4BiGradientColorChooser.WIDTH; x++) {
        Color color = gradientColor.getColorAt(x / Z4BiGradientColorChooser.WIDTH, true);

        int index = (y * Z4BiGradientColorChooser.WIDTH + x) * 4;
        data.$set(index, color.red);
        data.$set(index + 1, color.green);
        data.$set(index + 2, color.blue);
        data.$set(index + 3, color.alpha);
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  @Override
  public void setEnabled(boolean b) {
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
  public void setCloseOnChange(boolean b) {
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
  public static void showDialog(String title, Z4BiGradientColor bigradientColor, boolean spaceTimeLabelsVisible, $Apply_1_Void<Z4BiGradientColor> response) {
    Z4BiGradientColorPanel panel = new Z4BiGradientColorPanel();
    if ($exists(bigradientColor)) {
      panel.setValue(bigradientColor);
    }
    panel.setSpaceTimeLabelsVisible(spaceTimeLabelsVisible);
    
    JSOptionPane.showInputDialog(panel, title, (changeListener) -> panel.addChangeListener(changeListener), () -> true, res -> {
      if (res == JSOptionPane.OK_OPTION) {
        Z4BiGradientColor selected = panel.getValue();
        Z4BiGradientColor.pushHistory(selected);
        response.$apply(selected);
      }
    });
  }
}
