package giada.pizzapazza.ui;

import def.dom.HTMLElement;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.diblasi
 */
public class test_modal_message1 {

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

    ((HTMLElement) document.querySelector(".test-info")).onclick = (event) -> {
      Z4ModalMessageUI.showInfo("pizzApazzA", "This is an information message", () -> {
      });
      return null;
    };

    ((HTMLElement) document.querySelector(".test-warning")).onclick = (event) -> {
      Z4ModalMessageUI.showWarning("pizzApazzA", "This is a warning message", () -> {
      });
      return null;
    };

    ((HTMLElement) document.querySelector(".test-error")).onclick = (event) -> {
      Z4ModalMessageUI.showError("pizzApazzA", "This is an error message", () -> {
      });
      return null;
    };

    ((HTMLElement) document.querySelector(".test-question")).onclick = (event) -> {
      Z4ModalMessageUI.showQuestion("pizzApazzA", "This is a question message", () -> {
      }, null, null, null);
      return null;
    };
  }

  private test_modal_message1() {
  }
}
