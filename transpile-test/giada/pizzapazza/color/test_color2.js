/* global Array, JSON, OffscreenCanvas, Z4GradientColor, Z4Setting */

/**
 * @author gianpiero.di.blasi
 */
class test_color2 {

  static  onLoad() {
    document.getElementById("test1").textContent = "new Z4GradientColor() => " + test_color2.stringify(new Z4GradientColor());
    document.getElementById("test2").textContent = "new Z4GradientColor().addOrUpdateColor(0,65535) => " + test_color2.stringify(new Z4GradientColor().addOrUpdateColor(0, 65535));
    document.getElementById("test3").textContent = "new Z4GradientColor().addOrUpdateColor(0.3,65535).move(0.3,0.4) => " + test_color2.stringify(new Z4GradientColor().addOrUpdateColor(0.3, 65535).move(0.3, 0.4));
    document.getElementById("test4").textContent = "new Z4GradientColor().setRipple(0.2) => " + test_color2.stringify(new Z4GradientColor().setRipple(0.2));
    document.getElementById("test5").textContent = "new Z4GradientColor().getZ4ColorAt(0.5,false,false) => " + test_color2.stringify(new Z4GradientColor().getZ4ColorAt(0.5, false, false));
    document.getElementById("test6").textContent = "new Z4GradientColor().setRipple(0.2).getZ4ColorAt(0.75,true,false) => " + test_color2.stringify(new Z4GradientColor().setRipple(0.2).getZ4ColorAt(0.75, true, false));
    test_color2.drawAll();
    document.getElementById("mode").value = Z4Setting.getMode();
    document.getElementById("mode").onchange = (event) => {
      Z4Setting.setMode(document.getElementById("mode").value);
      test_color2.drawAll();
      return null;
    };
  }

  static  drawAll() {
    test_color2.drawCanvas("canvas1", new Z4GradientColor());
    test_color2.drawCanvas("canvas2", new Z4GradientColor().setRipple(0.2));
    test_color2.drawCanvas("canvas3", new Z4GradientColor().setRipple(0.4).addOrUpdateColor(0.5, 255 << 24 | 255 << 16));
    test_color2.drawCanvas("canvas4", new Z4GradientColor().setRipple(1).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8));
    test_color2.drawCanvas("canvas5", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8));
    test_color2.drawCanvas("canvas6", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative());
    test_color2.drawCanvas("canvas7", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative().inverted());
    test_color2.drawCanvas("canvas8", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative().inverted().setMirrored(true));
    test_color2.fillCanvas("canvas9", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative().inverted(), 1);
    test_color2.fillCanvas("canvas10", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative().inverted(), 2);
    test_color2.fillCanvas("canvas11", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative().inverted(), 3);
    test_color2.setCanvas("canvas12");
    test_color2.drawCanvas2("canvas13", "slider1", new Z4GradientColor());
    test_color2.drawCanvas2("canvas14", "slider2", new Z4GradientColor().addOrUpdateColor(0.5, 255 << 24 | 255 << 16));
  }

  static  setCanvas(id) {
    let canvas = document.getElementById(id);
    canvas.width = document.body.clientWidth / 2 - 100;
    canvas.height = 100;
  }

  static  drawCanvas(id, color) {
    let canvas = document.getElementById(id);
    canvas.width = document.body.clientWidth / 2 - 100;
    canvas.height = 100;
    let offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    let offscreenCtx = offscreen.getContext("2d");
    for (let x = 0; x < canvas.width; x++) {
      offscreenCtx.fillStyle = color.getZ4ColorAt(x / canvas.width, true, true).getHEX();
      offscreenCtx.fillRect(x, 0, 1, canvas.height);
    }
    let ctx = canvas.getContext("2d");
    ctx.drawImage(offscreen, 0, 0);
  }

  static  drawCanvas2(canvas, slider, color) {
    test_color2.drawCanvas(canvas, color);
    document.getElementById(slider).oninput = (event) => {
      color.setRipple(document.getElementById(slider).valueAsNumber);
      test_color2.drawCanvas(canvas, color);
      return null;
    };
  }

  static  fillCanvas(id, color, style) {
    let canvas = document.getElementById(id);
    canvas.width = document.body.clientWidth / 2 - 100;
    canvas.height = 100;
    let offscreen = new OffscreenCanvas(canvas.width, canvas.height);
    let offscreenCtx = offscreen.getContext("2d");
    switch(style) {
      case 1:
        offscreenCtx.fillStyle = color.getLinearGradient(offscreenCtx, canvas.width / 2 - 5, 0, canvas.width / 2 + 5, canvas.height);
        break;
      case 2:
        offscreenCtx.fillStyle = color.getRadialGradient(offscreenCtx, canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, 100);
        break;
      case 3:
        offscreenCtx.fillStyle = color.getConicGradient(offscreenCtx, canvas.width / 2, canvas.height / 2, 0);
        break;
    }
    offscreenCtx.fillRect(0, 0, canvas.width, canvas.height);
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
