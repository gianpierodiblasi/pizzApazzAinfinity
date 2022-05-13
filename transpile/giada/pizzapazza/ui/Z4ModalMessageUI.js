/**
 * The class of all UI messages
 *
 * @author gianpiero.di.blasi
 */
class Z4ModalMessageUI {

  static  html = Z4ModalMessageUI.loadHTML();

  static  modal = new bootstrap.Modal(Z4ModalMessageUI.html);

  static  loadHTML() {
    let parent = document.createElement("div");
    parent.setAttribute("id", new Date().getTime() + "-" + parseInt(1000 * Math.random()));
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
    Z4ModalMessageUI.appendButton(Z4MessageFactory.get("OK"), "btn btn-sm btn-primary", onOK, footer);
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
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    if (onYES) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("YES"), "btn btn-sm btn-primary", onYES, footer);
    }
    if (onNO) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("NO"), "btn btn-sm btn-secondary", onNO, footer);
    }
    if (onOK) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("OK"), "btn btn-sm btn-primary", onOK, footer);
    }
    if (onCANCEL) {
      Z4ModalMessageUI.appendButton(Z4MessageFactory.get("CANCEL"), "btn btn-sm btn-secondary", onCANCEL, footer);
    }
    Z4ModalMessageUI.modal.show();
  }

  /**
   * Shows a question message with open answer
   *
   * @param title The title
   * @param message The message
   * @param optionStr1 The option1 message
   * @param onOption1 The callback to call on option1
   * @param optionStr2 The option2 message
   * @param onOption2 The callback to call on option2
   * @param optionStr3 The option3 message
   * @param onOption3 The callback to call on option3
   * @param optionStr4 The option4 message
   * @param onOption4 The callback to call on option4
   */
  static  showOpenQuestion(title, message, optionStr1, onOption1, optionStr2, onOption2, optionStr3, onOption3, optionStr4, onOption4) {
    (Z4ModalMessageUI.html.querySelector(".modal-title")).innerHTML = title;
    (Z4ModalMessageUI.html.querySelector(".modal-message")).innerHTML = message;
    let icon = Z4ModalMessageUI.html.querySelector(".modal-icon i");
    icon.className = "bi bi-question-circle-fill";
    icon.style.color = "#6c757d";
    let footer = Z4ModalMessageUI.html.querySelector(".modal-footer");
    footer.innerHTML = "";
    if (optionStr1) {
      Z4ModalMessageUI.appendButton(optionStr1, "btn btn-sm btn-secondary", onOption1, footer);
    }
    if (optionStr2) {
      Z4ModalMessageUI.appendButton(optionStr2, "btn btn-sm btn-secondary", onOption2, footer);
    }
    if (optionStr3) {
      Z4ModalMessageUI.appendButton(optionStr3, "btn btn-sm btn-secondary", onOption3, footer);
    }
    if (optionStr4) {
      Z4ModalMessageUI.appendButton(optionStr4, "btn btn-sm btn-secondary", onOption4, footer);
    }
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
