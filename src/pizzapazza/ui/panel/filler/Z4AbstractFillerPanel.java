package pizzapazza.ui.panel.filler;

import static def.dom.Globals.document;
import def.dom.ImageData;
import def.dom.MouseEvent;
import def.js.Array;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.awt.Point;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.color.Z4GradientColor;
import pizzapazza.filler.Z4AbstractFiller;
import pizzapazza.math.Z4Math;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
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

  private $OffscreenCanvas offscreenCanvas = new $OffscreenCanvas(Z4AbstractFillerPanel.SIZE / Z4AbstractFillerPanel.RESCALE, Z4AbstractFillerPanel.SIZE / Z4AbstractFillerPanel.RESCALE);
  private $CanvasRenderingContext2D offscreenCtx = this.offscreenCanvas.getContext("2d");

  private final JSSlider xSlider = new JSSlider();
  private final JSSpinner xSpinner = new JSSpinner();
  private final JSSlider ySlider = new JSSlider();
  private final JSSpinner ySpinner = new JSSpinner();

  private Z4GradientColor gradientColor = new Z4GradientColor();
  private final Array<JSRadioButton> radios = new Array<>();
  private final Array<Point> points = new Array<>();

  private int width = Z4Constants.DEFAULT_IMAGE_SIZE;
  private int height = Z4Constants.DEFAULT_IMAGE_SIZE;
  private int selectedIndex = 0;
  private Object selectedOption;
  private boolean pressed = false;

  private static final int SIZE = 180;
  private static final int SELECTOR_RADIUS = 7;
  private static final int RESCALE = 3;

  /**
   * Creates the object
   *
   * @param count The number of points managed by this panel
   * @param options The available options
   */
  public Z4AbstractFillerPanel(int count, Array<?> options) {
    super();
    this.cssAddClass("z4abstractfillerpanel");
    this.setLayout(new GridBagLayout());

    JSPanel panelOptions = new JSPanel();
    this.add(panelOptions, new GBC(0, 0).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));

    this.preview.setProperty("width", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.setProperty("height", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.addEventListener("mouseenter", event -> this.onMouse((MouseEvent) event, "enter"));
    this.preview.addEventListener("mouseleave", event -> this.onMouse((MouseEvent) event, "leave"));
    this.preview.addEventListener("mousedown", event -> this.onMouse((MouseEvent) event, "down"));
    this.preview.addEventListener("mousemove", event -> this.onMouse((MouseEvent) event, "move"));
    this.preview.addEventListener("mouseup", event -> this.onMouse((MouseEvent) event, "up"));
    this.add(this.preview, new GBC(0, 1).wh(2, 2).wxy(1, 1).i(2, 2, 2, 2));

    Z4UI.addLabel(this, "y", new GBC(2, 2).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");

    Z4UI.setVerticalSpinner(this.ySpinner);
    this.ySpinner.setModel(new SpinnerNumberModel(0, 0, this.height, 1));
    this.ySpinner.addChangeListener(event -> this.onChange(true, this.ySpinner.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.add(this.ySpinner, new GBC(2, 1).wy(1).a(GBC.NORTHEAST));

    this.ySlider.setMaximum(this.height);
    this.ySlider.setOrientation(JSSlider.VERTICAL);
    this.ySlider.setInverted(true);
    this.ySlider.getStyle().minHeight = "20rem";
    this.ySlider.getStyle().minWidth = "1.5rem";
    this.ySlider.addChangeListener(event -> this.onChange(false, this.ySlider.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.add(this.ySlider, new GBC(3, 1).h(2).a(GBC.EAST));

    Z4UI.addHLine(this, new GBC(0, 3).w(4).a(GBC.WEST).f(GBC.HORIZONTAL).i(2, 1, 2, 1));

    Z4UI.addLabel(this, "x", new GBC(0, 4).a(GBC.WEST));

    this.xSpinner.setModel(new SpinnerNumberModel(0, 0, this.width, 1));
    this.xSpinner.cssAddClass("jsspinner_w_4rem");
    this.xSpinner.addChangeListener(event -> this.onChange(true, this.xSpinner.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.add(this.xSpinner, new GBC(1, 4).w(3).a(GBC.EAST));

    this.xSlider.setMaximum(this.width);
    this.xSlider.getStyle().minWidth = "20rem";
    this.xSlider.addChangeListener(event -> this.onChange(false, this.xSlider.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.add(this.xSlider, new GBC(0, 5).w(4).a(GBC.NORTH).f(GBC.HORIZONTAL));

    JSPanel panelRadios = new JSPanel();
    this.add(panelRadios, new GBC(0, 6).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));

    if ($exists(options)) {
      ButtonGroup buttonGroupOptions = new ButtonGroup();

      options.forEach((option, index, array) -> {
        JSRadioButton radio = new JSRadioButton();
        radio.setContentAreaFilled(false);
        radio.setToggle();
        radio.setSelected(index == 0);
        if (index == 0) {
          this.selectedOption = option;
        }
        radio.setIcon(new Z4EmptyImageProducer<>(option));
        radio.addActionListener(event -> {
          this.selectedOption = option;
          this.drawPreview(false);
        });

        buttonGroupOptions.add(radio);
        panelOptions.add(radio, null);
      });
    }

    ButtonGroup buttonGroupRadios = new ButtonGroup();
    for (int index = 0; index < count; index++) {
      int idx = index;

      JSRadioButton radio = new JSRadioButton();
      radio.setText("" + (index + 1));
      radio.setSelected(index == 0);
      radio.addActionListener(event -> this.onRadio(idx));

      this.radios.push(radio);
      buttonGroupRadios.add(radio);
      panelRadios.add(radio, null);
    }

    this.pushPointPositions(this.points, this.width, this.height);
    this.setXY();
  }

  private void onRadio(int index) {
    this.selectedIndex = index;
    this.setXY();
    this.drawPreview(false);
  }

  private void onChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider, boolean isX) {
    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    this.setPointPosition(this.points, this.selectedIndex, isX ? slider.getValue() : this.points.$get(this.selectedIndex).x, !isX ? slider.getValue() : this.points.$get(this.selectedIndex).y, this.width, this.height);
    this.drawPreview(adjusting);
  }

  private void onMouse(MouseEvent event, String type) {
    int w = parseInt(this.preview.getProperty("width"));
    int h = parseInt(this.preview.getProperty("height"));

    switch (type) {
      case "enter":
        break;
      case "down":
        this.points.map(point -> new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) -> {
          if (this.isPointEnabled(index) && Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) <= Z4AbstractFillerPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.radios.$get(this.selectedIndex).setSelected(true);
            this.setXY();
            this.drawPreview(false);
          }
        });
        break;
      case "move":
        if (this.pressed) {
          this.setPointPosition(this.points, this.selectedIndex, parseInt(this.width * event.offsetX / w), parseInt(this.height * event.offsetY / h), this.width, this.height);
          this.setXY();
          this.drawPreview(true);
        } else {
          this.preview.getStyle().cursor = "default";
          this.points.map(point -> new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) -> {
            if (this.isPointEnabled(index) && Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) <= Z4AbstractFillerPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          });
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        break;
      case "leave":
        if (this.pressed) {
          this.pressed = false;
          this.drawPreview(false);
        }
        break;
    }
  }

  /**
   * Sets the position of a point
   *
   * @param points The points
   * @param selectedIndex The selected index of the point
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @param width The preview width
   * @param height The preview height
   */
  protected abstract void setPointPosition(Array<Point> points, int selectedIndex, int x, int y, int width, int height);

  /**
   * Requests a call to the setPointPosition method
   */
  protected void requestSetPointPosition() {
    this.setPointPosition(this.points, this.selectedIndex, this.points.$get(this.selectedIndex).x, this.points.$get(this.selectedIndex).y, this.width, this.height);
  }

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

    this.offscreenCanvas = new $OffscreenCanvas(parseInt(this.preview.getProperty("width")) / Z4AbstractFillerPanel.RESCALE, parseInt(this.preview.getProperty("height")) / Z4AbstractFillerPanel.RESCALE);
    this.offscreenCtx = this.offscreenCanvas.getContext("2d");

    this.drawPreview(false);
  }

  /**
   * Sets the gradient color to use
   *
   * @param gradientColor The gradient color
   */
  public void setGradientColor(Z4GradientColor gradientColor) {
    this.gradientColor = gradientColor;
    this.drawPreview(false);
  }

  /**
   * Pushes the point positions
   *
   * @param points The points
   * @param width The preview width
   * @param height The preview height
   */
  protected abstract void pushPointPositions(Array<Point> points, int width, int height);

  private void setXY() {
    this.xSlider.setValue(this.points.$get(this.selectedIndex).x);
    this.xSpinner.setValue(this.points.$get(this.selectedIndex).x);
    this.ySlider.setValue(this.points.$get(this.selectedIndex).y);
    this.ySpinner.setValue(this.points.$get(this.selectedIndex).y);
  }

  /**
   * Sets the enabled property of all points
   */
  protected void setPointsEnabled() {
    this.radios.forEach((radio, index, array) -> {
      boolean b = this.isPointEnabled(index);
      radio.setEnabled(b);

      if (!b && radio.isSelected()) {
        this.radios.$get(0).setSelected(true);
        this.selectedIndex = 0;
        this.setXY();
        this.drawPreview(false);
      }
    });
  }

  /**
   * Returns the selected filler
   *
   * @return The selected filler
   */
  public Z4AbstractFiller getSelectedFiller() {
    return this.getFiller(this.gradientColor, this.points, this.selectedOption);
  }

  /**
   * Draws the preview
   *
   * @param adjusting true if the value is adjusting, false otherwise
   */
  public void drawPreview(boolean adjusting) {
    int w = parseInt(this.preview.getProperty("width"));
    int h = parseInt(this.preview.getProperty("height"));

    if (w > 0 && h > 0) {
      this.ctx.clearRect(0, 0, w, h);

      Array<Point> map = this.points.map(point -> new Point(w * point.x / this.width, h * point.y / this.height));
      if (adjusting && this.needsRescale(this.selectedOption)) {
        ImageData imageData = this.offscreenCtx.createImageData(w / Z4AbstractFillerPanel.RESCALE, h / Z4AbstractFillerPanel.RESCALE);
        this.getFiller(this.gradientColor, map.map(point -> new Point(point.x / Z4AbstractFillerPanel.RESCALE, point.y / Z4AbstractFillerPanel.RESCALE)), this.selectedOption).fill(imageData);
        this.offscreenCtx.putImageData(imageData, 0, 0);

        this.ctx.drawImage(this.offscreenCanvas, 0, 0, w, h);
      } else {
        ImageData imageData = this.ctx.createImageData(w, h);
        this.getFiller(this.gradientColor, map, this.selectedOption).fill(imageData);
        this.ctx.putImageData(imageData, 0, 0);
      }

      this.ctx.save();
      map.forEach((point, index, array) -> this.drawCircle(point, index));
      this.ctx.restore();

      this.ctx.save();
      this.drawObjects(this.ctx, map);
      this.ctx.restore();
    }
  }

  /**
   * Check if a rescale is needed during drawing
   *
   * @param option The selected option
   * @return true if a rescale is needed during drawing, false otherwise
   */
  protected abstract boolean needsRescale(Object option);

  /**
   * Returns the filler
   *
   * @param gradientColor The color used to fill
   * @param points The points
   * @param option The selected option
   * @return The filler
   */
  protected abstract Z4AbstractFiller getFiller(Z4GradientColor gradientColor, Array<Point> points, Object option);

  private void drawCircle(Point point, int index) {
    if (this.isPointEnabled(index)) {
      this.ctx.lineWidth = 3;
      
      Array<Double> dash = new Array<>();

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, Z4AbstractFillerPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
      this.ctx.strokeStyle = Z4Constants.$getStyle(index == this.selectedIndex ? "red" : "black");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();

      dash.push(2.5, 2.5);

      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, Z4AbstractFillerPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
      this.ctx.strokeStyle = Z4Constants.$getStyle("white");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();
    }
  }

  /**
   * Checks if a point is enabled
   *
   * @param index The index
   * @return true if the point is enabled, false otherwise
   */
  protected abstract boolean isPointEnabled(int index);

  /**
   * Draws other objects
   *
   * @param ctx The context
   * @param mappedPoints The (mapped) points
   */
  protected abstract void drawObjects($CanvasRenderingContext2D ctx, Array<Point> mappedPoints);
}
