package giada.pizzapazza.color;

import def.dom.Event;
import def.js.Array;
import def.js.JSON;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import java.util.function.BiFunction;
import java.util.function.Function;
import simulation.dom.$Canvas;
import simulation.dom.$CanvasRenderingContext2D;
import simulation.dom.$OffscreenCanvas;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.di.blasi
 */
public class test_color3 {

  public static void onLoad() {
    document.$getElementById("language").value = Z4Setting.getLanguage();
    document.$getElementById("language").onchange = (event) -> {
      Z4Setting.setLanguage(document.$getElementById("language").value);
      Z4MessageFactory.changingLanguage();
      return null;
    };

    document.$getElementById("mode").value = Z4Setting.getMode();
    document.$getElementById("mode").onchange = (event) -> {
      Z4Setting.setMode(document.$getElementById("mode").value);
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
  }

  private static void drawAll() {
    test_color3.drawCanvas("canvas1", new Z4TemporalColor());
    test_color3.drawCanvas("canvas2", new Z4TemporalColor().setRipple(0.2, 0));
    test_color3.drawCanvas("canvas3", new Z4TemporalColor().setRipple(0, 0.2));
    test_color3.drawCanvas("canvas4", new Z4TemporalColor().setRipple(0.4, 0).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16));
    test_color3.drawCanvas("canvas5", new Z4TemporalColor().addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8));
    test_color3.drawCanvas("canvas6", new Z4TemporalColor().setRipple(1, 0).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8));
    test_color3.drawCanvas("canvas7", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255));
    test_color3.drawCanvas("canvas8", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255).negative());
    test_color3.drawCanvas("canvas9", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255).negative().inverted(true, true));
    test_color3.drawCanvas("canvas10", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 8 | 255).addOrUpdateColor(0.25, 0.5, 255 << 24 | 255).addOrUpdateColor(0.5, 0.5, 255 << 24 | 255 << 16).addOrUpdateColor(0.75, 0.5, 255 << 24 | 255 << 8).addOrUpdateColor(1, 1, 255 << 24 | 255 << 16 | 255).negative().inverted(true, true).setMirrored(true, true));

    test_color3.drawCanvas2("canvas11", "slider1", "slider2", new Z4TemporalColor().addOrUpdateColor(0, 0, 255 << 24 | 255 << 16).addOrUpdateColor(1, 1, 255 << 24 | 255));
    test_color3.setCanvas("canvas12");
  }

  private static void setCanvas(String id) {
    $Canvas canvas = ($Canvas) document.getElementById(id);
    canvas.width = document.body.clientWidth / 2 - 100;
    canvas.height = 100;
  }

  private static void drawCanvas(String id, Z4TemporalColor color) {
    $Canvas canvas = ($Canvas) document.getElementById(id);
    canvas.width = document.body.clientWidth / 2 - 100;
    canvas.height = 100;

    $OffscreenCanvas offscreen = new $OffscreenCanvas(canvas.width, canvas.height);
    $CanvasRenderingContext2D offscreenCtx = offscreen.getContext("2d");
    for (int x = 0; x < canvas.width; x++) {
      Z4AbstractGradientColor<?> z4GradientColor = color.getZ4GradientColorAt(x / canvas.width, true, true);

      for (int y = 0; y < canvas.height; y++) {
        offscreenCtx.fillStyle = z4GradientColor.getZ4ColorAt(y / canvas.height, true, true).$getHEX();
        offscreenCtx.fillRect(x, canvas.height - y, 1, 1);
      }
    }

    $CanvasRenderingContext2D ctx = canvas.getContext("2d");
    ctx.drawImage(offscreen, 0, 0);
  }

  private static void drawCanvas2(String canvas, String slider1, String slider2, Z4TemporalColor color) {
    test_color3.drawCanvas(canvas, color);

    Function<Event, Object> oninput = (event) -> {
      color.setRipple(document.$getElementById(slider1).valueAsNumber, document.$getElementById(slider2).valueAsNumber);
      test_color3.drawCanvas(canvas, color);
      return null;
    };

    document.getElementById(slider1).oninput = oninput;
    document.getElementById(slider2).oninput = oninput;
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

  private test_color3() {
  }
}
