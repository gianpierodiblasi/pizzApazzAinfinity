package giada.pizzapazza.iterator.ui;

import giada.pizzapazza.iterator.Z4Spirograph;
import giada.pizzapazza.painter.Z4Painter;
import giada.pizzapazza.setting.Z4HTMLFactory;

/**
 * The component to edit a Z4Spirograph
 *
 * @author gianpiero.di.blasi
 */
public class Z4SpirographUI extends Z4PointIteratorUI<Z4Spirograph> {

  private final static String UI = Z4HTMLFactory.get("giada/pizzapazza/iterator/ui/Z4SpirographUI.html");

  /**
   * Creates a Z4SpirographUI
   */
  public Z4SpirographUI() {
    super(Z4SpirographUI.UI);

    this.querySelector(".point-iterator-arrow-module-container").style.display = "none";
    this.setValue(new Z4Spirograph());
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T extends Z4PointIteratorUI<?>> T setPainter(Z4Painter<?> painter) {
    super.setPainter(painter);
    this.querySelector(".point-iterator-arrow-module-container").style.display = "none";
    return (T) this;
  }
}
