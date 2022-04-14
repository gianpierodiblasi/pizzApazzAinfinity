/* global Array, JSON, Z4Color, Z4ColorUI, Z4MessageFactory, Z4Setting */

/**
 * @author gianpiero.di.blasi
 */
class test_color1 {

  static  onLoad() {
    document.getElementById("language").value = Z4Setting.getLanguage();
    document.getElementById("language").onchange = (event) => {
      Z4Setting.setLanguage(document.getElementById("language").value);
      Z4MessageFactory.changingLanguage();
      return null;
    };
    document.getElementById("test1").textContent = "new Z4Color(0,0,0,0) => " + test_color1.stringify(new Z4Color(0, 0, 0, 0));
    document.getElementById("test2").textContent = "new Z4Color(0,255,0,0) => " + test_color1.stringify(new Z4Color(0, 255, 0, 0));
    document.getElementById("test3").textContent = "new Z4Color(255,255,255,255) => " + test_color1.stringify(new Z4Color(255, 255, 255, 255));
    document.getElementById("test4").textContent = "Z4Color.fromColor(255) => " + test_color1.stringify(Z4Color.fromARGB(255));
    document.getElementById("test5").textContent = "Z4Color.fromColor(65535) => " + test_color1.stringify(Z4Color.fromARGB(65535));
    document.getElementById("test6").textContent = "Z4Color.fromColor(65535).gray() => " + test_color1.stringify(Z4Color.fromARGB(65535).gray());
    document.getElementById("test7").textContent = "Z4Color.fromColor(65535).negative() => " + test_color1.stringify(Z4Color.fromARGB(65535).negative());
    document.getElementById("test8").textContent = "Z4Color.fromColor(65535).lighted(0.3) => " + test_color1.stringify(Z4Color.fromARGB(65535).lighted(0.3));
    document.getElementById("test9").textContent = "Z4Color.fromColor(65535).darkened(0.3) => " + test_color1.stringify(Z4Color.fromARGB(65535).darkened(0.3));
    let ui = new Z4ColorUI();
    ui.appendTo(document.querySelector("#test10")).onchange = (z4Color) => document.getElementById("test11").textContent = test_color1.stringify(z4Color);
    document.getElementById("test11").textContent = test_color1.stringify(ui.getZ4Color());
    ui = new Z4ColorUI().setZ4Color(new Z4Color(120, 60, 20, 70));
    ui.appendTo(document.querySelector("#test13")).onchange = (z4Color) => document.getElementById("test14").textContent = test_color1.stringify(z4Color);
    document.getElementById("test14").textContent = test_color1.stringify(ui.getZ4Color());
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
