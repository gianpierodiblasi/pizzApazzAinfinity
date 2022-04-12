/* global Array, JSON, Z4GradientColor */

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
