/**
 * The panel to merge layers
 *
 * @author gianpiero.diblasi
 */
class Z4MergeLayerPanel extends JSPanel {

   checkboxes = new Array();

   layers = new Array();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4mergelayerpanel");
    this.setLayout(new GridBagLayout());
    let button = new JSButton();
    button.setText(Z4Translations.MERGE_VISIBLE_LAYERS);
    button.addActionListener(event => {
      this.layers.forEach((layer, index, array) => this.checkboxes[index].setSelected(!layer.isHidden()));
      this.onchange();
    });
    this.add(button, new GBC(0, 0).i(0, 0, 0, 2));
    button = new JSButton();
    button.setText(Z4Translations.MERGE_ALL_LAYERS);
    button.addActionListener(event => {
      this.checkboxes.forEach((checkbox, index, array) => checkbox.setSelected(true));
      this.onchange();
    });
    this.add(button, new GBC(1, 0).i(0, 2, 0, 0));
  }

  /**
   * Returns the selected layers
   *
   * @return The selected layers
   */
   getSelectedLayers() {
    let selected = new Array();
    this.checkboxes.forEach((checkbox, index, array) => {
      if (checkbox.isSelected()) {
        selected.push(this.layers[index]);
      }
    });
    return selected;
  }

  /**
   * Sets the canvas
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    for (let index = 0; index < canvas.getLayersCount(); index++) {
      let layer = canvas.getLayerAt(index);
      let label = new JSLabel();
      label.setText(Z4LayerPreview.VISIBLE_LAYER_CONTENT);
      if (!layer.isHidden()) {
        label.getStyle().color = "var(--main-action-bgcolor)";
      }
      this.add(label, new GBC(0, index + 1).a(GBC.EAST));
      let checkbox = new JSCheckBox();
      checkbox.setText(layer.getName());
      checkbox.addActionListener(event => this.onchange());
      this.add(checkbox, new GBC(1, index + 1).a(GBC.WEST));
      this.checkboxes.push(checkbox);
      this.layers.push(layer);
    }
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }
}
