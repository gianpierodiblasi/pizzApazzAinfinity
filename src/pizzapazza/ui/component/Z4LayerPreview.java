package pizzapazza.ui.component;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import static def.js.Globals.parseFloat;
import javascript.awt.BorderLayout;
import javascript.awt.Dimension;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSTextField;
import jsweet.util.union.Union4;
import pizzapazza.Z4Layer;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$DOMRect;
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
  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
  private Union4<String, CanvasGradient, CanvasPattern, Object> chessboard;
  
  private final JSPanel editor = new JSPanel();
  private final JSTextField editName = new JSTextField();
  
  private Z4Canvas canvas;
  private Z4Layer layer;
  private double zoom = 1;
  
  private final static int PREVIEW_SIZE = 50;
  
  @SuppressWarnings("StringEquality")
  public Z4LayerPreview() {
    super(document.createElement("details"));
    
    this.cssAddClass("z4layerpreview");
    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
        this.getChilStyleByQuery(".z4layerpreview-editor").visibility = "visible";
        
        $DOMRect rect = this.invokeInTree(".z4layerpreview-editor", "getBoundingClientRect()");
        $DOMRect rectSummary = this.invokeInTree("summary", "getBoundingClientRect()");
        
        if (rectSummary.left + rect.width < document.body.scrollWidth) {
          this.getChilStyleByQuery(".z4layerpreview-editor").left = rectSummary.left + "px";
        } else if (rectSummary.right - rect.width > 0) {
          this.getChilStyleByQuery(".z4layerpreview-editor").left = (rectSummary.right - rect.width) + "px";
        } else {
          this.getChilStyleByQuery(".z4layerpreview-editor").left = "auto";
          this.getChilStyleByQuery(".z4layerpreview-editor").right = "5px";
        }
        
        if (rectSummary.bottom + rect.height < document.body.scrollHeight) {
          this.getChilStyleByQuery(".z4layerpreview-editor").top = rectSummary.bottom + "px";
        } else if (rectSummary.top - rect.height > 0) {
          this.getChilStyleByQuery(".z4layerpreview-editor").top = "calc(" + (rectSummary.top - rect.height) + "px - 1rem)";
        } else {
          this.getChilStyleByQuery(".z4layerpreview-editor").top = "auto";
          this.getChilStyleByQuery(".z4layerpreview-editor").bottom = "5px";
        }
      } else {
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("visibility");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("top");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("bottom");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("left");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("right");
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
    
    this.preview.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
    
    this.summary.setLayout(new BorderLayout(0, 0));
    this.summary.add(this.name, BorderLayout.NORTH);
    this.summary.add(this.preview, BorderLayout.CENTER);
    
    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);
    
    this.editor.cssAddClass("z4layerpreview-editor");
    this.editor.setLayout(new GridBagLayout());
    
    this.editName.addActionListener(event -> {
      String newName = this.editName.getText();
      if ($exists(newName)) {
        this.canvas.setSaved(false);
        this.name.setText(newName);
        this.layer.setName(newName);
      }
    });
    
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = 0;
    constraints.gridy = 0;
    constraints.gridwidth = 2;
    constraints.fill = GridBagConstraints.HORIZONTAL;
    this.editor.add(this.editName, constraints);
    
    this.appendChild(this.editor);
  }

  /**
   * Sets the layer
   *
   * @param canvas The canvas
   * @param layer The layer
   */
  public void setLayer(Z4Canvas canvas, Z4Layer layer) {
    this.canvas = canvas;
    this.layer = layer;
    this.name.setText(this.layer.getName());
    this.editName.setText(this.layer.getName());
    this.setChildAttributeByQuery("summary", "title", this.layer.getName());
    
    Dimension d = layer.getSize();
    double ratio = d.width / d.height;
    double w;
    double h;
    if (ratio > 1) {
      w = Z4LayerPreview.PREVIEW_SIZE;
      h = Z4LayerPreview.PREVIEW_SIZE / ratio;
    } else {
      w = Z4LayerPreview.PREVIEW_SIZE * ratio;
      h = Z4LayerPreview.PREVIEW_SIZE;
    }
    this.zoom = Math.min(w / d.width, h / d.height);
    
    this.preview.setAttribute("width", "" + w);
    this.preview.setAttribute("height", "" + h);
    this.preview.getStyle().marginTop = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginBottom = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginLeft = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    this.preview.getStyle().marginRight = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    
    this.drawLayer();
  }
  
  private void drawLayer() {
    this.ctx.save();
    this.ctx.fillStyle = this.chessboard;
    this.ctx.fillRect(0, 0, parseFloat(this.preview.getAttribute("width")), parseFloat(this.preview.getAttribute("height")));
    this.ctx.restore();
    
    if ($exists(this.layer)) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx, true);
      this.ctx.restore();
    }
  }
}
