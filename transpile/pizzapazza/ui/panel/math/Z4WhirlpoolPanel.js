/**
 * The panel to manage a whirlpool
 *
 * @author gianpiero.diblasi
 */
class Z4WhirlpoolPanel extends Z4AbstractValuePanel {

   angle = null;

   radios = new Array();

   enabled = true;

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4whirlpoolpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4WhirlpoolPanelOrientation.HORIZONTAL) {
      Z4UI.addLabel(this, Z4Translations.WHIRLPOOL, new GBC(0, 0).a(GBC.WEST).wx(1));
      this.addRadio(Z4WhirlpoolBehavior.NONE, buttonGroup, 1, 0, "left");
      this.addRadio(Z4WhirlpoolBehavior.FORWARD, buttonGroup, 2, 0, "center");
      this.addRadio(Z4WhirlpoolBehavior.BACKWARD, buttonGroup, 3, 0, "right");
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
      this.add(this.angle, new GBC(0, 1).w(4));
    } else if (orientation === Z4WhirlpoolPanelOrientation.VERTICAL) {
      Z4UI.addLabel(this, Z4Translations.WHIRLPOOL, new GBC(0, 0).w(4).a(GBC.WEST));
      this.addRadio(Z4WhirlpoolBehavior.NONE, buttonGroup, 0, 1, "left");
      this.addRadio(Z4WhirlpoolBehavior.FORWARD, buttonGroup, 1, 1, "center");
      this.addRadio(Z4WhirlpoolBehavior.BACKWARD, buttonGroup, 2, 1, "right");
      Z4UI.addLabel(this, "", new GBC(3, 1).wx(1));
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
      this.add(this.angle, new GBC(0, 2).w(4));
    } else {
      this.angle = null;
    }
    this.angle.setLabel(Z4Translations.ANGLE);
    this.angle.setSignsVisible(false);
    this.angle.setConstantRange(0, 90);
    this.angle.setRandomRange(0, 90);
    this.angle.addChangeListener(event => this.onWhirlpoolChange(this.angle.getValueIsAdjusting()));
    this.setValue(new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false)));
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4whirlpoolpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations[behavior === Z4WhirlpoolBehavior.NONE ? "NONE_HIM" : "" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.onWhirlpoolChange(false);
    });
    let gbc = new GBC(x, y);
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "center":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    this.add(radio, gbc);
  }

   onWhirlpoolChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "NONE":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, this.angle.getValue());
            break;
          case "FORWARD":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.FORWARD, this.angle.getValue());
            break;
          case "BACKWARD":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.BACKWARD, this.angle.getValue());
            break;
        }
      }
    });
    this.angle.setEnabled(this.enabled && this.value.getWhirlpoolBehavior() !== Z4WhirlpoolBehavior.NONE);
    this.onchange();
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   */
   setRandomLengthRange(min, max) {
    this.angle.setRandomLengthRange(min, max);
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.angle.setValue(value.getAngle());
    this.angle.setEnabled(this.enabled && value.getWhirlpoolBehavior() !== Z4WhirlpoolBehavior.NONE);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getWhirlpoolBehavior()]).setSelected(true);
    (this.radios["" + value.getWhirlpoolBehavior()]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    this.enabled = b;
    this.angle.setEnabled(b && this.value.getWhirlpoolBehavior() !== Z4WhirlpoolBehavior.NONE);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
  }
}
