package giada.pizzapazza.iterator;

import def.js.Array;
import def.js.JSON;
import giada.pizzapazza.color.ui.Z4GradientColorUI;
import giada.pizzapazza.iterator.ui.Z4StamperUI;
import giada.pizzapazza.math.Z4FancifulValue;
import giada.pizzapazza.math.Z4Point;
import giada.pizzapazza.math.Z4Rotation;
import giada.pizzapazza.math.Z4SignedRandomValue;
import giada.pizzapazza.math.Z4Vector;
import giada.pizzapazza.painter.Z4Shape2DPainter;
import giada.pizzapazza.setting.Z4MessageFactory;
import giada.pizzapazza.setting.Z4Setting;
import java.util.function.BiFunction;
import static simulation.js.$Globals.$exists;
import static simulation.js.$Globals.$typeof;
import static simulation.js.$Globals.document;

/**
 *
 * @author gianpiero.diblasi
 */
public class test_stamper1 {

  public static void onLoad() {
    Z4StamperUI ui = new Z4StamperUI().appendToElement(document.getElementById("test1"));
    ui.oninput = (value) -> document.getElementById("test2").textContent = "ONINPUT " + test_stamper1.stringify(value);
    ui.onchange = (value) -> document.getElementById("test2").textContent = "ONCHANGE " + test_stamper1.stringify(value);
    document.getElementById("test2").textContent = test_stamper1.stringify(ui.getValue());

    document.$getElementById("painter").onchange = (event) -> {
      switch (document.$getElementById("painter").value) {
        case "none":
          ui.setPainter(null);
          break;
        case "shape2d":
          ui.setPainter(new Z4Shape2DPainter());
          break;
      }
      return null;
    };

    Z4GradientColorUI ui2 = new Z4GradientColorUI().appendToElement(document.querySelector("#color"));
    ui2.oninput = (value) -> ui.setGradientColor(value);
    ui2.onchange = (value) -> ui.setGradientColor(value);
  }
}
