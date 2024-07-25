/**
 * The panel to merge/connect geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4MergeConnectGeometricShapePanel extends JSPanel {

   delete = new JSCheckBox();

   selectedPanel = new JSPanel();

   containerPanel = new JSPanel();

   selectedGeometricShapes = new Array();

   listeners = new Array();

  static  PREVIEW_SIZE = 75;

  /**
   * Creates the object
   */
  constructor() {
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
   getSelectedGeometricShapes() {
    return this.selectedGeometricShapes;
  }

  /**
   * Returns if the merging shapes/paths have to be deleted
   *
   * @return true if the merging shapes/paths have to be deleted, false
   * otherwise
   */
   isDeleteSelectedShapesAndPaths() {
    return this.delete.isSelected();
  }

  /**
   * Sets the canvas
   *
   * @param canvas The canvas
   * @param onlyPaths true to show only paths, false otherwise (paths and shapes
   * will be shown)
   */
   setCanvas(canvas, onlyPaths) {
    let d = canvas.getSize();
    let ratio = d.width / d.height;
    let w = ratio > 1 ? Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE : Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE * ratio;
    let h = ratio > 1 ? Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE / ratio : Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE;
    let zoom = Math.min(w / d.width, h / d.height);
    for (let index = 0; index < canvas.getGeometricShapesCount(); index++) {
      let shape = canvas.getGeometricShapeAt(index);
      if (!onlyPaths || shape.isPath()) {
        let checkbox = new JSCheckBox();
        checkbox.addActionListener(event => this.onClick(checkbox, shape, w, h, zoom, onlyPaths));
        this.containerPanel.add(checkbox, new GBC((index % 4) * 4, parseInt(index / 4)));
        let preview = this.createPreview(w, h);
        preview.addEventListener("mousedown", event => {
          checkbox.setSelected(!checkbox.isSelected());
          this.onClick(checkbox, shape, w, h, zoom, onlyPaths);
        });
        this.drawShape(preview.invoke("getContext('2d')"), shape, zoom, onlyPaths);
        this.containerPanel.add(preview, new GBC((index % 4) * 4 + 1, parseInt(index / 4)).i(5, 0, 0, 5));
      }
    }
  }

   createPreview(w, h) {
    let preview = new JSComponent(document.createElement("canvas"));
    preview.setAttribute("width", "" + w);
    preview.setAttribute("height", "" + h);
    preview.getStyle().marginTop = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - h - 1) / 2 + "px";
    preview.getStyle().marginBottom = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - h - 1) / 2 + "px";
    preview.getStyle().marginLeft = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - w - 1) / 2 + "px";
    preview.getStyle().marginRight = (Z4MergeConnectGeometricShapePanel.PREVIEW_SIZE - w - 1) / 2 + "px";
    return preview;
  }

   drawShape(ctx, shape, zoom, withDirection) {
    let path2D = shape.getPath2D();
    ctx.save();
    ctx.lineWidth = 3 / zoom;
    ctx.scale(zoom, zoom);
    let dash = new Array();
    ctx.strokeStyle = Z4Constants.getStyle("green");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);
    dash.push(2.5, 2.5);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke(path2D);
    if (withDirection) {
      ctx.setLineDash(new Array());
      shape.getDirectionArrows().forEach(directionArrow => {
        ctx.fillStyle = Z4Constants.getStyle("white");
        ctx.fill(directionArrow);
        ctx.strokeStyle = Z4Constants.getStyle("green");
        ctx.stroke(directionArrow);
      });
    }
    ctx.restore();
  }

   onClick(checkbox, shape, w, h, zoom, withDirection) {
    if (checkbox.isSelected()) {
      this.selectedGeometricShapes.push(shape);
      let preview = this.createPreview(w, h);
      this.drawShape(preview.invoke("getContext('2d')"), shape, zoom, withDirection);
      this.selectedPanel.add(preview, null);
    } else {
      let indexOf = this.selectedGeometricShapes.indexOf(shape);
      this.selectedGeometricShapes.splice(indexOf, 1);
      document.querySelector(".z4mergeconnectgeometricshapepanel-selected canvas:nth-child(" + (indexOf + 1) + ")").remove();
    }
    this.onchange();
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
