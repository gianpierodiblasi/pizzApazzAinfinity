/**
 * The guided tour for the Z4GradientColorUI
 *
 * @author gianpiero.di.blasi
 */
class Z4GradientColorGuidedTourUI extends Z4GradientColorUI {

   options = new Object();

   element1 = null;

   element2 = null;

   event = null;

   message = null;

  /**
   * Creates a Z4GradientColorGuidedTourUI
   */
  constructor() {
    super();
    this.querySelector(".dropdown-divider").remove();
    this.querySelector(".gradient-guided-tour").remove();
    this.options["once"] = true;
    this.doStep(0);
  }

  /**
   * Shows the guided tour
   */
  static  show() {
    Z4ModalMessageUI.showInfo(Z4MessageFactory.get("TITLE"), "", () => {
      document.querySelector(".modal-dialog").classList.remove("modal-lg");
      (document.querySelector(".modal-message")).innerHTML = "";
      (document.querySelector(".modal-dialog .modal-footer")).innerHTML = "";
    });
    let label = document.createElement("label");
    label.className = "z4-guided-tour";
    document.querySelector(".modal-dialog").classList.add("modal-lg");
    document.querySelector(".modal-dialog .modal-footer").insertBefore(label, document.querySelector(".modal-dialog .modal-footer button"));
    new Z4GradientColorGuidedTourUI().appendToElement(document.querySelector(".modal-message"));
  }

   doStep(step) {
    switch(step) {
      case 0:
        this.element1 = this.element2 = this.querySelector(".form-check-input[value='1']");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_SELECT_COLOR");
        break;
      case 1:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_COMPONENTS1");
        break;
      case 2:
        this.element1 = this.querySelector(".dropdown-toggle-split");
        this.element2 = this.querySelector(".dropdown-menu .form-range");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_OPACITY");
        break;
      case 3:
        this.element1 = this.element2 = this.querySelector(".sliders");
        this.event = Z4Loader.touch ? "touchstart" : "mousedown";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_ADD_COLOR");
        break;
      case 4:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_EDIT_COMPONENTS2");
        break;
      case 5:
        this.element1 = this.element2 = this.querySelector(".form-check-input:nth-child(3)");
        this.event = Z4Loader.touch ? "touchend" : "mouseup";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_MOVE");
        break;
      case 6:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".gradient-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_INVERT");
        break;
      case 7:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".gradient-negative");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_NEGATIVIZE");
        break;
      case 8:
        this.element1 = this.element2 = this.querySelector(".mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_MIRROR");
        break;
      case 9:
        this.element1 = this.element2 = this.querySelector(".form-range[step='0.01']");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_GRADIENT_ADD_RIPPLE");
        break;
      default:
        this.element1 = null;
        this.message = Z4MessageFactory.get("GUIDED_TOUR_COMPLETED");
    }
    let label = document.querySelector(".modal-dialog .modal-footer label");
    if (this.element1) {
      this.element1.classList.add("z4-guided-tour");
      this.element2.classList.add("z4-guided-tour");
      this.element2.addEventListener(this.event, (evt) => {
        this.element1.classList.remove("z4-guided-tour");
        this.element2.classList.remove("z4-guided-tour");
        this.doStep(step + 1);
      }, this.options);
    } else if (label) {
      label.className = "";
    }
    if (label) {
      label.innerHTML = this.message;
    } else {
      console.log(this.message);
    }
  }
}
