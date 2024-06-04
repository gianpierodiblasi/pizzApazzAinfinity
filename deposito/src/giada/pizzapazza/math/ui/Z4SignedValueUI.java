package giada.pizzapazza.math.ui;

import static def.dom.Globals.clearTimeout;
import def.dom.HTMLElement;
import def.dom.NodeList;
import giada.pizzapazza.Z4Loader;
import giada.pizzapazza.math.Z4Sign;
import giada.pizzapazza.math.Z4SignedValue;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.ui.Z4AbstractComponentWithValueUI;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_2_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.setTimeout;

/**
 * The component to edit a signed value
 *
 * @author gianpiero.diblasi
 */
public class Z4SignedValueUI extends Z4AbstractComponentWithValueUI<Z4SignedValue> {

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   * @return This Z4SignedValueUI
   */
  public Z4SignedValueUI setSignVisible(boolean visible) {
    this.signVisible = visible;
    if (visible) {
      this.querySelector(".signed-value-input-group").classList.remove("sign-not-visible");
    } else {
      this.querySelector(".signed-value-input-group").classList.add("sign-not-visible");
    }

    return this;
  }

  /**
   * Checks if the sign is visible
   *
   * @return true if the sign is visible, false otherwise
   */
  public boolean isSignVisible() {
    return this.signVisible;
  }
}
