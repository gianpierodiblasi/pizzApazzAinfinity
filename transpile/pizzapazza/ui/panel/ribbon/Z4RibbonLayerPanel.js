/**
 * The ribbon panel containing the layer menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonLayerPanel extends JSPanel {

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
    this.addLabel(Z4Translations.NEW_LAYER, 0);
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", event => this.addFromColor());
    this.addButton(Z4Translations.FROM_CLIPBOARD, typeof navigator.clipboard["read"] === "function", 1, 1, "both", event => this.addFromClipboard());
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", event => this.addFromFile());
    this.addVLine(3);
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
      if (!this.canvas.moveLayer(this.layerDnD, index)) {
      } else if (index < this.canvas.getLayersCount()) {
        index = Math.min(this.canvas.getLayersCount(), index + 1);
        this.layersPreview.insertBefore(this.previewDnD, "details:nth-child(" + index + ")");
      } else {
        this.layersPreview.add(this.previewDnD, null);
      }
    });
    let constraints = new GridBagConstraints();
    constraints.gridx = 4;
    constraints.gridy = 0;
    constraints.gridheight = 2;
    constraints.weightx = 1;
    constraints.fill = GridBagConstraints.BOTH;
    this.add(this.layersPreview, constraints);
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

   addLabel(text, gridx) {
    let label = new JSLabel();
    label.setText(text);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.gridwidth = 3;
    constraints.anchor = GridBagConstraints.WEST;
    constraints.insets = new Insets(5, 5, 2, 0);
    this.add(label, constraints);
  }

   addButton(text, enabled, gridx, gridy, border, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = gridy;
    constraints.anchor = GridBagConstraints.NORTH;
    switch(border) {
      case "left":
        constraints.insets = new Insets(0, 5, 0, 0);
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
        constraints.insets = new Insets(0, 0, 0, 5);
        button.getStyle().borderTopLeftRadius = "0px";
        button.getStyle().borderBottomLeftRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
    }
    this.add(button, constraints);
  }

   addVLine(gridx) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    let constraints = new GridBagConstraints();
    constraints.gridx = gridx;
    constraints.gridy = 0;
    constraints.gridheight = 2;
    constraints.fill = GridBagConstraints.VERTICAL;
    constraints.weighty = 1;
    constraints.insets = new Insets(1, 2, 1, 2);
    this.add(div, constraints);
  }

   addFromColor() {
    let canvasSize = this.canvas.getSize();
    let panel = new Z4NewImagePanel();
    panel.setSelectedSize(canvasSize.width, canvasSize.height);
    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener => panel.addChangeListener(listener), () => {
      let size = panel.getSelectedSize();
      return size.width > 0 && size.height > 0;
    }, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let size = panel.getSelectedSize();
        this.canvas.addLayer(size.width, size.height, panel.getSelectedFilling());
      }
    });
  }

   addFromFile() {
    JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.addLayerFromFile(file)));
  }

   addFromClipboard() {
    this.canvas.addLayerFromClipboard();
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
    preview.setLayer(this.canvas, layer);
    preview.setChildAttributeByQuery("summary", "draggable", "true");
    preview.addEventListener("dragstart", event => {
      (event).dataTransfer.effectAllowed = "move";
      this.layerDnD = layer;
      this.previewDnD = preview;
    });
    this.layersPreview.add(preview, null);
  }
}
