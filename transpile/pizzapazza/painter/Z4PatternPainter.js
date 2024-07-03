/**
 * The painter representing one or more patterns
 *
 * @author gianpiero.diblasi
 */
class Z4PatternPainter extends Z4Painter {

   patterns = null;

   randomSequence = false;

   multiSize = false;

   index = -1;

  /**
   * Creates the object
   *
   * @param patterns The patterns
   * @param randomSequence true for a random sequence (the patterns are randomly
   * selected), false otherwise (the patterns are selected in a sequence)
   * @param multiSize true if each pattern can be resized, false otherwise (the
   * original dimensions are used)
   */
  constructor(patterns, randomSequence, multiSize) {
    super();
    this.patterns = patterns;
    this.randomSequence = randomSequence;
    this.multiSize = multiSize;
  }

   getType() {
    return Z4PainterType.PATTERN;
  }

  /**
   * Returns the patterns
   *
   * @return The patterns
   */
   getPatterns() {
    return this.patterns;
  }

  /**
   * Check if a random sequence is used
   *
   * @return true for a random sequence (the patterns are randomly selected),
   * false otherwise (the patterns are selected in a sequence)
   */
   isRandomSequence() {
    return this.randomSequence;
  }

  /**
   * Check if each pattern can be resized
   *
   * @return true if each pattern can be resized, false otherwise (the original
   * dimensions are used)
   */
   isMultiSize() {
    return this.multiSize;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (this.patterns.length) {
      if (this.randomSequence) {
        this.index = parseInt(this.patterns.length * Math.random());
      } else {
        this.index++;
        this.index %= this.patterns.length;
      }
      let scale = this.multiSize ? Math.random() : 1;
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : scale * this.patterns[this.index].width);
      let currentHeight = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : scale * this.patterns[this.index].height);
      if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
        this.drawBounds(context, currentWidth, currentHeight);
      } else {
        this.drawPattern(context, this.patterns[this.index], currentWidth, currentHeight);
      }
    }
  }

   drawPattern(context, image, currentWidth, currentHeight) {
    context.save();
    context.drawImage(image, -currentWidth / 2, -currentHeight / 2, currentWidth, currentHeight);
    context.restore();
  }

   drawBounds(context, currentWidth, currentHeight) {
    context.save();
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.beginPath();
    context.ellipse(0, 0, currentWidth / 2, currentHeight / 2, 0, 0, Z4Math.TWO_PI);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.translate(1, 1);
    context.ellipse(0, 0, currentWidth / 2, currentHeight / 2, 0, 0, Z4Math.TWO_PI);
    context.stroke();
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    let base64 = new Array();
    this.patterns.forEach(pattern => {
      let canvas = document.createElement("canvas");
      canvas.width = pattern.width;
      canvas.height = pattern.height;
      let context = canvas.getContext("2d");
      context.drawImage(pattern, 0, 0);
      base64.push(canvas.toDataURL("image/png", 1));
    });
    json["patterns"] = base64;
    json["randomSequence"] = this.randomSequence;
    json["multiSize"] = this.multiSize;
    return json;
  }

  /**
   * Creates a Z4PatternPainter from a JSON object
   *
   * @param json The JSON object
   * @return the pattern painter
   */
  static  fromJSON(json) {
    let patterns = new Array();
    (json["patterns"]).forEach(base64 => {
      let pattern = new Image();
      pattern.src = base64;
      patterns.push(pattern);
    });
    return new Z4PatternPainter(patterns, json["randomSequence"], json["multiSize"]);
  }
}
