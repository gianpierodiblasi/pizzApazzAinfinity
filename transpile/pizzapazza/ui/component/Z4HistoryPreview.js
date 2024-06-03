/**
 * The history preview
 *
 * @author gianpiero.diblasi
 */
class Z4HistoryPreview extends JSDropDown {

   summary = new JSPanel();

   preview = new JSComponent(document.createElement("canvas"));

   previewBig = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   ctxBig = this.previewBig.invoke("getContext('2d')");

   ribbonHistoryPanel = null;

   canvas = null;

   key = 0;

   json = null;

   zoom = 1;

   zoomBig = 1;

  static  PREVIEW_SIZE = 50;

  static  PREVIEW_BIG_SIZE = 500;

  /**
   * The text content for the selected button
   */
  static  SELECTED_HISTORY_CONTENT = "\u2611";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_HISTORY_CONTENT = "\u2610";

  /**
   * Creates the object
   */
  constructor() {
    super(".z4historypreview-editor");
    this.cssAddClass("z4historypreview");
    this.summary.setLayout(new GridBagLayout());
    this.preview.setAttribute("width", "" + Z4HistoryPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4HistoryPreview.PREVIEW_SIZE);
    this.summary.add(this.preview, new GBC(0, 0));
    let selector = new JSButton();
    selector.setText(Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
    selector.cssAddClass("z4historypreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event => {
      this.ribbonHistoryPanel.setCurrentKey(this.key);
      this.canvas.openFromHistory(this.json);
    });
    this.summary.add(selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendChildInTree("summary", this.summary);
    this.previewBig.setAttribute("width", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    this.previewBig.setAttribute("height", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    let panel = new JSPanel();
    panel.cssAddClass("z4historypreview-editor");
    panel.add(this.previewBig, null);
    this.appendChild(panel);
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonHistoryPanel(ribbonHistoryPanel) {
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the history
   *
   * @param key The history key
   * @param json The history json
   * @param canvas The canvas
   */
   setHistory(key, json, canvas) {
    this.key = key;
    this.json = json;
    this.canvas = canvas;
    this.cssAddClass("z4historypreview-" + key);
    let d = new Dimension(json["width"], json["height"]);
    this.zoom = this.setSize(this.preview, d, Z4HistoryPreview.PREVIEW_SIZE);
    this.zoomBig = this.setSize(this.previewBig, d, Z4HistoryPreview.PREVIEW_BIG_SIZE);
    this.drawHistory(this.ctx, this.zoom);
    this.drawHistory(this.ctxBig, this.zoomBig);
  }

   setSize(component, d, SIZE) {
    let ratio = d.width / d.height;
    let w = 0.0;
    let h = 0.0;
    if (ratio > 1) {
      w = SIZE;
      h = SIZE / ratio;
    } else {
      w = SIZE * ratio;
      h = SIZE;
    }
    component.setAttribute("width", "" + w);
    component.setAttribute("height", "" + h);
    component.getStyle().marginTop = (SIZE - h - 1) / 2 + "px";
    component.getStyle().marginBottom = (SIZE - h - 1) / 2 + "px";
    component.getStyle().marginLeft = (SIZE - w - 1) / 2 + "px";
    component.getStyle().marginRight = (SIZE - w - 1) / 2 + "px";
    return Math.min(w / d.width, h / d.height);
  }

   drawHistory(ctx, zoom) {
    ctx.scale(zoom, zoom);
    this.drawLayer(ctx, this.json["layers"], 0);
  }

   drawLayer(ctx, layers, index) {
    let layer = layers[index];
    if (!layer["hidden"]) {
      let image = document.createElement("img");
      image.onload = event => {
        ctx.save();
        ctx.globalAlpha = layer["opacity"];
        ctx.globalCompositeOperation = layer["compositeOperation"];
        ctx.drawImage(image, layer["offsetX"], layer["offsetY"]);
        ctx.restore();
        if (index < layers.length - 1) {
          this.drawLayer(ctx, layers, index + 1);
        }
        return null;
      };
      image.src = URL.createObjectURL(layer["data"]);
    } else if (index < layers.length - 1) {
      this.drawLayer(ctx, layers, index + 1);
    }
  }
}
