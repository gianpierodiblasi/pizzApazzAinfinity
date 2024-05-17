package simulation.dom;

import def.dom.CanvasGradient;
import def.dom.CanvasPattern;
import def.dom.CanvasRenderingContext2D;
import def.js.Array;
import jsweet.util.union.Union4;
import simulation.js.$Path2D;

/**
 * The simulation of the CanvasRenderingContext2D object
 *
 * @author gianpiero.diblasi
 */
public class $CanvasRenderingContext2D extends CanvasRenderingContext2D {

  public boolean imageSmoothingEnabled;
  
  public void stroke($Path2D path) {
  }

  public void fill($Path2D path) {
  }

  public void drawImage($Image image, double x, double y) {
  }

  public void drawImage($OffscreenCanvas canvas, double x, double y) {
  }

  public void setLineDash(Array<Double> array) {
  }
  
  public CanvasGradient createConicGradient(double angle, double x, double y) {
    return null;
  }

  public Union4<String, CanvasGradient, CanvasPattern, java.lang.Object> createPattern($Image image, String string) {
    return null;
  }
}
