package giada.pizzapazza.math;

import def.js.Array;
import def.js.JSON;
import giada.pizzapazza.math.ui.Z4FancifulValueUI;
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
public class test_fancifulvalue1 {

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

    Z4FancifulValueUI ui1 = new Z4FancifulValueUI().appendToElement(document.querySelector("#test1"));

    Z4FancifulValue v = new Z4FancifulValue().
            setConstant(new Z4SignedValue().setValue(10).setSign(Z4Sign.NEGATIVE)).
            setRandom(Z4SignedRandomValue.bezier(20, 10).setSign(Z4Sign.RANDOM));

    Z4FancifulValueUI ui2 = new Z4FancifulValueUI().setValue(v).appendToElement(document.querySelector("#test3"));
    Z4FancifulValueUI ui3 = new Z4FancifulValueUI().appendToElement(document.querySelector("#test5"));

    ui1.oninput = (value) -> document.getElementById("test2").textContent = "ONINPUT " + test_fancifulvalue1.stringify(value);
    ui1.onchange = (value) -> document.getElementById("test2").textContent = "ONCHANGE " + test_fancifulvalue1.stringify(value);
    document.getElementById("test2").textContent = test_fancifulvalue1.stringify(ui1.getValue());

    ui2.oninput = (value) -> document.getElementById("test4").textContent = "ONINPUT " + test_fancifulvalue1.stringify(value);
    ui2.onchange = (value) -> document.getElementById("test4").textContent = "ONCHANGE " + test_fancifulvalue1.stringify(value);
    document.getElementById("test4").textContent = test_fancifulvalue1.stringify(ui2.getValue());

    ui3.oninput = (value) -> document.getElementById("test6").textContent = "ONINPUT " + test_fancifulvalue1.stringify(value);
    ui3.onchange = (value) -> document.getElementById("test6").textContent = "ONCHANGE " + test_fancifulvalue1.stringify(value);
    document.getElementById("test6").textContent = test_fancifulvalue1.stringify(ui3.getValue());

    document.getElementById("sign-visible").onchange = (event) -> {
      ui1.setSignsVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      ui2.setSignsVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
      ui3.setSignsVisible((($HTMLElement) document.getElementById("sign-visible")).checked);
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
      } else if (v instanceof Z4SignedRandomValue) {
        return v;
      } else {
        return JSON.stringify(v).replaceAll("\"", "").replaceAll("\n", "");
      }
    };

    return JSON.stringify(object, replacer, "\t").replaceAll("\"", "");
  }

  private test_fancifulvalue1() {
  }
}
