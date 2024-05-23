package pizzapazza.ui.component;

import static def.dom.Globals.document;
import def.js.Array;
import javascript.awt.BorderLayout;
import javascript.awt.Dimension;
import javascript.awt.GridBagConstraints;
import javascript.awt.GridBagLayout;
import javascript.awt.Insets;
import javascript.awt.Point;
import javascript.swing.ButtonGroup;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.JSRadioButton;
import javascript.swing.JSSlider;
import javascript.swing.JSSpinner;
import javascript.swing.JSTabbedPane;
import javascript.swing.JSTextField;
import javascript.swing.SpinnerNumberModel;
import javascript.util.Translations;
import pizzapazza.Z4Layer;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$DOMRect;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
public class Z4LayerPreview extends JSComponent {

  private final JSPanel summary = new JSPanel();
  private JSLabel name = new JSLabel();
  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");

  private final JSTabbedPane editor = new JSTabbedPane();
  private final JSTextField editName = new JSTextField();

  private final JSSlider offsetXSlider = new JSSlider();
  private final JSSpinner offsetXSpinner = new JSSpinner();
  private final JSSlider offsetYSlider = new JSSlider();
  private final JSSpinner offsetYSpinner = new JSSpinner();
  private final JSSlider opacitySlider = new JSSlider();
  private final JSSpinner opacitySpinner = new JSSpinner();
  private final Array<JSRadioButton> compositeOperations = new Array<>();
  private final ButtonGroup compositeOperationsGroup = new ButtonGroup();

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

    this.name.getStyle().width = Z4LayerPreview.PREVIEW_SIZE + "px";

