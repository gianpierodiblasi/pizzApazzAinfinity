/**
 * The panel to manage the grid of a canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasGridPanel extends JSDropDown {

   showGridLabel = new JSComponent(document.createElement("img"));

   dottedGridLabel = new JSComponent(document.createElement("img"));

   magneticGridLabel = new JSComponent(document.createElement("img"));

   showGridCheckBox = new JSCheckBox();

   dottedGridCheckBox = new JSCheckBox();

   magneticGridCheckBox = new JSCheckBox();

  /**
   * Creates the object
   */
  constructor() {
    super(".z4canvasgridpanel-editor");
    this.cssAddClass("z4canvasgridpanel");
    let summary = new JSPanel();
    summary.setLayout(new GridBagLayout());
    this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid");
    summary.add(this.showGridLabel, new GBC(0, 0).i(0, 0, 0, 2));
    this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid");
    this.dottedGridLabel.getStyle().visibility = "hidden";
    summary.add(this.dottedGridLabel, new GBC(1, 0).i(0, 0, 0, 2));
    this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid");
    this.magneticGridLabel.getStyle().visibility = "hidden";
    summary.add(this.magneticGridLabel, new GBC(2, 0));
    this.appendChildInTree("summary", summary);
    let panel = new JSPanel();
    panel.cssAddClass("z4canvasgridpanel-editor");
    panel.setLayout(new GridBagLayout());
    this.showGridCheckBox.setText(Z4Translations.SHOW_GRID);
    this.showGridCheckBox.addActionListener(event => this.onchange());
    panel.add(this.showGridCheckBox, new GBC(0, 2).a(GBC.WEST));
    this.dottedGridCheckBox.setText(Z4Translations.DOTTED_GRID);
    this.dottedGridCheckBox.addActionListener(event => this.onchange());
    panel.add(this.dottedGridCheckBox, new GBC(0, 1).a(GBC.WEST));
    this.magneticGridCheckBox.setText(Z4Translations.MAGNETIC_GRID);
    this.magneticGridCheckBox.addActionListener(event => this.onchange());
    panel.add(this.magneticGridCheckBox, new GBC(0, 0).a(GBC.WEST));
    this.appendChild(panel);
  }

   onchange() {
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
  }

  /**
   * Resets the panel
   */
   reset() {
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
  }
}
