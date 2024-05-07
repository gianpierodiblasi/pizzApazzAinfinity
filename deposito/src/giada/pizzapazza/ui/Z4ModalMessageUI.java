package giada.pizzapazza.ui;

import def.dom.HTMLElement;
import def.js.Array;
import def.js.Date;
import giada.pizzapazza.setting.Z4HTMLFactory;
import giada.pizzapazza.setting.Z4MessageFactory;
import simulation.dom.$HTMLElement;
import simulation.js.$Apply_0_Void;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.document;
import static simulation.js.$Globals.parseInt;

/**
 * The class of all UI messages
 *
 * @author gianpiero.diblasi
 */
public class Z4ModalMessageUI {

  private final static HTMLElement html = Z4ModalMessageUI.loadHTML();
  private final static bootstrap.$Modal modal = new bootstrap.$Modal(Z4ModalMessageUI.html);

  private static HTMLElement loadHTML() {
    HTMLElement parent = document.createElement("div");
    parent.id = new Date().getTime() + "-" + parseInt(1000 * Math.random());
    parent.setAttribute("data-bs-backdrop", "static");
    parent.setAttribute("data-bs-keyboard", "false");
    parent.setAttribute("tabindex", "-1");
    parent.setAttribute("style", "display:none");
    parent.className = "modal modal-dialog-centered fade";
    parent.innerHTML = Z4HTMLFactory.get("giada/pizzapazza/ui/Z4ModalMessageUI.html");

    document.body.appendChild(parent);
    return parent;
  }

  /**
   * Shows an information message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  public static void showInfo(String title, String message, $Apply_0_Void onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-info-circle-fill", "#0dcaf0");
  }

  /**
   * Shows a warning message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  public static void showWarning(String title, String message, $Apply_0_Void onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-exclamation-triangle-fill", "#ffc107");
  }

  /**
   * Shows an error message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  public static void showError(String title, String message, $Apply_0_Void onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-exclamation-octagon-fill", "#dc3545");
  }

  private static void showOneButton(String title, String message, $Apply_0_Void onOK, String className, String color) {
    ((HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    ((HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;

    HTMLElement icon = (HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = className;
    icon.style.color = color;

    $HTMLElement footer = ($HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";

    Z4ModalMessageUI.appendButton(Z4MessageFactory.get("OK"), "btn btn-primary", onOK, footer);
    Z4ModalMessageUI.modal.show();
  }

  /**
   * Shows a question message
   *
   * @param title The title
   * @param message The message
   * @param onYES The callback to call on YES, null to hide the YES button
   * @param onNO The callback to call on NO, null to hide the NO button
   * @param onOK The callback to call on OK, null to hide the OK button
   * @param onCANCEL The callback to call on CANCEL, null to hide the CANCEL
   * button
   */
  public static void showQuestion(String title, String message, $Apply_0_Void onYES, $Apply_0_Void onNO, $Apply_0_Void onOK, $Apply_0_Void onCANCEL) {
    Array<String> options = new Array<>();
    Array<$Apply_0_Void> onOptions = new Array<>();
    Array<Boolean> isPrimary = new Array<>();

    Z4ModalMessageUI.push("YES", onYES, true, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("NO", onNO, false, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("OK", onOK, true, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("CANCEL", onCANCEL, false, options, onOptions, isPrimary);

    Z4ModalMessageUI.showOpenQuestion(title, message, options, onOptions, isPrimary);
  }

  private static void push(String token, $Apply_0_Void onButton, boolean primary, Array<String> options, Array<$Apply_0_Void> onOptions, Array<Boolean> isPrimary) {
    if ($exists(onButton)) {
      options.push(Z4MessageFactory.get(token));
      onOptions.push(onButton);
      isPrimary.push(primary);
    }
  }

  /**
   * Shows a question message with open answers
   *
   * @param title The title
   * @param message The message
   * @param options The array of option messages
   * @param onOptions The array of callbacks to call
   * @param isPrimary The array of primary buttons
   *
   */
  public static void showOpenQuestion(String title, String message, Array<String> options, Array<$Apply_0_Void> onOptions, Array<Boolean> isPrimary) {
    ((HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    ((HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;

    HTMLElement icon = (HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";

    $HTMLElement footer = ($HTMLElement) Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";

    options.forEach((option, index, array) -> {
      Z4ModalMessageUI.appendButton(option, "btn " + (isPrimary.$get(index) ? "btn-primary" : "btn-secondary"), onOptions.$get(index), footer);
    });

    Z4ModalMessageUI.modal.show();
  }

  private static void appendButton(String text, String className, $Apply_0_Void onButton, $HTMLElement footer) {
    HTMLElement button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-dismiss", "modal");
    button.className = className;
    button.innerHTML = text;
    button.onclick = (event) -> {
      onButton.$apply();
      return null;
    };

    footer.appendChild(button);
  }

  private Z4ModalMessageUI() {
  }
}
