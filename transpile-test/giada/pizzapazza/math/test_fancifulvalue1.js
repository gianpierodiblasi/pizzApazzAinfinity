/**
 * @author gianpiero.di.blasi
 */
class test_fancifulvalue1 {

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
    document.getElementById("mode").value = Z4Setting.getMode();
    document.getElementById("mode").onchange = (event) => {
      Z4Setting.setMode(document.getElementById("mode").value);
      return null;
    };
    let ui1 = new Z4FancifulValueUI();
    ui1.appendTo(document.querySelector("#test1"));
    let v = new Z4FancifulValue().setConstant(Z4Sign.NEGATIVE, 10).setRandom(Z4Sign.RANDOM, Z4RandomValue.bezier(20, 10)).setProportional(Z4Sign.POSITIVE, 30);
    let ui2 = new Z4FancifulValueUI().setVertical().setValue(v);
    ui2.appendTo(document.querySelector("#test3"));
    ui1.oninput = (value) => document.getElementById("test2").textContent = "ONINPUT " + test_fancifulvalue1.stringify(value);
    ui1.onchange = (value) => document.getElementById("test2").textContent = "ONCHANGE " + test_fancifulvalue1.stringify(value);
    document.getElementById("test2").textContent = test_fancifulvalue1.stringify(ui1.getValue());
    ui2.oninput = (value) => document.getElementById("test4").textContent = "ONINPUT " + test_fancifulvalue1.stringify(value);
    ui2.onchange = (value) => document.getElementById("test4").textContent = "ONCHANGE " + test_fancifulvalue1.stringify(value);
    document.getElementById("test4").textContent = test_fancifulvalue1.stringify(ui2.getValue());
    let onComponent = (event) => {
      ui1.setComponentsVisible((document.getElementById("constant-visible")).checked, (document.getElementById("random-visible")).checked, (document.getElementById("proportional-visible")).checked);
      ui2.setComponentsVisible((document.getElementById("constant-visible")).checked, (document.getElementById("random-visible")).checked, (document.getElementById("proportional-visible")).checked);
      return null;
    };
    document.getElementById("constant-visible").onchange = onComponent;
    document.getElementById("random-visible").onchange = onComponent;
    document.getElementById("proportional-visible").onchange = onComponent;
    let onSign = (event) => {
      ui1.setSignsVisible((document.getElementById("constant-sign-visible")).checked, (document.getElementById("random-sign-visible")).checked, (document.getElementById("proportional-sign-visible")).checked);
      ui2.setSignsVisible((document.getElementById("constant-sign-visible")).checked, (document.getElementById("random-sign-visible")).checked, (document.getElementById("proportional-sign-visible")).checked);
      return null;
    };
    document.getElementById("constant-sign-visible").onchange = onSign;
    document.getElementById("random-sign-visible").onchange = onSign;
    document.getElementById("proportional-sign-visible").onchange = onSign;
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
      } else if (v instanceof Z4RandomValue) {
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
