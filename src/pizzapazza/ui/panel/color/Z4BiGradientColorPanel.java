package pizzapazza.ui.panel.color;

import static def.dom.Globals.document;
import def.dom.HTMLElement;
import def.dom.ImageData;
import def.dom.MouseEvent;
import def.js.Array;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import javascript.swing.event.ChangeEvent;
import pizzapazza.color.Z4BiGradientColor;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Uint8Array;

/**
 * The panel to manage a bigradient color
 *
 * @author gianpiero.diblasi
 */
public class Z4BiGradientColorPanel extends Z4AbstractValuePanel<Z4BiGradientColor> {

  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
  private final JSSpinner biRippleSpinner = new JSSpinner();
  private final JSSlider biRippleSlider = new JSSlider();
  private final JSSpinner rippleSpinner = new JSSpinner();
  private final JSSlider rippleSlider = new JSSlider();
  private final Z4ColorPanel colorPanel = new Z4ColorPanel();
  private final JSButton biDelete = new JSButton();
  private final JSButton delete = new JSButton();
  private final JSLabel space;
  private final JSLabel time;

  private int biSelectedIndex = 0;
  private int selectedIndex = 0;
  private boolean pressed = false;

  private boolean valueIsAdjusting;

  private int width = Z4BiGradientColorPanel.SIZE;
  private int height = Z4BiGradientColorPanel.SIZE;

  private static final int SELECTOR_RADIUS = 7;
  private static final int SIZE = 200;
  private static final double TOLERANCE = 0.1;

