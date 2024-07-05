package pizzapazza.ui.panel;

import static def.dom.Globals.document;
import def.js.Array;
import def.js.Number;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.parseInt;

/**
 * The panel to resize an image
 *
 * @author gianpiero.diblasi
 */
public class Z4ResizeImagePanel extends JSPanel {

  private final JSSpinner width = new JSSpinner();
  private final JSSpinner height = new JSSpinner();
  private final JSSpinner resolution = new JSSpinner();
  private final JSLabel dimensionMM = new JSLabel();
  private final JSLabel dimensionIN = new JSLabel();

  private final JSRadioButton resizeByKeepingRatio = new JSRadioButton();
  private final JSRadioButton adaptByKeepingRatio = new JSRadioButton();
  private final JSRadioButton keepSize = new JSRadioButton();

  private final JSSpinner offsetX = new JSSpinner();
  private final JSSpinner offsetY = new JSSpinner();
  private final JSButton center = new JSButton();

  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");

  private final Array<ChangeListener> listeners = new Array<>();

  private $OffscreenCanvas canvasToResize;
  private double originalWidth = Z4Constants.DEFAULT_IMAGE_SIZE;
  private double originalHeight = Z4Constants.DEFAULT_IMAGE_SIZE;
  private double originalRatio = 1;

  private static final int SIZE = 180;

  /**
   * Creates the object
   */
  public Z4ResizeImagePanel() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());

    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.width, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, true, false, 0, 1);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.height, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, false, true, 1, 1);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.resolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, false, false, 2, 1);
    this.add(this.dimensionMM, new GBC(0, 2).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));
    this.add(this.dimensionIN, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 5, 0, 0));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio(this.resizeByKeepingRatio, buttonGroup, Z4Translations.RESIZE_BY_KEEPING_RATIO, true, 4);
    this.addRadio(this.adaptByKeepingRatio, buttonGroup, Z4Translations.ADAPT_BY_KEEPING_RATIO, false, 5);
    this.addRadio(this.keepSize, buttonGroup, Z4Translations.KEEP_SIZE, false, 6);

    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(0, 7).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.offsetX, 0, 0, Z4Constants.MAX_IMAGE_SIZE, false, false, 0, 8);
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(1, 7).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(this.offsetY, 0, 0, Z4Constants.MAX_IMAGE_SIZE, false, false, 1, 8);

    this.center.setContentAreaFilled(false);
    this.center.setText(Z4Translations.CENTER_VERB);
    this.center.addActionListener(event -> {
    });
    this.add(this.center, new GBC(2, 8).a(GBC.EAST).i(0, 5, 0, 5));

    this.add(this.preview, new GBC(3, 0).h(9).i(5, 5, 5, 5));

    this.setDimensions(false, false);
  }

  private void addSpinner(JSSpinner spinner, double value, double min, double max, boolean isW, boolean isH, int gridx, int gridy) {
    spinner.setModel(new SpinnerNumberModel(value, min, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event -> this.setDimensions(isW, isH));
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 5, 0, 5));
  }

  private void addRadio(JSRadioButton radio, ButtonGroup buttonGroup, String text, boolean selected, int gridy) {
    radio.setText(text);
    radio.setSelected(selected);
    radio.addActionListener(event -> this.setDimensions(selected, false));
    buttonGroup.add(radio);
    this.add(radio, new GBC(0, gridy).a(GBC.WEST).w(3));
  }

  private void setDimensions(boolean isW, boolean isH) {
    double w = this.width.getValue();
    double h = this.height.getValue();
    double res = this.resolution.getValue();

    if (!this.resizeByKeepingRatio.isSelected()) {
    } else if (isW) {
      h = parseInt(w / this.originalRatio);

      if (h < 1) {
        w = parseInt(this.originalRatio);
        h = 1;
      } else if (h > Z4Constants.MAX_IMAGE_SIZE) {
        w = parseInt(Z4Constants.MAX_IMAGE_SIZE * this.originalRatio);
        h = Z4Constants.MAX_IMAGE_SIZE;
      }
    } else if (isH) {
      w = parseInt(h * this.originalRatio);

      if (w < 1) {
        w = 1;
        h = parseInt(1 / this.originalRatio);
      } else if (w > Z4Constants.MAX_IMAGE_SIZE) {
        w = Z4Constants.MAX_IMAGE_SIZE;
        h = parseInt(Z4Constants.MAX_IMAGE_SIZE / this.originalRatio);
      }
    }

    this.width.setValue(w);
    this.height.setValue(h);

    double dimWIN = w / res;
    double dimHIN = h / res;

    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");

    double newRatio = w / h;
    this.preview.setProperty("width", "" + parseInt(newRatio > 1 ? Z4ResizeImagePanel.SIZE : Z4ResizeImagePanel.SIZE * newRatio));
    this.preview.setProperty("height", "" + parseInt(newRatio > 1 ? Z4ResizeImagePanel.SIZE / newRatio : Z4ResizeImagePanel.SIZE));

    if (!$exists(this.canvasToResize)) {
    } else if (this.resizeByKeepingRatio.isSelected()) {
      this.offsetX.setEnabled(false);
      this.offsetY.setEnabled(false);
      this.center.setEnabled(false);
      
      this.ctx.drawImage(this.canvasToResize, 0, 0, parseInt(this.preview.getProperty("width")), parseInt(this.preview.getProperty("height")));
    } else if (this.adaptByKeepingRatio.isSelected()) {
      this.offsetX.setEnabled(w != this.originalWidth);
      this.offsetY.setEnabled(h != this.originalHeight);
      this.center.setEnabled(true);
    } else if (this.keepSize.isSelected()) {
      this.offsetX.setEnabled(true);
      this.offsetY.setEnabled(true);
      this.center.setEnabled(true);
//      
//      double scale = parseInt(this.preview.getProperty("width")) / this.originalWidth;
//
//      this.ctx.save();
//      this.ctx.scale(scale, scale);
//      this.ctx.drawImage(this.canvasToResize, 0, 0);
//      this.ctx.restore();
    }

    this.onchange();
  }

  /**
   * Sets the canvas to resize
   *
   *
   * @param canvas The canvas to resize;
   * @param width The canvas width
   * @param height The canvas height
   */
  public void setCanvasToResize($OffscreenCanvas canvas, int width, int height) {
    this.canvasToResize = canvas;
    this.originalWidth = width;
    this.originalHeight = height;
    this.originalRatio = width / height;

    this.width.setValue(width);
    this.height.setValue(height);
    this.setDimensions(false, false);
  }

  /**
   * Returns the selected size
   *
   * @return The selected size
   */
  public Dimension getSelectedSize() {
    return new Dimension((int) this.width.getValue(), (int) this.height.getValue());
  }

  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }

  private void onchange() {
    ChangeEvent event = new ChangeEvent();

    this.listeners.forEach(listener -> {
      if ($typeof(listener, "function")) {
        listener.$apply(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
