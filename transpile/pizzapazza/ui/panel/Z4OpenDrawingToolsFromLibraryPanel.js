/**
 * The panel to open the drawing tools from library
 *
 * @author gianpiero.diblasi
 */
class Z4OpenDrawingToolsFromLibraryPanel extends JSPanel {

   checkboxes = new Array();

   drawingTools = new Array();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4opendrawingtoolsfromlibrarypanel");
    this.setLayout(new GridBagLayout());
    let json = null;
    eval("json = z4drawingtool_library");
    json.sort((obj1, obj2) => {
      let name1 = obj1[Z4Translations.CURRENT_LANGUAGE.key];
      let name2 = obj2[Z4Translations.CURRENT_LANGUAGE.key];
      let response = 0;
      eval("response = name1 < name2 ? -1 : +1");
      return response;
    }).forEach((obj, index, array) => {
      let checkbox = new JSCheckBox();
      checkbox.setText(obj[Z4Translations.CURRENT_LANGUAGE.key]);
      checkbox.addActionListener(event => this.onchange());
      this.add(checkbox, new GBC(0, index).a(GBC.WEST));
      this.checkboxes.push(checkbox);
      let z4drawingtool = obj["z4drawingtool"];
      z4drawingtool["name"] = obj[Z4Translations.CURRENT_LANGUAGE.key];
      this.drawingTools.push(z4drawingtool);
    });
  }

  /**
   * Returns the selected drawing tools
   *
   * @return The selected drawing tools
   */
   getSelectedDrawingTools() {
    let selected = new Array();
    this.checkboxes.forEach((checkbox, index, array) => {
      if (checkbox.isSelected()) {
        selected.push(this.drawingTools[index]);
      }
    });
    return selected;
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
