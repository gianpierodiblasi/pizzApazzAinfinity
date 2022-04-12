package giada.pizzapazza.color;

import static def.dom.Globals.document;
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
    document.getElementById("test1").textContent = "new Z4Color(0,0,0,0) => " + test_color1.stringify(new Z4Color(0, 0, 0, 0));
    document.getElementById("test2").textContent = "new Z4Color(0,255,0,0) => " + test_color1.stringify(new Z4Color(0, 255, 0, 0));
    document.getElementById("test3").textContent = "new Z4Color(255,255,255,255) => " + test_color1.stringify(new Z4Color(255, 255, 255, 255));

    document.getElementById("test4").textContent = "Z4Color.fromColor(255) => " + test_color1.stringify(Z4Color.fromARGB(255));
    document.getElementById("test5").textContent = "Z4Color.fromColor(65535) => " + test_color1.stringify(Z4Color.fromARGB(65535));

    document.getElementById("test6").textContent = "Z4Color.fromColor(65535).gray() => " + test_color1.stringify(Z4Color.fromARGB(65535).gray());
    document.getElementById("test7").textContent = "Z4Color.fromColor(65535).negative() => " + test_color1.stringify(Z4Color.fromARGB(65535).negative());

    document.getElementById("test8").textContent = "Z4Color.fromColor(65535).lighted(0.3) => " + test_color1.stringify(Z4Color.fromARGB(65535).lighted(0.3));
    document.getElementById("test9").textContent = "Z4Color.fromColor(65535).darkened(0.3) => " + test_color1.stringify(Z4Color.fromARGB(65535).darkened(0.3));
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
