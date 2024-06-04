/**
 * The panel to manage a sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignPanel extends Z4AbstractValuePanel {

   radios = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4signpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "left");
    this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "center");
    this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 2, 0, "center");
    this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 3, 0, "right");
    this.setValue(new Z4Sign(Z4SignBehavior.RANDOM));
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => this.onchange());
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
    this.add(radio, new GBC(x, y));
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getSignBehavior()]).setSelected(true);
  }
}
