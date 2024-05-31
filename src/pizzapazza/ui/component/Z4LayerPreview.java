package pizzapazza.ui.component;

import static def.dom.Globals.document;
import def.js.Array;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.awt.Point;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSLabel;
import javascript.swing.JSOptionPane;
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
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$DOMRect;
import simulation.js.$Apply_0_Void;
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
  private final JSButton delete = new JSButton();

  private Z4Canvas canvas;
  private Z4Layer layer;
  private double zoom = 1;
  private boolean changed;

  private final static int PREVIEW_SIZE = 50;

  @SuppressWarnings("StringEquality")
  public Z4LayerPreview() {
    super(document.createElement("details"));

    this.cssAddClass("z4layerpreview");
    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
        this.changed = false;
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

        this.delete.setEnabled(document.querySelectorAll(".z4layerpreview").length > 1);
      } else {
        if (this.changed) {
          this.canvas.setChanged(true);
          this.canvas.saveHistory("standard,tool");
        }

        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("visibility");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("top");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("bottom");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("left");
        this.getChilStyleByQuery(".z4layerpreview-editor").removeProperty("right");
      }
    });

    this.name.getStyle().width = (Z4LayerPreview.PREVIEW_SIZE + 30) + "px";

    this.preview.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);

    this.summary.setLayout(new GridBagLayout());

    this.summary.add(this.name, new GBC(0, 0).w(3));
    this.summary.add(this.preview, new GBC(1, 1).h(3).f(GBC.BOTH));

    JSButton button = new JSButton();
    button.setText("\u00A0\uD83D\uDC41");
    button.setContentAreaFilled(false);
    this.summary.add(button, new GBC(0, 1).i(0, 0, 0, 2));

    button = new JSButton();
    button.setText("\u2610\u00A0"); //\u2611
    button.setContentAreaFilled(false);
    this.summary.add(button, new GBC(2, 1).i(0, 2, 0, 0));

    button = new JSButton();
    button.setText("\u00A0\u25C0");
    button.setContentAreaFilled(false);
    this.summary.add(button, new GBC(0, 2).i(0, 2, 0, 0));

    button = new JSButton();
    button.setText("|\u25C0");
    button.setContentAreaFilled(false);
    this.summary.add(button, new GBC(0, 3).i(0, 2, 0, 0));

    button = new JSButton();
    button.setText("\u25B6\u00A0");
    button.setContentAreaFilled(false);
    this.summary.add(button, new GBC(2, 2).i(0, 2, 0, 0));

    button = new JSButton();
    button.setText("\u25B6|");
    button.setContentAreaFilled(false);
    this.summary.add(button, new GBC(2, 3).i(0, 2, 0, 0));

    this.appendNodeChild(document.createElement("summary"));
    this.appendChildInTree("summary", this.summary);

    this.editor.cssAddClass("z4layerpreview-editor");

    JSPanel panelBasic = new JSPanel();
    panelBasic.setLayout(new GridBagLayout());

    this.editName.addActionListener(event -> {
      String newName = this.editName.getText();
      if ($exists(newName)) {
        this.changed = true;
        this.canvas.setSaved(false);
        this.name.setText(newName);
        this.layer.setName(newName);
        this.setChildAttributeByQuery("summary", "title", newName);
      }
    });

    Z4UI.addLabel(panelBasic, Z4Translations.LAYER_NAME, new GBC(0, 0).a(GBC.WEST));
    panelBasic.add(this.editName, new GBC(0, 1).w(5).a(GBC.WEST).f(GBC.HORIZONTAL).i(0, 0, 5, 0));

    Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_X, new GBC(0, 2).a(GBC.WEST));

    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event -> this.onChange(true, this.offsetXSpinner.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    panelBasic.add(this.offsetXSpinner, new GBC(1, 2).a(GBC.EAST));

    this.offsetXSlider.getStyle().minWidth = "20rem";
    this.offsetXSlider.addChangeListener(event -> this.onChange(false, this.offsetXSlider.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    panelBasic.add(this.offsetXSlider, new GBC(0, 3).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));

    Z4UI.addLabel(panelBasic, Translations.JSColorChooser_OPACITY, new GBC(0, 4).a(GBC.WEST));

    this.opacitySpinner.cssAddClass("jsspinner_w_4rem");
    this.opacitySpinner.addChangeListener(event -> this.onChange(true, this.opacitySpinner.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    panelBasic.add(this.opacitySpinner, new GBC(1, 4).a(GBC.EAST));

    this.opacitySlider.addChangeListener(event -> this.onChange(false, this.opacitySlider.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    this.opacitySlider.getStyle().minWidth = "20rem";
    panelBasic.add(this.opacitySlider, new GBC(0, 5).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));

    Z4UI.addVLine(panelBasic, new GBC(2, 2).h(5).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_Y, new GBC(3, 6).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");

    this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.addChangeListener(event -> this.onChange(true, this.offsetYSpinner.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    panelBasic.add(this.offsetYSpinner, new GBC(3, 2).h(3).a(GBC.NORTH));

    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minHeight = "20rem";
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event -> this.onChange(false, this.offsetYSlider.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    panelBasic.add(this.offsetYSlider, new GBC(4, 2).h(5).wy(1).a(GBC.NORTH));

    button = new JSButton();
    button.setText(Z4Translations.DUPLICATE);
    button.addActionListener(event -> {
      this.changed = true;
      this.canvas.duplicateLayer(this.layer);
      this.removeAttribute("open");
    });
    panelBasic.add(button, new GBC(0, 6).a(GBC.SOUTHWEST));

    this.delete.setText(Z4Translations.DELETE);
    this.delete.addActionListener(event -> JSOptionPane.showConfirmDialog(Z4Translations.DELETE_LAYER_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response -> {
      if (response == JSOptionPane.YES_OPTION) {
        this.changed = true;
        int index = this.canvas.deleteLayer(this.layer);
        document.querySelector(".z4layerpreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
    panelBasic.add(this.delete, new GBC(1, 6).a(GBC.SOUTHEAST));

    this.editor.addTab(Z4Translations.BASIC, panelBasic);

    JSPanel panelAdvanced = new JSPanel();
    panelAdvanced.setLayout(new GridBagLayout());

    Z4UI.addLabel(panelAdvanced, Z4Translations.COMPOSITE_OPERATION, new GBC(0, 0).a(GBC.WEST));

    Z4Constants.COMPOSITE_OPERATION.forEach((array, index, parent) -> {
      array.forEach((element, index2, array2) -> {
        JSRadioButton radio = new JSRadioButton();
        radio.setContentAreaFilled(false);
        radio.setToggle();
        radio.setText(element);
        radio.setTooltip(Z4Translations.$get("COMPOSITE_OPERATION_" + element.toUpperCase().replace("-", "_")));
        radio.addActionListener(event -> this.onAction(element));

        this.compositeOperations.push(radio);
        this.compositeOperationsGroup.add(radio);

        panelAdvanced.add(radio, new GBC(index2, index + 1).a(GBC.WEST).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
      });
    });

    this.editor.addTab(Z4Translations.ADVANCED, panelAdvanced);

    JSPanel panelTranform = new JSPanel();
    panelTranform.setLayout(new GridBagLayout());

    this.editor.addTab(Z4Translations.TRANSFORM, panelTranform);
    this.addButton(panelTranform, Z4Translations.FLIP_HORIZONTAL, 0, 0, () -> this.layer.flipHorizonal());
    this.addButton(panelTranform, Z4Translations.FLIP_VERTICAL, 1, 0, () -> this.layer.flipVertical());
    this.addButton(panelTranform, Z4Translations.ROTATE_PLUS_90, 0, 1, () -> {
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
    });
    this.addButton(panelTranform, Z4Translations.ROTATE_MINUS_90, 1, 1, () -> {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
    });
    this.addButton(panelTranform, Z4Translations.ROTATE_180, 0, 2, () -> {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
    });
    this.appendChild(this.editor);
  }

  private void addButton(JSPanel panel, String text, int gridx, int gridy, $Apply_0_Void func) {
    JSButton button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(event -> {
      this.changed = true;
      func.$apply();
      this.drawLayer();
      this.canvas.setSaved(false);
      this.canvas.drawCanvas();
    });

    panel.add(button, new GBC(gridx, gridy).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
  }

  private void onChange(boolean spTosl, boolean adjusting, JSSpinner spinner, JSSlider slider) {
    this.changed = true;
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
    this.changed = true;
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
      this.layer.draw(this.ctx, true, true);
      this.ctx.restore();
    }
  }
}
