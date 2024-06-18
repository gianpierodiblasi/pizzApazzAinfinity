package pizzapazza.ui.panel.iterator;

import javascript.awt.GBC;
import pizzapazza.iterator.Z4Stamper;
import pizzapazza.math.Z4FancifulValue;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Rotation;
import pizzapazza.math.Z4RotationBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedRandomValue;
import pizzapazza.math.Z4SignedValue;
import pizzapazza.ui.panel.math.Z4FancifulValuePanel;
import pizzapazza.ui.panel.math.Z4FancifulValuePanelOrientation;
import pizzapazza.util.Z4Translations;

/**
 *
 * @author gianpiero.diblasi
 */
public class Z4StamperPanel extends Z4PointIteratorPanel<Z4Stamper> {
  
  private final Z4FancifulValuePanel multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
  private final Z4FancifulValuePanel push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  public Z4StamperPanel() {
    super();
    this.cssAddClass("z4stamperpanel");
    
    this.add(this.multiplicity, new GBC(0, 0).a(GBC.WEST).i(0, 0, 1, 0));
    this.add(this.push, new GBC(0, 1).a(GBC.WEST).i(0, 0, 1, 0));
    this.add(this.rotation, new GBC(0, 2));
    
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event -> this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    
    this.push.setSignsVisible(false);
    this.push.setLabel(Z4Translations.PUSH);
    this.push.cssAddClass("z4abstractvaluepanel-titled");
    this.push.addChangeListener(event -> this.onIteratorChange(this.push.getValueIsAdjusting()));
    
    this.setValue(new Z4Stamper(
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false),
            new Z4Rotation(0, new Z4FancifulValue(
                    new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0),
                    new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)),
                    false), Z4RotationBehavior.FIXED, false))
    );
  }
  
  @Override
  protected void onIteratorChange(boolean valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    
    this.value = new Z4Stamper(this.multiplicity.getValue(), this.push.getValue(), this.rotation.getValue());
    this.onchange();
  }
  
  @Override
  public void setValue(Z4Stamper value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
  }
  
  @Override
  public void setEnabled(boolean b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.push.setEnabled(b);
  }
}
