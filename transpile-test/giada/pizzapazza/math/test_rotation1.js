/**
 * @author gianpiero.diblasi
 */
class test_rotation1 {

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
    let ui1 = new Z4RotationUI().appendToElement(document.querySelector("#test1"));
    let v = Z4Rotation.cumulative().setStartAngle(35).setDelayed(true).setAngle(new Z4FancifulValue().setConstant(new Z4SignedValue().setValue(10).setSign(Z4Sign.NEGATIVE)).setRandom(Z4SignedRandomValue.bezier(20, 10).setSign(Z4Sign.RANDOM)));
    let ui2 = new Z4RotationUI().setValue(v).appendToElement(document.querySelector("#test3"));
    ui1.oninput = (value) => document.getElementById("test2").textContent = "ONINPUT " + test_rotation1.stringify(value);
    ui1.onchange = (value) => document.getElementById("test2").textContent = "ONCHANGE " + test_rotation1.stringify(value);
    document.getElementById("test2").textContent = test_rotation1.stringify(ui1.getValue());
    ui2.oninput = (value) => document.getElementById("test4").textContent = "ONINPUT " + test_rotation1.stringify(value);
    ui2.onchange = (value) => document.getElementById("test4").textContent = "ONCHANGE " + test_rotation1.stringify(value);
    document.getElementById("test4").textContent = test_rotation1.stringify(ui2.getValue());
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
      } else if (v instanceof Z4SignedRandomValue) {
        return v;
      } else if (v instanceof Z4FancifulValue) {
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
