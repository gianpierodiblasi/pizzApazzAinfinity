/**
 * The panel to merge geometric shapes
 *
 * @author gianpiero.diblasi
 */
class Z4MergeGeometricShapePanel extends JSPanel {

   delete = new JSCheckBox();

   checkboxes = new Array();

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
    this.cssAddClass("z4mergegeometricshapepanel");
    this.setLayout(new GridBagLayout());
    this.selectedPanel.cssAddClass("z4mergegeometricshapepanel-selected");
    this.selectedPanel.setLayout(new BoxLayout(this.selectedPanel, BoxLayout.X_AXIS));
    this.add(this.selectedPanel, new GBC(0, 0).i(0, 0, 2, 0));
    this.containerPanel.cssAddClass("z4mergegeometricshapepanel-container");
    this.containerPanel.setLayout(new GridBagLayout());
    this.add(this.containerPanel, new GBC(0, 1).f(GBC.HORIZONTAL));
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
   * Sets the canvas
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    let d = canvas.getSize();
    let ratio = d.width / d.height;
    let w = ratio > 1 ? Z4MergeGeometricShapePanel.PREVIEW_SIZE : Z4MergeGeometricShapePanel.PREVIEW_SIZE * ratio;
    let h = ratio > 1 ? Z4MergeGeometricShapePanel.PREVIEW_SIZE / ratio : Z4MergeGeometricShapePanel.PREVIEW_SIZE;
    let zoom = Math.min(w / d.width, h / d.height);
    for (let index = 0; index < canvas.getGeometricShapesCount(); index++) {
      let shape = canvas.getGeometricShapeAt(index);
      let checkbox = new JSCheckBox();
      checkbox.addActionListener(event => this.onClick(checkbox, shape, w, h, zoom));
      this.containerPanel.add(checkbox, new GBC((index % 4) * 4, parseInt(index / 4)));
      let preview = this.createPreview(w, h);
      preview.addEventListener("mousedown", event => {
        checkbox.setSelected(!checkbox.isSelected());
        this.onClick(checkbox, shape, w, h, zoom);
      });
      this.drawShape(preview.invoke("getContext('2d')"), shape, zoom);
      this.containerPanel.add(preview, new GBC((index % 4) * 4 + 1, parseInt(index / 4)).i(5, 0, 0, 5));
    }
  }

   createPreview(w, h) {
    let preview = new JSComponent(document.createElement("canvas"));
    preview.setAttribute("width", "" + w);
    preview.setAttribute("height", "" + h);
    preview.getStyle().marginTop = (Z4MergeGeometricShapePanel.PREVIEW_SIZE - h - 1) / 2 + "px";
    preview.getStyle().marginBottom = (Z4MergeGeometricShapePanel.PREVIEW_SIZE - h - 1) / 2 + "px";
    preview.getStyle().marginLeft = (Z4MergeGeometricShapePanel.PREVIEW_SIZE - w - 1) / 2 + "px";
    preview.getStyle().marginRight = (Z4MergeGeometricShapePanel.PREVIEW_SIZE - w - 1) / 2 + "px";
    return preview;
  }

   drawShape(ctx, shape, zoom) {
    let path2D = shape.getPolyline().getPath2D();
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
    ctx.restore();
  }

   onClick(checkbox, shape, w, h, zoom) {
    if (checkbox.isSelected()) {
      this.selectedGeometricShapes.push(shape);
      let preview = this.createPreview(w, h);
      this.drawShape(preview.invoke("getContext('2d')"), shape, zoom);
      this.selectedPanel.add(preview, null);
    } else {
      let indexOf = this.selectedGeometricShapes.indexOf(shape);
      this.selectedGeometricShapes.splice(indexOf, 1);
      document.querySelector(".z4mergegeometricshapepanel-selected canvas:nth-child(" + (indexOf + 1) + ")").remove();
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
