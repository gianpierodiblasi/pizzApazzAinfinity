package giada.pizzapazza.ui;

import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.diblasi
 */
public class test_tool_composer {

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

    Z4ToolComposerUI ui = new Z4ToolComposerUI().appendToElement(document.getElementById("test1"));
  }

  private test_tool_composer() {
  }
}
