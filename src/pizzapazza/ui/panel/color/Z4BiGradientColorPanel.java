package pizzapazza.ui.panel.color;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import def.dom.ImageData;
import def.dom.MouseEvent;
import javascript.awt.Color;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.ui.component.Z4ColorPreview;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4BiGradientColorPanel extends JSPanel {

  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
//  private final JSSpinner rippleSpinner = new JSSpinner();
//  private final JSSlider rippleSlider = new JSSlider();
  private final Z4ColorPreview colorPreview = new Z4ColorPreview();
//  private final JSButton delete = new JSButton();

  private final Z4BiGradientColor biGradientColor = new Z4BiGradientColor();
//  private int selectedIndex = 0;
//  private boolean pressed = false;

  private static final int SELECTOR_RADIUS = 7;
  private static final int WIDTH = 200;
  private static final int HEIGHT = 200;
  private static final double TOLLERANCE = 0.075;

  public Z4BiGradientColorPanel() {
    super();
    this.cssAddClass("z4bigradientcolorpanel");
    this.setLayout(new GridBagLayout());

    this.preview.setProperty("width", "" + Z4BiGradientColorPanel.WIDTH);
    this.preview.setProperty("height", "" + Z4BiGradientColorPanel.HEIGHT);
    this.preview.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.preview.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.preview.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    this.addComponent(this.preview, 0, 0, 3, 1, 2, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);
//
//    this.colorPreview.setColor(this.gradientColor.getColorAtIndex(0));
//    this.addComponent(this.colorPreview, 0, 1, 1, 1, 1, 0, GridBagConstraints.CENTER, GridBagConstraints.HORIZONTAL, null);
//
//    JSButton button = new JSButton();
//    button.setText(Z4Translations.EDIT);
//    button.addActionListener(event -> this.selectColor());
//    this.addComponent(button, 1, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
//
//    this.delete.setText(Z4Translations.DELETE);
//    this.delete.setEnabled(false);
//    this.delete.addActionListener(event -> {
//      JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
//        if (response == JSOptionPane.YES_OPTION) {
//          this.gradientColor.removeColor(this.gradientColor.getColorPositionAtIndex(this.selectedIndex));
//          this.selectedIndex = 0;
//          this.colorPreview.setColor(this.gradientColor.getColorAtIndex(0));
//          this.delete.setEnabled(false);
//          this.drawPreview(false);
//        }
//      });
//    });
//    
//    this.addComponent(this.delete, 2, 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 5, 0, 0));
//    
//    this.addLabel(Z4Translations.RIPPLE, 0, 3, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
//
//    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
//    this.rippleSpinner.getStyle().minWidth = "4rem";
//    this.rippleSpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
//    this.rippleSpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
//    this.rippleSpinner.addChangeListener(event -> this.onChange(true, this.rippleSpinner.getValueIsAdjusting()));
//    this.addComponent(this.rippleSpinner, 1, 3, 2, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(5, 0, 0, 0));
//
//    this.rippleSlider.setValue(0);
//    this.rippleSlider.getStyle().minWidth = "20rem";
//    this.rippleSlider.addChangeListener(event -> this.onChange(false, this.rippleSlider.getValueIsAdjusting()));
//    this.addComponent(this.rippleSlider, 0, 4, 3, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
//
//    JSPanel panel = new JSPanel();
//    this.addComponent(panel, 0, 5, 3, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);
//
//    button = new JSButton();
//    button.setText(Z4Translations.MIRRORED);
//    button.addActionListener(event -> {
//      this.gradientColor.mirror();
//      this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
//      this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1);
//      this.drawPreview(false);
//    });
//    panel.add(button, null);
//
//    button = new JSButton();
//    button.setText(Z4Translations.INVERTED);
//    button.addActionListener(event -> {
//      this.gradientColor.reverse();
//      this.drawPreview(false);
//    });
//    panel.add(button, null);

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
//    int w = parseInt(this.preview.getProperty("width"));
//    int h = parseInt(this.preview.getProperty("height"));
//
//    switch (type) {
//      case "down":
//        for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
//          double position = this.gradientColor.getColorPositionAtIndex(index);
//          if (Z4Math.distance(position * w, h / 2, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
//            this.pressed = true;
//            this.selectedIndex = index;
//            this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
//            this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1);
//            this.drawPreview(false);
//          }
//        }
//
//        if (!this.pressed && !this.gradientColor.isPositionOccupied(event.offsetX / w, Z4BiGradientColorPanel.TOLLERANCE) && Math.abs(h / 2 - event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
//          this.gradientColor.addColor(this.gradientColor.getColorAt(event.offsetX / w, false), event.offsetX / w);
//          this.pressed = true;
//
//          for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
//            double position = this.gradientColor.getColorPositionAtIndex(index);
//            if (Z4Math.distance(position * w, h / 2, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
//              this.selectedIndex = index;
//              this.colorPreview.setColor(this.gradientColor.getColorAtIndex(this.selectedIndex));
//              this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1);
//            }
//          }
//
//          this.preview.getStyle().cursor = "pointer";
//          this.drawPreview(false);
//        }
//        break;
//      case "move":
//        if (this.pressed) {
//          double position = this.gradientColor.getColorPositionAtIndex(this.selectedIndex);
//          double positionBefore = this.gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
//          double positionAfter = this.gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
//          double newPosition = event.offsetX / w;
//
//          if (this.selectedIndex != 0 && this.selectedIndex != this.gradientColor.getColorCount() - 1
//                  && positionBefore < newPosition - Z4BiGradientColorPanel.TOLLERANCE && positionAfter > newPosition + Z4BiGradientColorPanel.TOLLERANCE) {
//            Color color = this.gradientColor.getColorAtIndex(this.selectedIndex);
//            this.gradientColor.removeColor(position);
//            this.gradientColor.addColor(color, newPosition);
//            this.drawPreview(true);
//          }
//        } else {
//          this.preview.getStyle().cursor = "default";
//          for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
//            double position = this.gradientColor.getColorPositionAtIndex(index);
//            if (Z4Math.distance(position * w, h / 2, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
//              this.preview.getStyle().cursor = "pointer";
//            }
//          }
//
//          if (this.preview.getStyle().cursor == "default") {
//            if (!this.gradientColor.isPositionOccupied(event.offsetX / w, Z4BiGradientColorPanel.TOLLERANCE) && Math.abs(h / 2 - event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
//              this.preview.getStyle().cursor = "copy";
//            }
//
//          }
//        }
//        break;
//      case "up":
//        this.pressed = false;
//        this.drawPreview(false);
//        break;
//    }
  }

  private void onChange(boolean spTosl, boolean adjusting) {
//    if (spTosl) {
//      this.rippleSlider.setValue((int) this.rippleSpinner.getValue());
//    } else {
//      this.rippleSpinner.setValue(this.rippleSlider.getValue());
//    }
//
//    this.gradientColor.setRipple(this.rippleSlider.getValue() / 100);
//    this.drawPreview(adjusting);
  }

  private void selectColor() {
//    JSColorChooser.showDialog(Z4Translations.COLOR, this.gradientColor.getColorAtIndex(this.selectedIndex), true, null, c -> {
//      double position = this.gradientColor.getColorPositionAtIndex(this.selectedIndex);
//      this.gradientColor.addColor(c, position);
//      this.colorPreview.setColor(c);
//      this.drawPreview(false);
//    });
  }

  private void drawPreview(boolean adjusting) {
    ImageData imageData = this.ctx.createImageData(Z4BiGradientColorPanel.WIDTH, Z4BiGradientColorPanel.HEIGHT);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < Z4BiGradientColorPanel.HEIGHT; y++) {
      Z4GradientColor gradientColor = this.biGradientColor.getColorAt(y / Z4BiGradientColorPanel.HEIGHT, true);
      for (int x = 0; x < Z4BiGradientColorPanel.WIDTH; x++) {
        Color color = gradientColor.getColorAt(x / Z4BiGradientColorPanel.WIDTH, true);

        int index = (y * Z4BiGradientColorPanel.WIDTH + x) * 4;
        data.$set(index, color.red);
        data.$set(index + 1, color.green);
        data.$set(index + 2, color.blue);
        data.$set(index + 3, color.alpha);
      }
    }
//
//    this.ctx.putImageData(imageData, 0, 0);
//
//    for (int index = 0; index < this.gradientColor.getColorCount(); index++) {
//      this.drawCircle(this.gradientColor.getColorPositionAtIndex(index), index);
//    }
  }

  private void drawCircle(double position, int index) {
//    Array<Double> dash = new Array<>();
//
//    this.ctx.beginPath();
//    this.ctx.arc(position * w, h / 2, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
//    this.ctx.closePath();
//    this.ctx.strokeStyle = this.$getStrokeStyle(index == this.selectedIndex ? "red" : "black");
//    this.ctx.setLineDash(dash);
//    this.ctx.stroke();
//
//    dash.push(2.5, 2.5);
//
//    this.ctx.beginPath();
//    this.ctx.arc(position * w, h / 2, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
//    this.ctx.closePath();
//    this.ctx.strokeStyle = this.$getStrokeStyle("white");
//    this.ctx.setLineDash(dash);
//    this.ctx.stroke();
  }

  private String getStrokeStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }
}
