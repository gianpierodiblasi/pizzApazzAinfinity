package pizzapazza.ui.panel;

import def.js.Array;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSButton;
import javascript.swing.JSCheckBox;
import javascript.swing.JSLabel;
import javascript.swing.JSPanel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.ui.component.Z4Canvas;
import pizzapazza.ui.component.Z4LayerPreview;
import pizzapazza.util.Z4Layer;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$typeof;

/**
 * The panel to merge layers
 *
 * @author gianpiero.diblasi
 */
public class Z4MergeLayerPanel extends JSPanel {

  private final Array<JSCheckBox> checkboxes = new Array<>();
  private final Array<Z4Layer> layers = new Array<>();
  private final Array<ChangeListener> listeners = new Array<>();

  /**
   * Creates the object
   */
  public Z4MergeLayerPanel() {
    super();
    this.cssAddClass("z4mergelayerpanel");
    this.setLayout(new GridBagLayout());

    JSButton button = new JSButton();
    button.setText(Z4Translations.MERGE_VISIBLE_LAYERS);
    button.addActionListener(event -> {
      this.layers.forEach((layer, index, array) -> this.checkboxes.$get(index).setSelected(!layer.isHidden()));
      this.onchange();
    });
    this.add(button, new GBC(0, 0).i(0, 0, 0, 2));

    button = new JSButton();
    button.setText(Z4Translations.MERGE_ALL_LAYERS);
    button.addActionListener(event -> {
      this.checkboxes.forEach((checkbox, index, array) -> checkbox.setSelected(true));
      this.onchange();
    });
    this.add(button, new GBC(1, 0).i(0, 2, 0, 0));
  }

  /**
   * Returns the selected layers
   *
   * @return The selected layers
   */
  public Array<Z4Layer> getSelectedLayers() {
    Array<Z4Layer> selected = new Array<>();

    this.checkboxes.forEach((checkbox, index, array) -> {
      if (checkbox.isSelected()) {
        selected.push(this.layers.$get(index));
      }
    });

    return selected;
  }

  /**
   * Sets the canvas
   *
   * @param canvas The canvas
   */
  public void setCanvas(Z4Canvas canvas) {
    for (int index = 0; index < canvas.getLayersCount(); index++) {
      Z4Layer layer = canvas.getLayerAt(index);

      JSLabel label = new JSLabel();
      label.setText(Z4LayerPreview.VISIBLE_LAYER_CONTENT);
      if (!layer.isHidden()) {
        label.getStyle().color = "var(--main-action-bgcolor)";
      }
      this.add(label, new GBC(0, index + 1).a(GBC.EAST).i(0, 0, 0, 2));

      JSCheckBox checkbox = new JSCheckBox();
      checkbox.setText(layer.getName());
      checkbox.addActionListener(event -> this.onchange());
      this.add(checkbox, new GBC(1, index + 1).a(GBC.WEST));

      this.checkboxes.push(checkbox);
      this.layers.push(layer);
    }
  }

  private void onchange() {
    ChangeEvent event = new ChangeEvent();

    this.listeners.forEach(listener -> {
      if ($typeof(listener, "function")) {
        listener.$apply(event);
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
  public void addChangeListener(ChangeListener listener) {
    this.listeners.push(listener);
  }
}
