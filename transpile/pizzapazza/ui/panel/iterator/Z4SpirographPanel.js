/**
 * The panel to edit a Z4Spirograph
 *
 * @author gianpiero.diblasi
 */
class Z4SpirographPanel extends Z4PointIteratorPanel {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4spirographpanel");
    this.add(this.rotation, new GBC(0, 0));
    this.setValue(new Z4Spirograph(new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.value = new Z4Spirograph(this.rotation.getValue());
    this.onchange();
  }
}
