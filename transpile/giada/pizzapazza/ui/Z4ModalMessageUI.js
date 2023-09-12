/**
 * The class of all UI messages
 *
 * @author gianpiero.diblasi
 */
class Z4ModalMessageUI {

  static  html = Z4ModalMessageUI.loadHTML();

  static  modal = new bootstrap.Modal(Z4ModalMessageUI.html);

  static  loadHTML() {
    let parent = document.createElement("div");
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
  static  showInfo(title, message, onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-info-circle-fill", "#0dcaf0");
  }

  /**
   * Shows a warning message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  static  showWarning(title, message, onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-exclamation-triangle-fill", "#ffc107");
  }

  /**
   * Shows an error message
   *
   * @param title The title
   * @param message The message
   * @param onOK The callback to call on OK
   */
  static  showError(title, message, onOK) {
    Z4ModalMessageUI.showOneButton(title, message, onOK, "bi bi-exclamation-octagon-fill", "#dc3545");
  }

  static  showOneButton(title, message, onOK, className, color) {
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = className;
    icon.style.color = color;
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
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
  static  showQuestion(title, message, onYES, onNO, onOK, onCANCEL) {
    let options = new Array();
    let onOptions = new Array();
    let isPrimary = new Array();
    Z4ModalMessageUI.push("YES", onYES, true, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("NO", onNO, false, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("OK", onOK, true, options, onOptions, isPrimary);
    Z4ModalMessageUI.push("CANCEL", onCANCEL, false, options, onOptions, isPrimary);
    Z4ModalMessageUI.showOpenQuestion(title, message, options, onOptions, isPrimary);
  }

  static  push(token, onButton, primary, options, onOptions, isPrimary) {
    if (onButton) {
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
   */
  static  showOpenQuestion(title, message, options, onOptions, isPrimary) {
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    options.forEach((option, index, array) => {
      Z4ModalMessageUI.appendButton(option, "btn " + (isPrimary[index] ? "btn-primary" : "btn-secondary"), onOptions[index], footer);
    });
    Z4ModalMessageUI.modal.show();
  }

  static  appendButton(text, className, onButton, footer) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-dismiss", "modal");
    button.className = className;
    button.innerHTML = text;
    button.onclick = (event) => {
      onButton();
      return null;
    };
    footer.appendChild(button);
  }

  constructor() {
  }
}
