/**
 * The panel to manage the grid of a canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasGridPanel extends JSDropDown {

   showGridLabel = new JSComponent(document.createElement("img"));

   dottedGridLabel = new JSComponent(document.createElement("img"));

   magneticGridLabel = new JSComponent(document.createElement("img"));

   colorPanelLabel = new Z4ColorPanel();

   xLabel = new JSLabel();

   yLabel = new JSLabel();

   distanceLabel = new JSLabel();

   angleLabel = new JSLabel();

   deltaXLabel = new JSLabel();

   deltaYLabel = new JSLabel();

   vline1 = null;

   vline2 = null;

   vline3 = null;

   showGridCheckBox = new JSCheckBox();

   dottedGridCheckBox = new JSCheckBox();

   magneticGridCheckBox = new JSCheckBox();

   colorPanel = new Z4ColorPanel();

   offsetXSlider = new JSSlider();

   offsetXSpinner = new JSSpinner();

   offsetYSlider = new JSSlider();

   offsetYSpinner = new JSSpinner();

   plotWidthSlider = new JSSlider();

   plotWidthSpinner = new JSSpinner();

   canvas = null;

   center = null;

  /**
   * Creates the object
   */
  constructor() {
    super(".z4canvasgridpanel-editor");
    this.cssAddClass("z4canvasgridpanel");
    let summary = new JSPanel();
    summary.setLayout(new GridBagLayout());
    this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid");
    summary.add(this.showGridLabel, new GBC(0, 0).h(2).i(0, 0, 0, 5));
    this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid");
    summary.add(this.dottedGridLabel, new GBC(1, 0).h(2).i(0, 0, 0, 5));
    this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid");
    summary.add(this.magneticGridLabel, new GBC(2, 0).h(2).i(0, 0, 0, 5));
    this.colorPanelLabel.setEditButtonVisible(false);
    this.colorPanelLabel.getChilStyleByQuery(".jscolorpreview").height = "14px";
    this.colorPanelLabel.getStyle().width = "14px";
    summary.add(this.colorPanelLabel, new GBC(3, 0).h(2));
    this.vline1 = Z4UI.addVLine(summary, new GBC(4, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.xLabel.getStyle().fontFamily = "monospace";
    this.xLabel.getStyle().fontSize = "smaller";
    summary.add(this.xLabel, new GBC(5, 0));
    this.yLabel.getStyle().fontFamily = "monospace";
    this.yLabel.getStyle().fontSize = "smaller";
    summary.add(this.yLabel, new GBC(5, 1).a(GBC.WEST));
    this.vline2 = Z4UI.addVLine(summary, new GBC(6, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.distanceLabel.getStyle().fontFamily = "monospace";
    this.distanceLabel.getStyle().fontSize = "smaller";
    summary.add(this.distanceLabel, new GBC(7, 0));
    this.angleLabel.getStyle().fontFamily = "monospace";
    this.angleLabel.getStyle().fontSize = "smaller";
    summary.add(this.angleLabel, new GBC(7, 1));
    this.vline3 = Z4UI.addVLine(summary, new GBC(8, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.deltaXLabel.getStyle().fontFamily = "monospace";
    this.deltaXLabel.getStyle().fontSize = "smaller";
    summary.add(this.deltaXLabel, new GBC(9, 0));
    this.deltaYLabel.getStyle().fontFamily = "monospace";
    this.deltaYLabel.getStyle().fontSize = "smaller";
    summary.add(this.deltaYLabel, new GBC(9, 1).a(GBC.WEST));
    this.appendChildInTree("summary", summary);
    let panel = new JSPanel();
    panel.cssAddClass("z4canvasgridpanel-editor");
    panel.setLayout(new GridBagLayout());
    this.showGridCheckBox.setText(Z4Translations.SHOW_GRID);
    this.showGridCheckBox.addActionListener(event => this.onchange(false, null, null));
    panel.add(this.showGridCheckBox, new GBC(0, 7).w(2).a(GBC.WEST));
    this.dottedGridCheckBox.setText(Z4Translations.DOTTED_GRID);
    this.dottedGridCheckBox.addActionListener(event => this.onchange(false, null, null));
    panel.add(this.dottedGridCheckBox, new GBC(0, 6).w(2).a(GBC.WEST));
    this.magneticGridCheckBox.setText(Z4Translations.MAGNETIC_GRID);
    this.magneticGridCheckBox.addActionListener(event => this.onchange(false, null, null));
    panel.add(this.magneticGridCheckBox, new GBC(0, 5).w(2).a(GBC.WEST));
    this.colorPanel.setLabel(Z4Translations.COLOR);
    this.colorPanel.setOpacityVisible(false);
    this.colorPanel.addChangeListener(event => this.onchange(false, null, null));
    panel.add(this.colorPanel, new GBC(0, 4).w(2).a(GBC.WEST).f(GBC.HORIZONTAL));
    this.plotWidthSlider.addChangeListener(event => this.onchange(false, this.plotWidthSpinner, this.plotWidthSlider));
    panel.add(this.plotWidthSlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));
    this.plotWidthSpinner.cssAddClass("jsspinner_w_4rem");
    this.plotWidthSpinner.addChangeListener(event => this.onchange(true, this.plotWidthSpinner, this.plotWidthSlider));
    panel.add(this.plotWidthSpinner, new GBC(1, 2).a(GBC.EAST));
    Z4UI.addLabel(panel, Z4Translations.PLOT_WIDTH, new GBC(0, 2).a(GBC.WEST));
    this.offsetXSlider.getStyle().minWidth = "20.4rem";
    this.offsetXSlider.addChangeListener(event => this.onchange(false, this.offsetXSpinner, this.offsetXSlider));
    panel.add(this.offsetXSlider, new GBC(0, 1).w(2).f(GBC.HORIZONTAL));
    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event => this.onchange(true, this.offsetXSpinner, this.offsetXSlider));
    panel.add(this.offsetXSpinner, new GBC(1, 0).a(GBC.EAST));
    Z4UI.addLabel(panel, Z4Translations.OFFSET_X, new GBC(0, 0).a(GBC.WEST));
    Z4UI.addVLine(panel, new GBC(2, 0).h(8).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(panel, Z4Translations.OFFSET_Y, new GBC(3, 4).h(4).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    Z4UI.setVerticalSpinner(this.offsetYSpinner);
    this.offsetYSpinner.addChangeListener(event => this.onchange(true, this.offsetYSpinner, this.offsetYSlider));
    panel.add(this.offsetYSpinner, new GBC(3, 0).h(4).a(GBC.NORTH));
    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event => this.onchange(false, this.offsetYSpinner, this.offsetYSlider));
    panel.add(this.offsetYSlider, new GBC(4, 0).h(8).wy(1).a(GBC.NORTH).f(GBC.VERTICAL));
    this.appendChild(panel);
    this.reset(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, false);
  }

   onchange(spTosl, spinner, slider) {
    if (spinner && spTosl) {
      slider.setValue(spinner.getValue());
    } else if (spinner) {
      spinner.setValue(slider.getValue());
    }
    this.center = new Point(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    this.showGridLabel.cssRemoveClass("z4canvasgridpanel-showgrid-on");
    this.showGridLabel.cssRemoveClass("z4canvasgridpanel-showgrid-off");
    this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid-" + (this.showGridCheckBox.isSelected() ? "on" : "off"));
    this.dottedGridLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.dottedGridLabel.cssRemoveClass("z4canvasgridpanel-dottedgrid-on");
    this.dottedGridLabel.cssRemoveClass("z4canvasgridpanel-dottedgrid-off");
    this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid-" + (this.dottedGridCheckBox.isSelected() ? "on" : "off"));
    this.dottedGridCheckBox.setEnabled(this.showGridCheckBox.isSelected());
    this.magneticGridLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.magneticGridLabel.cssRemoveClass("z4canvasgridpanel-magneticgrid-on");
    this.magneticGridLabel.cssRemoveClass("z4canvasgridpanel-magneticgrid-off");
    this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid-" + (this.magneticGridCheckBox.isSelected() ? "on" : "off"));
    this.magneticGridCheckBox.setEnabled(this.showGridCheckBox.isSelected());
    this.colorPanelLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.colorPanelLabel.setValue(this.colorPanel.getValue());
    this.colorPanel.setEnabled(this.showGridCheckBox.isSelected());
    this.xLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.xLabel.setText("X: " + new Number(this.center.x).toFixed(0).padStart(4, "\u00A0") + "px");
    this.yLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.yLabel.setText("Y: " + new Number(this.center.y).toFixed(0).padStart(4, "\u00A0") + "px");
    this.distanceLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.angleLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.deltaXLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.deltaYLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline1.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline2.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline3.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.plotWidthSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.plotWidthSlider.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetXSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetXSlider.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetYSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetYSlider.setEnabled(this.showGridCheckBox.isSelected());
    this.canvas.setGrid(this.showGridCheckBox.isSelected(), this.center, this.plotWidthSlider.getValue(), this.dottedGridCheckBox.isSelected(), this.magneticGridCheckBox.isSelected(), this.colorPanelLabel.getValue());
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
   setMousePosition(x, y) {
    let distance = Z4Math.distance(this.center.x, this.center.y, x, y);
    let angle = Z4Math.rad2deg(Z4Math.atan(this.center.x, this.center.y, x, y));
    let deltaX = Math.abs(this.center.x - x);
    let deltaY = Math.abs(this.center.y - y);
    let diff = 0;
    eval("diff = Z4Translations.DISTANCE.length - Z4Translations.ANGLE.length;");
    this.distanceLabel.setText(Z4Translations.DISTANCE + ": " + new Number(distance).toFixed(2).padStart(7 + (diff < 0 ? -diff : 0), "\u00A0") + "px");
    this.angleLabel.setText(Z4Translations.ANGLE + ": " + new Number(angle).toFixed(2).padStart(7 + (diff > 0 ? diff : 0), "\u00A0") + "\u00B0\u00A0");
    this.deltaXLabel.setText(Z4Translations.DELTA_X + ": " + new Number(deltaX).toFixed(0).padStart(4, "\u00A0") + "px");
    this.deltaYLabel.setText(Z4Translations.DELTA_Y + ": " + new Number(deltaY).toFixed(0).padStart(4, "\u00A0") + "px");
  }

  /**
   * Resets the panel
   *
   * @param width The canvas width
   * @param height The canvas height
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
   reset(width, height, resetOnlySize) {
    let value = 0.0;
    if (!resetOnlySize) {
      this.showGridLabel.cssRemoveClass("z4canvasgridpanel-showgrid-on");
      this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid-off");
      this.showGridCheckBox.setSelected(false);
      this.dottedGridLabel.getStyle().visibility = "hidden";
      this.dottedGridLabel.cssRemoveClass("z4canvasgridpanel-dottedgrid-on");
      this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid-off");
      this.dottedGridCheckBox.setSelected(false);
      this.dottedGridCheckBox.setEnabled(false);
      this.magneticGridLabel.getStyle().visibility = "hidden";
      this.magneticGridLabel.cssRemoveClass("z4canvasgridpanel-magneticgrid-on");
      this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid-off");
      this.magneticGridCheckBox.setSelected(false);
      this.magneticGridCheckBox.setEnabled(false);
      this.colorPanelLabel.getStyle().visibility = "hidden";
      this.colorPanelLabel.setValue(new Color(0, 0, 0, 255));
      this.colorPanel.setEnabled(false);
      this.colorPanel.setValue(new Color(0, 0, 0, 255));
      this.xLabel.getStyle().visibility = "hidden";
      this.yLabel.getStyle().visibility = "hidden";
      this.distanceLabel.getStyle().visibility = "hidden";
      this.angleLabel.getStyle().visibility = "hidden";
      this.deltaXLabel.getStyle().visibility = "hidden";
      this.deltaYLabel.getStyle().visibility = "hidden";
      this.vline1.getStyle().visibility = "hidden";
      this.vline2.getStyle().visibility = "hidden";
      this.vline3.getStyle().visibility = "hidden";
      value = 20;
    } else {
      value = this.plotWidthSpinner.getValue();
    }
    this.plotWidthSpinner.setEnabled(false);
    this.plotWidthSpinner.setModel(new SpinnerNumberModel(value, 5, parseInt(Math.min(width, height) / 2), 1));
    this.plotWidthSlider.setEnabled(false);
    this.plotWidthSlider.setMinimum(5);
    this.plotWidthSlider.setMaximum(parseInt(Math.min(width, height) / 2));
    this.plotWidthSlider.setValue(value);
    this.center = new Point(parseInt(width / 2), parseInt(height / 2));
    this.offsetXSpinner.setEnabled(false);
    this.offsetXSpinner.setModel(new SpinnerNumberModel(this.center.x, 0, width, 1));
    this.offsetXSlider.setEnabled(false);
    this.offsetXSlider.setMaximum(width);
    this.offsetXSlider.setValue(this.center.x);
    this.offsetYSpinner.setEnabled(false);
    this.offsetYSpinner.setModel(new SpinnerNumberModel(this.center.y, 0, height, 1));
    this.offsetYSlider.setEnabled(false);
    this.offsetYSlider.setMaximum(height);
    this.offsetYSlider.setValue(this.center.y);
  }
}
