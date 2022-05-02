/**
 * The abstract class of all UI components
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4AbstractComponentUI {

  /**
   * The HTML root of this component
   */
   root = null;

  /**
   * Creates a Z4AbstractComponentUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    this.root = document.createElement("div");
    this.root.setAttribute("id", "id" + new Date().getTime() + "_" + parseInt(1000 * Math.random()));
    this.root.innerHTML = ui;
    let list = this.root.querySelectorAll("#" + this.root.id + " [data-token-lang-inner_text]");
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
    return this.root.querySelector(selector);
  }

  /**
   * Selects all children of this component
   *
   * @param selector The selector
   * @return All children of this component
   */
   querySelectorAll(selector) {
    return this.root.querySelectorAll(selector);
  }

  /**
   * Appends this Z4AbstractComponentUI to its parent
   *
   * @param parent The parent
   * @return This Z4AbstractComponentUI
   */
   appendTo(parent) {
    parent.appendChild(this.root);
    return this;
  }
}
