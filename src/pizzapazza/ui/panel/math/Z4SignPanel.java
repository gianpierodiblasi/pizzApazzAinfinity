package pizzapazza.ui.panel.math;

import def.js.Array;
import javascript.awt.GBC;
import javascript.awt.GridBagLayout;
import javascript.swing.ButtonGroup;
import javascript.swing.JSRadioButton;
import pizzapazza.math.Z4Sign;
import pizzapazza.math.Z4SignBehavior;
import pizzapazza.ui.panel.Z4AbstractValuePanel;
import pizzapazza.util.Z4EmptyImageProducer;
import pizzapazza.util.Z4Translations;

/**
 * The panel to manage a sign
 *
 * @author gianpiero.diblasi
 */
public class Z4SignPanel extends Z4AbstractValuePanel<Z4Sign> {

  private final Array<JSRadioButton> radios = new Array<>();

  /**
   * Creates the object
   */
  public Z4SignPanel() {
    super();
    this.cssAddClass("z4signpanel");
    this.setLayout(new GridBagLayout());

    ButtonGroup buttonGroup = new ButtonGroup();
    this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "left");
    this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "center");
    this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 2, 0, "center");
    this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 3, 0, "right");

    this.setValue(new Z4Sign(Z4SignBehavior.RANDOM));
  }

  private void addRadio(Z4SignBehavior behavior, ButtonGroup buttonGroup, int x, int y, String border) {
    JSRadioButton radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.setTooltip(Z4Translations.$get("" + behavior));
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> this.onchange());

    switch (border) {
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
    this.radios.$set("" + behavior, radio);
    this.add(radio, new GBC(x, y));
  }

  @Override
  public void setValue(Z4Sign value) {
    this.value = value;

    ((JSRadioButton) this.radios.$get("" + value.getSignBehavior())).setSelected(true);
  }
}
