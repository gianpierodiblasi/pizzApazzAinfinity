/**
 * The painter of arrows, used only for testing purpose
 *
 * @author gianpiero.di.blasi
 */
class Z4ArrowPainter extends Z4Painter {

   module = 15;

   bool = false;

  /**
   * Sets the module
   *
   * @param module The module
   * @return This Z4ArrowPainter
   */
   setModule(module) {
    this.module = module;
    return this;
  }

  /**
   * Returns the module
   *
   * @return The module
   */
   getModule() {
    return this.module;
  }

   draw(context, point, gradientColor) {
    this.bool = !this.bool;
    let x = point.getIntensity() * (point.isUseVectorModuleAsSize() ? point.getZ4Vector().getModule() : this.module);
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = this.getColor(document.body.classList.contains("z4-dark") ? "white" : "black");
    context.beginPath();
    context.arc(0, 0, 2, 0, Z4Math.TWO_PI);
    context.stroke();
    context.strokeStyle = this.getColor(this.bool ? "blue" : "red");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 5, -2.5);
    context.lineTo(x - 5, +2.5);
    context.lineTo(x, 0);
    context.stroke();
    context.restore();
    return this;
  }
}
