package pizzapazza.ui.panel.painter;

import javascript.awt.GridBagLayout;
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
   * true if the panel is enabled, false otherwise
   */
  protected boolean enabled = true;

  public Z4PainterPanel() {
    super();
    this.cssAddClass("z4painterpanel");
    this.setLayout(new GridBagLayout());
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
  }
}
