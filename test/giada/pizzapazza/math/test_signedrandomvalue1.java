package giada.pizzapazza.math;

import def.js.Array;
import def.js.JSON;
import giada.pizzapazza.math.ui.Z4SignedRandomValueUI;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import java.util.function.BiFunction;
import simulation.dom.$HTMLElement;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.di.blasi
 */
public class test_signedrandomvalue1 {

  public static void onLoad() {
    document.$getElementById("language").value = Z4Setting.getLanguage();
    document.$getElementById("language").onchange = (event) -> {
      Z4Setting.setLanguage(document.$getElementById("language").value);
      Z4MessageFactory.changingLanguage();
      return null;
    };

    document.$getElementById("theme").value = Z4Setting.getTheme();
    document.$getElementById("theme").onchange = (event) -> {
      Z4Setting.setTheme(document.$getElementById("theme").value);
      return null;
    };

    Z4SignedRandomValueUI ui1 = new Z4SignedRandomValueUI().appendToElement(document.querySelector("#test1"));
    Z4SignedRandomValueUI ui2 = new Z4SignedRandomValueUI().setRange(30, 80).setValueLabel("INTENSITY", true, true).setValue(Z4SignedRandomValue.bezier(40, 10).setSign(Z4Sign.NEGATIVE)).appendToElement(document.querySelector("#test3"));
    Z4SignedRandomValueUI ui3 = new Z4SignedRandomValueUI().setCompact().setRange(0, 1000).setValueLabel("INTENSITY", true, true).setValue(Z4SignedRandomValue.bezier(40, 10).setSign(Z4Sign.NEGATIVE)).appendToElement(document.querySelector("#test5"));

    ui1.oninput = (value) -> document.getElementById("test2").textContent = "ONINPUT " + test_signedrandomvalue1.stringify(value);
    ui1.onchange = (value) -> document.getElementById("test2").textContent = "ONCHANGE " + test_signedrandomvalue1.stringify(value);
    document.getElementById("test2").textContent = test_signedrandomvalue1.stringify(ui1.getValue());

    ui2.oninput = (value) -> document.getElementById("test4").textContent = "ONINPUT " + test_signedrandomvalue1.stringify(value);
    ui2.onchange = (value) -> document.getElementById("test4").textContent = "ONCHANGE " + test_signedrandomvalue1.stringify(value);
    document.getElementById("test4").textContent = test_signedrandomvalue1.stringify(ui2.getValue());

    ui3.oninput = (value) -> document.getElementById("test6").textContent = "ONINPUT " + test_signedrandomvalue1.stringify(value);
    ui3.onchange = (value) -> document.getElementById("test6").textContent = "ONCHANGE " + test_signedrandomvalue1.stringify(value);
    document.getElementById("test6").textContent = test_signedrandomvalue1.stringify(ui3.getValue());

    document.getElementById("sign-visible").onchange = (event) -> {
      ui1.setSignVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      ui2.setSignVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      ui3.setSignVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      return null;
    };
  }

  private static String stringify(Object object) {
    @SuppressWarnings("StringEquality")
    BiFunction<String, Object, Object> replacer = (k, v) -> {
      if (!$exists(k)) {
        return v;
      } else if (k == "bezierCurve") { // JS equality for strings
        return null;
      } else if ($typeof(v, "number")) {
        return v;
      } else if ($typeof(v, "boolean")) {
        return v;
      } else if (Array.isArray(v)) {
        return v;
      } else {
        return JSON.stringify(v).replaceAll("\"", "").replaceAll("\n", "");
      }
    };

    return JSON.stringify(object, replacer, "\t").replaceAll("\"", "");
  }

  private test_signedrandomvalue1() {
  }
}
