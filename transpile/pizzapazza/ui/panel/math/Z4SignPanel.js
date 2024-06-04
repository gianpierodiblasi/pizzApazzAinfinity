/**
 * The panel to manage a sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignPanel extends Z4AbstractValuePanel {

   radios = new Array();

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4signpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4SignPanelOrientation.HORIZONTAL) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "left");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "centerh");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 2, 0, "centerh");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 3, 0, "right");
    } else if (orientation === Z4SignPanelOrientation.VERTICAL) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "top");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 0, 1, "centerv");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 0, 2, "centerv");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 0, 3, "bottom");
    } else if (orientation === Z4SignPanelOrientation.SQUARED) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "topleft");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "topright");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 0, 1, "bottomleft");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 1, 1, "bottomright");
    }
    this.setValue(new Z4Sign(Z4SignBehavior.RANDOM));
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.value = new Z4Sign(behavior);
      this.onchange();
    });
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerh":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      case "top":
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerv":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottom":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
      case "topleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "topright":
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
    this.add(radio, new GBC(x, y));
  }

   setValue(value) {
    this.value = value;
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getSignBehavior()]).setSelected(true);
    (this.radios["" + value.getSignBehavior()]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
  }
}
