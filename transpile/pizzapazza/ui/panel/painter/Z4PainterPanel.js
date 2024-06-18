/**
 * The abstract panel to edit a Z4Painter
 *
 * @author gianpiero.diblasi
 * @param <T> The painter type
 */
class Z4PainterPanel extends Z4AbstractValuePanel {

  /**
   * true if value is adjusting, false otherwise
   */
   valueIsAdjusting = false;

  /**
   * true if the panel is enabled, false otherwise
   */
   enabled = true;

  constructor() {
    super();
    this.cssAddClass("z4painterpanel");
    this.setLayout(new GridBagLayout());
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.enabled = b;
  }
}