    this.preview.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);

    this.summary.setLayout(new BorderLayout(0, 0));
    this.summary.add(this.name, BorderLayout.NORTH);
    this.summary.add(this.preview, BorderLayout.CENTER);

    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);

    this.editor.cssAddClass("z4layerpreview-editor");

    JSPanel panel = new JSPanel();
    panel.setLayout(new GridBagLayout());

    this.editName.addActionListener(event -> {
      String newName = this.editName.getText();
      if ($exists(newName)) {
        this.canvas.setSaved(false);
        this.name.setText(newName);
        this.layer.setName(newName);
      }
    });

    this.addLabel(panel, Z4Translations.LAYER_NAME, 0, 0, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);
    this.addComponent(panel, this.editName, 0, 1, 5, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, new Insets(0, 0, 5, 0));

    this.addLabel(panel, Z4Translations.OFFSET_X, 0, 2, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    this.offsetXSpinner.getStyle().minWidth = "4rem";
    this.offsetXSpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.offsetXSpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.offsetXSpinner.addChangeListener(event -> this.onChange(true, this.offsetXSpinner.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    this.addComponent(panel, this.offsetXSpinner, 1, 2, 1, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, null);

    this.offsetXSlider.getStyle().minWidth = "20rem";
    this.offsetXSlider.addChangeListener(event -> this.onChange(false, this.offsetXSlider.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    this.addComponent(panel, this.offsetXSlider, 0, 3, 2, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);

    this.addLabel(panel, Translations.JSColorChooser_OPACITY, 0, 4, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    this.opacitySpinner.getStyle().minWidth = "4rem";
    this.opacitySpinner.getChilStyleByQuery("input[type=number]").minWidth = "3.5rem";
    this.opacitySpinner.getChilStyleByQuery("input[type=number]").width = "3.5rem";
    this.opacitySpinner.addChangeListener(event -> this.onChange(true, this.opacitySpinner.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    this.addComponent(panel, this.opacitySpinner, 1, 4, 1, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, null);

    this.opacitySlider.addChangeListener(event -> this.onChange(false, this.opacitySlider.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    this.opacitySlider.getStyle().minWidth = "20rem";
    this.addComponent(panel, this.opacitySlider, 0, 5, 2, 1, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.HORIZONTAL, null);

    this.addVLine(panel, 2, 2, 1, 5, GridBagConstraints.CENTER, GridBagConstraints.VERTICAL);
    this.addLabel(panel, Z4Translations.OFFSET_Y, 3, 5, 1, 1, GridBagConstraints.SOUTH, GridBagConstraints.NONE);
    panel.getChilStyleByQuery("*:nth-child(10)").writingMode = "vertical-lr";
    panel.getChilStyleByQuery("*:nth-child(10)").transform = "rotate(180deg)";

    this.offsetYSpinner.cssAddClass("offsetyspinner");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.getStyle().minHeight = "4rem";
    this.offsetYSpinner.getChilStyleByQuery("input[type=number]").minHeight = "3.5rem";
    this.offsetYSpinner.getChilStyleByQuery("input[type=number]").height = "3.5rem";
    this.offsetYSpinner.addChangeListener(event -> this.onChange(true, this.offsetYSpinner.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    this.addComponent(panel, this.offsetYSpinner, 3, 2, 1, 3, 0, 0, GridBagConstraints.NORTH, GridBagConstraints.NONE, null);

    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minHeight = "20rem";
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event -> this.onChange(false, this.offsetYSlider.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    this.addComponent(panel, this.offsetYSlider, 4, 2, 1, 4, 0, 1, GridBagConstraints.NORTH, GridBagConstraints.NONE, null);

    this.editor.addTab(Z4Translations.BASIC, panel);

    JSPanel finalPanel = new JSPanel();
    finalPanel.setLayout(new GridBagLayout());

    this.addLabel(finalPanel, Z4Translations.COMPOSITE_OPERATION, 0, 0, 1, 1, GridBagConstraints.WEST, GridBagConstraints.NONE);

    Z4Constants.COMPOSITE_OPERATION.forEach((array, index, parent) -> {
      array.forEach((element, index2, array2) -> {
        JSRadioButton button = new JSRadioButton();
        button.setContentAreaFilled(false);
        button.setToggle();
        button.setText(element);
        button.setTooltip(Z4Translations.$get("COMPOSITE_OPERATION_" + element.toUpperCase().replace("-", "_")));
        button.addActionListener(event -> this.onAction(element));

        this.compositeOperations.push(button);
        this.compositeOperationsGroup.add(button);

        this.addComponent(finalPanel, button, index2, index + 1, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.HORIZONTAL, new Insets(1, 1, 1, 1));
      });
    });

    this.editor.addTab(Z4Translations.ADVANCED, finalPanel);

    this.appendChild(this.editor);
  }

  private void addLabel(JSPanel panel, String text, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill) {
    JSLabel label = new JSLabel();
    label.setText(text);
    this.addComponent(panel, label, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, null);
  }

  private void addVLine(JSPanel panel, int gridx, int gridy, int gridwidth, int gridheight, int anchor, int fill) {
    JSComponent div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor";
    this.addComponent(panel, div, gridx, gridy, gridwidth, gridheight, 0, 0, anchor, fill, new Insets(1, 2, 1, 2));
  }

  private void addComponent(JSPanel panel, JSComponent component, int gridx, int gridy, int gridwidth, int gridheight, int weightx, int weighty, int anchor, int fill, Insets insets) {
    GridBagConstraints constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.gridwidth = gridwidth;
    constraints.gridheight = gridheight;
    constraints.weightx = weightx;
    constraints.weighty = weighty;
    constraints.anchor = anchor;
    constraints.fill = fill;
    if ($exists(insets)) {
      constraints.insets = insets;
    }
    panel.add(component, constraints);
  }

  private void onChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
    this.canvas.setSaved(false);

    if (spTosl) {
      slider.setValue((int) spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }

    if (adjusting) {
      this.editor.setAttribute("offset", "true");
    } else {
      this.editor.removeAttribute("offset");
    }

    this.layer.setOpacity(this.opacitySpinner.getValue() / 100);
    this.layer.move(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    this.canvas.drawCanvas();
  }

  private void onAction(String text) {
    this.canvas.setSaved(false);
    this.layer.setCompositeOperation(text);
    this.canvas.drawCanvas();
  }

  /**
   * Sets the layer
   *
   * @param canvas The canvas
   * @param layer The layer
   */
  @SuppressWarnings("StringEquality")
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

    this.opacitySlider.setValue(parseInt(100 * layer.getOpacity()));
    this.opacitySpinner.setModel(new SpinnerNumberModel(parseInt(100 * layer.getOpacity()), 0, 100, 1));

    this.compositeOperations.forEach(button -> button.setSelected(button.getText() == layer.getCompositeOperation()));

    this.drawLayer();
  }

  private void drawLayer() {
    if ($exists(this.layer)) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx, true);
      this.ctx.restore();
    }
  }
}
