package giada.pizzapazza.math;

import def.js.Array;
import def.js.JSON;
import giada.pizzapazza.math.ui.Z4SignedValueUI;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import java.util.function.BiFunction;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.diblasi
 */
public class test_signedvalue1 {

  public static void onLoad() {
    Z4SignedValueUI ui1 = new Z4SignedValueUI().appendToElement(document.querySelector("#test1"));
    Z4SignedValueUI ui2 = new Z4SignedValueUI().setRange(30, 80, true).setValueLabel("INTENSITY", true, true).setValue(new Z4SignedValue().setSign(Z4Sign.NEGATIVE).setValue(50)).appendToElement(document.querySelector("#test3"));
    Z4SignedValueUI ui3 = new Z4SignedValueUI().setCompact().setRange(0, 1000, true).setValueLabel("INTENSITY", true, true).setValue(new Z4SignedValue().setSign(Z4Sign.NEGATIVE).setValue(50)).appendToElement(document.querySelector("#test5"));

    ui1.oninput = (value) -> document.getElementById("test2").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui1.onchange = (value) -> document.getElementById("test2").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test2").textContent = test_signedvalue1.stringify(ui1.getValue());

    ui2.oninput = (value) -> document.getElementById("test4").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui2.onchange = (value) -> document.getElementById("test4").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test4").textContent = test_signedvalue1.stringify(ui2.getValue());

    ui3.oninput = (value) -> document.getElementById("test6").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui3.onchange = (value) -> document.getElementById("test6").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test6").textContent = test_signedvalue1.stringify(ui3.getValue());

    document.getElementById("sign-visible").onchange = (event) -> {
      ui1.setSignVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      ui2.setSignVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      ui3.setSignVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      return null;
    };

    document.getElementById("enabled").onchange = (event) -> {
      ui1.setEnabled((($HTMLElement) document.getElementById("enabled")).checked);
      ui2.setEnabled((($HTMLElement) document.getElementById("enabled")).checked);
      ui3.setEnabled((($HTMLElement) document.getElementById("enabled")).checked);
      return null;
    };
  }

  private test_signedvalue1() {
  }
}
