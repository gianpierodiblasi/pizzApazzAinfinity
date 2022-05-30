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
    let ui1 = new Z4SignedValueUI().appendToElement(document.querySelector("#test1"));
    let ui2 = new Z4SignedValueUI().setRange(30, 80, true).setValueLabel("INTENSITY", true, true).setValue(new Z4SignedValue().setSign(Z4Sign.NEGATIVE).setValue(50)).appendToElement(document.querySelector("#test3"));
    let ui3 = new Z4SignedValueUI().setCompact().setRange(0, 1000, true).setValueLabel("INTENSITY", true, true).setValue(new Z4SignedValue().setSign(Z4Sign.NEGATIVE).setValue(50)).appendToElement(document.querySelector("#test5"));
    ui1.oninput = (value) => document.getElementById("test2").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui1.onchange = (value) => document.getElementById("test2").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test2").textContent = test_signedvalue1.stringify(ui1.getValue());
    ui2.oninput = (value) => document.getElementById("test4").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui2.onchange = (value) => document.getElementById("test4").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test4").textContent = test_signedvalue1.stringify(ui2.getValue());
    ui3.oninput = (value) => document.getElementById("test6").textContent = "ONINPUT " + test_signedvalue1.stringify(value);
    ui3.onchange = (value) => document.getElementById("test6").textContent = "ONCHANGE " + test_signedvalue1.stringify(value);
    document.getElementById("test6").textContent = test_signedvalue1.stringify(ui3.getValue());
    document.getElementById("sign-visible").onchange = (event) => {
      ui1.setSignVisible((document.getElementById("sign-visible")).checked);
      ui2.setSignVisible((document.getElementById("sign-visible")).checked);
      ui3.setSignVisible((document.getElementById("sign-visible")).checked);
      return null;
    };
    document.getElementById("enabled").onchange = (event) => {
      ui1.setEnabled((document.getElementById("enabled")).checked);
      ui2.setEnabled((document.getElementById("enabled")).checked);
      ui3.setEnabled((document.getElementById("enabled")).checked);
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
