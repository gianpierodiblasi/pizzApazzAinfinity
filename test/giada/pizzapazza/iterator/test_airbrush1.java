package giada.pizzapazza.iterator;

import def.js.Array;
import def.js.JSON;
import giada.pizzapazza.color.ui.Z4GradientColorUI;
import giada.pizzapazza.iterator.ui.Z4AirbrushUI;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4Shape2DPainter;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import java.util.function.BiFunction;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.di.blasi
 */
public class test_airbrush1 {

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

    Z4AirbrushUI ui = new Z4AirbrushUI().appendToElement(document.getElementById("test1"));
    ui.oninput = (value) -> document.getElementById("test2").textContent = "ONINPUT " + test_airbrush1.stringify(value);
    ui.onchange = (value) -> document.getElementById("test2").textContent = "ONCHANGE " + test_airbrush1.stringify(value);
    document.getElementById("test2").textContent = test_airbrush1.stringify(ui.getValue());

    document.$getElementById("painter").onchange = (event) -> {
      switch (document.$getElementById("painter").value) {
        case "none":
          ui.setPainter(null);
          break;
        case "shape2d":
          ui.setPainter(new Z4Shape2DPainter());
          break;
      }
      return null;
    };

    Z4GradientColorUI ui2 = new Z4GradientColorUI().appendToElement(document.querySelector("#color"));
    ui2.oninput = (value) -> ui.setGradientColor(value);
    ui2.onchange = (value) -> ui.setGradientColor(value);
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
      } else if (v instanceof Z4Rotation) {
        return v;
      } else if (v instanceof Z4FancifulValue) {
        return v;
      } else if (v instanceof Z4SignedRandomValue) {
        return v;
      } else if (v instanceof Z4Point) {
        return v;
      } else if (v instanceof Z4Vector) {
        return v;
      } else {
        return JSON.stringify(v).replaceAll("\"", "").replaceAll("\n", "");
      }
    };

    return JSON.stringify(object, replacer, "\t").replaceAll("\"", "");
  }

  private test_airbrush1() {
  }
}
