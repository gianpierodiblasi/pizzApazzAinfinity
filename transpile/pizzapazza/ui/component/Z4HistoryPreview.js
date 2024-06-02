/**
 * The history preview
 *
 * @author gianpiero.diblasi
 */
class Z4HistoryPreview extends JSComponent {

   summary = new JSPanel();

   selector = new JSButton();

   canvas = new JSComponent(document.createElement("canvas"));

   canvasBig = new JSComponent(document.createElement("canvas"));

   ctx = this.canvas.invoke("getContext('2d')");

   ctxBig = this.canvasBig.invoke("getContext('2d')");

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
    this.canvas.setAttribute("width", "" + Z4HistoryPreview.PREVIEW_SIZE);
    this.canvas.setAttribute("height", "" + Z4HistoryPreview.PREVIEW_SIZE);
    this.summary.add(this.canvas, new GBC(0, 0));
    this.selector.setText(Z4HistoryPreview.SELECTED_HISTORY_CONTENT);
    this.selector.cssAddClass("z4historypreview-selector");
    this.selector.getStyle().color = "var(--main-action-bgcolor)";
    this.selector.setContentAreaFilled(false);
    this.selector.addActionListener(event => {
      document.querySelectorAll(".z4historypreview .z4historypreview-selector").forEach(element => element.textContent = Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
      this.selector.setText(Z4HistoryPreview.SELECTED_HISTORY_CONTENT);
    });
    this.summary.add(this.selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);
    this.canvasBig.setAttribute("width", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    this.canvasBig.setAttribute("height", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    let panel = new JSPanel();
    panel.cssAddClass("z4historypreview-editor");
    panel.add(this.canvasBig, null);
    this.appendChild(panel);
  }

  /**
   * Sets the history
   *
   * @param key The history key
   * @param json The history json
   * @param selected true if this is the selected history, false otherwise
   */
   setHistory(key, json, selected) {
    this.key = key;
    this.json = json;
    this.selector.setText(selected ? Z4HistoryPreview.SELECTED_HISTORY_CONTENT : Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
    let d = new Dimension(json["width"], json["height"]);
    this.zoom = this.setSize(this.canvas, d, Z4HistoryPreview.PREVIEW_SIZE);
    this.zoomBig = this.setSize(this.canvasBig, d, Z4HistoryPreview.PREVIEW_BIG_SIZE);
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
