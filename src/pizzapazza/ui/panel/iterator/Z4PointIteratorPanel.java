package pizzapazza.ui.panel.iterator;

import javascript.awt.GridBagLayout;
import pizzapazza.iterator.Z4PointIterator;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.ui.panel.math.Z4RotationPanel;
import pizzapazza.ui.panel.math.Z4RotationPanelOrientation;
import pizzapazza.util.Z4Translations;

/**
 * The abstract panel to edit a Z4PointIterator
 *
 * @author gianpiero.diblasi
 * @param <T> The point iterator type
 */
public abstract class Z4PointIteratorPanel<T extends Z4PointIterator> extends Z4AbstractValuePanel<T> {

  /**
   * The rotation panel
   */
  protected final Z4RotationPanel rotation = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);

  /**
   * true if value is adjusting, false otherwise
   */
  protected boolean valueIsAdjusting;

  /**
   * true if the panel is enabled, false otherwise
   */
  protected boolean enabled = true;

  /**
   * Creates the object
   */
  public Z4PointIteratorPanel() {
    super();
    this.cssAddClass("z4pointiteratorpanel");
    this.setLayout(new GridBagLayout());

    this.rotation.setLabel(Z4Translations.ROTATION);
    this.rotation.cssAddClass("z4abstractvaluepanel-titled");
    this.rotation.addChangeListener(event -> this.onIteratorChange(this.rotation.getValueIsAdjusting()));
  }

  /**
   * The method to call on iterator changes
   *
   * @param valueIsAdjusting true if value is adjusting, false otherwise
   */
  protected abstract void onIteratorChange(boolean valueIsAdjusting);

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
  public boolean getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  @Override
  public void setValue(T value) {
    this.value = value;
    this.rotation.setValue(value.getRotation());
  }

  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.enabled = b;
    this.rotation.setEnabled(b);
  }
}
