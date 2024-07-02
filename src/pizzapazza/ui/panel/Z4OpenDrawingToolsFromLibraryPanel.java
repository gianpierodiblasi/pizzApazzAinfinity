package pizzapazza.ui.panel;

import def.js.Array;
import static def.js.Globals.eval;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.JSCheckBox;
import javascript.swing.JSPanel;
import javascript.swing.event.ChangeEvent;
import javascript.swing.event.ChangeListener;
import pizzapazza.util.Z4Translations;
import static simulation.js.$Globals.$typeof;
import simulation.js.$Object;

/**
 * The panel to open the drawing tools from library
 *
 * @author gianpiero.diblasi
 */
public class Z4OpenDrawingToolsFromLibraryPanel extends JSPanel {

  private final Array<JSCheckBox> checkboxes = new Array<>();
  private final Array<$Object> drawingTools = new Array<>();
  private final Array<ChangeListener> listeners = new Array<>();

  /**
   * Creates the object
   */
  @SuppressWarnings("null")
  public Z4OpenDrawingToolsFromLibraryPanel() {
    super();
    this.cssAddClass("z4opendrawingtoolsfromlibrarypanel");
    this.setLayout(new GridBagLayout());

    Array<$Object> json = null;
    eval("json = z4drawingtool_library");
    json.sort((obj1, obj2) -> {
      String name1 = obj1.$get(Z4Translations.CURRENT_LANGUAGE.key);
      String name2 = obj2.$get(Z4Translations.CURRENT_LANGUAGE.key);
      int response = 0;
      eval("response = name1 < name2 ? -1 : +1");
      return response;
    }).forEach((obj, index, array) -> {
      JSCheckBox checkbox = new JSCheckBox();
      checkbox.setText(obj.$get(Z4Translations.CURRENT_LANGUAGE.key));
      checkbox.addActionListener(event -> this.onchange());
      this.add(checkbox, new GBC(0, index).a(GBC.WEST));
      this.checkboxes.push(checkbox);

      $Object z4drawingtool = obj.$get("z4drawingtool");
      z4drawingtool.$set("name", obj.$get(Z4Translations.CURRENT_LANGUAGE.key));
      this.drawingTools.push(z4drawingtool);
    });
  }

  /**
   * Returns the selected drawing tools
   *
   * @return The selected drawing tools
   */
  public Array<$Object> getSelectedDrawingTools() {
    Array<$Object> selected = new Array<>();

    this.checkboxes.forEach((checkbox, index, array) -> {
      if (checkbox.isSelected()) {
        selected.push(this.drawingTools.$get(index));
      }
    });

    return selected;
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
