/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Frame extends JSFrame {

   ribbon = new Z4Ribbon();

   canvas = new Z4Canvas();

   statusPanel = new Z4StatusPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4frame");
    this.getContentPane().setLayout(new BorderLayout(5, 5));
    this.ribbon.setCanvas(this.canvas);
    this.ribbon.setStatusPanel(this.statusPanel);
    this.canvas.setStatusPanel(this.statusPanel);
    this.statusPanel.setCanvas(this.canvas);
    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
    this.getContentPane().add(this.canvas, BorderLayout.CENTER);
    this.getContentPane().add(this.statusPanel, BorderLayout.SOUTH);
  }
}
