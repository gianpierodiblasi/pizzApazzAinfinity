/**
 * The panel to manage shapes and paths
 *
 * @author gianpiero.diblasi
 */
class Z4ShapesAndPathsPanel extends JSPanel {

   drawDirection = new JSCheckBox();

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
    this.drawDirection.setText(Z4Translations.DRAW_DIRECTION);
    this.drawDirection.addActionListener(event => this.canvas.setDrawGeometricShapeDirection(this.drawDirection.isSelected()));
    this.add(this.drawDirection, new GBC(0, 1).w(2).a(GBC.WEST));
    let dropDownMenu = new JSDropDownMenu();
    dropDownMenu.setLabel(Z4Translations.NEW_HIS);
    dropDownMenu.addMenu(Z4Translations.LINE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.LINE, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.POLYLINE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.POLYLINE, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.ELLIPSE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.ELLIPSE, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.RECTANGLE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.RECTANGLE, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.ROUND_RECTANGLE, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.ROUND_RECTANGLE, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.QUAD, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.QUAD, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.BEZIER, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.BEZIER, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.SINUSOIDAL, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.SINUSOIDAL, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.SPIRAL, event => this.canvas.addGeometricShape(Z4GeometricShape.fromSize(Z4GeometricShapeType.SPIRAL, this.canvas.getSize().width, this.canvas.getSize().height))).setContentAreaFilled(false);
    this.add(dropDownMenu, new GBC(0, 2).i(0, 2, 0, 5));
    dropDownMenu = new JSDropDownMenu();
    dropDownMenu.setLabel(Z4Translations.ACTIONS);
    dropDownMenu.addMenu(Z4Translations.MERGE, event => this.mergeConnect(false)).setContentAreaFilled(false);
    dropDownMenu.addMenu(Z4Translations.CONNECT, event => this.mergeConnect(true)).setContentAreaFilled(false);
    this.add(dropDownMenu, new GBC(1, 2).a(GBC.WEST).f(GBC.VERTICAL));
    Z4UI.addHLine(this, new GBC(0, 3).w(2).wx(1).f(GBC.HORIZONTAL).i(2, 1, 2, 1));
    this.geometricShapesPreview.setLayout(new BoxLayout(this.geometricShapesPreview, BoxLayout.Y_AXIS));
    this.geometricShapesPreview.getStyle().overflowY = "scroll";
    this.geometricShapesPreview.getStyle().height = (window.innerHeight - 255) + "px";
    this.add(this.geometricShapesPreview, new GBC(0, 3).w(2).wxy(1, 1).f(GBC.BOTH).i(5, 2, 5, 2));
    window.addEventListener("resize", event => this.geometricShapesPreview.getStyle().height = (window.innerHeight - 255) + "px");
  }

   mergeConnect(connect) {
    let panel = new Z4MergeConnectGeometricShapePanel();
    panel.setCanvas(this.canvas, connect);
    JSOptionPane.showInputDialog(panel, Z4Translations.MERGE, listener => panel.addChangeListener(listener), () => panel.getSelectedGeometricShapes().length > 1, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let selected = panel.getSelectedGeometricShapes();
        if (panel.isDeleteSelectedShapesAndPaths()) {
          selected.forEach(shape => {
            let index = this.canvas.deleteGeometricShape(shape);
            document.querySelector(".z4geometricshapepreview:nth-child(" + (index + 1) + ")").remove();
          });
        }
        if (connect) {
          let d = this.canvas.getSize();
          this.canvas.addGeometricShape(selected.reduce((accumulator, current, index, array) => accumulator.connect(current, d.width, d.height)));
        } else {
          this.canvas.addGeometricShape(new Z4GeometricShapeSequence(selected));
        }
      }
    });
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
    this.drawDirection.setSelected(false);
    this.canvas.setDrawGeometricShapeDirection(false);
    this.geometricShapesPreview.setProperty("innerHTML", "");
  }
}
