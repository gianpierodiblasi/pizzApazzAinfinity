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
    this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 1);
    this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 2);
    this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 3);
    this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 4);

    this.setValue(new Z4Sign(Z4SignBehavior.RANDOM));
  }

  private void addRadio(Z4SignBehavior behavior, ButtonGroup buttonGroup, int x) {
    JSRadioButton radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer<>(behavior));
    radio.addActionListener(event -> this.onchange());

    buttonGroup.add(radio);
    this.radios.$set("" + behavior, radio);
    this.add(radio, new GBC(x, 0));
  }

  @Override
  public void setValue(Z4Sign value) {
    this.value = value;

    ((JSRadioButton) this.radios.$get("" + value.getSignBehavior())).setSelected(true);
  }
}
