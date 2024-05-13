package pizzapazza.ui.component;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import static def.dom.Globals.parseInt;
import javascript.awt.BorderLayout;
import javascript.awt.Dimension;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import jsweet.util.union.Union4;
import pizzapazza.Z4Layer;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$Image;
import static simulation.js.$Globals.$exists;

/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
public class Z4LayerPreview extends JSComponent {

  private JSPanel summary = new JSPanel();
  private JSLabel name = new JSLabel();
  private final JSComponent canvas = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.canvas.invoke("getContext('2d')");
  private Union4<String, CanvasGradient, CanvasPattern, Object> chessboard;

  private Z4Layer layer;
  private double zoom = 1;

  private final static int PREVIEW_SIZE = 50;

  @SuppressWarnings("StringEquality")
  public Z4LayerPreview() {
    super(document.createElement("details"));

    this.cssAddClass("z4layerpreview");
    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
//        this.getChilStyleByQuery(".jscolorpanel").visibility = "visible";
//
//        $DOMRect rect = this.invokeInTree(".jscolorpanel", "getBoundingClientRect()");
//        $DOMRect rectSummary = this.invokeInTree("summary", "getBoundingClientRect()");
//
//        if (rectSummary.left + rect.width < document.body.scrollWidth) {
//          this.getChilStyleByQuery(".jscolorpanel").left = rectSummary.left + "px";
//        } else if (rectSummary.right - rect.width > 0) {
//          this.getChilStyleByQuery(".jscolorpanel").left = (rectSummary.right - rect.width) + "px";
//        } else {
//          this.getChilStyleByQuery(".jscolorpanel").left = "auto";
//          this.getChilStyleByQuery(".jscolorpanel").right = "5px";
//        }
//
//        if (rectSummary.bottom + rect.height < document.body.scrollHeight) {
//          this.getChilStyleByQuery(".jscolorpanel").top = rectSummary.bottom + "px";
//        } else if (rectSummary.top - rect.height > 0) {
//          this.getChilStyleByQuery(".jscolorpanel").top = "calc(" + (rectSummary.top - rect.height) + "px - 1rem)";
//        } else {
//          this.getChilStyleByQuery(".jscolorpanel").top = "auto";
//          this.getChilStyleByQuery(".jscolorpanel").bottom = "5px";
//        }
      } else {
//        this.getChilStyleByQuery(".jscolorpanel").removeProperty("visibility");
//        this.getChilStyleByQuery(".jscolorpanel").removeProperty("top");
//        this.getChilStyleByQuery(".jscolorpanel").removeProperty("bottom");
//        this.getChilStyleByQuery(".jscolorpanel").removeProperty("left");
//        this.getChilStyleByQuery(".jscolorpanel").removeProperty("right");
      }
    });

    $Image image = ($Image) document.createElement("img");
    image.onload = event -> {
      this.chessboard = this.ctx.createPattern(image, "repeat");
      this.drawLayer();
      return null;
    };
    image.src = "image/chessboard.png";

    this.name.getStyle().width = Z4LayerPreview.PREVIEW_SIZE + "px";

    this.canvas.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.canvas.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.canvas.getStyle().width = Z4LayerPreview.PREVIEW_SIZE + "px";
    this.canvas.getStyle().height = Z4LayerPreview.PREVIEW_SIZE + "px";

    this.summary.setLayout(new BorderLayout(0, 0));
    this.summary.add(this.name, BorderLayout.NORTH);
    this.summary.add(this.canvas, BorderLayout.CENTER);

    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);
  }

  public void setLayer(Z4Layer layer) {
    this.layer = layer;
    this.name.setText(this.layer.getName());

    Dimension d = layer.getSize();
    double ratio = d.width / d.height;
    if (ratio > 1) {
      this.canvas.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
      this.canvas.setAttribute("height", "" + (Z4LayerPreview.PREVIEW_SIZE / ratio));
      this.zoom = Math.min(Z4LayerPreview.PREVIEW_SIZE / d.width, Z4LayerPreview.PREVIEW_SIZE / ratio / d.height);
    } else {
      this.canvas.setAttribute("width", "" + (Z4LayerPreview.PREVIEW_SIZE / ratio));
      this.canvas.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
      this.zoom = Math.min(Z4LayerPreview.PREVIEW_SIZE / ratio / d.width, Z4LayerPreview.PREVIEW_SIZE / d.height);
    }

    this.drawLayer();
  }

  private void drawLayer() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, parseInt(this.canvas.getAttribute("width")), parseInt(this.canvas.getAttribute("height")));
    this.ctx.restore();

    if ($exists(this.layer)) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx);
      this.ctx.restore();
    }
  }
}
