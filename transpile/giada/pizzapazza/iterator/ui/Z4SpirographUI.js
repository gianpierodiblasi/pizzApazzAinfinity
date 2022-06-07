/**
 * The component to edit a Z4Spirograph
 *
 * @author gianpiero.di.blasi
 */
class Z4SpirographUI extends Z4PointIteratorUI {

  static  UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4SpirographUI.html");

  /**
   * Creates a Z4SpirographUI
   */
  constructor() {
    super(Z4SpirographUI.UI);
    this.querySelector(".point-iterator-arrow-module-container").style.display = "none";
    this.setValue(new Z4Spirograph());
  }

   setPainter(painter) {
    super.setPainter(painter);
    this.querySelector(".point-iterator-arrow-module-container").style.display = "none";
    return this;
  }
}
