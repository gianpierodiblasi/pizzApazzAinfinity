package pizzapazza.ui.frame;

import javascript.awt.BorderLayout;
import javascript.swing.JSFrame;
import pizzapazza.ui.tab.Z4Ribbon;

/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
public class Z4Frame extends JSFrame {

  private final Z4Ribbon ribbon = new Z4Ribbon();

  /**
   * Creates the object
   */
  public Z4Frame() {
    super();

    this.cssAddClass("z4frame");

    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
  }
}
