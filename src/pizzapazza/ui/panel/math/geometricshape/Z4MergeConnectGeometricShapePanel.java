package pizzapazza.ui.panel.math.geometricshape;

import static def.dom.Globals.document;
import def.js.Array;
import javascript.awt.BoxLayout;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSCheckBox;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.math.geometricshape.Z4GeometricShape;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import simulation.dom.$CanvasRenderingContext2D;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.parseInt;
import simulation.js.$Path2D;

/**
 * The panel to merge/connect geometric shapes
 *
 * @author gianpiero.diblasi
 */
public class Z4MergeConnectGeometricShapePanel extends JSPanel {

  private final JSCheckBox delete = new JSCheckBox();
  private final JSPanel selectedPanel = new JSPanel();
  private final JSPanel containerPanel = new JSPanel();

  private final Array<Z4GeometricShape> selectedGeometricShapes = new Array<>();
  private final Array<ChangeListener> listeners = new Array<>();

  private final static int PREVIEW_SIZE = 75;

  /**
   * Creates the object
   */
  public Z4MergeConnectGeometricShapePanel() {
    super();
    this.cssAddClass("z4mergeconnectgeometricshapepanel");
    this.setLayout(new GridBagLayout());

    this.delete.setText(Z4Translations.DELETE_SELECTED_SHAPES_AND_PATHS_MESSAGE);
    this.add(this.delete, new GBC(0, 0).a(GBC.WEST));
    this.selectedPanel.cssAddClass("z4mergeconnectgeometricshapepanel-selected");
    this.selectedPanel.setLayout(new BoxLayout(this.selectedPanel, BoxLayout.X_AXIS));
    this.add(this.selectedPanel, new GBC(0, 1).i(0, 0, 2, 0));

    this.containerPanel.cssAddClass("z4mergeconnectgeometricshapepanel-container");
    this.containerPanel.setLayout(new GridBagLayout());
    this.add(this.containerPanel, new GBC(0, 2).f(GBC.HORIZONTAL));
  }

  /**
   * Returns the selected geometric shapes
   *
   * @return The selected geometric shapes
   */
  public Array<Z4GeometricShape> getSelectedGeometricShapes() {
    return this.selectedGeometricShapes;
  }

  /**
   * Returns if the merging shapes/paths have to be deleted
   *
   * @return true if the merging shapes/paths have to be deleted, false
   * otherwise
   */
  public boolean isDeleteSelectedShapesAndPaths() {
    return this.delete.isSelected();
  }

  /**
   * Sets the canvas
   *
   * @param canvas The canvas
   * @param onlyPaths true to show only paths, false otherwise (paths and shapes
   * will be shown)
   */
  public void setCanvas(Z4Canvas canvas, boolean onlyPaths) {
    Dimension d = canvas.getSize();
    double ratio = d.width / d.height;
    double w = ratio > 1 ? Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE : Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE * ratio;
    double h = ratio > 1 ? Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE / ratio : Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE;
    double zoom = Math.min(w / d.width, h / d.height);

    for (int index = 0; index < canvas.getGeometricShapesCount(); index++) {
      Z4GeometricShape shape = canvas.getGeometricShapeAt(index);
      if (!onlyPaths || shape.isPath()) {
        JSCheckBox checkbox = new JSCheckBox();
        checkbox.addActionListener(event -> this.onClick(checkbox, shape, w, h, zoom));

        this.containerPanel.add(checkbox, new GBC((index % 4) * 4, parseInt(index / 4)));
        JSComponent preview = this.createPreview(w, h);
        preview.addEventListener("mousedown", event -> {
          checkbox.setSelected(!checkbox.isSelected());
          this.onClick(checkbox, shape, w, h, zoom);
        });
        this.drawShape(preview.invoke("getContext('2d')"), shape, zoom);
        this.containerPanel.add(preview, new GBC((index % 4) * 4 + 1, parseInt(index / 4)).i(5, 0, 0, 5));
      }
    }
  }

  private JSComponent createPreview(double w, double h) {
    JSComponent preview = new JSComponent(document.createElement("canvas"));

    preview.setAttribute("width", "" + w);
    preview.setAttribute("height", "" + h);
    preview.getStyle().marginTop = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - h - 1) / 2 + "px";
    preview.getStyle().marginBottom = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - h - 1) / 2 + "px";
    preview.getStyle().marginLeft = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - w - 1) / 2 + "px";
    preview.getStyle().marginRight = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - w - 1) / 2 + "px";

    return preview;
  }

  void drawShape($CanvasRenderingContext2D ctx, Z4GeometricShape shape, double zoom) {
    $Path2D path2D = shape.getPath2D();

    ctx.save();

    ctx.lineWidth = 3 / zoom;
    ctx.scale(zoom, zoom);

    Array<Double> dash = new Array<>();

    ctx.strokeStyle = Z4Constants.$getStyle("green");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);

    dash.push(2.5, 2.5);

    ctx.strokeStyle = Z4Constants.$getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);

    ctx.restore();
  }

  private void onClick(JSCheckBox checkbox, Z4GeometricShape shape, double w, double h, double zoom) {
    if (checkbox.isSelected()) {
      this.selectedGeometricShapes.push(shape);

      JSComponent preview = this.createPreview(w, h);
      this.drawShape(preview.invoke("getContext('2d')"), shape, zoom);
      this.selectedPanel.add(preview, null);
    } else {
      int indexOf = this.selectedGeometricShapes.indexOf(shape);
      this.selectedGeometricShapes.splice(indexOf, 1);
      document.querySelector(".z4mergeconnectgeometricshapepanel-selected canvas:nth-child(" + (indexOf + 1) + ")").remove();
    }
    this.onchange();
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
