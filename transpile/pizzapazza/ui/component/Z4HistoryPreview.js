/**
 * The history preview
 *
 * @author gianpiero.diblasi
 */
class Z4HistoryPreview extends JSComponent {

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
    super(document.createElement("details"));
    this.cssAddClass("z4historypreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.getChilStyleByQuery(".z4historypreview-editor").visibility = "visible";
        let rect = this.invokeInTree(".z4historypreview-editor", "getBoundingClientRect()");
        let rectSummary = this.invokeInTree("summary", "getBoundingClientRect()");
        if (rectSummary.left + rect.width < document.body.scrollWidth) {
          this.getChilStyleByQuery(".z4historypreview-editor").left = rectSummary.left + "px";
        } else if (rectSummary.right - rect.width > 0) {
          this.getChilStyleByQuery(".z4historypreview-editor").left = (rectSummary.right - rect.width) + "px";
        } else {
          this.getChilStyleByQuery(".z4historypreview-editor").left = "auto";
          this.getChilStyleByQuery(".z4historypreview-editor").right = "5px";
        }
        if (rectSummary.bottom + rect.height < document.body.scrollHeight) {
          this.getChilStyleByQuery(".z4historypreview-editor").top = rectSummary.bottom + "px";
        } else if (rectSummary.top - rect.height > 0) {
          this.getChilStyleByQuery(".z4historypreview-editor").top = "calc(" + (rectSummary.top - rect.height) + "px - 1rem)";
        } else {
          this.getChilStyleByQuery(".z4historypreview-editor").top = "auto";
          this.getChilStyleByQuery(".z4historypreview-editor").bottom = "5px";
        }
      } else {
        this.getChilStyleByQuery(".z4historypreview-editor").removeProperty("visibility");
        this.getChilStyleByQuery(".z4historypreview-editor").removeProperty("top");
        this.getChilStyleByQuery(".z4historypreview-editor").removeProperty("bottom");
        this.getChilStyleByQuery(".z4historypreview-editor").removeProperty("left");
        this.getChilStyleByQuery(".z4historypreview-editor").removeProperty("right");
      }
    });
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
      // this.canvas.
    });
    this.summary.add(selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendNodeChild(document.createElement("summary"));
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
