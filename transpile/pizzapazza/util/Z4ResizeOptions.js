/**
 * The options of a resize operation
 *
 * @author gianpiero.diblasi
 */
class Z4ResizeOptions {

   containerWidth = 0;

   containerHeight = 0;

   contentWidth = 0;

   contentHeight = 0;

   contentOffsetX = 0;

   contentOffsetY = 0;

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
  constructor(containerWidth, containerHeight, contentWidth, contentHeight, contentOffsetX, contentOffsetY) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;
    this.contentOffsetX = contentOffsetX;
    this.contentOffsetY = contentOffsetY;
  }
}
