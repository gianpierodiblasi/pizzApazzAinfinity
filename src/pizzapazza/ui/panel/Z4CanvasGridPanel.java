package pizzapazza.ui.panel;

import static def.js.Globals.eval;
import javascript.awt.Color;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.awt.Point;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSDropDown;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.SpinnerNumberModel;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.panel.color.Z4ColorPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Number;
import simulation.js.$Path2D;

/**
 * The panel to manage the grid of a canvas
 *
 * @author gianpiero.diblasi
 */
public class Z4CanvasGridPanel extends JSDropDown {

  private final JSComponent showGridLabel = new JSComponent(document.createElement("img"));
  private final JSComponent dottedGridLabel = new JSComponent(document.createElement("img"));
  private final JSComponent magneticGridLabel = new JSComponent(document.createElement("img"));
  private final Z4ColorPanel colorPanelLabel = new Z4ColorPanel();

  private final JSLabel distanceLabel = new JSLabel();
  private final JSLabel angleLabel = new JSLabel();
  private final JSLabel deltaXLabel = new JSLabel();
  private final JSLabel deltaYLabel = new JSLabel();
  private final JSComponent vline1;
  private final JSComponent vline2;

  private final JSCheckBox showGridCheckBox = new JSCheckBox();
  private final JSCheckBox dottedGridCheckBox = new JSCheckBox();
  private final JSCheckBox magneticGridCheckBox = new JSCheckBox();
  private final Z4ColorPanel colorPanel = new Z4ColorPanel();

  private final JSSlider offsetXSlider = new JSSlider();
  private final JSSpinner offsetXSpinner = new JSSpinner();
  private final JSSlider offsetYSlider = new JSSlider();
  private final JSSpinner offsetYSpinner = new JSSpinner();
  private final JSSlider plotWidthSlider = new JSSlider();
  private final JSSpinner plotWidthSpinner = new JSSpinner();

  private Z4Canvas canvas;
  private Point center;
  private Dimension size;

  private final static double MAGNETISM_PERCENTAGE = 0.25;

  /**
   * Creates the object
   */
  public Z4CanvasGridPanel() {
    super(".z4canvasgridpanel-editor");
    this.cssAddClass("z4canvasgridpanel");

    JSPanel summary = new JSPanel();
    summary.setLayout(new GridBagLayout());

    this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid");
    summary.add(this.showGridLabel, new GBC(0, 0).h(2).i(0, 0, 0, 5));

    this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid");
    summary.add(this.dottedGridLabel, new GBC(1, 0).h(2).i(0, 0, 0, 5));

    this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid");
    summary.add(this.magneticGridLabel, new GBC(2, 0).h(2).i(0, 0, 0, 5));

    this.colorPanelLabel.setEditButtonVisible(false);
    this.colorPanelLabel.getChilStyleByQuery(".z4colorpanel-container").height = "14px";
    this.colorPanelLabel.getStyle().width = "14px";
    summary.add(this.colorPanelLabel, new GBC(3, 0).h(2));

    this.vline1 = Z4UI.addVLine(summary, new GBC(4, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));

    this.distanceLabel.getStyle().fontFamily = "monospace";
    this.distanceLabel.getStyle().fontSize = "smaller";
    summary.add(this.distanceLabel, new GBC(5, 0));

    this.angleLabel.getStyle().fontFamily = "monospace";
    this.angleLabel.getStyle().fontSize = "smaller";
    summary.add(this.angleLabel, new GBC(5, 1));

    this.vline2 = Z4UI.addVLine(summary, new GBC(6, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));

    this.deltaXLabel.getStyle().fontFamily = "monospace";
    this.deltaXLabel.getStyle().fontSize = "smaller";
    summary.add(this.deltaXLabel, new GBC(7, 0));

    this.deltaYLabel.getStyle().fontFamily = "monospace";
    this.deltaYLabel.getStyle().fontSize = "smaller";
    summary.add(this.deltaYLabel, new GBC(7, 1).a(GBC.WEST));

    this.appendChildInTree("summary", summary);

    JSPanel panel = new JSPanel();
    panel.cssAddClass("z4canvasgridpanel-editor");
    panel.setLayout(new GridBagLayout());

    this.showGridCheckBox.setText(Z4Translations.SHOW_GRID);
    this.showGridCheckBox.addActionListener(event -> this.onchange(false, null, null));
    panel.add(this.showGridCheckBox, new GBC(0, 7).w(2).a(GBC.WEST));

    this.dottedGridCheckBox.setText(Z4Translations.DOTTED_GRID);
    this.dottedGridCheckBox.addActionListener(event -> this.onchange(false, null, null));
    panel.add(this.dottedGridCheckBox, new GBC(0, 6).w(2).a(GBC.WEST));

    this.magneticGridCheckBox.setText(Z4Translations.MAGNETIC_GRID);
    this.magneticGridCheckBox.addActionListener(event -> this.onchange(false, null, null));
    panel.add(this.magneticGridCheckBox, new GBC(0, 5).w(2).a(GBC.WEST));

    this.colorPanel.setLabel(Z4Translations.COLOR);
    this.colorPanel.setOpacityVisible(false);
    this.colorPanel.addChangeListener(event -> this.onchange(false, null, null));
    panel.add(this.colorPanel, new GBC(0, 4).w(2).a(GBC.WEST).f(GBC.HORIZONTAL));

    this.plotWidthSlider.addChangeListener(event -> this.onchange(false, this.plotWidthSpinner, this.plotWidthSlider));
    panel.add(this.plotWidthSlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));

