package pizzapazza.ui.panel.iterator;

import javascript.awt.GBC;
import pizzapazza.iterator.Z4Ruler;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;

/**
 * The panel to edit a Z4Ruler
 *
 * @author gianpiero.diblasi
 */
public class Z4RulerPanel extends Z4PointIteratorPanel<Z4Ruler> {
  
//  private final JSCheckBox drawWhileMoving = new JSCheckBox();

  /**
   * Creates the object
   */
  public Z4RulerPanel() {
    super();
    this.cssAddClass("z4rulerpanel");
    
//    this.drawWhileMoving.setText(Z4Translations.DRAW_WHILE_MOVING);
//    this.drawWhileMoving.addActionListener(event -> this.onIteratorChange(false));
//    this.add(this.drawWhileMoving, new GBC(0, 0).a(GBC.WEST));
    
    this.add(this.rotation, new GBC(0, 1));
    
    this.setValue(new Z4Ruler(
            true,
            new Z4Rotation(0, new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false), Z4RotationBehavior.FIXED, false))
    );
  }
  
  @Override
  protected void onIteratorChange(boolean valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    
//    this.value = new Z4Ruler(this.drawWhileMoving.isSelected(), this.rotation.getValue());
    this.onchange();
  }
  
  @Override
  public void setValue(Z4Ruler value) {
    super.setValue(value);
//    this.drawWhileMoving.setSelected(value.isDrawWhileMoving());
  }
  
  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
//    this.drawWhileMoving.setEnabled(b);
  }
}
