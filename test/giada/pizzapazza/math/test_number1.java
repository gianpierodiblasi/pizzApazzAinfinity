package giada.pizzapazza.math;

import def.js.JSON;
import giada.pizzapazza.math.ui.Z4NumberUI;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.di.blasi
 */
public class test_number1 {

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

    document.$getElementById("mode").value = Z4Setting.getMode();
    document.$getElementById("mode").onchange = (event) -> {
      Z4Setting.setMode(document.$getElementById("mode").value);
      return null;
    };

    Z4NumberUI ui1 = new Z4NumberUI();
    ui1.appendTo(document.querySelector("#test1"));
    ui1.oninput = (Object) -> document.getElementById("test2").textContent = "ONINPUT " + ui1.getValue() + " " + JSON.stringify(ui1.getSign());
    ui1.onchange = (Object) -> document.getElementById("test2").textContent = "ONCHANGE " + ui1.getValue() + " " + JSON.stringify(ui1.getSign());
    document.getElementById("test2").textContent = ui1.getValue() + " " + JSON.stringify(ui1.getSign());
    
    Z4NumberUI ui2 = new Z4NumberUI().setRange(-30, 80).setSignVisible(false);
    ui2.appendTo(document.querySelector("#test3"));
    ui2.oninput = (Object) -> document.getElementById("test4").textContent = "ONINPUT " + ui2.getValue() + " " + JSON.stringify(ui2.getSign());
    ui2.onchange = (Object) -> document.getElementById("test4").textContent = "ONCHANGE " + ui2.getValue() + " " + JSON.stringify(ui2.getSign());
    document.getElementById("test4").textContent = ui2.getValue() + " " + JSON.stringify(ui2.getSign());
  }

  private test_number1() {
  }
}
