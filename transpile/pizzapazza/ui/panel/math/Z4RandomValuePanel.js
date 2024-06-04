/**
 * The panel to manage a random value
 *
 * @author gianpiero.diblasi
 */
class Z4RandomValuePanel extends Z4AbstractRandomValuePanel {

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super(false, orientation);
    this.cssAddClass("z4randomvaluepanel");
    this.setValue(new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0));
  }

   onRandomValueChange() {
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
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

   setValue(value) {
    this.value = value;
    this.valuePanel.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getValue()));
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getRandomValueBehavior()]).setSelected(true);
    (this.radios["" + value.getRandomValueBehavior()]).setContentAreaFilled(true);
    this.lengthPanel.setEnabled(value.getRandomValueBehavior() !== Z4RandomValueBehavior.CLASSIC);
    this.lengthPanel.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getLength()));
  }
}
