package giada.pizzapazza.color;

import static def.dom.Globals.document;
import def.js.Array;
import def.js.JSON;
import java.util.function.BiFunction;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;

/**
 *
 * @author gianpiero.di.blasi
 */
public class test_color2 {

  public static void onLoad() {
    document.getElementById("test1").textContent = "new Z4GradientColor() => " + test_color2.stringify(new Z4GradientColor());
    document.getElementById("test2").textContent = "new Z4GradientColor().addOrUpdateColor(0,65535) => " + test_color2.stringify(new Z4GradientColor().addOrUpdateColor(0, 65535));
    document.getElementById("test3").textContent = "new Z4GradientColor().addOrUpdateColor(0.3,65535).move(0.3,0.4) => " + test_color2.stringify(new Z4GradientColor().addOrUpdateColor(0.3, 65535).move(0.3, 0.4));
    document.getElementById("test4").textContent = "new Z4GradientColor().setRipple(0.2) => " + test_color2.stringify(new Z4GradientColor().setRipple(0.2));
    document.getElementById("test5").textContent = "new Z4GradientColor().getZ4ColorAt(0.5,false,false) => " + test_color2.stringify(new Z4GradientColor().getZ4ColorAt(0.5, false, false));
    document.getElementById("test6").textContent = "new Z4GradientColor().setRipple(0.2).getZ4ColorAt(0.75,true,false) => " + test_color2.stringify(new Z4GradientColor().setRipple(0.2).getZ4ColorAt(0.75, true, false));

    test_color2.drawCanvas("canvas1", new Z4GradientColor());
    test_color2.drawCanvas("canvas2", new Z4GradientColor().setRipple(0.2));
    test_color2.drawCanvas("canvas3", new Z4GradientColor().setRipple(0.4).addOrUpdateColor(0.5, 255 << 24 | 255 << 16));
    test_color2.drawCanvas("canvas4", new Z4GradientColor().setRipple(1).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8));
    test_color2.drawCanvas("canvas5", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8));
    test_color2.drawCanvas("canvas6", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative());
    test_color2.drawCanvas("canvas7", new Z4GradientColor().addOrUpdateColor(0.25, 255 << 24 | 255).addOrUpdateColor(0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 255 << 24 | 255 << 8).negative().inverted());
  }

  private static void drawCanvas(String id, Z4GradientColor color) {
    $Canvas canvas = ($Canvas) document.getElementById(id);

    canvas.width = document.body.clientWidth / 2 - 100;
    canvas.height = 100;

    $OffscreenCanvas offscreen = new $OffscreenCanvas(canvas.width, canvas.height);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    for (int x = 0; x < canvas.width; x++) {
      offscreenCtx.fillStyle = color.getZ4ColorAt(x / canvas.width, true, true).$getHEX();
      offscreenCtx.fillRect(x, 0, 1, canvas.height);
    }

    $CanvasRenderingContext2D ctx = canvas.getContext("2d");
    ctx.drawImage(offscreen, 0, 0);
  }

  private static String stringify(Object object) {

    BiFunction<String, Object, Object> replacer = (k, v) -> {
      if (!$exists(k)) {
        return v;
      } else if ($typeof(v, "number")) {
        return v;
      } else if ($typeof(v, "boolean")) {
        return v;
      } else if (Array.isArray(v)) {
        return v;
      } else {
        return JSON.stringify(v).replaceAll("\"", "").replaceAll("\n", "");
      }
    };

    return JSON.stringify(object, replacer, "\t").replaceAll("\"", "");
  }

  private test_color2() {
  }
}
