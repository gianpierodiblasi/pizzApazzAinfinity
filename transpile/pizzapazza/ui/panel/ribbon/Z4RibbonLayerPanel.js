/**
 * The ribbon panel containing the layer menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonLayerPanel extends Z4AbstractRibbonPanel {

   layersPreview = new JSPanel();

   statusPanel = null;

   canvas = null;

   layerDnD = null;

   previewDnD = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonlayerpanel");
    Z4UI.addLabel(this, Z4Translations.NEW_LAYER, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", 0, event => this.addFromColor());
    this.addButton(Z4Translations.FROM_CLIPBOARD, typeof navigator.clipboard["read"] === "function", 1, 1, "both", 0, event => this.addFromClipboard());
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", 0, event => this.addFromFile());
    Z4UI.addVLine(this, new GBC(3, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.addButton(Z4Translations.MERGE, true, 4, 1, "", 0, event => this.merge());
    Z4UI.addVLine(this, new GBC(5, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.layersPreview.setLayout(new BoxLayout(this.layersPreview, BoxLayout.X_AXIS));
    this.layersPreview.getStyle().overflowX = "scroll";
    this.layersPreview.addEventListener("dragenter", event => event.preventDefault());
    this.layersPreview.addEventListener("dragover", event => event.preventDefault());
    this.layersPreview.addEventListener("dragleave", event => event.preventDefault());
    this.layersPreview.addEventListener("drop", event => {
      event.preventDefault();
      let evt = event;
      let rect = this.previewDnD.invoke("getBoundingClientRect()");
      let rectLayers = this.layersPreview.invoke("getBoundingClientRect()");
      let index = parseInt((evt.clientX - rectLayers.left) / rect.width);
      this.moveLayer(this.previewDnD, this.layerDnD, index);
    });
    this.add(this.layersPreview, new GBC(6, 0).h(2).wx(1).f(GBC.BOTH));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Moves a layer
   *
   * @param preview The layer preview
   * @param layer The layer
   * @param index The new index layer
   */
   moveLayer(preview, layer, index) {
    if (!this.canvas.moveLayer(layer, index)) {
    } else if (index < this.canvas.getLayersCount()) {
      index = Math.min(this.canvas.getLayersCount(), index + 1);
      this.layersPreview.insertBefore(preview, "details:nth-child(" + index + ")");
    } else {
      this.layersPreview.add(preview, null);
    }
  }

   addFromColor() {
    let canvasSize = this.canvas.getSize();
    let panel = new Z4NewImagePanel();
    panel.setSelectedSize(canvasSize.width, canvasSize.height);
    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener => panel.addChangeListener(listener), () => {
      let size = panel.getSelectedSize();
      return 0 < size.width && size.width <= Z4Constants.MAX_IMAGE_SIZE && 0 < size.height && size.height < Z4Constants.MAX_IMAGE_SIZE;
    }, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let size = panel.getSelectedSize();
        this.canvas.addLayer(size.width, size.height, panel.getSelectedFilling());
      }
    });
  }

   addFromFile() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.addLayerFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.addLayerFromFile(file)));
    }
  }

   addFromClipboard() {
    this.canvas.addLayerFromClipboard();
  }

   merge() {
    let panel = new Z4MergeLayerPanel();
    panel.setCanvas(this.canvas);
    JSOptionPane.showInputDialog(panel, Z4Translations.MERGE, listener => panel.addChangeListener(listener), () => panel.getSelectedLayers().length > 1, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let selected = panel.getSelectedLayers();
        selected.forEach(layer => {
          let index = this.canvas.deleteLayer(layer, true);
          document.querySelector(".z4layerpreview:nth-child(" + (index + 1) + ")").remove();
        });
        this.canvas.mergeLayers(selected);
      }
    });
  }

  /**
   * Resets the layers preview
   */
   reset() {
    this.layersPreview.setProperty("innerHTML", "");
  }

  /**
   * Adds a new layer preview
   *
   * @param layer The layer
   */
   addLayerPreview(layer) {
    let preview = new Z4LayerPreview();
    preview.setRibbonLayerPanel(this);
    preview.setLayer(this.canvas, layer);
    preview.setChildAttributeByQuery("summary", "draggable", "true");
    preview.addEventListener("dragstart", event => {
      (event).dataTransfer.effectAllowed = "move";
      this.layerDnD = layer;
      this.previewDnD = preview;
    });
    document.querySelectorAll(".z4layerpreview .z4layerpreview-selector").forEach(element => element.textContent = Z4LayerPreview.UNSELECTED_LAYER_CONTENT);
    this.layersPreview.add(preview, null);
    preview.invoke("scrollIntoView()");
  }
}
