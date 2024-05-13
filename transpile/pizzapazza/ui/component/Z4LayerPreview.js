/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
class Z4LayerPreview extends JSComponent {

   summary = new JSPanel();

   name = new JSLabel();

   canvas = new JSComponent(document.createElement("canvas"));

   ctx = this.canvas.invoke("getContext('2d')");

   chessboard = null;

   layer = null;

   zoom = 1;

  static  PREVIEW_SIZE = 50;

  constructor() {
    super(document.createElement("details"));
    this.cssAddClass("z4layerpreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        // this.getChilStyleByQuery(".jscolorpanel").visibility = "visible";
        // 
        // $DOMRect rect = this.invokeInTree(".jscolorpanel", "getBoundingClientRect()");
        // $DOMRect rectSummary = this.invokeInTree("summary", "getBoundingClientRect()");
        // 
        // if (rectSummary.left + rect.width < document.body.scrollWidth) {
        // this.getChilStyleByQuery(".jscolorpanel").left = rectSummary.left + "px";
        // } else if (rectSummary.right - rect.width > 0) {
        // this.getChilStyleByQuery(".jscolorpanel").left = (rectSummary.right - rect.width) + "px";
        // } else {
        // this.getChilStyleByQuery(".jscolorpanel").left = "auto";
        // this.getChilStyleByQuery(".jscolorpanel").right = "5px";
        // }
        // 
        // if (rectSummary.bottom + rect.height < document.body.scrollHeight) {
        // this.getChilStyleByQuery(".jscolorpanel").top = rectSummary.bottom + "px";
        // } else if (rectSummary.top - rect.height > 0) {
        // this.getChilStyleByQuery(".jscolorpanel").top = "calc(" + (rectSummary.top - rect.height) + "px - 1rem)";
        // } else {
        // this.getChilStyleByQuery(".jscolorpanel").top = "auto";
        // this.getChilStyleByQuery(".jscolorpanel").bottom = "5px";
        // }
      } else {
        // this.getChilStyleByQuery(".jscolorpanel").removeProperty("visibility");
        // this.getChilStyleByQuery(".jscolorpanel").removeProperty("top");
        // this.getChilStyleByQuery(".jscolorpanel").removeProperty("bottom");
        // this.getChilStyleByQuery(".jscolorpanel").removeProperty("left");
        // this.getChilStyleByQuery(".jscolorpanel").removeProperty("right");
      }
    });
    let image = document.createElement("img");
    image.onload = event => {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawLayer();
      return null;
    };
    image.src = "image/chessboard.png";
    this.name.getStyle().width = Z4LayerPreview.PREVIEW_SIZE + "px";
    this.canvas.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.canvas.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.summary.setLayout(new BorderLayout(0, 0));
    this.summary.add(this.name, BorderLayout.NORTH);
    this.summary.add(this.canvas, BorderLayout.CENTER);
    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);
  }

  /**
   * Sets the layer
   * @param layer The layer
   */
   setLayer(layer) {
    this.layer = layer;
    this.name.setText(this.layer.getName());
    this.setChildAttributeByQuery("summary", "title", this.layer.getName());
    let d = layer.getSize();
    let ratio = d.width / d.height;
    let w = 0.0;
    let h = 0.0;
    if (ratio > 1) {
      w = Z4LayerPreview.PREVIEW_SIZE;
      h = Z4LayerPreview.PREVIEW_SIZE / ratio;
    } else {
      w = Z4LayerPreview.PREVIEW_SIZE * ratio;
      h = Z4LayerPreview.PREVIEW_SIZE;
    }
    this.zoom = Math.min(w / d.width, h / d.height);
    this.canvas.setAttribute("width", "" + w);
    this.canvas.setAttribute("height", "" + h);
    this.canvas.getStyle().marginTop = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.canvas.getStyle().marginBottom = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.canvas.getStyle().marginLeft = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    this.canvas.getStyle().marginRight = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    this.drawLayer();
  }

   drawLayer() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, parseFloat(this.canvas.getAttribute("width")), parseFloat(this.canvas.getAttribute("height")));
    this.ctx.restore();
    if (this.layer) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx, true);
      this.ctx.restore();
    }
  }
}
