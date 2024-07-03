package pizzapazza.ui.panel;

import static def.js.Globals.eval;
import java.awt.Point;
import javascript.awt.Color;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSDropDown;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import pizzapazza.math.Z4Math;
import pizzapazza.ui.panel.color.Z4ColorPanel;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import static simulation.js.$Globals.document;
import simulation.js.$Number;

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

  private Point center = new Point(0, 0);

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
    this.showGridCheckBox.addActionListener(event -> this.onchange());
    panel.add(this.showGridCheckBox, new GBC(0, 3).a(GBC.WEST));

    this.dottedGridCheckBox.setText(Z4Translations.DOTTED_GRID);
    this.dottedGridCheckBox.addActionListener(event -> this.onchange());
    panel.add(this.dottedGridCheckBox, new GBC(0, 2).a(GBC.WEST));

    this.magneticGridCheckBox.setText(Z4Translations.MAGNETIC_GRID);
    this.magneticGridCheckBox.addActionListener(event -> this.onchange());
    panel.add(this.magneticGridCheckBox, new GBC(0, 1).a(GBC.WEST));

    this.colorPanel.setLabel(Z4Translations.COLOR);
    this.colorPanel.setOpacityVisible(false);
    this.colorPanel.addChangeListener(event -> this.onchange());
    panel.add(this.colorPanel, new GBC(0, 0).a(GBC.WEST).f(GBC.HORIZONTAL));

    this.appendChild(panel);

    this.reset();
  }

  private void onchange() {
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
   */
  public void reset() {
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
  }
}
