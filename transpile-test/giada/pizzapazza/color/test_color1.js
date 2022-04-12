/* global Array, JSON, Z4Color, stringify */

/**
 * @author gianpiero.di.blasi
 */
class test_color1 {

  static  onLoad() {
    window.onload = (event) => {
      document.getElementById("test1").textContent = "new Z4Color(0,0,0,0) => " + stringify(new Z4Color(0, 0, 0, 0));
      document.getElementById("test2").textContent = "new Z4Color(0,255,0,0) => " + stringify(new Z4Color(0, 255, 0, 0));
      document.getElementById("test3").textContent = "new Z4Color(255,255,255,255) => " + stringify(new Z4Color(255, 255, 255, 255));
      return null;
    };
  }

  static  stringify(object) {
    let replacer = (k, v) => {
      if (!k) {
        return v;
        // } else if (typeof v === "number") {
        // return v;
        // } else if (typeof v === "boolean") {
        // return v;
      } else if (Array.isArray(v)) {
        return v;
      } else {
        return JSON.stringify(v).replaceAll("\"", "").replaceAll("\n", "");
      }
    };
    return JSON.stringify(object, replacer, "\t").replaceAll("\"", "");
  }

  constructor() {
  }
}
