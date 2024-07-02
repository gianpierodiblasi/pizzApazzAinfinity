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
    Object.keys(json).forEach((key, index, array) => {
      let value = json[key];
      let checkbox = new JSCheckBox();
      checkbox.setText(value[Z4Translations.CURRENT_LANGUAGE.key]);
      checkbox.addActionListener(event => this.onchange());
      this.add(checkbox, new GBC(0, index).a(GBC.WEST));
      this.checkboxes.push(checkbox);
      let z4drawingtool = value["z4drawingtool"];
      z4drawingtool["name"] = value[Z4Translations.CURRENT_LANGUAGE.key];
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
