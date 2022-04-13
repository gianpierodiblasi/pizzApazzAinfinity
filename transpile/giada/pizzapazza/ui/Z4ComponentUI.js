/* global Date, Math, URLSearchParams, XMLHttpRequest, parseInt */

/**
 * The abstract class of all UI components
 *
 * @author gianpiero.di.blasi
 */
class Z4ComponentUI {

   html = null;

  /**
   * Loads an HTML file
   * @param html The HTML file
   * @return The HTML file
   */
  static  loadHTML(html) {
    let urlParams = new URLSearchParams(window.location.search);
    let path = Z4Loader.UP + (urlParams.get("allFiles") ? "src/" : "build/html/");
    let client = new XMLHttpRequest();
    client.open("GET", path + html, false);
    client.send();
    return client.responseText;
  }

  constructor(ui) {
    this.html = document.createElement("div");
    this.html.setAttribute("id", new Date().getTime() + "-" + parseInt(1000 * Math.random()));
    this.html.innerHTML = ui;
  }

  /**
   * Appends this component to its parent
   *
   * @param parent The parent
   */
   appendTo(parent) {
    parent.appendChild(this.html);
  }

  /**
   * Selects a child of this component
   * @param selector The selector
   * @return The child of this component
   */
   querySelector(selector) {
    return this.html.querySelector(selector);
  }
}
