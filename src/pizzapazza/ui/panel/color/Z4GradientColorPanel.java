package pizzapazza.ui.panel.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import def.dom.ImageData;
import def.dom.MouseEvent;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSButton;
import javascript.swing.JSColorChooser;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.component.Z4ColorPreview;
import pizzapazza.util.Z4Translations;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorPanel extends JSPanel {

  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
  private final JSSpinner rippleSpinner = new JSSpinner();
  private final JSSlider rippleSlider = new JSSlider();
  private final Z4ColorPreview colorPreview = new Z4ColorPreview();
  private final JSButton delete = new JSButton();

  private final Z4GradientColor gradientColor = new Z4GradientColor();
  private int selectedIndex = 0;
  private boolean pressed = false;

  private final Array<ChangeListener> listeners = new Array<>();
  private boolean valueIsAdjusting;

  private static final int SELECTOR_RADIUS = 7;
  private static final int WIDTH = 200;
  private static final int HEIGHT = 50;
  private static final double TOLERANCE = 0.1;

  /**
   * Creates the object
   */
  public Z4GradientColorPanel() {
    super();
    this.cssAddClass("z4gradientcolorpanel");
    this.setLayout(new GridBagLayout());

    this.preview.setProperty("width", "" + Z4GradientColorPanel.WIDTH);
    this.preview.setProperty("height", "" + Z4GradientColorPanel.HEIGHT);
    this.preview.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.preview.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.preview.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    this.addComponent(this.preview, 0, 0, 3, 1, 0, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, new Insets(0, 0, 5, 0));

    this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
    this.addComponent(this.colorPreview, 0, 1, 1, 1, 1, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, null);

    JSButton button = new JSButton();
    button.setText(Z4Translations.EDIT);
    button.addActionListener(event -> this.selectColor());
    this.addComponent(button, 1, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));

    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event -> {
      JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
        if (response == JSOptionPane.YES_OPTION) {
          this.gradientColor.removeColor(this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
          this.selectedIndex = 0;
          this.afterOperation();
          this.fireOnChange();
        }
      });
    });

    this.addComponent(this.delete, 2, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));

    this.addLabel(Z4Translations.RIPPLE, 0, 3, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.addChangeListener(event -> this.onChange(true, this.rippleSpinner.getValueIsAdjusting()));
    this.addComponent(this.rippleSpinner, 1, 3, 2, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(5, 0, 0, 0));

    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event -> this.onChange(false, this.rippleSlider.getValueIsAdjusting()));
    this.addComponent(this.rippleSlider, 0, 4, 3, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);

    JSPanel panel = new JSPanel();
    this.addComponent(panel, 0, 5, 3, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);

    button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event -> {
      this.gradientColor.mirror();
      this.afterOperation();
      this.fireOnChange();
    });
    panel.add(button, null);

    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event -> {
      this.gradientColor.reverse();
      this.drawPreview(false);
      this.fireOnChange();
    });
    panel.add(button, null);

    this.drawPreview(false);
  }

  private void addLabel(String text, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill) {
    JSLabel label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, null);
  }

  private void addComponent(JSComponent component, int gridx, int gridy, int gridwidth, int gridheight, int weightx, int weighty, int anchor, int fill, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }

  @SuppressWarnings("StringEquality")
  private void onMouse(MouseEvent event, String type) {
    switch (type) {
      case "down":
        for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
          double position = this.gradientColor.getColorPositionAtIndex(index);
          if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.afterOperation();
          }
        }

        if (!this.pressed
                && !this.gradientColor.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE)
                && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
          this.gradientColor.addColor(this.gradientColor.getColorAt(event.offsetX / Z4GradientColorPanel.WIDTH, false), event.offsetX / Z4GradientColorPanel.WIDTH);
          this.pressed = true;

          for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
            double position = this.gradientColor.getColorPositionAtIndex(index);
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
          double position = this.gradientColor.getColorPositionAtIndex(this.selectedIndex);
          double positionBefore = this.gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
          double positionAfter = this.gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
          double newPosition = event.offsetX / Z4GradientColorPanel.WIDTH;

          if (this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1
                  && positionBefore < newPosition - Z4GradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4GradientColorPanel.TOLERANCE) {
            Color color = this.gradientColor.getColorAtIndex(this.selectedIndex);
            this.gradientColor.removeColor(position);
            this.gradientColor.addColor(color, newPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.fireOnChange();
          }
        } else {
          this.preview.getStyle().cursor = "default";
          for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
            double position = this.gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          }

          if (this.preview.getStyle().cursor == "default"
                  && !this.gradientColor.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE)
                  && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
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
    }
  }

  private void onChange(boolean spTosl, boolean adjusting) {
    if (spTosl) {
      this.rippleSlider.setValue((int) this.rippleSpinner.getValue());
    } else {
      this.rippleSpinner.setValue(this.rippleSlider.getValue());
    }

    this.gradientColor.setRipple(this.rippleSlider.getValue() / 100);
    this.drawPreview(adjusting);
    this.valueIsAdjusting = adjusting;
    this.fireOnChange();
  }

  private void selectColor() {
    JSColorChooser.showDialog(Z4Translations.COLOR, this.gradientColor.getColorAtIndex(this.selectedIndex), true, null, c -> {
      this.gradientColor.addColor(c, this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
      this.colorPreview.setColor(c);
      this.drawPreview(false);
      this.fireOnChange();
    });
  }

  private void afterOperation() {
    this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
    this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1);
    this.drawPreview(false);
  }

  private void drawPreview(boolean adjusting) {
    ImageData imageData = this.ctx.createImageData(Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int x = 0; x < Z4GradientColorPanel.WIDTH; x++) {
      Color color = this.gradientColor.getColorAt(x / Z4GradientColorPanel.WIDTH, true);
      for (int y = 0; y < Z4GradientColorPanel.HEIGHT; y++) {
        int index = (y * Z4GradientColorPanel.WIDTH + x) * 4;
        data.$set(index, color.red);
        data.$set(index + 1, color.green);
        data.$set(index + 2, color.blue);
        data.$set(index + 3, color.alpha);
      }
    }

    this.ctx.putImageData(imageData, 0, 0);

    for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
      this.drawCircle(this.gradientColor.getColorPositionAtIndex(index), index);
    }
  }

  private void drawCircle(double position, int index) {
    Array<Double> dash = new Array<>();

    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.$getStrokeStyle(index == this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();

    dash.push(2.5, 2.5);

    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.$getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  private String getStrokeStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }

  /**
   * Returns the managed gradient color
   *
   * @return The managed gradient color
   */
  public Z4GradientColor getGradientColor() {
    return this.gradientColor;
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }

  private void fireOnChange() {
    ChangeEvent event = new ChangeEvent();

    this.listeners.forEach(listener -> {
      if ($typeof(listener, "function")) {
        listener.$apply(event);
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
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }
}
