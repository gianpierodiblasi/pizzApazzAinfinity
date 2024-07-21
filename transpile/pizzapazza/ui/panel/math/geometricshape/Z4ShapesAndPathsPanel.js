/**
 * The panel to manage shapes and paths
 *
 * @author gianpiero.diblasi
 */
class Z4ShapesAndPathsPanel extends JSPanel {

   geometricShapesPreview = new JSPanel();

   statusPanel = null;

   canvas = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4shapesandpathspanel");
    this.setLayout(new GridBagLayout());
    let fieldset = new JSComponent(document.createElement("fieldset"));
    this.add(fieldset, new GBC(0, 0).f(GBC.BOTH).wxy(1, 1));
    let legend = new JSComponent(document.createElement("legend"));
    legend.setContent(Z4Translations.SHAPES_AND_PATHS);
    fieldset.appendChild(legend);
    // JSPanel panel = new JSPanel();
    // panel.setLayout(new GridBagLayout());
    // fieldset.appendChild(panel);
    // 
    // JSDropDownMenu dropDownMenu = new JSDropDownMenu();
    // dropDownMenu.setLabel(Z4Translations.NEW_HIS);
    // dropDownMenu.addMenu(Z4Translations.LINE, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.LINE));
    // dropDownMenu.addMenu(Z4Translations.POLYLINE, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.POLYLINE));
    // dropDownMenu.addMenu(Z4Translations.ELLIPSE, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.ELLIPSE));
    // dropDownMenu.addMenu(Z4Translations.RECTANGLE, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.RECTANGLE));
    // dropDownMenu.addMenu(Z4Translations.ROUND_RECTANGLE, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.ROUND_RECTANGLE));
    // dropDownMenu.addMenu(Z4Translations.QUAD, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.QUAD));
    // dropDownMenu.addMenu(Z4Translations.BEZIER, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.BEZIER));
    // dropDownMenu.addMenu(Z4Translations.SINUSOIDAL, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.SINUSOIDAL));
    // dropDownMenu.addMenu(Z4Translations.SPIRAL, event -> this.canvas.addGeometricShape(Z4GeometricShapeType.SPIRAL));
    // panel.add(dropDownMenu, new GBC(0, 0).i(0, 0, 0, 5));
    // 
    // JSButton button = new JSButton();
    // button.setText(Z4Translations.MERGE);
    // button.setContentAreaFilled(false);
    // panel.add(button, new GBC(1, 0).a(GBC.WEST).f(GBC.VERTICAL));
    // 
    // Z4UI.addHLine(panel, new GBC(0, 1).w(2).wx(1).f(GBC.HORIZONTAL).i(2, 1, 2, 1));
    // 
    // this.geometricShapesPreview.setLayout(new BoxLayout(this.geometricShapesPreview, BoxLayout.Y_AXIS));
    // this.geometricShapesPreview.getStyle().overflowY = "scroll";
    // fieldset.appendChild(this.geometricShapesPreview);
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
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Adds a new geometric shape preview
   *
   * @param shape The geometric shape
   */
   addGeometricShapePreview(shape) {
    let preview = new Z4GeometricShapePreview();
    preview.setShapesAndPathsPanel(this);
    preview.setGeometriShape(this.canvas, shape);
    this.geometricShapesPreview.add(preview, null);
    setTimeout(() => preview.invoke("scrollIntoView()"), 0);
  }
}
