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
    Z4UI.addLabel(this, Z4Translations.SHAPES_AND_PATHS, new GBC(0, 0).w(2).a(GBC.WEST).i(-9, 5, 5, 0));
    let dropDownMenu = new JSDropDownMenu();
    dropDownMenu.setLabel(Z4Translations.NEW_HIS);
    dropDownMenu.addMenu(Z4Translations.LINE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.LINE, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.POLYLINE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.POLYLINE, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.ELLIPSE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.ELLIPSE, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.RECTANGLE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.RECTANGLE, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.ROUND_RECTANGLE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.ROUND_RECTANGLE, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.QUAD, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.QUAD, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.BEZIER, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.BEZIER, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.SINUSOIDAL, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.SINUSOIDAL, this.canvas.getSize().width, this.canvas.getSize().height)));
    dropDownMenu.addMenu(Z4Translations.SPIRAL, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.SPIRAL, this.canvas.getSize().width, this.canvas.getSize().height)));
    this.add(dropDownMenu, new GBC(0, 1).i(0, 2, 0, 5));
    let button = new JSButton();
    button.setText(Z4Translations.MERGE);
    button.setContentAreaFilled(false);
    this.add(button, new GBC(1, 1).a(GBC.WEST).f(GBC.VERTICAL));
    Z4UI.addHLine(this, new GBC(0, 2).w(2).wx(1).f(GBC.HORIZONTAL).i(2, 1, 2, 1));
    this.geometricShapesPreview.setLayout(new BoxLayout(this.geometricShapesPreview, BoxLayout.Y_AXIS));
    this.geometricShapesPreview.getStyle().overflowY = "scroll";
    this.geometricShapesPreview.getStyle().height = (window.innerHeight - 230) + "px";
    this.add(this.geometricShapesPreview, new GBC(0, 3).w(2).wxy(1, 1).f(GBC.BOTH).i(5, 2, 5, 2));
    window.addEventListener("resize", event => this.geometricShapesPreview.getStyle().height = (window.innerHeight - 230) + "px");
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
    document.querySelectorAll(".z4geometricshapepreview .z4geometricshapepreview-selector").forEach(element => element.textContent = Z4GeometricShapePreview.UNSELECTED_GEOMETRIC_SHAPE_CONTENT);
    this.geometricShapesPreview.add(preview, null);
    setTimeout(() => preview.invoke("scrollIntoView()"), 0);
  }

  /**
   * Resets the geometric shape preview
   */
   reset() {
    this.geometricShapesPreview.setProperty("innerHTML", "");
  }
}
