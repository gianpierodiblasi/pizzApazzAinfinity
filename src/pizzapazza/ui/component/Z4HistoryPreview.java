package pizzapazza.ui.component;

import static def.dom.Globals.document;
import def.dom.URL;
import def.js.Array;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSPanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonHistoryPanel;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$DOMRect;
import simulation.dom.$Image;
import simulation.js.$Object;

/**
 * The history preview
 *
 * @author gianpiero.diblasi
 */
public class Z4HistoryPreview extends JSComponent {
  
  private final JSPanel summary = new JSPanel();
  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final JSComponent previewBig = new JSComponent(document.createElement("canvas"));
  
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
  private final $CanvasRenderingContext2D ctxBig = this.previewBig.invoke("getContext('2d')");
  
  private Z4RibbonHistoryPanel ribbonHistoryPanel;
  private Z4Canvas canvas;
  
  private int key;
  private $Object json;
  private double zoom = 1;
  private double zoomBig = 1;
  private final static int PREVIEW_SIZE = 50;
  private final static int PREVIEW_BIG_SIZE = 500;

  /**
   * The text content for the selected button
   */
  public final static String SELECTED_HISTORY_CONTENT = "\u2611";

  /**
   * The text content for the unselected button
   */
  public final static String UNSELECTED_HISTORY_CONTENT = "\u2610";

  /**
   * Creates the object
   */
  @SuppressWarnings("StringEquality")
  public Z4HistoryPreview() {
    super(document.createElement("details"));
    
    this.cssAddClass("z4historypreview");
    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
        this.getChilStyleByQuery(".z4historypreview-editor").visibility = "visible";
        
        $DOMRect rect = this.invokeInTree(".z4historypreview-editor", "getBoundingClientRect()");
        $DOMRect rectSummary = this.invokeInTree("summary", "getBoundingClientRect()");
        
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
    
    JSButton selector = new JSButton();
    selector.setText(Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
    selector.cssAddClass("z4historypreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event -> {
      this.ribbonHistoryPanel.setCurrentKey(this.key);
//      this.canvas.
    });
    this.summary.add(selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));
    
    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);
    
    this.previewBig.setAttribute("width", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    this.previewBig.setAttribute("height", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    
    JSPanel panel = new JSPanel();
    panel.cssAddClass("z4historypreview-editor");
    panel.add(this.previewBig, null);
    this.appendChild(panel);
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
  public void setRibbonHistoryPanel(Z4RibbonHistoryPanel ribbonHistoryPanel) {
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the history
   *
   * @param key The history key
   * @param json The history json
   * @param canvas The canvas
   */
  public void setHistory(int key, $Object json, Z4Canvas canvas) {
    this.key = key;
    this.json = json;
    this.cssAddClass("z4historypreview-" + key);
    
    Dimension d = new Dimension(json.$get("width"), json.$get("height"));
    this.zoom = this.setSize(this.preview, d, Z4HistoryPreview.PREVIEW_SIZE);
    this.zoomBig = this.setSize(this.previewBig, d, Z4HistoryPreview.PREVIEW_BIG_SIZE);
    
    this.drawHistory(this.ctx, this.zoom);
    this.drawHistory(this.ctxBig, this.zoomBig);
  }
  
  private double setSize(JSComponent component, Dimension d, int SIZE) {
    double ratio = d.width / d.height;
    
    double w;
    double h;
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
  
  @SuppressWarnings("unchecked")
  private void drawHistory($CanvasRenderingContext2D ctx, double zoom) {
    ctx.scale(zoom, zoom);
    this.drawLayer(ctx, this.json.$get("layers"), 0);
  }
  
  private void drawLayer($CanvasRenderingContext2D ctx, Array<$Object> layers, int index) {
    $Object layer = layers.$get(index);
    if (!(Boolean) layer.$get("hidden")) {
      $Image image = ($Image) document.createElement("img");
      image.onload = event -> {
        ctx.save();
        ctx.globalAlpha = layer.$get("opacity");
        ctx.globalCompositeOperation = layer.$get("compositeOperation");
        ctx.drawImage(image, layer.$get("offsetX"), layer.$get("offsetY"));
        ctx.restore();
        
        if (index < layers.length - 1) {
          this.drawLayer(ctx, layers, index + 1);
        }
        return null;
      };
      image.src = URL.createObjectURL(layer.$get("data"));
    } else if (index < layers.length - 1) {
      this.drawLayer(ctx, layers, index + 1);
    }
  }
}
