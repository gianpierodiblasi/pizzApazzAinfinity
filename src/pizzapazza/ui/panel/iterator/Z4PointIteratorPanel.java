package pizzapazza.ui.panel.iterator;

import javascript.awt.GridBagLayout;
import pizzapazza.iterator.Z4PointIterator;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.ui.panel.math.Z4RotationPanel;
import pizzapazza.ui.panel.math.Z4RotationPanelOrientation;

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
   * Creates the object
   */
  public Z4PointIteratorPanel() {
    super();
    this.cssAddClass("z4pointiteratorpanel");
    this.setLayout(new GridBagLayout());
    
    this.rotation.addChangeListener(event -> this.onIteratorChange());
  }

  /**
   * The method to call on iterator changes
   */
  protected abstract void onIteratorChange();
  
  @Override
  public void setValue(T value) {
    this.rotation.setValue(value.getRotation());
  }
  
  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.rotation.setEnabled(b);
  }  
}
