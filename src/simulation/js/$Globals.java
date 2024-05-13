package simulation.js;

import simulation.dom.$Document;
import simulation.dom.$Navigator;
import simulation.dom.$Window;

/**
 * Simulation of the global functions
 *
 * @author gianpiero.diblasi
 */
public class $Globals {

  public static $Navigator navigator;
  public static $Window window;
  public static $Document document;

  public static boolean $exists(Object object) {
    return false;
  }

  public static boolean $typeof(Object obj, String type) {
    return false;
  }

  public static int parseInt(double v) {
    return 0;
  }

  public static int parseInt(java.lang.String str) {
    return 0;
  }
  
  public static int parseInt(java.lang.String str, double v) {
    return 0;
  }

  public static int parseInt($String str, double v) {
    return 0;
  }

  public static int parseInt(def.js.String str, double v) {
    return 0;
  }

  public static int setTimeout($Apply_0_Void function, double milliseconds) {
    return 0;
  }

  public static int setInternal($Apply_0_Void function, double milliseconds) {
    return 0;
  }

  private $Globals() {
  }
}
