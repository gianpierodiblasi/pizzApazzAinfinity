/**
 * The drawing tool preview
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingToolPreview extends JSDropDown {

   summary = new JSPanel();

   name = new JSLabel();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   editor = new Z4DrawingToolPanel();

   ribbonDrawingToolPanel = null;

   canvas = null;

   drawingTool = null;

   oldDrawingTool = null;

   changed = false;

  /**
   * The text content for the selected button
   */
  static  SELECTED_DRAWING_TOOL_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_DRAWING_TOOL_CONTENT = "-";

  static  PREVIEW_SIZE = 48;

  constructor() {
    super(".z4drawingtoolpreview-editor");
    this.cssAddClass("z4drawingtoolpreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.changed = false;
        this.oldDrawingTool = this.drawingTool;
      } else if (this.changed) {
        this.canvas.setChanged(true);
        this.canvas.replaceDrawingTool(this.oldDrawingTool, this.drawingTool);
      }
    });
    this.name.getStyle().width = (Z4DrawingToolPreview.PREVIEW_SIZE + 15) + "px";
    this.preview.setAttribute("width", "" + Z4DrawingToolPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4DrawingToolPreview.PREVIEW_SIZE);
    this.summary.setLayout(new GridBagLayout());
    this.summary.add(this.name, new GBC(0, 0).w(2));
    this.summary.add(this.preview, new GBC(0, 1));
    let selector = new JSButton();
    selector.setText(Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4drawingtoolpreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event => {
      document.querySelectorAll(".z4drawingtoolpreview .z4drawingtoolpreview-selector").forEach(element => element.textContent = Z4DrawingToolPreview.UNSELECTED_DRAWING_TOOL_CONTENT);
      selector.setText(Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT);
      this.canvas.setSelectedDrawingTool(this.drawingTool);
    });
    this.summary.add(selector, new GBC(1, 1).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendChildInTree("summary", this.summary);
    this.editor.cssAddClass("z4drawingtoolpreview-editor");
    this.editor.addChangeListener(event => {
      this.changed = true;
      this.drawingTool = this.editor.getValue();
      this.name.setText(this.drawingTool.getName());
      this.setChildAttributeByQuery("summary", "title", this.drawingTool.getName());
      this.computePopupPosition();
      this.drawDemo();
    });
    this.appendChild(this.editor);
    // button = new JSButton();
    // button.setText(Z4Translations.DUPLICATE);
    // button.addActionListener(event -> {
    // this.changed = true;
    // this.canvas.duplicateLayer(this.drawingtool);
    // this.removeAttribute("open");
    // });
    // panelBasic.add(button, new GBC(0, 6).a(GBC.SOUTHWEST));
    // 
    // this.delete.setText(Z4Translations.DELETE);
    // this.delete.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_LAYER_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
    // if (response == JSOptionPane.YES_OPTION) {
    // this.changed = true;
    // int index = this.canvas.deleteLayer(this.drawingtool);
    // document.querySelector(".z4drawingtoolpreview:nth-child(" + (index + 1) + ")").remove();
    // }
    // }));
  }

  /**
   * Sets the riboon drawing tool panel
   *
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   */
   setRibbonDrawingToolPanel(ribbonDrawingToolPanel) {
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
  }

  /**
   * Sets the drawing tool
   *
   * @param canvas The canvas
   * @param drawingTool The drawing tool
   */
   setDrawingTool(canvas, drawingTool) {
    this.canvas = canvas;
    this.drawingTool = drawingTool;
    this.name.setText(this.drawingTool.getName());
    this.editor.setValue(this.drawingTool);
    this.setChildAttributeByQuery("summary", "title", this.drawingTool.getName());
    this.drawDemo();
  }

  /**
   * Draws the demo of the drawing tool
   */
   drawDemo() {
    if (this.drawingTool) {
      this.ctx.clearRect(0, 0, Z4DrawingToolPreview.PREVIEW_SIZE, Z4DrawingToolPreview.PREVIEW_SIZE);
      this.ctx.save();
      this.ctx.scale(0.1, 0.1);
      this.drawingTool.getPointIterator().drawDemo(this.ctx, this.drawingTool.getPainter(), this.drawingTool.getSpatioTemporalColor(), this.drawingTool.getProgression(), Z4DrawingToolPreview.PREVIEW_SIZE * 10, Z4DrawingToolPreview.PREVIEW_SIZE * 10);
      this.ctx.restore();
    }
  }
}
