/**
 * The abstract gradient color
 *
 * @author gianpiero.diblasi
 * @param <T> The type of color
 */
class Z4AbstractGradientColor {

  /**
   * The array of colors
   */
   colors = new Array();

  /**
   * The array of positions
   */
   colorPositions = new Array();

   ripple = 0.0;

  /**
   * Adds a color in a position, if the position is already occupied then
   * replaces the color
   *
   * @param color The color
   * @param position The position (in the range [0,1])
   */
   addColor(color, position) {
    let index = this.colorPositions.findIndex(pos => pos === position);
    if (index !== -1) {
      this.colors[index] = color;
    } else {
      index = this.colorPositions.findIndex(pos => pos > position);
      if (index !== -1) {
        this.colors.splice(index, 0, color);
        this.colorPositions.splice(index, 0, position);
      } else {
        this.colors.push(color);
        this.colorPositions.push(position);
      }
    }
  }

  /**
   * Removes a color by position, if the position is not occupied then no color
   * is removed
   *
   * @param position The position (in the range [0,1])
   */
   removeColor(position) {
    let index = this.colorPositions.findIndex(pos => pos === position);
    if (index !== -1) {
      this.colors.splice(index, 1);
      this.colorPositions.splice(index, 1);
    }
  }

  /**
   * Checks if a position is occupied
   *
   * @param position The position (in the range [0,1])
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   * @return true if the position is occupied, false otherwise
   */
   isPositionOccupied(position, tolerance) {
    return !!(this.colorPositions.filter(pos => Math.abs(pos - position) <= tolerance).length);
  }

  /**
   * Returns a position based on another position and a tolerance
   *
   * @param position The position (in the range [0,1])
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   * @return The position, -1 if there is no valid position
   */
   getPosition(position, tolerance) {
    let positions = this.colorPositions.filter(pos => Math.abs(pos - position) <= tolerance);
    return positions.length ? positions[0] : -1;
  }

  /**
   * Returns the color positions
   *
   * @return The color positions
   */
   getColorPositions() {
    return this.colorPositions.slice();
  }

  /**
   * Returns a color in an index
   *
   * @param index The index
   * @return The color
   */
   getColorAtIndex(index) {
    return this.colors[index];
  }

  /**
   * Mirrors this color
   */
   mirror() {
    this.colors.slice().splice(0, this.colors.length - 1).reverse().forEach(color => this.colors.push(this.cloneColor(color)));
    for (let index = 0; index < this.colorPositions.length; index++) {
      this.colorPositions[index] = this.colorPositions[index] / 2;
    }
    this.colorPositions.slice().splice(0, this.colorPositions.length - 1).reverse().forEach(position => this.colorPositions.push(1 - position));
  }

  /**
   * Clones a color
   *
   * @param color The color
   * @return The cloned color
   */
   cloneColor(color) {
  }

  /**
   * Reverses this color
   */
   reverse() {
    this.colors.reverse();
    this.colorPositions.reverse().forEach((position, index, array) => this.colorPositions[index] = 1 - position);
  }

  /**
   * Sets the ripple
   *
   * @param ripple The ripple (in the range [0,1])
   */
   setRipple(ripple) {
    this.ripple = ripple;
  }

  /**
   * Returns the ripple
   *
   * @return The ripple (in the range [0,1])
   */
   getRipple() {
    return this.ripple;
  }

  /**
   * Returns a color in a position
   *
   * @param position The color position (in the range [0,1])
   * @param useRipple true to use ripple, false otherwise
   * @return The color
   */
   getColorAt(position, useRipple) {
  }

  /**
   * Returns this color as a JSON object
   *
   * @return This color as a JSON object
   */
   toJSON() {
  }
}