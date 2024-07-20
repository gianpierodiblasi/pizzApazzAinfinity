/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Frame extends JSFrame {

   ribbon = new Z4Ribbon();

   canvas = new Z4Canvas();

   shapesAndPathsPanel = new Z4ShapesAndPathsPanel();

   statusPanel = new Z4StatusPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4frame");
    this.ribbon.setCanvas(this.canvas);
    this.ribbon.setShapesAndPathsPanel(this.shapesAndPathsPanel);
    this.ribbon.setStatusPanel(this.statusPanel);
    this.canvas.setStatusPanel(this.statusPanel);
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    panel.add(this.shapesAndPathsPanel, new GBC(0, 0).f(GBC.BOTH).wxy(1, 1));
    this.shapesAndPathsPanel.getStyle().display = "none";
    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
    this.getContentPane().add(this.canvas, BorderLayout.CENTER);
    this.getContentPane().add(panel, BorderLayout.EAST);
    this.getContentPane().add(this.statusPanel, BorderLayout.SOUTH);
    this.canvas.create(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, new Color(0, 0, 0, 0));
    window.onbeforeunload = event => {
      if (!this.canvas.isSaved()) {
        event.preventDefault();
        event.returnValue = Z4Translations.PROJECT_NOT_SAVED_MESSAGE;
        return event.returnValue;
      } else {
        return null;
      }
    };
  }
}
