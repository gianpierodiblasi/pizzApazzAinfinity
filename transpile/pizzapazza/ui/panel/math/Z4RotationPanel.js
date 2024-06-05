/**
 * The panel to manage a rotation
 *
 * @author gianpiero.diblasi
 */
class Z4RotationPanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   startAngle = null;

   angle = null;

   radios = new Array();

   delayed = new JSToggleButton();

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4rotationpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4RotationPanelOrientation.HORIZONTAL) {
      this.cssAddClass("z4rotationpanel-horizontal");
      this.add(this.label, new GBC(0, 0));
      this.startAngle = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.startAngle, new GBC(1, 0).h(2).a(GBC.SOUTHEAST).wx(1));
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
      this.add(this.angle, new GBC(0, 2).w(6));
      this.addRadio(Z4RotationBehavior.FIXED, buttonGroup, 3, 0, "left");
      this.addRadio(Z4RotationBehavior.CUMULATIVE, buttonGroup, 4, 0, "center");
      this.addRadio(Z4RotationBehavior.RELATIVE_TO_PATH, buttonGroup, 5, 0, "right");
      this.add(this.delayed, new GBC(2, 1).w(4));
    } else if (orientation === Z4RotationPanelOrientation.VERTICAL) {
      this.cssAddClass("z4rotationpanel-vertical");
      this.add(this.label, new GBC(0, 0).w(4).a(GBC.WEST));
      this.startAngle = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.startAngle, new GBC(0, 1).w(4).i(0, 0, 1, 0));
      this.addRadio(Z4RotationBehavior.FIXED, buttonGroup, 0, 2, "left");
      this.addRadio(Z4RotationBehavior.CUMULATIVE, buttonGroup, 1, 2, "center");
      this.addRadio(Z4RotationBehavior.RELATIVE_TO_PATH, buttonGroup, 2, 2, "center");
      this.delayed.getStyle().borderTopLeftRadius = "0px";
      this.delayed.getStyle().borderBottomLeftRadius = "0px";
      this.delayed.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
      this.add(this.delayed, new GBC(3, 2));
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
      this.add(this.angle, new GBC(0, 3).w(4).i(1, 0, 0, 0));
    } else {
      this.startAngle = null;
      this.angle = null;
    }
    this.startAngle.setRange(0, 360);
    this.startAngle.setSignVisible(false);
    this.startAngle.setLabel(Z4Translations.START_ANGLE);
    this.startAngle.addChangeListener(event => this.onRotationChange(this.startAngle.getValueIsAdjusting()));
    this.angle.setLabel(Z4Translations.ANGLE);
    this.angle.setConstantRange(0, 180);
    this.angle.setRandomRange(0, 180);
    this.angle.addChangeListener(event => this.onRotationChange(this.angle.getValueIsAdjusting()));
    this.delayed.cssAddClass("z4rotationpanel-delayed");
    this.delayed.getStyle().padding = "1px";
    this.delayed.setTooltip(Z4Translations.DELAYED);
    this.delayed.setIcon(new Z4EmptyImageProducer(""));
    this.delayed.addActionListener(event => this.onRotationChange(false));
    this.setValue(new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false));
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4rotationpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.onRotationChange(false);
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
      case "topleft":
        // gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "topright":
        // gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomright":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    this.add(radio, gbc);
  }

   onRotationChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.delayed.setContentAreaFilled(this.delayed.isSelected());
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "FIXED":
            this.value = new Z4Rotation(this.startAngle.getValue().getValue(), this.angle.getValue(), Z4RotationBehavior.FIXED, this.delayed.isSelected());
            break;
          case "CUMULATIVE":
            this.value = new Z4Rotation(this.startAngle.getValue().getValue(), this.angle.getValue(), Z4RotationBehavior.CUMULATIVE, this.delayed.isSelected());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4Rotation(this.startAngle.getValue().getValue(), this.angle.getValue(), Z4RotationBehavior.RELATIVE_TO_PATH, this.delayed.isSelected());
            break;
        }
      }
    });
    this.onchange();
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.label.setText(label);
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
    this.startAngle.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getStartAngle()));
    this.angle.setValue(value.getAngle());
    this.delayed.setSelected(value.isDelayed());
    this.delayed.setContentAreaFilled(value.isDelayed());
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getRotationBehavior()]).setSelected(true);
    (this.radios["" + value.getRotationBehavior()]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    this.startAngle.setEnabled(b);
    this.angle.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    this.delayed.setEnabled(b);
  }
}
