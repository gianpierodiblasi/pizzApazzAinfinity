/**
 * The panel to merge geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4MergeGeometricShapePanel extends JSPanel {

   checkboxes = new Array();

   geometricShapes = new Array();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4mergegeometricshapepanel");
    this.setLayout(new GridBagLayout());
  }

  /**
   * Returns the selected geometric shapes
   *
   * @return The selected geometric shapes
   */
   getSelectedGeometricShapes() {
    return this.geometricShapes;
  }

  /**
   * Sets the canvas
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    for (let index = 0; index < canvas.getGeometricShapesCount(); index++) {
      let shape = canvas.getGeometricShapeAt(index);
      let checkbox = new JSCheckBox();
      checkbox.addActionListener(event => {
        if (checkbox.isSelected()) {
          this.geometricShapes.push(shape);
        } else {
          this.geometricShapes.splice(this.geometricShapes.indexOf(shape), 1);
        }
        this.onchange();
      });
      this.add(checkbox, new GBC(0, index + 1).a(GBC.WEST));
      let preview = new JSComponent(document.createElement("canvas"));
      let ctx = preview.invoke("getContext('2d')");
    }
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }
}
