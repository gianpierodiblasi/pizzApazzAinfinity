package pizzapazza.ui.frame;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import pizzapazza.ui.Z4Canvas;
import pizzapazza.ui.tab.Z4Ribbon;

/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Frame extends JSFrame {

  private final Z4Ribbon ribbon = new Z4Ribbon();
  private final Z4Canvas canvas = new Z4Canvas();

  /**
   * Creates the object
   */
  public Z4Frame() {
    super();
    this.cssAddClass("z4frame");
    this.getContentPane().setLayout(new BorderLayout(5, 5));

    this.ribbon.setCanvas(this.canvas);

    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
    this.getContentPane().add(this.canvas, BorderLayout.CENTER);
  }
}