    this.plotWidthSpinner.cssAddClass("jsspinner_w_4rem");
    this.plotWidthSpinner.addChangeListener(event -> this.onchange(true, this.plotWidthSpinner, this.plotWidthSlider));
    panel.add(this.plotWidthSpinner, new GBC(1, 2).a(GBC.EAST));

    Z4UI.addLabel(panel, Z4Translations.PLOT_WIDTH, new GBC(0, 2).a(GBC.WEST));

    this.offsetXSlider.getStyle().minWidth = "20.4rem";
    this.offsetXSlider.addChangeListener(event -> this.onchange(false, this.offsetXSpinner, this.offsetXSlider));
    panel.add(this.offsetXSlider, new GBC(0, 1).w(2).f(GBC.HORIZONTAL));

    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event -> this.onchange(true, this.offsetXSpinner, this.offsetXSlider));
    panel.add(this.offsetXSpinner, new GBC(1, 0).a(GBC.EAST));

    Z4UI.addLabel(panel, Z4Translations.OFFSET_X, new GBC(0, 0).a(GBC.WEST));

    Z4UI.addVLine(panel, new GBC(2, 0).h(8).f(GBC.VERTICAL).i(1, 2, 1, 2));

    Z4UI.addLabel(panel, Z4Translations.OFFSET_Y, new GBC(3, 4).h(4).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");

    this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.addChangeListener(event -> this.onchange(true, this.offsetYSpinner, this.offsetYSlider));
    panel.add(this.offsetYSpinner, new GBC(3, 0).h(4).a(GBC.NORTH));

    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event -> this.onchange(false, this.offsetYSpinner, this.offsetYSlider));
    panel.add(this.offsetYSlider, new GBC(4, 0).h(8).wy(1).a(GBC.NORTH).f(GBC.VERTICAL));

    this.appendChild(panel);

    this.reset(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE);
  }

  private void onchange(boolean spTosl, JSSpinner spinner, JSSlider slider) {
    if ($exists(spinner) && spTosl) {
      slider.setValue((int) spinner.getValue());
    } else if ($exists(spinner)) {
      spinner.setValue(slider.getValue());
    }

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

    this.distanceLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.angleLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.deltaXLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.deltaYLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline1.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline2.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";

    this.plotWidthSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.plotWidthSlider.setEnabled(this.showGridCheckBox.isSelected());

    this.center = new Point(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    this.offsetXSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetXSlider.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetYSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetYSlider.setEnabled(this.showGridCheckBox.isSelected());

    this.canvas.setGrid(this.createGrid(), this.center, this.plotWidthSlider.getValue(), this.magneticGridCheckBox.isSelected(), this.colorPanelLabel.getValue());
  }

  private $Path2D createGrid() {
    $Path2D grid = new $Path2D();

    int plotWidth = this.plotWidthSlider.getValue();

    if (this.dottedGridCheckBox.isSelected()) {
      for (int x = this.center.x; x > 0; x -= plotWidth) {
        for (int y = this.center.y; y > 0; y -= plotWidth) {
          grid.moveTo(x + 2, y);
          grid.arc(x, y, 2, 0, Z4Math.TWO_PI);
        }
        for (int y = this.center.y; y < this.size.height; y += plotWidth) {
          grid.moveTo(x + 2, y);
          grid.arc(x, y, 2, 0, Z4Math.TWO_PI);
        }
      }
      for (int x = this.center.x; x < this.size.width; x += plotWidth) {
        for (int y = this.center.y; y > 0; y -= plotWidth) {
          grid.moveTo(x + 2, y);
          grid.arc(x, y, 2, 0, Z4Math.TWO_PI);
        }
        for (int y = this.center.y; y < this.size.height; y += plotWidth) {
          grid.moveTo(x + 2, y);
          grid.arc(x, y, 2, 0, Z4Math.TWO_PI);
        }
      }
    } else {
      for (int x = this.center.x; x > 0; x -= plotWidth) {
        grid.moveTo(x, 0);
        grid.lineTo(x, this.size.height);
      }
      for (int x = this.center.x; x < this.size.width; x += plotWidth) {
        grid.moveTo(x, 0);
        grid.lineTo(x, this.size.height);
      }
      for (int y = this.center.y; y > 0; y -= plotWidth) {
        grid.moveTo(0, y);
        grid.lineTo(this.size.width, y);
      }
      for (int y = this.center.y; y < this.size.height; y += plotWidth) {
        grid.moveTo(0, y);
        grid.lineTo(this.size.width, y);
      }
    }

    if (this.magneticGridCheckBox.isSelected()) {
      int magneticRadius = parseInt(plotWidth * Z4CanvasGridPanel.MAGNETISM_PERCENTAGE);

      for (int x = this.center.x; x > 0; x -= plotWidth) {
        for (int y = this.center.y; y > 0; y -= plotWidth) {
          grid.moveTo(x + magneticRadius, y);
          grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
        }
        for (int y = this.center.y; y < this.size.height; y += plotWidth) {
          grid.moveTo(x + magneticRadius, y);
          grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
        }
      }
      for (int x = this.center.x; x < this.size.width; x += plotWidth) {
        for (int y = this.center.y; y > 0; y -= plotWidth) {
          grid.moveTo(x + magneticRadius, y);
          grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
        }
        for (int y = this.center.y; y < this.size.height; y += plotWidth) {
          grid.moveTo(x + magneticRadius, y);
          grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
        }
      }
    }

    return grid;
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
  public void setMousePosition(int x, int y) {
    double distance = Z4Math.distance(this.center.x, this.center.y, x, y);
    double angle = Z4Math.rad2deg(Z4Math.atan(this.center.x, this.center.y, x, y));
    int deltaX = Math.abs(this.center.x - x);
    int deltaY = Math.abs(this.center.y - y);

    int diff = 0;
    eval("diff = Z4Translations.DISTANCE.length - Z4Translations.ANGLE.length;");

    this.distanceLabel.setText(Z4Translations.DISTANCE + ": " + new $Number(distance).toFixed(2).padStart(7 + (diff < 0 ? -diff : 0), "\u00A0") + "px");
    this.angleLabel.setText(Z4Translations.ANGLE + ": " + new $Number(angle).toFixed(2).padStart(7 + (diff > 0 ? diff : 0), "\u00A0") + "\u00B0\u00A0");
    this.deltaXLabel.setText(Z4Translations.DELTA_X + ": " + new $Number(deltaX).toFixed(0).padStart(4, "\u00A0") + "px");
    this.deltaYLabel.setText(Z4Translations.DELTA_Y + ": " + new $Number(deltaY).toFixed(0).padStart(4, "\u00A0") + "px");
  }

  /**
   * Resets the panel
   *
   * @param width The canvas width
   * @param height The canvas height
   */
  public void reset(int width, int height) {
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

    this.distanceLabel.getStyle().visibility = "hidden";
    this.angleLabel.getStyle().visibility = "hidden";
    this.deltaXLabel.getStyle().visibility = "hidden";
    this.deltaYLabel.getStyle().visibility = "hidden";
    this.vline1.getStyle().visibility = "hidden";
    this.vline2.getStyle().visibility = "hidden";

    this.plotWidthSpinner.setEnabled(false);
    this.plotWidthSpinner.setModel(new SpinnerNumberModel(20, 5, parseInt(Math.min(width, height) / 2), 1));
    this.plotWidthSlider.setEnabled(false);
    this.plotWidthSlider.setMinimum(5);
    this.plotWidthSlider.setMaximum(parseInt(Math.min(width, height) / 2));
    this.plotWidthSlider.setValue(20);

    this.center = new Point(0, 0);
    this.size = new Dimension(width, height);
    this.offsetXSpinner.setEnabled(false);
    this.offsetXSpinner.setModel(new SpinnerNumberModel(0, 0, width, 1));
    this.offsetXSlider.setEnabled(false);
    this.offsetXSlider.setMaximum(width);
    this.offsetXSlider.setValue(0);
    this.offsetYSpinner.setEnabled(false);
    this.offsetYSpinner.setModel(new SpinnerNumberModel(0, 0, height, 1));
    this.offsetYSlider.setEnabled(false);
    this.offsetYSlider.setMaximum(height);
    this.offsetYSlider.setValue(0);
  }
}
