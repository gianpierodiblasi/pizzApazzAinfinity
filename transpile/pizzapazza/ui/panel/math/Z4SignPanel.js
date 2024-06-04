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
    this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 1);
    this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 2);
    this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 3);
    this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 4);
    this.setValue(new Z4Sign(Z4SignBehavior.RANDOM));
  }

   addRadio(behavior, buttonGroup, x) {
    let radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => this.onchange());
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    this.add(radio, new GBC(x, 0));
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getSignBehavior()]).setSelected(true);
  }
}
