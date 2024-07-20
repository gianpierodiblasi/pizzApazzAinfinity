/**
 * The panel to manage shapes and paths
 *
 * @author gianpiero.diblasi
 */
class Z4ShapesAndPathsPanel extends JSPanel {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4shapesandpathspanel");
    this.setLayout(new GridBagLayout());
    let fieldset = new JSComponent(document.createElement("fieldset"));
    this.add(fieldset, new GBC(0, 0).f(GBC.BOTH).wxy(1, 1));
    let legend = new JSComponent(document.createElement("legend"));
    legend.setContent(Z4Translations.SHAPES_AND_PATHS);
    fieldset.appendChild(legend);
    let panel = new JSPanel();
    panel.cssAddClass("z4shapesandpathspanel-container");
    panel.setLayout(new GridBagLayout());
    fieldset.appendChild(panel);
  }
}
