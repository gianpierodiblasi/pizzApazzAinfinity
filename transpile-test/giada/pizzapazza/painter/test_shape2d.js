/**
 * @author gianpiero.di.blasi
 */
class test_shape2d {

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
    let ui = new Z4Shape2DPainterUI().appendToElement(document.getElementById("test1"));
    ui.oninput = (value) => document.getElementById("test2").textContent = "ONINPUT " + test_shape2d.stringify(value);
    ui.onchange = (value) => document.getElementById("test2").textContent = "ONCHANGE " + test_shape2d.stringify(value);
    document.getElementById("test2").textContent = test_shape2d.stringify(ui.getValue());
    document.getElementById("point-iterator").onchange = (event) => {
      switch(document.getElementById("point-iterator").value) {
        case "stamper":
          ui.setPointIterator(new Z4Stamper());
          break;
        case "tracer":
          ui.setPointIterator(new Z4Tracer());
          break;
        case "spirograph":
          ui.setPointIterator(new Z4Spirograph().setRotation(Z4Rotation.relativeToPath()));
          break;
      }
      return null;
    };
    let ui2 = new Z4GradientColorUI().appendToElement(document.querySelector("#color"));
    ui2.oninput = (value) => ui.setGradientColor(value);
    ui2.onchange = (value) => ui.setGradientColor(value);
  }

  static  stringify(object) {
    let replacer = (k, v) => {
      if (!k) {
        return v;
      } else if (k === "bezierCurve") {
        // JS equality for strings
        return null;
      } else if (typeof v === "number") {
        return v;
      } else if (typeof v === "boolean") {
        return v;
      } else if (Array.isArray(v)) {
        return v;
      } else if (v instanceof Z4Rotation) {
        return v;
      } else if (v instanceof Z4FancifulValue) {
        return v;
      } else if (v instanceof Z4SignedRandomValue) {
        return v;
      } else if (v instanceof Z4Point) {
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
