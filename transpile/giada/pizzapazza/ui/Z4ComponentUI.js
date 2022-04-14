/* global Date, Math, Object, URLSearchParams, XMLHttpRequest, parseInt */

/**
 * The abstract class of all UI components
 *
 * @param <T>
 * @author gianpiero.di.blasi
 */
class Z4ComponentUI {

  /**
   * The HTML
   */
   html = null;

  /**
   * The onchange function
   */
   onchange = element => {
  };

   devicePixelRatioListener = null;

  /**
   * Loads an HTML file
   *
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

  /**
   * Creates a Z4ComponentUI
   *
   * @param ui The HTML
   */
  constructor(ui) {
    this.html = document.createElement("div");
    this.html.setAttribute("id", new Date().getTime() + "-" + parseInt(1000 * Math.random()));
    this.html.innerHTML = ui;
    this.initDevicePixelRatio();
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

   initDevicePixelRatio() {
    if (window.matchMedia) {
      this.devicePixelRatioListener = () => {
        this.devicePixelRatioChanged();
        this.addDevicePixelRatioListener();
      };
      this.addDevicePixelRatioListener();
    }
  }

   addDevicePixelRatioListener() {
    let options = new Object();
    options["once"] = true;
    window.matchMedia("(resolution: " + window.devicePixelRatio + "dppx)").addEventListener("change", this.devicePixelRatioListener, options);
  }

  /**
   * Method called when the device pixel ratio changes
   */
   devicePixelRatioChanged() {
  }

  /**
   * Appends this Z4ComponentUI to its parent
   *
   * @param parent The parent
   * @return This Z4ComponentUI
   */
   appendTo(parent) {
    parent.appendChild(this.html);
    return this;
  }
}
