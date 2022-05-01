/**
 * @author gianpiero.di.blasi
 */
class test_signedvalue1 {

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
    let ui1 = new Z4SignedValueUI();
    ui1.appendTo(document.querySelector("#test1"));
    let ui2 = new Z4SignedValueUI().setRange(30, 80).setValue(new Z4SignedValue().setSign(Z4Sign.NEGATIVE).setValue(50));
    ui2.appendTo(document.querySelector("#test3"));
    ui1.oninput = (value) => document.getElementById("test2").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui1.onchange = (value) => document.getElementById("test2").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test2").textContent = test_signedvalue1.stringify(ui1.getValue());
    ui2.oninput = (value) => document.getElementById("test4").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui2.onchange = (value) => document.getElementById("test4").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test4").textContent = test_signedvalue1.stringify(ui2.getValue());
    document.getElementById("sign-visible").onchange = (event) => {
      ui1.setSignVisible((document.getElementById("sign-visible")).checked);
      ui2.setSignVisible((document.getElementById("sign-visible")).checked);
      return null;
    };
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
      } else {
        return JSON.stringify(v).replaceAll("\"", "").replaceAll("\n", "");
      }
    };
    return JSON.stringify(object, replacer, "\t").replaceAll("\"", "");
  }

  constructor() {
  }
}
