package pizzapazza.util;

/**
 * The options of a resize operation
 *
 * @author gianpiero.diblasi
 */
public class Z4ResizeOptions {

  public final int containerWidth;
  public final int containerHeight;
  public final int contentWidth;
  public final int contentHeight;
  public final int contentOffsetX;
  public final int contentOffsetY;

  /**
   * Creates the object
   *
   * @param containerWidth The container width
   * @param containerHeight The container height
   * @param contentWidth The content width
   * @param contentHeight The content height
   * @param contentOffsetX The content offset X
   * @param contentOffsetY The content offset Y
   */
  public Z4ResizeOptions(int containerWidth, int containerHeight, int contentWidth, int contentHeight, int contentOffsetX, int contentOffsetY) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;
    this.contentOffsetX = contentOffsetX;
    this.contentOffsetY = contentOffsetY;
  }
}
