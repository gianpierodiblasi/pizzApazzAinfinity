/* global Array, JSON, OffscreenCanvas, Z4MessageFactory, Z4Setting, Z4TemporalColor, Z4TemporalColorUI */

/**
 * @author gianpiero.di.blasi
 */
class test_color3 {

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
      test_color3.drawAll();
      return null;
    };
    document.getElementById("test1").textContent = "new Z4TemporalColor() => " + test_color3.stringify(new Z4TemporalColor());
    document.getElementById("test2").textContent = "new Z4TemporalColor().addOrUpdateColor(0,0,65535) => " + test_color3.stringify(new Z4TemporalColor().addOrUpdateColor(0, 0, 65535));
    document.getElementById("test3").textContent = "new Z4TemporalColor().addOrUpdateColor(0.3,0.2,65535).move(0.3,0.4,-1,-1) => " + test_color3.stringify(new Z4TemporalColor().addOrUpdateColor(0.3, 0.2, 65535).move(0.3, 0.4, -1, -1));
    document.getElementById("test4").textContent = "new Z4TemporalColor().setRipple(0.2,0.3) => " + test_color3.stringify(new Z4TemporalColor().setRipple(0.2, 0.3));
    document.getElementById("test5").textContent = "new Z4TemporalColor().getZ4ColorAt(0.5,0.5,false,false) => " + test_color3.stringify(new Z4TemporalColor().getZ4ColorAt(0.5, 0.5, false, false));
    document.getElementById("test6").textContent = "new Z4TemporalColor().setRipple(0.2,0.3).getZ4ColorAt(0.75,0.3,true,false) => " + test_color3.stringify(new Z4TemporalColor().setRipple(0.2, 0.3).getZ4ColorAt(0.75, 0.3, true, false));
    test_color3.drawAll();
    let ui = new Z4TemporalColorUI();
    ui.appendTo(document.querySelector("#test7"));
    ui.oninput = (z4TemporalColor) => document.getElementById("test8").textContent = "ONINPUT " + test_color3.stringify(z4TemporalColor);
    ui.onchange = (z4TemporalColor) => document.getElementById("test8").textContent = "ONCHANGE " + test_color3.stringify(z4TemporalColor);
    document.getElementById("test8").textContent = test_color3.stringify(ui.getZ4TemporalColor());
  }

  static  drawAll() {
    // test_color3.drawCanvas("canvas1", new Z4TemporalColor());
    // test_color3.drawCanvas("canvas2", new Z4TemporalColor().setRipple(0.2, 0));
    // test_color3.drawCanvas("canvas3", new Z4TemporalColor().setRipple(0, 0.2));
    // test_color3.drawCanvas("canvas4", new Z4TemporalColor().setRipple(0.4, 0).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16));
    // test_color3.drawCanvas("canvas5", new Z4TemporalColor().addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8));
    // test_color3.drawCanvas("canvas6", new Z4TemporalColor().setRipple(1, 0).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8));
    // test_color3.drawCanvas("canvas7", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255));
    // test_color3.drawCanvas("canvas8", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255).negative());
    // test_color3.drawCanvas("canvas9", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255).negative().inverted(true, true));
    // test_color3.drawCanvas("canvas10", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255).negative().inverted(true, true).setMirrored(true, true));
  }

  static  drawCanvas(id, color) {
    let canvas = document.getElementById(id);
    canvas.width = document.body.clientWidth / 2 - 100;
    canvas.height = 100;
    let offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < canvas.width; x++) {
      let z4GradientColor = color.getZ4GradientColorAt(x / canvas.width, true, true);
      for (let y = 0; y < canvas.height; y++) {
        offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / canvas.height, true, true).getHEX();
        offscreenCtx.fillRect(x, canvas.height - y, 1, 1);
      }
    }
    let ctx = canvas.getContext("2d");
    ctx.drawImage(offscreen, 0, 0);
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
