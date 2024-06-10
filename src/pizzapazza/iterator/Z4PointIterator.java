package pizzapazza.iterator;

import pizzapazza.Z4JSONable;

/**
 * The common parent of all point iterators
 *
 * @author gianpiero.diblasi
 */
public abstract class Z4PointIterator implements Z4JSONable {

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
  public abstract boolean draw(Z4PointIteratorDrawingAction action, double x, double y);
}
