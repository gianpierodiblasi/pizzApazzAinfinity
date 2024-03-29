/**
 * @author gianpiero.diblasi
 */
class test_color1 {

  static  onLoad() {
    document.getElementById("language").value = Z4Setting.getLanguage();
    document.getElementById("language").onchange = (event) => {
      Z4Setting.setLanguage(document.getElementById("language").value);
      Z4MessageFactory.changingLanguage();
      return null;
    };
    document.getElementById("theme").value = Z4Setting.getTheme();
    document.getElementById("theme").onchange = (event) => {
      Z4Setting.setTheme(document.getElementById("theme").value);
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
    let ui = new Z4ColorUI().appendToElement(document.querySelector("#test10"));
    ui.oninput = (z4Color) => document.getElementById("test11").textContent = "ONINPUT " + test_color1.stringify(z4Color);
    ui.onchange = (z4Color) => document.getElementById("test11").textContent = "ONCHANGE " + test_color1.stringify(z4Color);
    document.getElementById("test11").textContent = test_color1.stringify(ui.getValue());
    ui = new Z4ColorUI().setValue(new Z4Color(120, 60, 20, 70)).appendToElement(document.querySelector("#test13"));
    ui.oninput = (z4Color) => document.getElementById("test14").textContent = "ONINPUT " + test_color1.stringify(z4Color);
    ui.onchange = (z4Color) => document.getElementById("test14").textContent = "ONCHANGE " + test_color1.stringify(z4Color);
    document.getElementById("test14").textContent = test_color1.stringify(ui.getValue());
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
