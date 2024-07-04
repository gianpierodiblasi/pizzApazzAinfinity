/**
 * The panel to manage the lighting of a color
 *
 * @author gianpiero.diblasi
 */
class Z4LightingPanel extends Z4AbstractValuePanel {

   radios = new Array();

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4lightingpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4LightingPanelOrientation.HORIZONTAL) {
      this.addRadio(Z4Lighting.NONE, buttonGroup, 0, 0, "left");
      this.addRadio(Z4Lighting.LIGHTED_IN_OUT, buttonGroup, 1, 0, "centerh");
      this.addRadio(Z4Lighting.LIGHTED_OUT_IN, buttonGroup, 2, 0, "centerh");
      this.addRadio(Z4Lighting.DARKENED_IN_OUT, buttonGroup, 3, 0, "centerh");
      this.addRadio(Z4Lighting.DARKENED_OUT_IN, buttonGroup, 4, 0, "right");
    } else if (orientation === Z4LightingPanelOrientation.VERTICAL) {
      this.addRadio(Z4Lighting.NONE, buttonGroup, 0, 0, "top");
      this.addRadio(Z4Lighting.LIGHTED_IN_OUT, buttonGroup, 0, 1, "centerv");
      this.addRadio(Z4Lighting.LIGHTED_OUT_IN, buttonGroup, 0, 2, "centerv");
      this.addRadio(Z4Lighting.DARKENED_IN_OUT, buttonGroup, 0, 3, "centerv");
      this.addRadio(Z4Lighting.DARKENED_OUT_IN, buttonGroup, 0, 4, "bottom");
    }
    this.setValue(Z4Lighting.NONE);
  }

   addRadio(lighting, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4lightingpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations[("" + lighting).replace("NONE", "NONE_HER").replace("_IN_OUT", "").replace("_OUT_IN", "")]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(lighting));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.value = lighting;
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
    }
    buttonGroup.add(radio);
    this.radios["" + lighting] = radio;
    this.add(radio, new GBC(x, y));
  }

   setValue(value) {
    this.value = value;
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value]).setSelected(true);
    (this.radios["" + value]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
  }
}
