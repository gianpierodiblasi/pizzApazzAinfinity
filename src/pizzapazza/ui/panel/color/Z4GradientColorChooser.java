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
import pizzapazza.color.Z4GradientColor;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import simulation.js.$Uint8Array;

/**
 * The chooser for a gradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorChooser extends JSDropDown {

  private final JSComponent colorPreview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.colorPreview.invoke("getContext('2d')");
  private final Z4GradientColorPanel panel = new Z4GradientColorPanel();

  private boolean closeOnChange = true;
  private boolean changed;

  private final Array<ChangeListener> listeners = new Array<>();

  private static final int WIDTH = 45;
  private static final int HEIGHT = 12;

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4GradientColorChooser() {
    super(".z4gradientcolorpanel");
    this.cssAddClass("z4gradientcolorchooser");

    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
      } else if (this.changed) {
        Z4GradientColor.pushHistory(this.panel.getValue());
      }
    });

    this.colorPreview.setProperty("width", "" + Z4GradientColorChooser.WIDTH);
    this.colorPreview.setProperty("height", "" + Z4GradientColorChooser.HEIGHT);
    this.appendChildInTree("summary", this.colorPreview);
    this.putImageData();

    this.panel.addChangeListener(event -> this.onchange());
    this.appendChild(this.panel);
  }

  /**
   * Returns the selected gradient color
   *
   * @return The selected gradient color
   */
  public Z4GradientColor getSelectedColor() {
    return this.panel.getValue();
  }

  /**
   * Sets the selected gradient color
   *
   * @param gradientColor The selected gradient color
   */
  public void setSelectedColor(Z4GradientColor gradientColor) {
    this.panel.setValue(gradientColor);
    this.putImageData();
  }

  /**
   * Returns if the selected gradient color is "adjusting"
   *
   * @return true if the selected gradient color is adjusting, false otherwise
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
    Z4GradientColor gradientColor = this.panel.getValue();

    ImageData imageData = this.ctx.createImageData(Z4GradientColorChooser.WIDTH, Z4GradientColorChooser.HEIGHT);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int x = 0; x < Z4GradientColorChooser.WIDTH; x++) {
      Color color = gradientColor.getColorAt(x / Z4GradientColorChooser.WIDTH, true);
      for (int y = 0; y < Z4GradientColorChooser.HEIGHT; y++) {
        int idx = (y * Z4GradientColorChooser.WIDTH + x) * 4;
        data.$set(idx, color.red);
        data.$set(idx + 1, color.green);
        data.$set(idx + 2, color.blue);
        data.$set(idx + 3, color.alpha);
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
   * Sets the visibility of the ripple
   *
   * @param b true to show the ripple, false otherwise
   */
  public void setRippleVisible(boolean b) {
    this.panel.setRippleVisible(b);
  }

  /**
   * Shows a dialog to select the gradient color
   *
   * @param title The title
   * @param gradientColor The initial gradient color (it can be null)
   * @param rippleVisible true to show the ripple, false otherwise
   * @param response The function to call on close
   */
  public static void showDialog(String title, Z4GradientColor gradientColor, boolean rippleVisible, $Apply_1_Void<Z4GradientColor> response) {
    Z4GradientColorPanel panel = new Z4GradientColorPanel();
    if ($exists(gradientColor)) {
      panel.setValue(gradientColor);
    }
    panel.setRippleVisible(rippleVisible);

    JSOptionPane.showInputDialog(panel, title, (changeListener) -> panel.addChangeListener(changeListener), () -> true, res -> {
      if (res == JSOptionPane.OK_OPTION) {
        Z4GradientColor selected = panel.getValue();
        Z4GradientColor.pushHistory(selected);
        response.$apply(selected);
      }
    });
  }
}
