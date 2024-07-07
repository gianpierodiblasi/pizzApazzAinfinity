package pizzapazza.ui.panel;

import static def.dom.Globals.document;
import def.js.Array;
import def.js.Number;
import javascript.awt.BoxLayout;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
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

  private final JSSpinner layerWidth = new JSSpinner();
  private final JSSpinner layerHeight = new JSSpinner();
  private final JSSpinner layerResolution = new JSSpinner();
  private final JSCheckBox layerLockRatio = new JSCheckBox();
  private final JSLabel layerDimensionMM = new JSLabel();
  private final JSLabel layerDimensionIN = new JSLabel();

  private final JSSpinner contentWidth = new JSSpinner();
  private final JSSpinner contentHeight = new JSSpinner();
  private final JSSpinner contentResolution = new JSSpinner();
  private final JSCheckBox contentLockRatio = new JSCheckBox();
  private final JSLabel contentDimensionMM = new JSLabel();
  private final JSLabel contentDimensionIN = new JSLabel();

  private final JSSpinner contentOffsetX = new JSSpinner();
  private final JSSpinner contentOffsetY = new JSSpinner();
  private final JSButton centerContent = new JSButton();

  private final JSRadioButton resizeLayerAdaptContent = new JSRadioButton();
  private final JSRadioButton resizeLayerAndContent = new JSRadioButton();
  private final JSRadioButton resizeLayer = new JSRadioButton();
  private final JSRadioButton resizeContent = new JSRadioButton();

  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");

  private $OffscreenCanvas canvas;
  private double canvasWidth = Z4Constants.DEFAULT_IMAGE_SIZE;
  private double canvasHeight = Z4Constants.DEFAULT_IMAGE_SIZE;
  private double canvasRatio = 1;

  private final Array<ChangeListener> listeners = new Array<>();

  private static final int SIZE = 150;

  /**
   * Creates the object
   */
  public Z4ResizeImagePanel() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());

    Z4UI.addLabel(this, Z4Translations.LAYER, new GBC(0, 0).a(GBC.WEST).w(3)).getStyle().fontWeight = "bold";
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 1).a(GBC.WEST));
    this.addSpinner(this.layerWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 2, this.layerWidth, this.layerHeight, this.layerLockRatio);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 1).a(GBC.WEST));
    this.addSpinner(this.layerHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 2, this.layerWidth, this.layerHeight, this.layerLockRatio);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 1).a(GBC.WEST));
    this.addSpinner(this.layerResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 2, this.layerWidth, this.layerHeight, this.layerLockRatio);

    this.add(this.layerDimensionMM, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.layerDimensionIN, new GBC(0, 4).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));

    this.addCheckBox(this.layerLockRatio, this.layerWidth, this.layerHeight);
    this.add(this.layerLockRatio, new GBC(0, 5).a(GBC.WEST).w(3));

    Z4UI.addLabel(this, Z4Translations.CONTENT, new GBC(0, 6).a(GBC.WEST).w(3)).getStyle().fontWeight = "bold";
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 7).a(GBC.WEST));
    this.addSpinner(this.contentWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 7).a(GBC.WEST));
    this.addSpinner(this.contentHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 7).a(GBC.WEST));
    this.addSpinner(this.contentResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);

    this.add(this.contentDimensionMM, new GBC(0, 9).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.contentDimensionIN, new GBC(0, 10).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));

    this.addCheckBox(this.contentLockRatio, this.contentWidth, this.contentHeight);
    this.add(this.contentLockRatio, new GBC(0, 11).a(GBC.WEST).w(3));

    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(0, 12).a(GBC.WEST));
    this.addSpinner(this.contentOffsetX, 0, -Z4Constants.MAX_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 13, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(1, 12).a(GBC.WEST));
    this.addSpinner(this.contentOffsetY, 0, -Z4Constants.MAX_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 13, this.contentWidth, this.contentHeight, this.contentLockRatio);

    this.centerContent.setContentAreaFilled(false);
    this.centerContent.setText(Z4Translations.CENTER_VERB);
    this.centerContent.addActionListener(event -> {
      this.contentOffsetX.setValue(parseInt((this.layerWidth.getValue() - this.contentWidth.getValue()) / 2));
      this.contentOffsetY.setValue(parseInt((this.layerHeight.getValue() - this.contentHeight.getValue()) / 2));
      this.setDimensions();
    });
    this.add(this.centerContent, new GBC(2, 13));

    JSPanel panel = new JSPanel();
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    this.add(panel, new GBC(3, 0).h(6).a(GBC.NORTHWEST));

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio(panel, this.resizeLayerAdaptContent, buttonGroup, Z4Translations.RESIZE_LAYER_AND_ADAPT_CONTENT, true);
    this.addRadio(panel, this.resizeLayerAndContent, buttonGroup, Z4Translations.RESIZE_LAYER_AND_CONTENT, false);
    this.addRadio(panel, this.resizeLayer, buttonGroup, Z4Translations.RESIZE_LAYER, false);
    this.addRadio(panel, this.resizeContent, buttonGroup, Z4Translations.RESIZE_CONTENT, false);

    this.add(this.preview, new GBC(3, 6).h(8).wxy(1, 1));

    this.setDimensions();
  }

  private void addSpinner(JSSpinner spinner, double value, double min, double max, int gridx, int gridy, JSSpinner width, JSSpinner height, JSCheckBox lockRatio) {
    spinner.setModel(new SpinnerNumberModel(value, min, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event -> {
      Dimension size = this.computeDimension(width, height, lockRatio.isSelected(), spinner == width, spinner == height);
      width.setValue(size.width);
      height.setValue(size.height);
      this.setDimensions();
    });
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 0, 0, 5));
  }

  private void addCheckBox(JSCheckBox checkBox, JSSpinner width, JSSpinner height) {
    checkBox.setText(Z4Translations.LOCK_ASPECT_RATIO);
    checkBox.setSelected(true);
    checkBox.addActionListener(event -> {
      Dimension size = this.computeDimension(width, height, checkBox.isSelected(), true, false);
      width.setValue(size.width);
      height.setValue(size.height);
      this.setDimensions();
    });
  }

  private void addRadio(JSPanel panel, JSRadioButton radio, ButtonGroup buttonGroup, String text, boolean selected) {
    radio.setText(text);
    radio.setSelected(selected);
    radio.addActionListener(event -> this.setDimensions());
    buttonGroup.add(radio);
    panel.add(radio, null);
  }

  private Dimension computeDimension(JSSpinner width, JSSpinner height, boolean lockRatio, boolean isW, boolean isH) {
    double w = width.getValue();
    double h = height.getValue();

    if (!lockRatio) {
    } else if (isW) {
      h = parseInt(w / this.canvasRatio);

      if (h < 1) {
        w = parseInt(this.canvasRatio);
        h = 1;
      } else if (h > Z4Constants.MAX_IMAGE_SIZE) {
        w = parseInt(Z4Constants.MAX_IMAGE_SIZE * this.canvasRatio);
        h = Z4Constants.MAX_IMAGE_SIZE;
      }
    } else if (isH) {
      w = parseInt(h * this.canvasRatio);

      if (w < 1) {
        w = 1;
        h = parseInt(1 / this.canvasRatio);
      } else if (w > Z4Constants.MAX_IMAGE_SIZE) {
        w = Z4Constants.MAX_IMAGE_SIZE;
        h = parseInt(Z4Constants.MAX_IMAGE_SIZE / this.canvasRatio);
      }
    }

    return new Dimension((int) w, (int) h);
  }

  private void setDimensions() {
    if (this.resizeLayerAdaptContent.isSelected()) {
      this.setComponentsEnabled(true, false, false);
      this.contentWidth.setValue(this.layerWidth.getValue());
      this.contentHeight.setValue(this.layerHeight.getValue());
      this.contentOffsetX.setValue(0);
      this.contentOffsetY.setValue(0);
    } else if (this.resizeLayerAndContent.isSelected()) {
      this.setComponentsEnabled(true, true, true);
    } else if (this.resizeLayer.isSelected()) {
      this.setComponentsEnabled(true, false, true);
      this.contentWidth.setValue(this.canvasWidth);
      this.contentHeight.setValue(this.canvasHeight);
    } else if (this.resizeContent.isSelected()) {
      this.setComponentsEnabled(false, true, true);
      this.layerWidth.setValue(this.canvasWidth);
      this.layerHeight.setValue(this.canvasHeight);
    }

    this.setLabels(this.layerWidth, this.layerHeight, this.layerResolution, this.layerDimensionMM, this.layerDimensionIN);
    this.setLabels(this.contentWidth, this.contentHeight, this.contentResolution, this.contentDimensionMM, this.contentDimensionIN);

    double layerW = this.layerWidth.getValue();
    double layerH = this.layerHeight.getValue();

    double newRatio = layerW / layerH;
    double previewW = newRatio > 1 ? Z4ResizeImagePanel.SIZE : Z4ResizeImagePanel.SIZE * newRatio;
    double previewH = newRatio > 1 ? Z4ResizeImagePanel.SIZE / newRatio : Z4ResizeImagePanel.SIZE;
    this.preview.setProperty("width", "" + parseInt(previewW));
    this.preview.setProperty("height", "" + parseInt(previewH));

    if ($exists(this.canvas)) {
      double scaleW = previewW / layerW;
      double scaleH = previewH / layerH;

      this.ctx.save();
      this.ctx.scale(scaleW, scaleH);
      this.ctx.drawImage(this.canvas, this.contentOffsetX.getValue(), this.contentOffsetY.getValue(), this.contentWidth.getValue(), this.contentHeight.getValue());
      this.ctx.restore();
    }

    this.onchange();
  }

  private void setComponentsEnabled(boolean layer, boolean content, boolean offset) {
    this.layerWidth.setEnabled(layer);
    this.layerHeight.setEnabled(layer);
    this.layerLockRatio.setEnabled(layer);
    this.contentWidth.setEnabled(content);
    this.contentHeight.setEnabled(content);
    this.contentLockRatio.setEnabled(content);
    this.contentOffsetX.setEnabled(offset);
    this.contentOffsetY.setEnabled(offset);
    this.centerContent.setEnabled(offset);
  }

  private void setLabels(JSSpinner width, JSSpinner height, JSSpinner resolution, JSLabel dimensionMM, JSLabel dimensionIN) {
    double w = width.getValue();
    double h = height.getValue();

    double res = resolution.getValue();
    double dimWIN = w / res;
    double dimHIN = h / res;

    dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
  }

  /**
   * Sets the canvas to resize
   *
   *
   * @param canvas The canvas to resize;
   * @param width The canvas width
   * @param height The canvas height
   */
  public void setCanvas($OffscreenCanvas canvas, int width, int height) {
    this.canvas = canvas;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.canvasRatio = width / height;

    this.layerWidth.setValue(width);
    this.layerHeight.setValue(height);
    this.contentWidth.setValue(width);
    this.contentHeight.setValue(height);

    this.setDimensions();
  }

  /**
   * Returns the selected size
   *
   * @return The selected size
   */
//  public Dimension getSelectedSize() {
//    return new Dimension((int) this.width.getValue(), (int) this.height.getValue());
//  }
//  
  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
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
