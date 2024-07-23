package pizzapazza.ui.panel.math.geometricshape;

import def.js.Array;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.math.geometricshape.Z4GeometricShape;
import pizzapazza.ui.component.Z4Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;

/**
 * The panel to merge geometric shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4MergeGeometricShapePanel extends JSPanel {

  private final Array<JSCheckBox> checkboxes = new Array<>();
  private final Array<Z4GeometricShape> geometricShapes = new Array<>();
  private final Array<ChangeListener> listeners = new Array<>();

  /**
   * Creates the object
   */
  public Z4MergeGeometricShapePanel() {
    super();
    this.cssAddClass("z4mergegeometricshapepanel");
    this.setLayout(new GridBagLayout());
  }

  /**
   * Returns the selected geometric shapes
   *
   * @return The selected geometric shapes
   */
  public Array<Z4GeometricShape> getSelectedGeometricShapes() {
    return this.geometricShapes;
  }

  /**
   * Sets the canvas
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    for (int index = 0; index < canvas.getGeometricShapesCount(); index++) {
      Z4GeometricShape shape = canvas.getGeometricShapeAt(index);

      JSCheckBox checkbox = new JSCheckBox();
      checkbox.addActionListener(event -> {
        if (checkbox.isSelected()) {
          this.geometricShapes.push(shape);
        } else {
          this.geometricShapes.splice(this.geometricShapes.indexOf(shape), 1);
        }
        this.onchange();
      });
      this.add(checkbox, new GBC(0, index + 1).a(GBC.WEST));

      JSComponent preview = new JSComponent(document.createElement("canvas"));
      $CanvasRenderingContext2D ctx = preview.invoke("getContext('2d')");
    }
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

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }
}