  /**
   * Creates the object
   */
  public Z4BiGradientColorPanel() {
    super();
    this.cssAddClass("z4bigradientcolorpanel");
    this.setLayout(new GridBagLayout());

    this.add(new JSLabel(), new GBC(0, 0).w(3).wy(1));
    this.space = Z4UI.addLabel(this, Z4Translations.SPACE, new GBC(1, 1).w(2).a(GBC.SOUTHEAST));

    this.time = Z4UI.addLabel(this, Z4Translations.TIME, new GBC(0, 2).wh(3, 2).a(GBC.SOUTHEAST));
    this.time.cssAddClass("jslabel-vertical");

    this.preview.setProperty("width", "" + this.width);
    this.preview.setProperty("height", "" + this.height);
    this.preview.addEventListener("mouseenter", event -> this.onMouse((MouseEvent) event, "enter"));
    this.preview.addEventListener("mouseleave", event -> this.onMouse((MouseEvent) event, "leave"));
    this.preview.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.preview.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.preview.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    this.add(this.preview, new GBC(1, 2).wh(2, 2));

    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(3, 3).h(2).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");

    Z4UI.setVerticalSpinner(this.biRippleSpinner);
    this.biRippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.biRippleSpinner.addChangeListener(event -> this.onRippleChange(true, this.biRippleSpinner.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.add(this.biRippleSpinner, new GBC(3, 0).h(3).a(GBC.NORTHEAST).i(0, 5, 0, 0));

    this.biRippleSlider.setValue(0);
    this.biRippleSlider.setOrientation(JSSlider.VERTICAL);
    this.biRippleSlider.setInverted(true);
    this.biRippleSlider.getStyle().minHeight = "20rem";
    this.biRippleSlider.getStyle().minWidth = "1.5rem";
    this.biRippleSlider.addChangeListener(event -> this.onRippleChange(false, this.biRippleSlider.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.add(this.biRippleSlider, new GBC(4, 0).h(5).a(GBC.EAST));

    JSPanel panel = new JSPanel();
    panel.cssAddClass("jspanel-vertical");
    this.add(panel, new GBC(5, 0).h(5).a(GBC.NORTH).f(GBC.BOTH));

    JSButton button = new JSButton();
    button.cssAddClass("jsbutton-vertical");
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event -> {
      this.value.mirror();
      this.afterOperation(this.value.getColorAtIndex(this.biSelectedIndex));
      this.onchange();
    });
    panel.add(button, null);

    button = new JSButton();
    button.cssAddClass("jsbutton-vertical");
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event -> {
      this.value.reverse();
      this.drawPreview(false);
      this.onchange();
    });
    panel.add(button, null);

    this.biDelete.cssAddClass("jsbutton-vertical");
    this.biDelete.setText(Z4Translations.DELETE);
    this.biDelete.setEnabled(false);
    this.biDelete.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.value.removeColor(this.value.getColorPositionAtIndex(this.biSelectedIndex));
        this.biSelectedIndex = 0;
        this.afterOperation(this.value.getColorAtIndex(this.biSelectedIndex));
        this.onchange();
      }
    }));
    panel.add(this.biDelete, null);

    this.add(new JSLabel(), new GBC(0, 4).w(3).wy(1));
    Z4UI.addHLine(this, new GBC(0, 5).w(6).a(GBC.WEST).f(GBC.HORIZONTAL).i(2, 1, 2, 1));

    this.colorPanel.addChangeListener(event -> {
      Z4GradientColor gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
      gradientColor.addColor(this.colorPanel.getValue(), gradientColor.getColorPositionAtIndex(this.selectedIndex));
      this.drawPreview(false);
      this.onchange();
    });
    this.add(this.colorPanel, new GBC(0, 6).w(4).wx(1).f(GBC.HORIZONTAL));

    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        Z4GradientColor gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
        gradientColor.removeColor(gradientColor.getColorPositionAtIndex(this.selectedIndex));
        this.selectedIndex = 0;
        this.afterOperation(gradientColor);
        this.onchange();
      }
    }));

    this.add(this.delete, new GBC(4, 6).w(2).a(GBC.EAST).i(0, 5, 0, 0));

    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(0, 7).w(2).a(GBC.WEST));

    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.addChangeListener(event -> this.onRippleChange(true, this.rippleSpinner.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.add(this.rippleSpinner, new GBC(3, 7).w(3).a(GBC.EAST).i(5, 0, 0, 0));

    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event -> this.onRippleChange(false, this.rippleSlider.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.add(this.rippleSlider, new GBC(0, 8).w(6).a(GBC.NORTH).f(GBC.HORIZONTAL));

    panel = new JSPanel();
    this.add(panel, new GBC(0, 9).w(5).a(GBC.NORTH).f(GBC.HORIZONTAL));

    button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event -> {
      Z4GradientColor gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
      gradientColor.mirror();
      this.afterOperation(gradientColor);
      this.onchange();
    });
    panel.add(button, null);

    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event -> {
      Z4GradientColor gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
      gradientColor.reverse();
      this.afterOperation(gradientColor);
      this.onchange();
    });
    panel.add(button, null);

    button = new JSButton();
    button.cssAddClass("z4bigradientcolorpanel-history");
    button.setIcon(new Z4EmptyImageProducer<>(""));
    button.setTooltip(Z4Translations.HISTORY);
    button.addActionListener(event -> this.showHistory());
    this.add(button, new GBC(5, 9).a(GBC.EAST));

    this.setValue(new Z4BiGradientColor());
  }

  @SuppressWarnings("StringEquality")
  private void onMouse(MouseEvent event, String type) {
    switch (type) {
      case "enter":
        break;
      case "down":
        for (int biIndex = 0; biIndex < this.value.getColorCount(); biIndex++) {
          double biPosition = this.value.getColorPositionAtIndex(biIndex);
          Z4GradientColor gradientColor = this.value.getColorAtIndex(biIndex);

          for (int index = 0; index < gradientColor.getColorCount(); index++) {
            double position = gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * this.width, biPosition * this.height, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
              this.pressed = true;
              this.biSelectedIndex = biIndex;
              this.selectedIndex = index;
              this.afterOperation(gradientColor);
            }
          }
        }

        if (!this.pressed
                && !this.value.isPositionOccupied(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE)) {
          Z4GradientColor gradientColor = this.value.getColorAt(event.offsetY / this.height, false);
          while (gradientColor.getColorCount() > 2) {
            gradientColor.removeColor(gradientColor.getColorPositionAtIndex(1));
          }
          if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
            gradientColor.addColor(gradientColor.getColorAt(event.offsetX / this.width, false), event.offsetX / this.width);
          }
          gradientColor.mergeOverlapping(Z4BiGradientColorPanel.TOLERANCE);

          this.value.addColor(gradientColor, event.offsetY / this.height);
          this.pressed = true;
          this.setPointer(event, true);
          this.onchange();
        }

        if (!this.pressed) {
          double biPosition = this.value.getPosition(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE);
          Z4GradientColor gradientColor = this.value.getColorAt(biPosition, false);

          if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
            gradientColor.addColor(gradientColor.getColorAt(event.offsetX / this.width, false), event.offsetX / this.width);
            this.setPointer(event, true);
          }
        }
        break;
      case "move":
        if (this.pressed) {
          double biPosition = this.value.getColorPositionAtIndex(this.biSelectedIndex);
          double biPositionBefore = this.value.getColorPositionAtIndex(this.biSelectedIndex - 1);
          double biPositionAfter = this.value.getColorPositionAtIndex(this.biSelectedIndex + 1);
          double newBiPosition = event.offsetY / this.height;

          Z4GradientColor gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
          double position = gradientColor.getColorPositionAtIndex(this.selectedIndex);
          double positionBefore = gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
          double positionAfter = gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
          double newPosition = event.offsetX / this.width;

          if (this.biSelectedIndex != 0 && this.biSelectedIndex != this.value.getColorCount() - 1
                  && biPositionBefore < newBiPosition - Z4BiGradientColorPanel.TOLERANCE && biPositionAfter > newBiPosition + Z4BiGradientColorPanel.TOLERANCE) {
            this.value.removeColor(biPosition);
            this.value.addColor(gradientColor, newBiPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.onchange();
          }

          if (this.selectedIndex != 0 && this.selectedIndex != gradientColor.getColorCount() - 1
                  && positionBefore < newPosition - Z4BiGradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4BiGradientColorPanel.TOLERANCE) {
            Color color = gradientColor.getColorAtIndex(this.selectedIndex);
            gradientColor.removeColor(position);
            gradientColor.addColor(color, newPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.onchange();
          }
        } else {
          this.preview.getStyle().cursor = "default";
          this.setPointer(event, false);

          if (this.preview.getStyle().cursor == "default"
                  && !this.value.isPositionOccupied(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE)) {
            this.preview.getStyle().cursor = "copy";
          }

          if (this.preview.getStyle().cursor == "default") {
            double biPosition = this.value.getPosition(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE);
            Z4GradientColor gradientColor = this.value.getColorAt(biPosition, false);

            if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
              this.preview.getStyle().cursor = "copy";
            }
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

  private void setPointer(MouseEvent event, boolean setOther) {
    for (int biIndex = 0; biIndex < this.value.getColorCount(); biIndex++) {
      double biPosition = this.value.getColorPositionAtIndex(biIndex);
      Z4GradientColor gradientColor = this.value.getColorAtIndex(biIndex);

      for (int index = 0; index < gradientColor.getColorCount(); index++) {
        double position = gradientColor.getColorPositionAtIndex(index);
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

  private void onRippleChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider, boolean isBi) {
    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    if (isBi) {
      this.value.setRipple(slider.getValue() / 100);
    } else {
      this.value.setGradientRipple(slider.getValue() / 100);
    }
    this.drawPreview(adjusting);
    this.valueIsAdjusting = adjusting;
    this.onchange();
  }

  private void afterOperation(Z4GradientColor gradientColor) {
    this.colorPanel.setValue(this.value.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex));
    this.biDelete.setEnabled(this.biSelectedIndex != 0 && this.biSelectedIndex != this.value.getColorCount() - 1);
    this.delete.setEnabled(this.selectedIndex != 0 && this.selectedIndex != gradientColor.getColorCount() - 1);
    this.drawPreview(false);
  }

  private void showHistory() {
    JSPanel scrollPanel = new JSPanel();
    scrollPanel.cssAddClass("z4bigradientcolorpanel-scrollpanel");
    scrollPanel.getStyle().height = ((Z4BiGradientColorPanel.SIZE / 2 + 6) * 4 + 5) + "px";

    JSPanel historyPanel = new JSPanel();
    historyPanel.setLayout(new GridBagLayout());
    historyPanel.cssAddClass("z4bigradientcolorpanel-historypanel");
    scrollPanel.add(historyPanel, null);

    Array<JSRadioButton> radios = new Array<>();
    Array<JSComponent> previews = new Array<>();
    ButtonGroup buttonGroup = new ButtonGroup();

    Z4BiGradientColor.getHistory().forEach((gradientColor, index, array) -> {
      JSRadioButton radio = new JSRadioButton();
      buttonGroup.add(radio);
      radios.push(radio);

      JSComponent previewHistory = new JSComponent(document.createElement("canvas"));
      previewHistory.setProperty("width", "" + Z4BiGradientColorPanel.SIZE / 2);
      previewHistory.setProperty("height", "" + Z4BiGradientColorPanel.SIZE / 2);
      previewHistory.getStyle().width = Z4BiGradientColorPanel.SIZE / 2 + "px";
      previewHistory.getStyle().height = Z4BiGradientColorPanel.SIZE / 2 + "px";
      previews.push(previewHistory);

      this.putImageData(previewHistory.invoke("getContext('2d')"), gradientColor, Z4BiGradientColorPanel.SIZE / 2, Z4BiGradientColorPanel.SIZE / 2);

      historyPanel.add(radio, new GBC((index % 4) * 2, parseInt(index / 4)));
      historyPanel.add(previewHistory, new GBC((index % 4) * 2 + 1, parseInt(index / 4)).wx(1).a(GBC.WEST).i(2, 0, 2, 20));
    });

    JSOptionPane.showInputDialog(scrollPanel, Z4Translations.HISTORY, listener -> {
      radios.forEach(radio -> radio.addActionListener(event -> listener.$apply(new ChangeEvent())));
      previews.forEach((previewHistory, index, array) -> previewHistory.addEventListener("mousedown", event -> {
        radios.$get(index).setSelected(true);
        listener.$apply(new ChangeEvent());
      }));
      previews.forEach((previewHistory, index, array) -> previewHistory.addEventListener("dblclick", event -> {
        radios.$get(index).setSelected(true);
        listener.$apply(new ChangeEvent());

        ((HTMLElement) (($HTMLElement) document.querySelector(".z4bigradientcolorpanel-historypanel")).closest(".jsdialog").querySelector(".jsoptionpane-option-0")).click();
      }));
    }, () -> radios.some((radio, index, array) -> radio.isSelected()), response -> {
      if (response == JSOptionPane.OK_OPTION) {
        this.setValue(Z4BiGradientColor.getHistory().$get(radios.findIndex(radio -> radio.isSelected())));
        this.onchange();
      }
    });
  }

  private void drawPreview(boolean adjusting) {
    if (this.width > 0 && this.height > 0) {
      this.putImageData(this.ctx, this.value, this.width, this.height);

      for (int biIndex = 0; biIndex < this.value.getColorCount(); biIndex++) {
        double biPosition = this.value.getColorPositionAtIndex(biIndex);
        Z4GradientColor gradientColor = this.value.getColorAtIndex(biIndex);

        for (int index = 0; index < gradientColor.getColorCount(); index++) {
          this.drawCircle(biPosition, gradientColor.getColorPositionAtIndex(index), biIndex, index);
        }
      }
    }
  }

  private void putImageData($CanvasRenderingContext2D ctx, Z4BiGradientColor bigradientColor, int width, int height) {
    ImageData imageData = ctx.createImageData(width, height);
    $Uint8Array data = ($Uint8Array) imageData.data;

    for (int y = 0; y < height; y++) {
      Z4GradientColor gradientColor = bigradientColor.getColorAt(y / height, true);
      for (int x = 0; x < width; x++) {
        Color color = gradientColor.getColorAt(x / width, true);

        int index = (y * width + x) * 4;
        data.$set(index, color.red);
        data.$set(index + 1, color.green);
        data.$set(index + 2, color.blue);
        data.$set(index + 3, color.alpha);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private void drawCircle(double biPosition, double position, int biIndex, int index) {
    this.ctx.lineWidth = 3;

    Array<Double> dash = new Array<>();

    this.ctx.beginPath();
    this.ctx.arc(position * this.width, biPosition * this.height, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.$getStyle(biIndex == this.biSelectedIndex && index == this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();

    dash.push(2.5, 2.5);

    this.ctx.beginPath();
    this.ctx.arc(position * this.width, biPosition * this.height, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.$getStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Sets the visibility of the space and time labels
   *
   * @param b true to show the space and time labels, false otherwise
   */
  public void setSpaceTimeLabelsVisible(boolean b) {
    this.space.getStyle().visibility = b ? "visible" : "hidden";
    this.time.getStyle().visibility = b ? "visible" : "hidden";
  }

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
  public void setSize(int width, int height) {
    double ratio = width / height;
    this.width = parseInt(ratio > 1 ? Z4BiGradientColorPanel.SIZE : Z4BiGradientColorPanel.SIZE * ratio);
    this.height = parseInt(ratio > 1 ? Z4BiGradientColorPanel.SIZE / ratio : Z4BiGradientColorPanel.SIZE);

    this.preview.setProperty("width", "" + this.width);
    this.preview.setProperty("height", "" + this.height);

    this.drawPreview(false);
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
  public Z4BiGradientColor getValue() {
    return Z4BiGradientColor.fromJSON(this.value.toJSON());
  }

  @Override
  public void setValue(Z4BiGradientColor value) {
    this.value = Z4BiGradientColor.fromJSON(value.toJSON());

    this.biSelectedIndex = 0;
    this.selectedIndex = 0;
    this.colorPanel.setValue(this.value.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex));
    this.drawPreview(false);
  }
}
