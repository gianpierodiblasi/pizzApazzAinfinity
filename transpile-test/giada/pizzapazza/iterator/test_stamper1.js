/**
 * @author gianpiero.di.blasi
 */
class test_stamper1 {

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
    let canvas = document.getElementById("canvas");
    let canvasCtx = canvas.getContext("2d");
    let offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    let offscreenCtx = offscreen.getContext("2d");
    // Z4Stamper stamper = new Z4Stamper();
    // stamper.setRotation(new Z4FancifulValue().setRandom(Z4Sign.RANDOM, Z4RandomValue.classic(45)), Z4Rotation.FIXED);
    // stamper.drawDemo(offscreenCtx, canvas.width, canvas.height);
    // 
    // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    // canvasCtx.drawImage(offscreen, 0, 0);
    // 
    let ui = new Z4StamperUI();
    ui.appendToElement(document.getElementById("test1"));
    ui.oninput = (value) => document.getElementById("test2").textContent = "ONINPUT " + test_stamper1.stringify(value);
    ui.onchange = (value) => document.getElementById("test2").textContent = "ONCHANGE " + test_stamper1.stringify(value);
    document.getElementById("test2").textContent = test_stamper1.stringify(ui.getValue());
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