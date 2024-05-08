/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Frame extends JSFrame {

   ribbon = new Z4Ribbon();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4frame");
    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
  }
}
