/**
 * The abstract class of all UI components
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractComponentUI {

   html = null;

  /**
   * Creates a Z4AbstractComponentUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    this.html = document.createElement("div");
    this.html.setAttribute("id", "id" + new Date().getTime() + "_" + parseInt(1000 * Math.random()));
    this.html.innerHTML = ui;
    let list = this.html.querySelectorAll("#" + this.html.id + " [data-token-lang-inner_text]");
    for (let index = 0; index < list.length; index++) {
      let element = list.item(index);
      element.innerText = Z4MessageFactory.get(element.getAttribute("data-token-lang-inner_text"));
    }
  }

  /**
   * Selects a child of this component
   *
   * @param selector The selector
   * @return The child of this component
   */
   querySelector(selector) {
    return this.html.querySelector(selector);
  }

  /**
   * Selects all children of this component
   *
   * @param selector The selector
   * @return All children of this component
   */
   querySelectorAll(selector) {
    return this.html.querySelectorAll(selector);
  }

  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
   appendTo(parent) {
    parent.appendChild(this.html);
    return this;
  }
}
