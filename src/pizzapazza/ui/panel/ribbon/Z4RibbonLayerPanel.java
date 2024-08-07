package pizzapazza.ui.panel.ribbon;

import def.dom.DragEvent;
import def.js.Array;
import javascript.awt.BoxLayout;
import javascript.awt.Dimension;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSCheckBox;
import javascript.swing.JSFileChooser;
import javascript.swing.JSFilePicker;
import javascript.swing.JSOptionPane;
import javascript.swing.JSPanel;
import javascript.util.fsa.FilePickerOptions;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4LayerPreview;
import pizzapazza.ui.panel.Z4MergeLayerPanel;
import pizzapazza.ui.panel.Z4NewImagePanel;
import pizzapazza.ui.panel.Z4StatusPanel;
import pizzapazza.util.Z4Constants;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Translations;
import pizzapazza.util.Z4UI;
import simulation.dom.$DOMRect;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.navigator;
import static simulation.js.$Globals.parseInt;
import static simulation.js.$Globals.setTimeout;
import static simulation.js.$Globals.window;

/**
 * The ribbon panel containing the layer menus
 *
 * @author gianpiero.diblasi
 */
public class Z4RibbonLayerPanel extends Z4AbstractRibbonPanel {

  private final JSCheckBox showLayerBounds = new JSCheckBox();
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
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", 0, event -> this.addFromColor());
    this.addButton(Z4Translations.FROM_CLIPBOARD, $typeof(navigator.clipboard.$get("read"), "function"), 1, 1, "both", 0, event -> this.addFromClipboard());
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", 0, event -> this.addFromFile());
    Z4UI.addVLine(this, new GBC(3, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

    this.addButton(Z4Translations.MERGE, true, 4, 1, "", 0, event -> this.merge());

    this.showLayerBounds.setText(Z4Translations.SHOW_LAYER_BOUNDS);
    this.showLayerBounds.addActionListener(event -> this.canvas.setShowLayerBounds(this.showLayerBounds.isSelected()));
    this.add(this.showLayerBounds, new GBC(4, 2).a(GBC.NORTH).i(0, 5, 0, 5));

    Z4UI.addVLine(this, new GBC(5, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));

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
      this.moveLayer(this.previewDnD, this.layerDnD, index);
    });

    this.add(this.layersPreview, new GBC(6, 0).h(3).wx(1).f(GBC.BOTH));
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

  /**
   * Moves a layer
   *
   * @param preview The layer preview
   * @param layer The layer
   * @param index The new index layer
   */
  public void moveLayer(Z4LayerPreview preview, Z4Layer layer, int index) {
    if (!this.canvas.moveLayer(layer, index)) {
    } else if (index < this.canvas.getLayersCount()) {
      index = Math.min(this.canvas.getLayersCount(), index + 1);
      this.layersPreview.insertBefore(preview, "details:nth-child(" + index + ")");
    } else {
      this.layersPreview.add(preview, null);
    }
  }

  private void addFromColor() {
    Dimension canvasSize = this.canvas.getSize();
    Z4NewImagePanel panel = new Z4NewImagePanel();
    panel.setSelectedSize(canvasSize.width, canvasSize.height);

    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener -> panel.addChangeListener(listener), () -> {
      Dimension size = panel.getSelectedSize();
      return 0 < size.width && size.width <= Z4Constants.MAX_IMAGE_SIZE && 0 < size.height && size.height <= Z4Constants.MAX_IMAGE_SIZE;
    }, response -> {
      if (response == JSOptionPane.OK_OPTION) {
        Dimension size = panel.getSelectedSize();
        Object filling = panel.getSelectedFilling();
        this.canvas.addLayer(size.width, size.height, filling);
        Z4Constants.pushHistory(filling);
      }
    });
  }

  private void addFromFile() {
    if ($typeof(window.$get("showOpenFilePicker"), "function")) {
      FilePickerOptions options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;

      JSFilePicker.showOpenFilePicker(options, 0, handles -> handles.forEach(handle -> this.canvas.addLayerFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files -> files.forEach(file -> this.canvas.addLayerFromFile(file)));
    }
  }

  private void addFromClipboard() {
    this.canvas.addLayerFromClipboard();
  }

  private void merge() {
    Z4MergeLayerPanel panel = new Z4MergeLayerPanel();
    panel.setCanvas(this.canvas);

    JSOptionPane.showInputDialog(panel, Z4Translations.MERGE, listener -> panel.addChangeListener(listener), () -> panel.getSelectedLayers().length > 1, response -> {
      if (response == JSOptionPane.OK_OPTION) {
        Array<Z4Layer> selected = panel.getSelectedLayers();
        selected.forEach(layer -> {
          int index = this.canvas.deleteLayer(layer, true);
          document.querySelector(".z4layerpreview:nth-child(" + (index + 1) + ")").remove();
        });

        this.canvas.mergeLayers(selected);
      }
    });
  }

  /**
   * Resets the layers preview
   */
  public void reset() {
    this.showLayerBounds.setSelected(false);
    this.layersPreview.setProperty("innerHTML", "");
  }

  /**
   * Adds a new layer preview
   *
   * @param layer The layer
   */
  public void addLayerPreview(Z4Layer layer) {
    Z4LayerPreview preview = new Z4LayerPreview();
    preview.setRibbonLayerPanel(this);
    preview.setLayer(this.canvas, layer);
    preview.setChildAttributeByQuery("summary", "draggable", "true");
    preview.addEventListener("dragstart", event -> {
      ((DragEvent) event).dataTransfer.effectAllowed = "move";
      this.layerDnD = layer;
      this.previewDnD = preview;
    });

    document.querySelectorAll(".z4layerpreview .z4layerpreview-selector").forEach(element -> element.textContent = Z4LayerPreview.UNSELECTED_LAYER_CONTENT);

    this.layersPreview.add(preview, null);
    setTimeout(() -> preview.invoke("scrollIntoView()"), 0);
  }
}
