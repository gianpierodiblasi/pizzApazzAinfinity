package pizzapazza.ui.component;

import def.dom.Element;
import static def.dom.Globals.document;
import def.js.Array;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.awt.Point;
import javascript.awt.event.ActionListener;
import javascript.swing.ButtonGroup;
import javascript.swing.JSButton;
import javascript.swing.JSComponent;
import javascript.swing.JSDropDown;
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
import pizzapazza.ui.panel.Z4ResizeImagePanel;
import pizzapazza.ui.panel.ribbon.Z4RibbonLayerPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4ResizeOptions;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.parseInt;

/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
public class Z4LayerPreview extends JSDropDown {
  
  private final JSPanel summary = new JSPanel();
  private final JSLabel name = new JSLabel();
  private final JSButton eye = new JSButton();
  private final JSComponent preview = new JSComponent(document.createElement("canvas"));
  private final $CanvasRenderingContext2D ctx = this.preview.invoke("getContext('2d')");
  
  private final JSTabbedPane editor = new JSTabbedPane();
  private final JSTextField editName = new JSTextField();
  
  private final JSLabel size = new JSLabel();
  private final JSSlider offsetXSlider = new JSSlider();
  private final JSSpinner offsetXSpinner = new JSSpinner();
  private final JSSlider offsetYSlider = new JSSlider();
  private final JSSpinner offsetYSpinner = new JSSpinner();
  private final JSSlider opacitySlider = new JSSlider();
  private final JSSpinner opacitySpinner = new JSSpinner();
  private final Array<JSRadioButton> compositeOperations = new Array<>();
  private final ButtonGroup compositeOperationsGroup = new ButtonGroup();
  private final JSButton delete = new JSButton();
  
  private Z4RibbonLayerPanel ribbonLayerPanel;
  private Z4Canvas canvas;
  private Z4Layer layer;
  private double zoom = 1;
  private boolean changed;

  /**
   * The text content for the selected button
   */
  public final static String SELECTED_LAYER_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  public final static String UNSELECTED_LAYER_CONTENT = "-";

  /**
   * The text content for the visible button
   */
  public final static String VISIBLE_LAYER_CONTENT = "#";
  
  private final static int PREVIEW_SIZE = 50;
  
  @SuppressWarnings("StringEquality")
  public Z4LayerPreview() {
    super(".z4layerpreview-editor");
    this.cssAddClass("z4layerpreview");
    
    this.addEventListener("toggle", event -> {
      if ("" + this.getProperty("open") == "true") {
        this.changed = false;
        this.delete.setEnabled(this.canvas.getLayersCount() > 1);
      } else if (this.changed) {
        this.canvas.setChanged(true);
        this.canvas.saveHistory("standard,tool");
      }
    });
    
    this.name.getStyle().width = (Z4LayerPreview.PREVIEW_SIZE + 35) + "px";
    
    this.preview.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
    
    this.summary.setLayout(new GridBagLayout());
    
    this.summary.add(this.name, new GBC(0, 0).w(3));
    this.summary.add(this.preview, new GBC(1, 1).h(3).f(GBC.BOTH));
    
    this.eye.setText(Z4LayerPreview.VISIBLE_LAYER_CONTENT);
    this.eye.setTooltip(Z4Translations.VISIBLE);
    this.eye.setContentAreaFilled(false);
    this.eye.addActionListener(event -> {
      boolean b = !this.layer.isHidden();
      if (b) {
        this.eye.getStyle().removeProperty("color");
      } else {
        this.eye.getStyle().color = "var(--main-action-bgcolor)";
      }
      
      this.layer.setHidden(b);
      this.canvas.setChanged(true);
      this.canvas.setSaved(false);
      this.canvas.drawCanvas();
    });
    this.summary.add(this.eye, new GBC(0, 1).f(GBC.BOTH).i(0, 0, 0, 2));
    
    JSButton selector = new JSButton();
    selector.setText(Z4LayerPreview.SELECTED_LAYER_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4layerpreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event -> {
      document.querySelectorAll(".z4layerpreview .z4layerpreview-selector").forEach(element -> element.textContent = Z4LayerPreview.UNSELECTED_LAYER_CONTENT);
      selector.setText(Z4LayerPreview.SELECTED_LAYER_CONTENT);
      this.canvas.setSelectedLayer(this.layer);
    });
    this.summary.add(selector, new GBC(2, 1).f(GBC.BOTH).i(0, 2, 0, 0));
    
    JSButton button = new JSButton();
    button.setText("\uD83E\uDC08");
    button.setTooltip(Z4Translations.MOVE_DOWN);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event -> this.move(-1));
    this.summary.add(button, new GBC(0, 2).f(GBC.BOTH).i(0, 0, 0, 2));
    
