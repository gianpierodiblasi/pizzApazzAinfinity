package pizzapazza.ui.panel.color;

import static def.dom.Globals.document;
import def.dom.ImageData;
import def.dom.MouseEvent;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4GradientColorPanel extends Z4AbstractValuePanel<Z4GradientColor> {

  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
  private final JSSpinner rippleSpinner = new JSSpinner();
  private final JSSlider rippleSlider = new JSSlider();
  private final Z4ColorPanel colorPanel = new Z4ColorPanel();
  private final JSButton delete = new JSButton();

  private int selectedIndex = 0;
  private boolean pressed = false;

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
    this.preview.addEventListener("mouseenter", event -> this.onMouse((MouseEvent) event, "enter"));
    this.preview.addEventListener("mouseleave", event -> this.onMouse((MouseEvent) event, "leave"));
    this.preview.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.preview.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.preview.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    this.add(this.preview, new GBC(0, 0).w(3).i(0, 0, 5, 0));

    this.colorPanel.addChangeListener(event -> {
      this.value.addColor(this.colorPanel.getValue(), this.value.getColorPositionAtIndex(this.selectedIndex));
      this.drawPreview(false);
      this.onchange();
    });
    this.add(this.colorPanel, new GBC(0, 1).w(2).wx(1).f(GBC.HORIZONTAL));

    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.value.removeColor(this.value.getColorPositionAtIndex(this.selectedIndex));
        this.selectedIndex = 0;
        this.afterOperation();
        this.onchange();
      }
    }));
    this.add(this.delete, new GBC(2, 1).a(GBC.WEST).i(0, 5, 0, 0));

    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(0, 3).a(GBC.WEST));

    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.addChangeListener(event -> this.onRippleChange(true, this.rippleSpinner.getValueIsAdjusting()));
    this.add(this.rippleSpinner, new GBC(1, 3).w(2).a(GBC.EAST).i(5, 0, 0, 0));

    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event -> this.onRippleChange(false, this.rippleSlider.getValueIsAdjusting()));
    this.add(this.rippleSlider, new GBC(0, 4).w(3).a(GBC.NORTH).f(GBC.HORIZONTAL));

    JSPanel panel = new JSPanel();
    this.add(panel, new GBC(0, 5).w(3).a(GBC.NORTH).f(GBC.HORIZONTAL));

    JSButton button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event -> {
      this.value.mirror();
      this.afterOperation();
      this.onchange();
    });
    panel.add(button, null);

    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event -> {
      this.value.reverse();
      this.drawPreview(false);
      this.onchange();
    });
    panel.add(button, null);

    this.setValue(new Z4GradientColor());
  }

  @SuppressWarnings("StringEquality")
  private void onMouse(MouseEvent event, String type) {
    switch (type) {
      case "enter":
        break;
      case "down":
        for (int index = 0; index < this.value.getColorCount(); index++) {
          double position = this.value.getColorPositionAtIndex(index);
          if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.afterOperation();
          }
        }

        if (!this.pressed
                && !this.value.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE)
                && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
          this.value.addColor(this.value.getColorAt(event.offsetX / Z4GradientColorPanel.WIDTH, false), event.offsetX / Z4GradientColorPanel.WIDTH);
          this.pressed = true;

          for (int index = 0; index < this.value.getColorCount(); index++) {
            double position = this.value.getColorPositionAtIndex(index);
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
          double position = this.value.getColorPositionAtIndex(this.selectedIndex);
          double positionBefore = this.value.getColorPositionAtIndex(this.selectedIndex - 1);
          double positionAfter = this.value.getColorPositionAtIndex(this.selectedIndex + 1);
          double newPosition = event.offsetX / Z4GradientColorPanel.WIDTH;

          if (this.selectedIndex != 0 && this.selectedIndex != this.value.getColorCount() - 1
                  && positionBefore < newPosition - Z4GradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4GradientColorPanel.TOLERANCE) {
            Color color = this.value.getColorAtIndex(this.selectedIndex);
            this.value.removeColor(position);
            this.value.addColor(color, newPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.onchange();
          }
        } else {
          this.preview.getStyle().cursor = "default";
          for (int index = 0; index < this.value.getColorCount(); index++) {
            double position = this.value.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          }

          if (this.preview.getStyle().cursor == "default"
                  && !this.value.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE)
                  && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
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

  private void onRippleChange(boolean spTosl, boolean adjusting) {
    if (spTosl) {
      this.rippleSlider.setValue((int) this.rippleSpinner.getValue());
    } else {
      this.rippleSpinner.setValue(this.rippleSlider.getValue());
    }

    this.value.setRipple(this.rippleSlider.getValue() / 100);
    this.drawPreview(adjusting);
    this.valueIsAdjusting = adjusting;
    this.onchange();
  }

  private void afterOperation() {
    this.colorPanel.setValue(this.value.getColorAtIndex(this.selectedIndex));
    this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.value.getColorCount() - 1);
    this.drawPreview(false);
  }

  private void drawPreview(boolean adjusting) {
    ImageData imageData = this.ctx.createImageData(Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int x = 0; x < Z4GradientColorPanel.WIDTH; x++) {
      Color color = this.value.getColorAt(x / Z4GradientColorPanel.WIDTH, true);
      for (int y = 0; y < Z4GradientColorPanel.HEIGHT; y++) {
        int index = (y * Z4GradientColorPanel.WIDTH + x) * 4;
        data.$set(index, color.red);
        data.$set(index + 1, color.green);
        data.$set(index + 2, color.blue);
        data.$set(index + 3, color.alpha);
      }
    }

    this.ctx.putImageData(imageData, 0, 0);

    for (int index = 0; index < this.value.getColorCount(); index++) {
      this.drawCircle(this.value.getColorPositionAtIndex(index), index);
    }
  }

  private void drawCircle(double position, int index) {
    Array<Double> dash = new Array<>();

    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = Z4Constants.$getStyle(index == this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();

    dash.push(2.5, 2.5);

    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = Z4Constants.$getStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  @Override
  public Z4GradientColor getValue() {
    return Z4GradientColor.fromJSON(this.value.toJSON());
  }

  @Override
  public void setValue(Z4GradientColor value) {
    this.value = Z4GradientColor.fromJSON(value.toJSON());

    this.colorPanel.setValue(this.value.getColorAtIndex(this.selectedIndex));
    this.drawPreview(false);
  }
}
