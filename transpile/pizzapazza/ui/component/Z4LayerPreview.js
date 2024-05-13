/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
class Z4LayerPreview extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   chessboard = null;

   layer = null;

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
  }

   setLayer(layer) {
    this.layer = layer;
    this.drawLayer();
  }

   drawLayer() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    if (this.layer) {
      this.ctx.save();
      // this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx);
      this.ctx.restore();
    }
  }
}