    button = new JSButton();
    button.setText("\u2BEC");
    button.setTooltip(Z4Translations.MOVE_BOTTOM);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event -> this.ribbonLayerPanel.moveLayer(this, this.layer, 0));
    this.summary.add(button, new GBC(0, 3).f(GBC.BOTH).i(0, 0, 0, 2));
    
    button = new JSButton();
    button.setText("\uD83E\uDC0A");
    button.setTooltip(Z4Translations.MOVE_UP);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event -> this.move(2));
    this.summary.add(button, new GBC(2, 2).f(GBC.BOTH).i(0, 2, 0, 0));
    
    button = new JSButton();
    button.setText("\u2BEE");
    button.setTooltip(Z4Translations.MOVE_TOP);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event -> this.ribbonLayerPanel.moveLayer(this, this.layer, this.canvas.getLayersCount()));
    this.summary.add(button, new GBC(2, 3).f(GBC.BOTH).i(0, 2, 0, 0));
    
    Z4UI.addVLine(this.summary, new GBC(3, 0).h(4).f(GBC.VERTICAL).i(1, 2, 1, 2));
    
    this.appendChildInTree("summary", this.summary);
    
    this.editor.cssAddClass("z4layerpreview-editor");
    this.editor.addChangeListener(event -> this.computePopupPosition());
    
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
    
    Z4UI.addLabel(panelBasic, Z4Translations.LAYER_NAME, new GBC(0, 0).a(GBC.WEST).wx(1));
    panelBasic.add(this.size, new GBC(1, 0).a(GBC.EAST).w(4));
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
        int index = this.canvas.deleteLayer(this.layer, false);
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
    this.addButton(panelTranform, Z4Translations.FLIP_HORIZONTAL, 0, 0, event -> {
      this.layer.flipHorizonal();
      this.afterTransform();
    });
    this.addButton(panelTranform, Z4Translations.FLIP_VERTICAL, 1, 0, event -> {
      this.layer.flipVertical();
      this.afterTransform();
    });
    this.addButton(panelTranform, Z4Translations.ROTATE_PLUS_90, 0, 1, event -> {
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTranform, Z4Translations.ROTATE_MINUS_90, 1, 1, event -> {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTranform, Z4Translations.ROTATE_180, 0, 2, event -> {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTranform, Z4Translations.RESIZE, 1, 2, event -> {
      Dimension layerSize = this.layer.getSize();
      $OffscreenCanvas offsetCanvas = new $OffscreenCanvas(layerSize.width, layerSize.height);
      this.layer.draw(offsetCanvas.getContext("2d"), true, true);
      
      Z4ResizeImagePanel resizeImagePanel = new Z4ResizeImagePanel();
      resizeImagePanel.setCanvas(offsetCanvas, layerSize.width, layerSize.height);
      
      JSOptionPane.showInputDialog(resizeImagePanel, Z4Translations.RESIZE, listener -> resizeImagePanel.addChangeListener(listener), () -> {
        Z4ResizeOptions resizeOptions = resizeImagePanel.getResizeOptions();
        boolean containerOK = 0 < resizeOptions.containerWidth && resizeOptions.containerWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.containerHeight && resizeOptions.containerHeight < Z4Constants.MAX_IMAGE_SIZE;
        boolean contentOK = 0 < resizeOptions.contentWidth && resizeOptions.contentWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.contentHeight && resizeOptions.contentHeight < Z4Constants.MAX_IMAGE_SIZE;
        return containerOK && contentOK;
        
      }, response -> {
        if (response == JSOptionPane.OK_OPTION) {
          this.layer.resize(resizeImagePanel.getResizeOptions());
          this.setLayer(this.canvas, this.layer);
          this.afterTransform();
        }
      });
    });
    this.appendChild(this.editor);
  }
  
  private void addButton(JSPanel panel, String text, int gridx, int gridy, ActionListener listener) {
    JSButton button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    panel.add(button, new GBC(gridx, gridy).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
  }
  
  private void afterTransform() {
    this.changed = true;
    this.drawLayer();
    this.canvas.setSaved(false);
    this.canvas.drawCanvas();
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
  
  private void move(int direction) {
    this.cssAddClass("z4layerpreview-move");
    
    int moveIndex = -1;
    Element move = document.querySelector(".z4layerpreview-move");
    for (int index = 0; index < move.parentElement.children.length; index++) {
      if (move == move.parentElement.children.item(index)) {
        moveIndex = index;
      }
    }
    
    if ((direction < 0 && moveIndex > 0) || (direction > 0 && moveIndex < this.canvas.getLayersCount() - 1)) {
      this.removeAttribute("open");
      this.ribbonLayerPanel.moveLayer(this, this.layer, moveIndex + direction);
    }
    
    this.cssRemoveClass("z4layerpreview-move");
  }

  /**
   * Sets the riboon layer panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   */
  public void setRibbonLayerPanel(Z4RibbonLayerPanel ribbonLayerPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
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
    this.layer.setLayerPreview(this);
    this.name.setText(this.layer.getName());
    this.size.setText(this.layer.getSize().width + " x " + this.layer.getSize().height);
    this.editName.setText(this.layer.getName());
    this.setChildAttributeByQuery("summary", "title", this.layer.getName());
    
    if (this.layer.isHidden()) {
      this.eye.getStyle().removeProperty("color");
    } else {
      this.eye.getStyle().color = "var(--main-action-bgcolor)";
    }
    
    Dimension d = layer.getSize();
    double ratio = d.width / d.height;
    double w = ratio > 1 ? Z4LayerPreview.PREVIEW_SIZE : Z4LayerPreview.PREVIEW_SIZE * ratio;
    double h = ratio > 1 ? Z4LayerPreview.PREVIEW_SIZE / ratio : Z4LayerPreview.PREVIEW_SIZE;
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

  /**
   * Draws the layer
   */
  public void drawLayer() {
    if ($exists(this.layer)) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx, true, true);
      this.ctx.restore();
    }
  }
}
