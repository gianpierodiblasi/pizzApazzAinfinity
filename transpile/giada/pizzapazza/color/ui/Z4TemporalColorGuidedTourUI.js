/**
 * The guided tour for the Z4TemporalColorUI
 *
 * @author gianpiero.di.blasi
 */
class Z4TemporalColorGuidedTourUI extends Z4TemporalColorUI {

   options = new Object();

   element1 = null;

   element2 = null;

   event = null;

   message = null;

   i = document.createElement("i");

  /**
   * Creates a Z4TemporalColorGuidedTourUI
   */
  constructor() {
    super();
    this.querySelector(".dropdown-divider").remove();
    this.querySelector(".temporal-guided-tour").remove();
    let div = document.createElement("div");
    div.setAttribute("style", "float:right");
    this.querySelector(".canvas-container div div:nth-child(3)").appendChild(div);
    this.i.className = "bi bi-arrow-left-circle";
    this.i.setAttribute("style", "font-size:30px;border-radius:48px;position:relative;top:50px;padding:0px 5px;visibility:hidden");
    div.appendChild(this.i);
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
    new Z4TemporalColorGuidedTourUI().appendTo(document.querySelector(".modal-message"));
  }

   doStep(step) {
    switch(step) {
      case 0:
        this.element1 = this.element2 = this.querySelector(".form-check-input[value='1-1']");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_SELECT_COLOR");
        break;
      case 1:
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_COMPONENTS1");
        break;
      case 2:
        this.element1 = this.querySelector(".dropdown-toggle-split");
        this.element2 = this.querySelector(".dropdown-menu .form-range");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_OPACITY");
        break;
      case 3:
        this.i.style.visibility = "visible";
        this.element1 = this.querySelector(".bi-arrow-left-circle");
        this.element2 = this.querySelector(".canvas");
        this.event = Z4Loader.touch ? "touchstart" : "mousedown";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_COLOR");
        break;
      case 4:
        this.i.style.visibility = "hidden";
        this.element1 = this.element2 = this.querySelector(".form-control-color");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_EDIT_COMPONENTS2");
        break;
      case 5:
        this.element1 = this.element2 = this.querySelector(".form-check-input:nth-child(9)");
        this.event = Z4Loader.touch ? "touchend" : "mouseup";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MOVE");
        break;
      case 6:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".spatial-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_INVERT_SPATIAL");
        break;
      case 7:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".temporal-inverted");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_INVERT_TEMPORAL");
        break;
      case 8:
        this.element1 = this.querySelector(".z4-dropdown-toggle-three-dots");
        this.element2 = this.querySelector(".temporal-negative");
        this.event = "click";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_NEGATIVIZE");
        break;
      case 9:
        this.element1 = this.element2 = this.querySelector(".temporal-mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MIRROR_TEMPORAL");
        break;
      case 10:
        this.element1 = this.element2 = this.querySelector(".spatial-mirrored-check");
        this.event = "change";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_MIRROR_SPATIAL");
        break;
      case 11:
        this.element1 = this.element2 = this.querySelector(".form-range-spatial");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_RIPPLE_SPATIAL");
        break;
      case 12:
        this.element1 = this.element2 = this.querySelector(".form-range-temporal");
        this.event = "input";
        this.message = Z4MessageFactory.get("GUIDED_TOUR_TEMPORAL_ADD_RIPPLE_TEMPORAL");
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
      label.innerText = this.message;
    } else {
      console.log(this.message);
    }
  }
}
