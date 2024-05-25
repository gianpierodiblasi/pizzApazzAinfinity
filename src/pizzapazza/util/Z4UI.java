package pizzapazza.util;

import static def.dom.Globals.document;
import def.dom.HTMLElement;
import simulation.js.$Apply_0_T;
import simulation.js.$Apply_0_Void;
import simulation.js.$Apply_1_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.setTimeout;

/**
 * UI utilities
 *
 * @author gianpiero.diblasi
 */
public class Z4UI {

  /**
   * Waits for a process to complete
   *
   * @param <T> The object returned by the process
   * @param beforeProcess The actions to do before the process
   * @param process The process
   * @param afterProcess The actions to do before the process
   */
  public static <T extends Object> void pleaseWait($Apply_0_Void beforeProcess, $Apply_0_T<T> process, $Apply_1_Void<T> afterProcess) {
    document.querySelectorAll("dialog").forEach(dialog -> {
      if (!$exists(dialog.querySelector(".please-wait"))) {
        HTMLElement pleaseWait = document.createElement("div");
        pleaseWait.classList.add("please-wait");
        dialog.appendChild(pleaseWait);
      }
    });
    document.querySelectorAll(".please-wait").forEach(element -> element.classList.add("please-wait-visible"));

    beforeProcess.$apply();

    setTimeout(() -> {
      T obj = process.$apply();
      document.querySelectorAll(".please-wait").forEach(element -> element.classList.remove("please-wait-visible"));
      afterProcess.$apply(obj);
    }, 0);
  }

  private Z4UI() {
  }
}
