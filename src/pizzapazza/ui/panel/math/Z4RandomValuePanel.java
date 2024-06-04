package pizzapazza.ui.panel.math;

import def.js.Object;
import javascript.swing.JSRadioButton;
import pizzapazza.math.Z4RandomValue;
import pizzapazza.math.Z4RandomValueBehavior;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.math.Z4SignedValue;

/**
 * The panel to manage a random value
 *
 * @author gianpiero.diblasi
 */
public class Z4RandomValuePanel extends Z4AbstractRandomValuePanel<Z4RandomValue> {

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  public Z4RandomValuePanel(Z4RandomValuePanelOrientation orientation) {
    super(false, orientation);
    this.cssAddClass("z4randomvaluepanel");

    this.setValue(new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0));
  }

  @Override
  protected void onRandomValueChange() {
    Object.keys(this.radios).forEach(key -> {
      if (((JSRadioButton) this.radios.$get(key)).isSelected()) {
        switch ("" + key) {
          case "CLASSIC":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.CLASSIC, this.lengthPanel.getValue().getValue());
            break;
          case "BEZIER":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.BEZIER, this.lengthPanel.getValue().getValue());
            break;
          case "POLYLINE":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.POLYLINE, this.lengthPanel.getValue().getValue());
            break;
          case "STEPPED":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.STEPPED, this.lengthPanel.getValue().getValue());
            break;
        }
      }
    });
  }

  @Override
  public void setValue(Z4RandomValue value) {
    this.value = value;
    this.valuePanel.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getValue()));

    Object.keys(this.radios).forEach(key -> ((JSRadioButton) this.radios.$get(key)).setContentAreaFilled(false));
    ((JSRadioButton) this.radios.$get("" + value.getRandomValueBehavior())).setSelected(true);
    ((JSRadioButton) this.radios.$get("" + value.getRandomValueBehavior())).setContentAreaFilled(true);

    this.lengthPanel.setEnabled(value.getRandomValueBehavior() != Z4RandomValueBehavior.CLASSIC);
    this.lengthPanel.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getLength()));
  }
}
