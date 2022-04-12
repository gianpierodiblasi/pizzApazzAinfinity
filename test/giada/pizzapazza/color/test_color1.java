package giada.pizzapazza.color;

import static def.dom.Globals.document;
import static def.dom.Globals.window;
import def.js.Array;
import def.js.JSON;
import java.util.function.BiFunction;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;

/**
 *
 * @author gianpiero.di.blasi
 */
public class test_color1 {

  public static void onLoad() {
    window.onload = (event) -> {
      document.getElementById("test1").textContent = "new Z4Color(0,0,0,0) => " + stringify(new Z4Color(0, 0, 0, 0));
      document.getElementById("test2").textContent = "new Z4Color(0,255,0,0) => " + stringify(new Z4Color(0, 255, 0, 0));
      document.getElementById("test3").textContent = "new Z4Color(255,255,255,255) => " + stringify(new Z4Color(255, 255, 255, 255));

      return null;
    };
  }

  private static String stringify(Object object) {

    BiFunction<String, Object, Object> replacer = (k, v) -> {
      if (!$exists(k)) {
        return v;
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

  private test_color1() {
  }
}
