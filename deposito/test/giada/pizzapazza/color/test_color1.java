package giada.pizzapazza.color;

import def.js.Array;
import def.js.JSON;
import giada.pizzapazza.color.ui.Z4ColorUI;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import java.util.function.BiFunction;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.diblasi
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

    Z4ColorUI ui = new Z4ColorUI().appendToElement(document.querySelector("#test10"));
    ui.oninput = (z4Color) -> document.getElementById("test11").textContent = "ONINPUT " + test_color1.stringify(z4Color);
    ui.onchange = (z4Color) -> document.getElementById("test11").textContent = "ONCHANGE " + test_color1.stringify(z4Color);
    document.getElementById("test11").textContent = test_color1.stringify(ui.getValue());

    ui = new Z4ColorUI().setValue(new Z4Color(120, 60, 20, 70)).appendToElement(document.querySelector("#test13"));
    ui.oninput = (z4Color) -> document.getElementById("test14").textContent = "ONINPUT " + test_color1.stringify(z4Color);
    ui.onchange = (z4Color) -> document.getElementById("test14").textContent = "ONCHANGE " + test_color1.stringify(z4Color);
    document.getElementById("test14").textContent = test_color1.stringify(ui.getValue());
  }
}
