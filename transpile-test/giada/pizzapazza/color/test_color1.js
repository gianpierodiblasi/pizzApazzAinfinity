/* global Array, JSON, Z4Color */

/**
 * @author gianpiero.di.blasi
 */
class test_color1 {

  static  onLoad() {
    document.getElementById("test1").textContent = "new Z4Color(0,0,0,0) => " + test_color1.stringify(new Z4Color(0, 0, 0, 0));
    document.getElementById("test2").textContent = "new Z4Color(0,255,0,0) => " + test_color1.stringify(new Z4Color(0, 255, 0, 0));
    document.getElementById("test3").textContent = "new Z4Color(255,255,255,255) => " + test_color1.stringify(new Z4Color(255, 255, 255, 255));
    document.getElementById("test4").textContent = "Z4Color.fromColor(255) => " + test_color1.stringify(Z4Color.fromARGB(255));
    document.getElementById("test5").textContent = "Z4Color.fromColor(65535) => " + test_color1.stringify(Z4Color.fromARGB(65535));
  }

  static  stringify(object) {
    let replacer = (k, v) => {
      if (!k) {
        return v;
      } else if (typeof v === "number") {
        return v;
      } else if (typeof v === "boolean") {
        return v;
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
