package pizzapazza.ui.component;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import static def.dom.Globals.document;
import static def.js.Globals.parseFloat;
import javascript.awt.BorderLayout;
import javascript.awt.Dimension;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.Point;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.JSTextField;
import javascript.swing.SpinnerNumberModel;
import jsweet.util.union.Union4;
import pizzapazza.Z4Layer;
import pizzapazza.util.Z4Translations;
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

  private final JSSlider offsetXSlider = new JSSlider();
  private final JSSpinner offsetXSpinner = new JSSpinner();
  private final JSSlider offsetYSlider = new JSSlider();
  private final JSSpinner offsetYSpinner = new JSSpinner();

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

    this.addComponent(this.editName, 0, 0, 2, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, new Insets(0, 0, 5, 0));
    this.addLabel(Z4Translations.OFFSET_X, 0, 1, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    this.offsetXSpinner.getStyle().minWidth = "4rem";
    this.offsetXSpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.offsetXSpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.offsetXSpinner.addChangeListener(event -> this.onChange(true, this.offsetXSpinner, this.offsetXSlider));
    this.addComponent(this.offsetXSpinner, 1, 1, 1, 1, GridBagConstraints.EAST, GridBagConstraints.NONE, null);

    this.offsetXSlider.addChangeListener(event -> this.onChange(false, this.offsetXSpinner, this.offsetXSlider));
    this.offsetXSlider.getStyle().minWidth = "25rem";
    this.addComponent(this.offsetXSlider, 0, 2, 2, 1, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, null);
    this.appendChild(this.editor);
  }

  private void addLabel(String text, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill) {
    JSLabel label = new JSLabel();
    label.setText(text);
    this.addComponent(label, gridx, gridy, gridwidth, gridheight, anchor, fill, null);
  }

  private void addComponent(JSComponent component, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    this.editor.add(component, constraints);
  }

  private void onChange(boolean spTosl, JSSpinner spinner, JSSlider slider) {
    this.canvas.setSaved(false);

    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    this.layer.move(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    this.canvas.drawCanvas();
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

    Point p = layer.getOffset();
    Dimension dC = this.canvas.getSize();
    this.offsetXSlider.setMinimum(-d.width);
    this.offsetXSlider.setMaximum(dC.width);
    this.offsetXSlider.setValue(p.x);
    this.offsetXSpinner.setModel(new SpinnerNumberModel(p.x, -d.width, dC.width, 1));
    this.offsetYSlider.setMinimum(-d.height);
    this.offsetYSlider.setMaximum(dC.height);
    this.offsetYSlider.setValue(p.y);
    this.offsetYSpinner.setModel(new SpinnerNumberModel(p.y, -d.height, dC.height, 1));

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
