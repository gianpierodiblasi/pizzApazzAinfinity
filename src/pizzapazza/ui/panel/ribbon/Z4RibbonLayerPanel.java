package pizzapazza.ui.panel.ribbon;

import def.dom.DragEvent;
import javascript.awt.BoxLayout;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.awt.event.ActionListener;
import javascript.swing.JSButton;
import javascript.swing.JSFileChooser;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import pizzapazza.Z4Layer;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4LayerPreview;
import pizzapazza.ui.panel.Z4NewImagePanel;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$DOMRect;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.navigator;
import static simulation.js.$Globals.parseInt;

/**
 * The ribbon panel containing the layer menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonLayerPanel extends JSPanel {

  private final JSPanel layersPreview = new JSPanel();
  private Z4StatusPanel statusPanel;

  private Z4Canvas canvas;
  private Z4Layer layerDnD;
  private Z4LayerPreview previewDnD;

  /**
   * Creates the object
   */
  public Z4RibbonLayerPanel() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonlayerpanel");

    Z4UI.addLabel(this, Z4Translations.NEW_LAYER, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", event -> this.addFromColor());
    this.addButton(Z4Translations.FROM_CLIPBOARD, $typeof(navigator.clipboard.$get("read"), "function"), 1, 1, "both", event -> this.addFromClipboard());
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", event -> this.addFromFile());
    Z4UI.addVLine(this, new GBC(3, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.layersPreview.setLayout(new BoxLayout(this.layersPreview, BoxLayout.X_AXIS));
    this.layersPreview.getStyle().overflowX = "scroll";
    this.layersPreview.addEventListener("dragenter", event -> event.preventDefault());
    this.layersPreview.addEventListener("dragover", event -> event.preventDefault());
    this.layersPreview.addEventListener("dragleave", event -> event.preventDefault());
    this.layersPreview.addEventListener("drop", event -> {
      event.preventDefault();

      DragEvent evt = (DragEvent) event;
      $DOMRect rect = this.previewDnD.invoke("getBoundingClientRect()");
      $DOMRect rectLayers = this.layersPreview.invoke("getBoundingClientRect()");

      int index = parseInt((evt.clientX - rectLayers.left) / rect.width);
      if (!this.canvas.moveLayer(this.layerDnD, index)) {
      } else if (index < this.canvas.getLayersCount()) {
        index = Math.min(this.canvas.getLayersCount(), index + 1);
        this.layersPreview.insertBefore(this.previewDnD, "details:nth-child(" + index + ")");
      } else {
        this.layersPreview.add(this.previewDnD, null);
      }
    });

    this.add(this.layersPreview, new GBC(4, 0).h(2).wx(1).f(GBC.BOTH));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
  public void setStatusPanel(Z4StatusPanel statusPanel) {
    this.statusPanel = statusPanel;
  }

  private void addButton(String text, boolean enabled, int gridx, int gridy, String border, ActionListener listener) {
    JSButton button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);

    GBC gbc = new GBC(gridx, gridy).a(GBC.NORTH);
    switch (border) {
      case "left":
        gbc.i(0, 5, 0, 0);
        button.getStyle().borderTopRightRadius = "0px";
        button.getStyle().borderBottomRightRadius = "0px";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "both":
        button.getStyle().borderRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        gbc.i(0, 0, 0, 5);
        button.getStyle().borderTopLeftRadius = "0px";
        button.getStyle().borderBottomLeftRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
    }

    this.add(button, gbc);
  }

  private void addFromColor() {
    Dimension canvasSize = this.canvas.getSize();
    Z4NewImagePanel panel = new Z4NewImagePanel();
    panel.setSelectedSize(canvasSize.width, canvasSize.height);

    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener -> panel.addChangeListener(listener), () -> {
      Dimension size = panel.getSelectedSize();
      return size.width > 0 && size.height > 0;
    }, response -> {
      if (response == JSOptionPane.OK_OPTION) {
        Dimension size = panel.getSelectedSize();
        this.canvas.addLayer(size.width, size.height, panel.getSelectedFilling());
      }
    });
  }

  private void addFromFile() {
    JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> this.canvas.addLayerFromFile(file)));
  }

  private void addFromClipboard() {
    this.canvas.addLayerFromClipboard();
  }

  /**
   * Resets the layers preview
   */
  public void reset() {
    this.layersPreview.setProperty("innerHTML", "");
  }

  /**
   * Adds a new layer preview
   *
   * @param layer The layer
   */
  public void addLayerPreview(Z4Layer layer) {
    Z4LayerPreview preview = new Z4LayerPreview();
    preview.setLayer(this.canvas, layer);
    preview.setChildAttributeByQuery("summary", "draggable", "true");
    preview.addEventListener("dragstart", event -> {
      ((DragEvent) event).dataTransfer.effectAllowed = "move";
      this.layerDnD = layer;
      this.previewDnD = preview;
    });

    this.layersPreview.add(preview, null);
  }
}
