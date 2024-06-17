package pizzapazza.ui.panel.painter;

import pizzapazza.painter.Z4Painter;
import pizzapazza.ui.panel.Z4AbstractValuePanel;

/**
 * The abstract panel to edit a Z4Painter
 *
 * @author gianpiero.diblasi
 * @param <T> The painter type
 */
public abstract class Z4PainterPanel<T extends Z4Painter> extends Z4AbstractValuePanel<T> {

  /**
   * true if value is adjusting, false otherwise
   */
  protected boolean valueIsAdjusting;
  
  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }
}
