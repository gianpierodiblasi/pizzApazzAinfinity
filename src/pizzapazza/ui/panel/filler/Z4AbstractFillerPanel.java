package pizzapazza.ui.panel.filler;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import def.dom.ImageData;
import def.dom.MouseEvent;
import def.js.Array;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.Point;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import javascript.util.DefaultHTMLImageProducer;
import javascript.util.KeyValue;
import jsweet.util.union.Union4;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.util.Z4Constants;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The abstract panel to manage fillers
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4AbstractFillerPanel extends JSPanel {

  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");

  private final JSPanel panelOptions = new JSPanel();

  private final JSSlider xSlider = new JSSlider();
  private final JSSpinner xSpinner = new JSSpinner();
  private final JSSlider ySlider = new JSSlider();
  private final JSSpinner ySpinner = new JSSpinner();

  private final JSPanel panelRadios = new JSPanel();
  private final ButtonGroup buttonGroupOptions = new ButtonGroup();
  private final ButtonGroup buttonGroupRadios = new ButtonGroup();

  private final Z4GradientColor color = new Z4GradientColor();
  private final Array<JSRadioButton> radios = new Array<>();
  private final Array<Point> points = new Array<>();

  private int width = Z4Constants.DEFAULT_IMAGE_SIZE;
  private int height = Z4Constants.DEFAULT_IMAGE_SIZE;
  private int selectedIndex = 0;
  private Object selectedOption = 0;
  private boolean pressed = false;

  private static final int SIZE = 180;

  /**
   * Creates the object
   *
   * @param count The number of points managed by this panel
   * @param options The available options
   */
  public Z4AbstractFillerPanel(int count, Array<KeyValue<Integer, String>> options) {
    super();
    this.cssAddClass("z4abstractfillerpanel");
    this.setLayout(new GridBagLayout());

    this.addComponent(this.panelOptions, 0, 0, 3, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);

    this.preview.setProperty("width", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.setProperty("height", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.preview.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.preview.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    this.addComponent(this.preview, 0, 2, 1, 1, GridBagConstraints.CENTER, GridBagConstraints.NONE, null);

    this.addLabel("y", 1, 1, 1, 1, GridBagConstraints.CENTER, GridBagConstraints.NONE);

    this.ySpinner.setModel(new SpinnerNumberModel(0, 0, this.height, 1));
    this.ySpinner.getStyle().minWidth = "4rem";
    this.ySpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.ySpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.ySpinner.addChangeListener(event -> this.onChange(true, this.ySpinner.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.addComponent(this.ySpinner, 2, 1, 1, 1, GridBagConstraints.EAST, GridBagConstraints.NONE, null);

    this.ySlider.setMaximum(this.height);
    this.ySlider.setOrientation(JSSlider.VERTICAL);
    this.ySlider.setInverted(true);
    this.ySlider.getStyle().minHeight = "20rem";
    this.ySlider.addChangeListener(event -> this.onChange(false, this.ySlider.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.addComponent(this.ySlider, 1, 2, 1, 1, GridBagConstraints.NORTH, GridBagConstraints.NONE, null);

    this.addLabel("x", 0, 3, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    this.xSpinner.setModel(new SpinnerNumberModel(0, 0, this.width, 1));
    this.xSpinner.getStyle().minWidth = "4rem";
    this.xSpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.xSpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.xSpinner.addChangeListener(event -> this.onChange(true, this.xSpinner.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.addComponent(this.xSpinner, 2, 3, 1, 1, GridBagConstraints.EAST, GridBagConstraints.NONE, null);

    this.xSlider.setMaximum(this.width);
    this.xSlider.getStyle().minWidth = "20rem";
    this.xSlider.addChangeListener(event -> this.onChange(false, this.xSlider.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.addComponent(this.xSlider, 0, 4, 3, 1, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);

    this.addComponent(this.panelRadios, 0, 5, 3, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);

    if ($exists(options)) {
      options.forEach((option, index, array) -> {
        JSRadioButton radio = new JSRadioButton();
        radio.setContentAreaFilled(false);
        radio.setToggle();
        radio.setSelected(index == 0);
        radio.setIcon(new DefaultHTMLImageProducer<>(option.key, option.value));
        radio.addActionListener(event -> {
          this.selectedOption = option.key;
          this.drawPreview();
        });

        this.buttonGroupOptions.add(radio);
        this.panelOptions.add(radio, null);
      });
    }

    for (int index = 0; index < count; index++) {
      int idx = index;

      JSRadioButton radio = new JSRadioButton();
      radio.setText("" + (index + 1));
      radio.setSelected(index == 0);
      radio.addActionListener(event -> this.onRadio(idx));

      this.radios.push(radio);
      this.buttonGroupRadios.add(radio);
      this.panelRadios.add(radio, null);
    }

    this.pushPointPositions(this.points, this.width, this.height);
    this.setXY();

    this.drawPreview();
  }

  private void addLabel(String text, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill) {
    JSLabel label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, gridy, gridwidth, gridheight, anchor, fill, null);
  }

  private void addComponent(JSComponent component, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;

    constraints.anchor = anchor;
    constraints.fill = fill;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    this.add(component, constraints);
  }

  private void onRadio(int index) {
    this.selectedIndex = index;
    this.setXY();
    this.drawPreview();
  }

  private void onChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider, boolean isX) {
    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    Point p = this.points.$get(this.selectedIndex);
    this.points.$set(this.selectedIndex, new Point(isX ? slider.getValue() : p.x, !isX ? slider.getValue() : p.y));
    this.drawPreview();
  }

  private void onMouse(MouseEvent event, String type) {
    int w = parseInt(this.preview.getProperty("width"));
    int h = parseInt(this.preview.getProperty("height"));

    switch (type) {
      case "down":
        this.points.map(point -> new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) -> {
          if (Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) < 5) {
            this.pressed = true;
            this.selectedIndex = index;
            this.radios.$get(this.selectedIndex).setSelected(true);
            this.setXY();
            this.drawPreview();
          }
        });
        break;
      case "move":
        if (this.pressed) {
          this.points.$set(this.selectedIndex, new Point(parseInt(this.width * event.offsetX / w), parseInt(this.height * event.offsetY / h)));
          this.setXY();
          this.drawPreview();
        } else {
          this.preview.getStyle().cursor = "default";
          this.points.map(point -> new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) -> {
            if (Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) < 5) {
              this.preview.getStyle().cursor = "pointer";
            }
          });
        }
        break;
      case "up":
        this.pressed = false;
        break;
    }
  }

  /**
   * Returns the filler
   *
   * @param gradientColor The color used to fill
   * @param points The points
   * @param option The selected option
   * @return The filler
   */
  protected abstract Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option);

  /**
   * Pushes the point positions
   *
   * @param points The points
   * @param width The preview width
   * @param height The preview height
   */
  protected abstract void pushPointPositions(Array<Point> points, int width, int height);

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
  public void setSize(int width, int height) {
    this.width = width;
    this.height = height;

    this.ySpinner.setModel(new SpinnerNumberModel(0, 0, this.height, 1));
    this.ySlider.setMaximum(this.height);
    this.xSpinner.setModel(new SpinnerNumberModel(0, 0, this.width, 1));
    this.xSlider.setMaximum(this.width);

    this.points.length = 0;
    this.pushPointPositions(this.points, this.width, this.height);
    this.setXY();

    double ratio = width / height;
    this.preview.setProperty("width", "" + parseInt(ratio > 1 ? Z4AbstractFillerPanel.SIZE : Z4AbstractFillerPanel.SIZE * ratio));
    this.preview.setProperty("height", "" + parseInt(ratio > 1 ? Z4AbstractFillerPanel.SIZE / ratio : Z4AbstractFillerPanel.SIZE));
    this.drawPreview();
  }

  private void setXY() {
    this.xSlider.setValue(this.points.$get(this.selectedIndex).x);
    this.xSpinner.setValue(this.points.$get(this.selectedIndex).x);
    this.ySlider.setValue(this.points.$get(this.selectedIndex).y);
    this.ySpinner.setValue(this.points.$get(this.selectedIndex).y);
  }

  private void drawPreview() {
    int w = parseInt(this.preview.getProperty("width"));
    int h = parseInt(this.preview.getProperty("height"));

    this.ctx.clearRect(0, 0, w, h);

    Array<Point> map = this.points.map(point -> new Point(w * point.x / this.width, h * point.y / this.height));
    ImageData imageData = this.ctx.createImageData(w, h);
    this.getFiller(this.color, map, this.selectedOption).fill(imageData);
    this.ctx.putImageData(imageData, 0, 0);

    this.ctx.save();
    map.forEach((point, index, array) -> this.drawCircle(point, index));
    this.ctx.restore();

    this.ctx.save();
    this.drawObjects(this.ctx, map);
    this.ctx.restore();
  }

  private void drawCircle(Point point, int index) {
    Array<Double> dash = new Array<>();

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.$getStrokeStyle(index == this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();

    dash.push(2.5, 2.5);

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.strokeStyle = this.$getStrokeStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Draws other objects
   *
   * @param ctx The context
   * @param mappedPoints The (mapped) points
   */
  protected abstract void drawObjects($CanvasRenderingContext2D ctx, Array<Point> mappedPoints);

  private String getStrokeStyle(String style) {
    return style;
  }

  private Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> $getStrokeStyle(String style) {
    return null;
  }
}
