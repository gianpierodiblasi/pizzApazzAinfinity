/* global Translations, Z4Translations, SwingJS, LaunchParams, launchQueue, Z4Constants */

window.onload = () => {
  window.addEventListener("wheel", event => {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, {passive: false});

  window.addEventListener("keydown", event => {
    if (event.ctrlKey && (event.key === "+" || event.key === "-")) {
      event.preventDefault();
      document.querySelector(".z4canvas").dispatchEvent(new event.constructor(event.type, event));
    }
  });

  switch (localStorage.getItem("z4language")) {
    case "en":
      Translations.setEnglish();
      Z4Translations.setEnglish();
      break;
    case "it":
      Translations.setItalian();
      Z4Translations.setItalian();
      break;
  }

  switch (localStorage.getItem("z4theme")) {
    case "light":
      break;
    case "dark":
      SwingJS.instance().darkMode(true).build();
      break;
    case "auto":
    default:
      SwingJS.instance().darkMode(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches).build();
      break;
  }

  let color = localStorage.getItem("z4color");
  if (color) {
    SwingJS.instance().mainActionBGColor(color).build();
  }

  SwingJS.instance().fontSize(12).build();

  Z4Constants.configureAcceptedFileTypeArrays();
  
  var frame = new Z4Frame();

  if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
    launchQueue.setConsumer(launchParams => {
      if (launchParams.files[0]) {
        launchParams.files[0].getFile().then(file => {
          if (file.name.toLowerCase().endsWith(".z4i")) {
            frame.canvas.openProject(file);
          } else {
            frame.canvas.createFromFile(file);
          }
        });
      }
    });
  }

  if ("serviceWorker" in navigator) {
    let newWorker, refreshing;

    navigator.serviceWorker.register('service-worker.js').then(reg => {
      reg.onupdatefound = () => {
        newWorker = reg.installing;

        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            document.querySelector(".z4ribbonhelppanel .z4check-update").style.display = "flex";
            document.querySelector(".z4ribbonhelppanel .z4check-update").onclick = () => newWorker.postMessage({action: 'skipWaiting'});
          }
        };
      };
    });

    navigator.serviceWorker.oncontrollerchange = () => {
      if (!refreshing) {
        caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
        window.location.reload();
        refreshing = true;
      }
    };

    window.addEventListener('beforeinstallprompt', event => {
      document.querySelector(".z4ribbonhelppanel .z4check-install").style.display = "flex";
      document.querySelector(".z4ribbonhelppanel .z4check-install").onclick = () => event.prompt();
    });

    window.addEventListener('appinstalled', () => document.querySelector(".z4ribbonhelppanel .z4check-install").style.display = "none");

    if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      document.head.title = "";
    }
  }
};
/**
 * The behavior of a progression of a color (flat, gradient, bigradient)
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgressionBehavior {

  /**
   * The color is used spatially
   */
  static SPATIAL = 'SPATIAL';
  /**
   * The color is used temporally
   */
  static TEMPORAL = 'TEMPORAL';
  /**
   * The color is used temporally relative to the length of a path
   */
  static RELATIVE_TO_PATH = 'RELATIVE_TO_PATH';
  /**
   * The color is randomly selected
   */
  static RANDOM = 'RANDOM';
}
/**
 * The lighting of a color
 *
 * @author gianpiero.diblasi
 */
class Z4Lighting {

  /**
   * No lighting
   */
  static NONE = 'NONE';
  /**
   * lighting from in to out
   */
  static LIGHTED_IN_OUT = 'LIGHTED_IN_OUT';
  /**
   * darkening from in to out
   */
  static DARKENED_IN_OUT = 'DARKENED_IN_OUT';
  /**
   * lighting from out to in
   */
  static LIGHTED_OUT_IN = 'LIGHTED_OUT_IN';
  /**
   * darkening from out to in
   */
  static DARKENED_OUT_IN = 'DARKENED_OUT_IN';
}
/**
 * The common interface for all fillers; each instance of
 * <i>Z4AbstractFiller</i> provides a different painting style (radial, conic,
 * elliptic, ect.)
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractFiller {

  /**
   * Fills an image
   *
   * @param imageData The image data
   */
   fill(imageData) {
  }

  /**
   * Returns the filling color (an instance of Color or Z4GradientColor) if it
   * exists
   *
   * @return The filling color (an instance of Color or Z4GradientColor)
   */
   getFillingColor() {
  }
}
/**
 * A Filler based on a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractGradientColorFiller extends Z4AbstractFiller {

   gradientColor = null;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   */
  constructor(gradientColor) {
    super();
    this.gradientColor = gradientColor;
  }

   fill(imageData) {
    let data = imageData.data;
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        let position = this.getColorPositionAt(x, y);
        if (position !== -1) {
          let color = this.gradientColor.getColorAt(position, true);
          let index = (y * imageData.width + x) * 4;
          data[index] = color.red;
          data[index + 1] = color.green;
          data[index + 2] = color.blue;
          data[index + 3] = color.alpha;
        }
      }
    }
  }

  /**
   * Returns the color position to use for a pixel
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The color position, -1 if no position is available
   */
   getColorPositionAt(x, y) {
  }

   getFillingColor() {
    return this.gradientColor;
  }
}
/**
 * A Filler with a boundary behavior
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractBoundaryBehaviorFiller extends Z4AbstractGradientColorFiller {

   boundaryBehavior = null;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, boundaryBehavior) {
    super(gradientColor);
    this.boundaryBehavior = boundaryBehavior;
  }

   getColorPositionAt(x, y) {
    return this.getColorPositionAtWithBoundaryBehavior(x, y, this.boundaryBehavior);
  }

  /**
   * Returns the color position to use for a pixel
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @param boundaryBehavior The boundary behavior
   * @return The color position, -1 if no position is available
   */
   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
  }
}
/**
 * A Filler with a boundary behavior based on a distance
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractDistanceBasedBoundaryBehaviorFiller extends Z4AbstractBoundaryBehaviorFiller {

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
  }

  /**
   * Returns the distance of a point
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @return The distance
   */
   getDistance(x, y) {
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let d = this.getDistance(x, y);
    if (d <= 1) {
      return d;
    } else if (boundaryBehavior === Z4BoundaryBehavior.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.FILL_AT_BOUNDARY) {
      return 1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY) {
      let step = Math.floor(d);
      d -= step;
      if ((step % 2)) {
        d = 1 - d;
      }
      return d;
    } else if (boundaryBehavior === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY) {
      return d - Math.floor(d);
    } else {
      return -1;
    }
  }
}
/**
 * A (multi) cubic bezier filler
 *
 * @author gianpiero.diblasi
 */
class Z4BezierFiller extends Z4AbstractDistanceBasedBoundaryBehaviorFiller {

   x1 = 0;

   y1 = 0;

   ctrlx1 = 0;

   ctrly1 = 0;

   ctrlx2 = 0;

   ctrly2 = 0;

   x2 = 0;

   y2 = 0;

   radius = 0;

   bezier = null;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx1 The x-axis coordinate of the first control point of the curve
   * @param ctrly1 The y-axis coordinate of the first control point of the curve
   * @param ctrlx2 The x-axis coordinate of the second control point of the
   * curve
   * @param ctrly2 The y-axis coordinate of the second control point of the
   * curve
   * @param x2 The x-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param y2 The y-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param radius The radius
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2, radius, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.x1 = x1;
    this.y1 = y1;
    this.ctrlx1 = ctrlx1;
    this.ctrly1 = ctrly1;
    this.ctrlx2 = ctrlx2;
    this.ctrly2 = ctrly2;
    this.x2 = x2;
    this.y2 = y2;
    this.radius = radius;
    this.bezier = new Bezier(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
  }

   getDistance(x, y) {
    let point = this.bezier.project(new Z4Point(x, y));
    return Z4Math.distance(point.x, point.y, x, y) / this.radius;
  }
}
/**
 * A (multi) elliptic filler
 *
 * @author gianpiero.diblasi
 */
class Z4EllipticFiller extends Z4AbstractDistanceBasedBoundaryBehaviorFiller {

   cx = 0;

   cy = 0;

   rx = 0;

   ry = 0;

   angle = 0.0;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param rx The x-radius
   * @param ry The y-radius
   * @param angle The rotation angle of the ellipse (in radians)
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, cx, cy, rx, ry, angle, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
  }

   getDistance(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    return Math.hypot(rotated.x / this.rx, rotated.y / this.ry);
  }
}
/**
 * A (multi) sinusoidal filler
 *
 * @author gianpiero.diblasi
 */
class Z4SinusoidalFiller extends Z4AbstractDistanceBasedBoundaryBehaviorFiller {

   x = 0;

   y = 0;

   waveLength = 0.0;

   period = 0.0;

   amplitude = 0.0;

   angle = 0.0;

   two_PI_over_period = 0.0;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x The x-axis coordinate of the start point of the sinusoid
   * @param y The y-axis coordinate of the start point of the sinusoid
   * @param waveLength The wave lenght of the sinusoid
   * @param period The period of the sinusoid
   * @param amplitude The amplitude of the sinusoid
   * @param angle The rotation angle of the sinusoid
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, x, y, waveLength, period, amplitude, angle, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.x = x;
    this.y = y;
    this.waveLength = waveLength;
    this.period = period;
    this.amplitude = amplitude;
    this.angle = angle;
    this.two_PI_over_period = Z4Math.TWO_PI / this.period;
  }

   getDistance(x, y) {
    let rotated = Z4Math.rotate(x - this.x, y - this.y, this.angle);
    return Math.abs(rotated.y - this.amplitude * Math.sin(rotated.x * this.two_PI_over_period)) / this.waveLength;
  }
}
/**
 * A Filler which can be inscribed in an ellipse
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractEllipseInscribedFiller extends Z4AbstractBoundaryBehaviorFiller {

   cx = 0;

   cy = 0;

   rx = 0;

   ry = 0;

   angle = 0.0;

   vertexCount = 0;

   edges = null;

   d00 = 0.0;

   ctx = new OffscreenCanvas(1, 1).getContext("2d");

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point of the inscribing
   * ellipse
   * @param cy The y-axis coordinate of the center point of the inscribing
   * ellipse
   * @param rx The x-radius of the inscribing ellipse
   * @param ry The y-radius of the inscribing ellipse
   * @param angle The rotation angle of the inscribing ellipse
   * @param vertexCount The number of vertices of the polygon
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.cx = cx;
    this.cy = cy;
    this.rx = rx;
    this.ry = ry;
    this.angle = angle;
    this.vertexCount = vertexCount;
    this.edges = this.createEdges(this.vertexCount);
    this.ctx.beginPath();
    this.edges.forEach((edge, index, array) => {
      if (index === 0) {
        this.ctx.moveTo(edge.x1, edge.y1);
      } else {
        this.ctx.lineTo(edge.x1, edge.y1);
      }
    });
    this.ctx.closePath();
    this.d00 = this.edges.map(edge => Z4Math.ptSegDist(edge.x1, edge.y1, edge.x2, edge.y2, 0, 0)).reduce((accumulator, current, index, array) => Math.min(accumulator, current));
  }

  /**
   * Creates the polygon edges
   *
   * @param vertexCount The number of vertices of the polygon
   * @return The edges
   */
   createEdges(vertexCount) {
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let xx = rotated.x / this.rx;
    let yy = rotated.y / this.ry;
    if (boundaryBehavior === Z4BoundaryBehavior.STOP_AT_BOUNDARY || boundaryBehavior === Z4BoundaryBehavior.FILL_AT_BOUNDARY) {
      return this.ctx.isPointInPath(xx, yy) ? 1 - this.getDistance(xx, yy, 1) : boundaryBehavior === Z4BoundaryBehavior.STOP_AT_BOUNDARY ? -1 : 1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY || boundaryBehavior === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY) {
      let divider = 1;
      let xxx = xx / divider;
      let yyy = yy / divider;
      let distance = this.getDistance(xxx, yyy, divider);
      while (distance > 1 || !this.ctx.isPointInPath(xxx, yyy)) {
        divider++;
        xxx = xx / divider;
        yyy = yy / divider;
        distance = this.getDistance(xxx, yyy, divider);
      }
      return boundaryBehavior === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY ? 1 - distance : divider % 2 ? 1 - distance : distance;
    } else {
      return -1;
    }
  }

   getDistance(x, y, divider) {
    return this.edges.map(edge => Z4Math.ptSegDist(edge.x1, edge.y1, edge.x2, edge.y2, x, y)).reduce((accumulator, current, index, array) => Math.min(accumulator, current)) / (this.d00 / divider);
  }
}
/**
 * A (multi) polygon filler
 *
 * @author gianpiero.diblasi
 */
class Z4PolygonFiller extends Z4AbstractEllipseInscribedFiller {

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point of the ellipse
   * containing the (regular) polygon
   * @param cy The y-axis coordinate of the center point of the ellipse
   * containing the (regular) polygon
   * @param rx The x-radius of the ellipse containing the (regular) polygon
   * @param ry The y-radius of the ellipse containing the (regular) polygon
   * @param angle The rotation angle of the ellipse containing the (regular)
   * polygon (in radians)
   * @param vertexCount The number of vertices of the polygon
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior) {
    super(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior);
  }

   createEdges(vertexCount) {
    let edges = new Array();
    for (let index = 0; index < vertexCount - 1; index++) {
      edges.push(new Z4Line(Math.cos(index * Z4Math.TWO_PI / vertexCount), Math.sin(index * Z4Math.TWO_PI / vertexCount), Math.cos((index + 1) * Z4Math.TWO_PI / vertexCount), Math.sin((index + 1) * Z4Math.TWO_PI / vertexCount)));
    }
    edges.push(new Z4Line(Math.cos((vertexCount - 1) * Z4Math.TWO_PI / vertexCount), Math.sin((vertexCount - 1) * Z4Math.TWO_PI / vertexCount), Math.cos(0), Math.sin(0)));
    return edges;
  }
}
/**
 * A (multi) star filler
 *
 * @author gianpiero.diblasi
 */
class Z4StarFiller extends Z4AbstractEllipseInscribedFiller {

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point of the ellipse
   * containing the (regular) star
   * @param cy The y-axis coordinate of the center point of the ellipse
   * containing the (regular) star
   * @param rx The x-radius of the ellipse containing the (regular) star
   * @param ry The y-radius of the ellipse containing the (regular) star
   * @param angle The rotation angle of the ellipse containing the (regular)
   * star (in radians)
   * @param vertexCount The number of vertices of the star
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior) {
    super(gradientColor, cx, cy, rx, ry, angle, vertexCount, boundaryBehavior);
  }

   createEdges(vertexCount) {
    let points = new Array();
    for (let index = 0; index < vertexCount; index++) {
      let val = index * Z4Math.TWO_PI / vertexCount;
      points.push(new Z4Point(Math.cos(val), Math.sin(val)));
      val = (index * Z4Math.TWO_PI + Math.PI) / vertexCount;
      points.push(new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION));
    }
    points.push(new Z4Point(Math.cos(0), Math.sin(0)));
    let edges = new Array();
    for (let index = 0; index < points.length - 1; index++) {
      edges.push(new Z4Line(points[index].x, points[index].y, points[index + 1].x, points[index + 1].y));
    }
    return edges;
  }
}
/**
 * A (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
class Z4LinearFiller extends Z4AbstractBoundaryBehaviorFiller {

   p1x = 0;

   p1y = 0;

   p2x = 0;

   p2y = 0;

   angle = 0.0;

   distance = 0.0;

   line1x = 0.0;

   line1y = 0.0;

   line2x = 0.0;

   line2y = 0.0;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param boundaryBehavior The boundary behavior
   */
  constructor(gradientColor, x1, y1, x2, y2, boundaryBehavior) {
    super(gradientColor, boundaryBehavior);
    this.p1x = x1;
    this.p1y = y1;
    this.p2x = x2;
    this.p2y = y2;
    this.angle = Z4Math.atan(this.p1x, this.p1y, this.p2x, this.p2y) + Z4Math.HALF_PI;
    this.distance = Z4Math.distance(this.p1x, this.p1y, this.p2x, this.p2y);
    this.line1x = this.p1x + Math.cos(this.angle);
    this.line1y = this.p1y + Math.sin(this.angle);
    this.line2x = this.p2x + Math.cos(this.angle);
    this.line2y = this.p2y + Math.sin(this.angle);
  }

   getColorPositionAtWithBoundaryBehavior(x, y, boundaryBehavior) {
    let d1 = Z4Math.ptLineDist(this.p1x, this.p1y, this.line1x, this.line1y, x, y) / this.distance;
    let d2 = Z4Math.ptLineDist(this.p2x, this.p2y, this.line2x, this.line2y, x, y) / this.distance;
    if (d1 <= 1 && d2 <= 1) {
      return d1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.STOP_AT_BOUNDARY) {
      return -1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.FILL_AT_BOUNDARY) {
      return d1 < d2 ? 0 : 1;
    } else if (boundaryBehavior === Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY) {
      let position = d1 < d2 ? d1 : d2;
      let step = Math.floor(position);
      position -= step;
      if ((d1 < d2 && (step % 2)) || (d1 > d2 && !(step % 2))) {
        position = 1 - position;
      }
      return position;
    } else if (boundaryBehavior === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY) {
      let position = d1 < d2 ? d1 : d2;
      position -= Math.floor(position);
      if (d1 < d2) {
        position = 1 - position;
      }
      return position;
    } else {
      return -1;
    }
  }
}
/**
 * A (multi) conic filler
 *
 * @author gianpiero.diblasi
 */
class Z4ConicFiller extends Z4AbstractGradientColorFiller {

   cx = 0;

   cy = 0;

   angle = 0.0;

   symmetric = false;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param angle The rotation angle of the cone (in radians)
   * @param symmetric true for symmetric cone, false otherwise
   */
  constructor(gradientColor, cx, cy, angle, symmetric) {
    super(gradientColor);
    this.cx = cx;
    this.cy = cy;
    this.angle = angle;
    this.symmetric = symmetric;
  }

   getColorPositionAt(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let position = Math.atan2(rotated.y, rotated.x) / Z4Math.TWO_PI;
    if (position < 0) {
      position += 1;
    }
    if (this.symmetric) {
      return 2 * (position < 0.5 ? position : 1 - position);
    } else {
      return position;
    }
  }
}
/**
 * A (multi) spiral filler
 *
 * @author gianpiero.diblasi
 */
class Z4SpiralFiller extends Z4AbstractGradientColorFiller {

   cx = 0;

   cy = 0;

   radius = 0.0;

   angle = 0.0;

   logarithmic = false;

  /**
   * Creates the object
   *
   * @param gradientColor The color used to fill
   * @param cx The x-axis coordinate of the center point
   * @param cy The y-axis coordinate of the center point
   * @param radius The radius of the spiral
   * @param angle The start angle of the spiral (in radians)
   * @param logarithmic true for a logarithmic spiral, false otherwise
   */
  constructor(gradientColor, cx, cy, radius, angle, logarithmic) {
    super(gradientColor);
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.angle = angle;
    this.logarithmic = logarithmic;
  }

   getColorPositionAt(x, y) {
    let rotated = Z4Math.rotate(x - this.cx, y - this.cy, this.angle);
    let distance = Math.hypot(rotated.x, rotated.y);
    let currentAngle = Z4Math.TWO_PI * (this.logarithmic ? Math.log(distance / this.radius) : distance / this.radius);
    let xSpiral = distance * Math.cos(currentAngle);
    let ySpiral = distance * Math.sin(currentAngle);
    distance = Z4Math.distance(rotated.x, rotated.y, xSpiral, ySpiral) / (2 * distance);
    return isNaN(distance) ? 0 : distance;
  }
}
/**
 * A Filler based on a texture
 *
 * @author gianpiero.diblasi
 */
class Z4TextureFiller extends Z4AbstractFiller {

   texture = null;

   x1 = 0;

   y1 = 0;

   x2 = 0;

   y2 = 0;

   color = null;

   symmetric = false;

   textureData = null;

   left = 0;

   top = 0;

   width = 0;

   height = 0;

   scaleW = 0.0;

   scaleH = 0.0;

  /**
   * Creates the object
   *
   * @param texture The texture
   * @param x1 The x-axis coordinate of the top-left corner where start the
   * texture
   * @param y1 The y-axis coordinate of the top-left corner where start the
   * texture
   * @param x2 The x-axis coordinate of the bottom-right corner where start the
   * texture
   * @param y2 The y-axis coordinate of the bottom-right corner where start the
   * texture
   * @param color The background color
   * @param symmetric true for symmetric texture, false otherwise
   */
  constructor(texture, x1, y1, x2, y2, color, symmetric) {
    super();
    this.texture = texture;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.symmetric = symmetric;
    if (this.symmetric) {
      this.textureData = new Uint8Array(4 * 4 * this.texture.width * this.texture.height);
      for (let y = 0; y < this.texture.height; y++) {
        for (let x = 0; x < this.texture.width; x++) {
          let index = (y * this.texture.width + x) * 4;
          let indexSym = (y * this.texture.width * 2 + x) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
          indexSym = (y * this.texture.width * 2 + (this.texture.width * 2 - 1 - x)) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
          indexSym = ((2 * this.texture.height - 1 - y) * this.texture.width * 2 + x) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
          indexSym = ((2 * this.texture.height - y - 1) * this.texture.width * 2 + (this.texture.width * 2 - 1 - x)) * 4;
          this.textureData[indexSym] = this.texture.data[index];
          this.textureData[indexSym + 1] = this.texture.data[index + 1];
          this.textureData[indexSym + 2] = this.texture.data[index + 2];
          this.textureData[indexSym + 3] = this.texture.data[index + 3];
        }
      }
    } else {
      this.textureData = this.texture.data;
    }
    this.left = Math.min(x1, x2);
    this.top = Math.min(y1, y2);
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
    this.scaleW = (this.symmetric ? 2 : 1) * this.texture.width / this.width;
    this.scaleH = (this.symmetric ? 2 : 1) * this.texture.height / this.height;
  }

   fill(imageData) {
    if (!this.width || !this.height) {
      return;
    }
    let data = imageData.data;
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        let index = (y * imageData.width + x) * 4;
        let p = this.computeRect(x, y);
        let xx = parseInt(this.scaleW * (x - p.x));
        let yy = parseInt(this.scaleH * (y - p.y));
        let indexTexture = (yy * (this.symmetric ? 2 : 1) * this.texture.width + xx) * 4;
        if (this.textureData[indexTexture + 3]) {
          data[index] = this.textureData[indexTexture];
          data[index + 1] = this.textureData[indexTexture + 1];
          data[index + 2] = this.textureData[indexTexture + 2];
          data[index + 3] = this.textureData[indexTexture + 3];
        } else {
          data[index] = this.color.red;
          data[index + 1] = this.color.green;
          data[index + 2] = this.color.blue;
          data[index + 3] = this.color.alpha;
        }
      }
    }
  }

   computeRect(x, y) {
    let l = this.left;
    let t = this.top;
    let r = l + this.width;
    let b = t + this.height;
    while (x < l) {
      l -= this.width;
      r = l + this.width;
    }
    while (x >= r) {
      l += this.width;
      r = l + this.width;
    }
    while (y < t) {
      t -= this.height;
      b = t + this.height;
    }
    while (y >= b) {
      t += this.height;
      b = t + this.height;
    }
    return new Point(l, t);
  }

   getFillingColor() {
    return this.color;
  }
}
/**
 * The boundary behavior of a filler
 *
 * @author gianpiero.diblasi
 */
class Z4BoundaryBehavior {

  /**
   * The filler does nothing outside the boundary
   */
  static STOP_AT_BOUNDARY = 'STOP_AT_BOUNDARY';
  /**
   * The filler uses the last color outside the boundary
   */
  static FILL_AT_BOUNDARY = 'FILL_AT_BOUNDARY';
  /**
   * The filler symmetrically repeats the color outside the boundary
   */
  static SYMMETRIC_AT_BOUNDARY = 'SYMMETRIC_AT_BOUNDARY';
  /**
   * The filler restarts the color outside the boundary
   */
  static REPEAT_AT_BOUNDARY = 'REPEAT_AT_BOUNDARY';
}
/**
 * The drawing action of a Z4PointIterator
 *
 * @author gianpiero.diblasi
 */
class Z4PointIteratorDrawingAction {

  /**
   * The start
   */
  static START = 'START';
  /**
   * The continue
   */
  static CONTINUE = 'CONTINUE';
  /**
   * The stop
   */
  static STOP = 'STOP';
}
/**
 * The point iterator type
 *
 * @author gianpiero.diblasi
 */
class Z4PointIteratorType {

  static STAMPER = 'STAMPER';
  static TRACER = 'TRACER';
  static AIRBRUSH = 'AIRBRUSH';
  static SPIROGRAPH = 'SPIROGRAPH';
  static SCATTERER = 'SCATTERER';
}
/**
 * The direction of a drawing
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingDirection {

  /**
   * The drawing can move in any direction
   */
  static FREE = 'FREE';
  /**
   * The drawing can only move horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The drawing can only move vertically
   */
  static VERTICAL = 'VERTICAL';
}
/**
 * The point where to perform a drawing
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingPoint {

   z4Vector = null;

   intensity = 0.0;

   temporalPosition = 0.0;

   intent = null;

   side = null;

   useVectorModuleAsSize = false;

  /**
   * Creates the object
   *
   * @param z4Vector The vector providing position and direction of the drawing
   * @param intensity The intensity of the drawing (in the range [0,1])
   * @param temporalPosition The temporal position to use in the color object
   * (in the range [0,1]), -1 if this point has no temporal position
   * @param intent the intent of this point
   * @param side The side
   * @param useVectorModuleAsSize true if the vector module of this point has to
   * be used has size, false otherwise
   */
  constructor(z4Vector, intensity, temporalPosition, intent, side, useVectorModuleAsSize) {
    this.z4Vector = z4Vector;
    this.intensity = intensity;
    this.temporalPosition = temporalPosition;
    this.intent = intent;
    this.side = side;
    this.useVectorModuleAsSize = useVectorModuleAsSize;
  }
}
/**
 * The intent of a Z4DrawingPoint
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingPointIntent {

  /**
   * The point has to be used to draw bounds
   */
  static DRAW_BOUNDS = 'DRAW_BOUNDS';
  /**
   * The point has to be used to replace previous bounds and draw new bounds
   */
  static REPLACE_PREVIOUS_BOUNDS = 'REPLACE_PREVIOUS_BOUNDS';
  /**
   * The point has to be used to draw objects
   */
  static DRAW_OBJECTS = 'DRAW_OBJECTS';
}
/**
 * The line
 *
 * @author gianpiero.diblasi
 */
class Z4Line {

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

  /**
   * Creates the object
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   */
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}
/**
 * The utility library for math
 *
 * @author gianpiero.diblasi
 */
class Z4Math {

  /**
   * 2*PI value
   */
  static  TWO_PI = 2 * Math.PI;

  /**
   * PI/2 value
   */
  static  HALF_PI = Math.PI / 2;

  /**
   * The square root of 2
   */
  static  SQRT_OF_2 = Math.sqrt(2);

  /**
   * The gold section
   */
  static  GOLD_SECTION = (1 + Math.sqrt(5)) / 2;

  /**
   * The gold section square
   */
  static  SQUARE_GOLD_SECTION = Z4Math.GOLD_SECTION * Z4Math.GOLD_SECTION;

  /**
   * RAD to DEG conversion
   */
  static  RAD2DEG = 180 / Math.PI;

  /**
   * DEG to RAD conversion
   */
  static  DEG2RAD = Math.PI / 180;

  /**
   * Converts an angle from radiants to degrees
   *
   * @param radians The angle in radians
   * @return The angle in degree
   */
  static  rad2deg(radians) {
    return radians * Z4Math.RAD2DEG;
  }

  /**
   * Converts an angle from degrees to radians
   *
   * @param degrees The angle in degrees
   * @return The angle in radians
   */
  static  deg2rad(degrees) {
    return degrees * Z4Math.DEG2RAD;
  }

  /**
   * Returns the distance between two points
   *
   * @param x1 The x-axis coordinate of the first point
   * @param y1 The y-axis coordinate of the first point
   * @param x2 The x-axis coordinate of the second point
   * @param y2 The y-axis coordinate of the second point
   * @return The distance between two points
   */
  static  distance(x1, y1, x2, y2) {
    let x = x1 - x2;
    let y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Returns the distance from a point to a (infinite) line
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The distance
   */
  static  ptLineDist(x1, y1, x2, y2, px, py) {
    return Math.sqrt(Z4Math.ptLineDistSq(x1, y1, x2, y2, px, py));
  }

  /**
   * Returns the square of the distance from a point to a (infinite) line
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The square of the distance
   */
  static  ptLineDistSq(x1, y1, x2, y2, px, py) {
    x2 -= x1;
    y2 -= y1;
    px -= x1;
    py -= y1;
    let dotprod = px * x2 + py * y2;
    let projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
    let lenSq = px * px + py * py - projlenSq;
    return lenSq < 0 ? 0 : lenSq;
  }

  /**
   * Returns the distance from a point to a line segment
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The distance
   */
  static  ptSegDist(x1, y1, x2, y2, px, py) {
    return Math.sqrt(Z4Math.ptSegDistSq(x1, y1, x2, y2, px, py));
  }

  /**
   * Returns the square of the distance from a point to a line segment
   *
   * @param x1 The x-axis coordinate of the start point of the line
   * @param y1 The y-axis coordinate of the start point of the line
   * @param x2 The x-axis coordinate of the end point of the line
   * @param y2 The y-axis coordinate of the end point of the line
   * @param px The x-axis coordinate of the point
   * @param py The y-axis coordinate of the point
   * @return The square of the distance
   */
  static  ptSegDistSq(x1, y1, x2, y2, px, py) {
    x2 -= x1;
    y2 -= y1;
    px -= x1;
    py -= y1;
    let dotprod = px * x2 + py * y2;
    let projlenSq = 0.0;
    if (dotprod <= 0.0) {
      projlenSq = 0.0;
    } else {
      px = x2 - px;
      py = y2 - py;
      dotprod = px * x2 + py * y2;
      if (dotprod <= 0.0) {
        projlenSq = 0.0;
      } else {
        projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
      }
    }
    let lenSq = px * px + py * py - projlenSq;
    return lenSq < 0 ? 0 : lenSq;
  }

  /**
   * Returns, give a point and a grid, the point in the grid with the minimum
   * distance from the given point
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @param cx The x-axis coordinate of the grid center
   * @param cy The y-axis coordinate of the grid center
   * @param plotWidth The grid plot width
   * @param magnetismPercentage The grid magnetism percentage, in the range
   * ]0,1]
   * @return The point in the grid with the minimum distance from the given
   * point, if the given point is inside the magnetism area, null otherwise
   */
  static  nearestPointInGrid(x, y, cx, cy, plotWidth, magnetismPercentage) {
    let dx = cx + Math.round((x - cx) / plotWidth) * plotWidth;
    let dy = cy + Math.round((y - cy) / plotWidth) * plotWidth;
    return Z4Math.distance(x, y, dx, dy) <= magnetismPercentage * plotWidth ? new Z4Point(dx, dy) : null;
  }

  /**
   * Returns the theta component of a point or a vector, in polar coordinates.
   * The value is normalized in the range [0,2*PI]
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x The x-axis coordinate of the end point
   * @param y The y-axis coordinate of the end point
   * @return The theta component of a point or a vector, in polar coordinates
   */
  static  atan(x0, y0, x, y) {
    let a = Math.atan2(y - y0, x - x0);
    return a < 0 ? a + Z4Math.TWO_PI : a;
  }

  /**
   * Rotates a point by an angle
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @param angle The angle (in radians)
   * @return The rotated point
   */
  static  rotate(x, y, angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new Z4Point(x * cos + y * sin, x * sin - y * cos);
  }

  /**
   * Rotates a point by an angle and then translates it
   *
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @param angle The angle (in radians)
   * @param tx The x-axis translation
   * @param ty The y-axis translation
   * @return The rotated point
   */
  static  rotoTranslate(x, y, angle, tx, ty) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new Z4Point(x * cos + y * sin + tx, x * sin - y * cos + ty);
  }

  /**
   * Generates a ripple around a value
   *
   * @param value The value
   * @param min The minimum allowed value
   * @param max The maximum allowed value
   * @param ripple The ripple (in the range [0,1])
   * @return The rippled value
   */
  static  ripple(value, min, max, ripple) {
    let rnd = (max - min) * ripple * Math.random();
    value += Math.random() > 0.5 ? rnd : -rnd;
    return value < min ? min : value > max ? max : value;
  }

  /**
   * Returns the vertices of a polygon inscribed in a circle with radius = 1
   *
   * @param vertexCount The vertex count
   * @return The vertices
   */
  static  getPolygonVertices(vertexCount) {
    let vertices = new Array();
    for (let index = 0; index < vertexCount; index++) {
      vertices.push(new Z4Point(Math.cos(index * Z4Math.TWO_PI / vertexCount), Math.sin(index * Z4Math.TWO_PI / vertexCount)));
    }
    return vertices;
  }

  /**
   * Returns the vertices of a star inscribed in a circle with radius = 1
   *
   * @param vertexCount The vertex count
   * @return The vertices
   */
  static  getStarVertices(vertexCount) {
    let vertices = new Array();
    for (let index = 0; index < vertexCount; index++) {
      let val = index * Z4Math.TWO_PI / vertexCount;
      vertices.push(new Z4Point(Math.cos(val), Math.sin(val)));
      val = (index * Z4Math.TWO_PI + Math.PI) / vertexCount;
      vertices.push(new Z4Point(Math.cos(val) / Z4Math.SQUARE_GOLD_SECTION, Math.sin(val) / Z4Math.SQUARE_GOLD_SECTION));
    }
    return vertices;
  }

  /**
   * Calculates the control points of a Bezier curve, having coincident starting
   * (S) and ending (E) points, passing through a given point (P), included in a
   * given angle (A) and symmetrical with respect to the straight line passing
   * through the starting point (S) and the given point (P)
   *
   * @param vector The vector starting at the starting point (S) and ending at
   * the given point (P)
   *
   * @param alpha The angle (A) including the Bezier curve, in radians
   * @return An array of two points containing the first and second control
   * points of the Bezier curve
   */
  static  butterfly(vector, alpha) {
    let cos = Math.cos(alpha);
    let sin = Math.sin(alpha);
    let val1 = 3 * (cos + 1);
    let val2 = vector.y0 - 4 * vector.y;
    let y = -(val2 * cos + 4 * (vector.x - vector.x0) * sin + val2) / val1;
    let x = (3 * vector.x0 * cos + 3 * (y - vector.y0) * sin - 5 * vector.x0 + 8 * vector.x) / val1;
    let controlPoint1 = new Z4Point(x, y);
    let dx = controlPoint1.x - vector.x0;
    let dy = controlPoint1.y - vector.y0;
    let controlPoint2 = new Z4Point(dx * cos - dy * sin + vector.x0, dx * sin + dy * cos + vector.y0);
    return new Array(controlPoint1, controlPoint2);
  }

  /**
   * Evaluates a random number by using a correction factor given by the law
   * f(x,y)=pow(x,1/y) with y&gt;=1
   *
   * @param factor The correction factor
   * @return The random number with the correction factor
   */
  static  randomCorrected(factor) {
    return Math.pow(Math.random(), 1.0 / factor);
  }

  constructor() {
  }
}
/**
 * The point
 *
 * @author gianpiero.diblasi
 */
class Z4Point {

   x = 0.0;

   y = 0.0;

  /**
   * Creates the object
   *
   * @param x The x-axis coordinate
   * @param y The y-axis coordinate
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
/**
 * The behavior of a random value
 *
 * @author gianpiero.diblasi
 */
class Z4RandomValueBehavior {

  /**
   * The random value generates "classic "random values
   */
  static CLASSIC = 'CLASSIC';
  /**
   * The random value generates random values on a bezier curve
   */
  static BEZIER = 'BEZIER';
  /**
   * The random value generates random values on a polyline
   */
  static POLYLINE = 'POLYLINE';
  /**
   * The random value generates random values on a stepped line
   */
  static STEPPED = 'STEPPED';
}
/**
 * The behavior of a rotation
 *
 * @author gianpiero.diblasi
 */
class Z4RotationBehavior {

  /**
   * The rotation is computed on a fixed value
   */
  static FIXED = 'FIXED';
  /**
   * The rotation is computed by cumulating previous rotation
   */
  static CUMULATIVE = 'CUMULATIVE';
  /**
   * The rotation is computed relative to a path
   */
  static RELATIVE_TO_PATH = 'RELATIVE_TO_PATH';
}
/**
 * The behavior of a sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignBehavior {

  /**
   * The positive sign
   */
  static POSITIVE = 'POSITIVE';
  /**
   * The negative sign
   */
  static NEGATIVE = 'NEGATIVE';
  /**
   * The random sign
   */
  static RANDOM = 'RANDOM';
  /**
   * A sign providing the following sequence +1, -1, +1, -1, ...
   */
  static ALTERNATE = 'ALTERNATE';
}
/**
 * The path for a Z4Tracer
 *
 * @author gianpiero.diblasi
 */
class Z4TracerPath {

   surplus = 0.0;

   step = 0.0;

   x1 = 0.0;

   y1 = 0.0;

   x2 = 0.0;

   y2 = 0.0;

   x3 = 0.0;

   y3 = 0.0;

   bezierCurve = null;

   bezierCurveLength = 0.0;

   length = 0.0;

   position = 0.0;

  /**
   * Creates a Z4TracerPath from a line
   *
   * @param x1 The x-axis coordinate of the start point
   * @param y1 The y-axis coordinate of the start point
   * @param x2 The x-axis coordinate of the end point
   * @param y2 The y-axis coordinate of the end point
   * @param surplus The surplus from a previous path
   * @param step The step
   * @return The Z4TracerPath
   */
  static  fromLine(x1, y1, x2, y2, surplus, step) {
    let path = new Z4TracerPath();
    path.x1 = x1;
    path.y1 = y1;
    path.x2 = x2;
    path.y2 = y2;
    return path.init(surplus, step);
  }

  /**
   * Creates a Z4TracerPath from a quadric Bezier curve followed by a line
   *
   * @param x1 The x-axis coordinate of the start point of the curve
   * @param y1 The y-axis coordinate of the start point of the curve
   * @param ctrlx The x-axis coordinate of the control point of the curve
   * @param ctrly The y-axis coordinate of the control point of the curve
   * @param x2 The x-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param y2 The y-axis coordinate of the end point of the curve (the start
   * point of the line)
   * @param x3 The x-axis coordinate of the end point of the line
   * @param y3 The y-axis coordinate of the end point of the line
   * @param surplus The surplus from a previous path
   * @param step The step
   * @return The Z4TracerPath
   */
  static  fromQuadAndLine(x1, y1, ctrlx, ctrly, x2, y2, x3, y3, surplus, step) {
    let path = new Z4TracerPath();
    path.bezierCurve = new Bezier(x1, y1, ctrlx, ctrly, x2, y2);
    path.bezierCurveLength = path.bezierCurve.length();
    path.x2 = x2;
    path.y2 = y2;
    path.x3 = x3;
    path.y3 = y3;
    return path.init(surplus, step);
  }

   init(surplus, step) {
    this.surplus = surplus;
    this.step = step;
    this.length = this.bezierCurve ? this.bezierCurveLength + Z4Math.distance(this.x2, this.y2, this.x3, this.y3) : Z4Math.distance(this.x1, this.y1, this.x2, this.y2);
    this.position = surplus;
    return this;
  }

  /**
   * Checks if this path has more points
   *
   * @return true if this path has more points, false otherwise
   */
   hasNext() {
    return this.length > this.position;
  }

  /**
   * Returns the next tangent vector
   *
   * @return The next tangent vector, null if the path has no more points
   */
   next() {
    if (!this.hasNext()) {
      return null;
    } else if (!this.bezierCurve) {
      let t = this.position / this.length;
      let x = (this.x2 - this.x1) * t + this.x1;
      let y = (this.y2 - this.y1) * t + this.y1;
      this.position += this.step;
      return Z4Vector.fromVector(x, y, 1, Z4Math.atan(this.x1, this.y1, this.x2, this.y2));
    } else if (this.position < this.bezierCurveLength) {
      let t = this.position / this.bezierCurveLength;
      let point = this.bezierCurve.get(t);
      let derivative = this.bezierCurve.derivative(t);
      this.position += this.step;
      return Z4Vector.fromPoints(point.x, point.y, point.x + derivative.x, point.y + derivative.y);
    } else {
      let t = (this.position - this.bezierCurveLength) / (this.length - this.bezierCurveLength);
      let x = (this.x3 - this.x2) * t + this.x2;
      let y = (this.y3 - this.y2) * t + this.y2;
      this.position += this.step;
      return Z4Vector.fromVector(x, y, 1, Z4Math.atan(this.x2, this.y2, this.x3, this.y3));
    }
  }

  /**
   * Returns the tangent vector in a position
   *
   * @param position The position (in the range [0,1])
   * @return The tangent vector
   */
  // public Z4Vector getTangentAt(double position) {
  // let tangent = this._gPath.tangentAt(position);
  // return Z4Vector.fromPoints(tangent.start.x, tangent.start.y, tangent.end.x, tangent.end.y);
  // return null;
  // }
  /**
   * Restarts the path
   *
   * @return This Z4TracerPath
   */
   restart() {
    this.position = this.surplus;
    return this;
  }

  /**
   * Returns the path length
   *
   * @return The path length
   */
   getLength() {
    return this.length;
  }

  /**
   * Returns the new surplus for the next path
   *
   * @return The new surplus for the next path
   */
   getNewSurplus() {
    return this.position - this.length;
  }

  /**
   * Returns the number of available points in the path
   *
   * @return The number of available points in the path
   */
   getPointCount() {
    return parseInt((this.length - this.surplus) / this.step);
  }
}
/**
 * The vector
 *
 * @author gianpiero.diblasi
 */
class Z4Vector {

   x0 = 0.0;

   y0 = 0.0;

   x = 0.0;

   y = 0.0;

   module = 0.0;

   phase = 0.0;

  constructor(x0, y0, x, y, module, phase) {
    this.x0 = x0;
    this.y0 = y0;
    this.x = x;
    this.y = y;
    this.module = module;
    this.phase = phase;
  }

  /**
   * Creates a Z4Vector from points
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x The x-axis coordinate of the end point
   * @param y The y-axis coordinate of the end point
   * @return The Z4Vector
   */
  static  fromPoints(x0, y0, x, y) {
    return new Z4Vector(x0, y0, x, y, Z4Math.distance(x0, y0, x, y), Z4Math.atan(x0, y0, x, y));
  }

  /**
   * Creates a Z4Vector from a vector
   *
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param module The module
   * @param phase The phase (in radians)
   * @return The Z4Vector
   */
  static  fromVector(x0, y0, module, phase) {
    return new Z4Vector(x0, y0, x0 + module * Math.cos(phase), y0 + module * Math.sin(phase), module, phase);
  }

  /**
   * Returns the direction in which this vector rotates on another Z4Vector
   *
   * @param vector The other vector
   * @return The direction in which this vector rotates on another Z4Vector
   */
   direction(vector) {
    let x1 = this.x - this.x0;
    let y1 = this.y - this.y0;
    let x2 = vector.x - vector.x0;
    let y2 = vector.y - vector.y0;
    return Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2) >= 0 ? Z4SignBehavior.POSITIVE : Z4SignBehavior.NEGATIVE;
  }
}
/**
 * The behavior of a whirlpool
 *
 * @author gianpiero.diblasi
 */
class Z4WhirlpoolBehavior {

  /**
   * A Z4Whirlpool without whirlpool
   */
  static NONE = 'NONE';
  /**
   * A Z4Whirlpool with forward whirlpool
   */
  static FORWARD = 'FORWARD';
  /**
   * A Z4Whirlpool with backward whirlpool
   */
  static BACKWARD = 'BACKWARD';
}
/**
 * The type of Z4CenteredFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4CenteredFigurePainterType {

  // useAngle1, useAngle2, useTension
  // true,      false,     false
  static TYPE_0 = 'TYPE_0';
  // true,      false,     false
  static TYPE_1 = 'TYPE_1';
  // true,      false,     false
  static TYPE_2 = 'TYPE_2';
  // true,      true,      true
  static TYPE_3 = 'TYPE_3';
  // true,      false,     true
  static TYPE_4 = 'TYPE_4';
  // false,     true,      true
  static TYPE_5 = 'TYPE_5';
}
/**
 * The type of Z4DropPainter
 *
 * @author gianpiero.diblasi
 */
class Z4DropPainterType {

  /**
   * The drop has to use a thousand points effect
   */
  static THOUSAND_POINTS = 'THOUSAND_POINTS';
  /**
   * The drop has to use a thousand lines effect
   */
  static THOUSAND_LINES = 'THOUSAND_LINES';
  /**
   * The drop has to use a thousand areas effect
   */
  static THOUSAND_AREAS = 'THOUSAND_AREAS';
}
/**
 * The control point closure of Z4NaturalFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainterControlPointClosure {

  static CONTROL_POINT_CLOSURE_0 = 'CONTROL_POINT_CLOSURE_0';
  static CONTROL_POINT_CLOSURE_1 = 'CONTROL_POINT_CLOSURE_1';
  static CONTROL_POINT_CLOSURE_2 = 'CONTROL_POINT_CLOSURE_2';
}
/**
 * The type of Z4NaturalFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainterType {

  static TYPE_0 = 'TYPE_0';
  static TYPE_1 = 'TYPE_1';
  static TYPE_2 = 'TYPE_2';
  static TYPE_3 = 'TYPE_3';
}
/**
 * The painter type
 *
 * @author gianpiero.diblasi
 */
class Z4PainterType {

  static ARROW = 'ARROW';
  static SHAPE_2D = 'SHAPE_2D';
  static DROP = 'DROP';
  static BRUSH = 'BRUSH';
  static PATTERN = 'PATTERN';
  static CENTERED_FIGURE = 'CENTERED_FIGURE';
  static NATURAL_FIGURE = 'NATURAL_FIGURE';
}
/**
 * The canvas
 *
 * @author gianpiero.diblasi
 */
class Z4Canvas extends JSComponent {

   canvas = document.createElement("canvas");

   ctx = this.canvas.getContext("2d");

   canvasGrid = document.createElement("canvas");

   ctxGrid = this.canvasGrid.getContext("2d");

   pathGrid = null;

   centerGrid = null;

   plotWidthGrid = 0;

   dottedGrid = false;

   magneticGrid = false;

   colorGrid = null;

   canvasBounds = document.createElement("canvas");

   ctxBounds = this.canvasBounds.getContext("2d");

   showLayerBounds = false;

   canvasOverlay = document.createElement("canvas");

   ctxOverlay = this.canvasOverlay.getContext("2d");

   canvasOverlayModes = new Array();

   ribbonProjectPanel = null;

   ribbonLayerPanel = null;

   ribbonDrawingToolPanel = null;

   ribbonHistoryPanel = null;

   statusPanel = null;

   projectName = null;

   handle = null;

   width = 0;

   height = 0;

   zoom = 1;

   zooming = false;

   saved = true;

   changed = false;

   isOpenFromHistory = false;

   paper = new Z4Paper();

   selectedLayer = null;

   drawingTools = new Array();

   selectedDrawingTool = null;

   drawingDirection = Z4DrawingDirection.FREE;

   mouseManager = new Z4CanvasMouseManager(this, this.ctx);

   ioManager = new Z4CanvasIOManager(this, this.paper, this.drawingTools);

   historyManager = new Z4CanvasHistoryManager(this, this.paper);

  /**
   * Creates the object
   */
  constructor() {
    super(document.createElement("div"));
    this.cssAddClass("z4canvas");
    this.appendNodeChild(this.canvas);
    this.appendNodeChild(this.canvasGrid);
    this.appendNodeChild(this.canvasBounds);
    this.appendNodeChild(this.canvasOverlay);
    this.canvas.classList.add("main-canvas");
    this.canvas.addEventListener("mouseenter", event => this.mouseManager.onMouse(event, "enter"));
    this.canvas.addEventListener("mouseleave", event => this.mouseManager.onMouse(event, "leave"));
    this.canvas.addEventListener("mousedown", event => this.mouseManager.onMouse(event, "down"));
    this.canvas.addEventListener("mousemove", event => this.mouseManager.onMouse(event, "move"));
    this.canvas.addEventListener("mouseup", event => this.mouseManager.onMouse(event, "up"));
    this.canvasOverlay.addEventListener("mousemove", event => this.mouseManager.onMouse(event, "move"));
    this.canvasOverlay.addEventListener("mouseup", event => this.mouseManager.onMouse(event, "up"));
    this.addEventListener("wheel", event => {
      let evt = event;
      if (!evt.ctrlKey) {
      } else if (evt.deltaY < 0) {
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.find(level => level > this.zoom, null));
      } else if (evt.ctrlKey && evt.deltaY > 0) {
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.filter(level => level < this.zoom).pop());
      }
    });
    this.addEventListener("keydown", event => {
      let evt = event;
      if (!evt.ctrlKey) {
      } else if (evt.key === "+") {
        evt.stopPropagation();
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.find(level => level > this.zoom, null));
      } else if (evt.key === "-") {
        evt.stopPropagation();
        this.zoomInOut(() => Z4Constants.ZOOM_LEVEL.filter(level => level < this.zoom).pop());
      }
    });
  }

  /**
   * Sets the ribbon panels
   *
   * @param ribbonProjectPanel The ribbon project panel
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonPanels(ribbonProjectPanel, ribbonLayerPanel, ribbonDrawingToolPanel, ribbonHistoryPanel) {
    this.ribbonProjectPanel = ribbonProjectPanel;
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;
    this.ribbonProjectPanel.setCanvas(this);
    this.ribbonLayerPanel.setCanvas(this);
    this.ribbonDrawingToolPanel.setCanvas(this);
    this.ribbonHistoryPanel.setCanvas(this);
    this.mouseManager.setRibbonHistoryPanel(ribbonHistoryPanel);
    this.ioManager.setRibbonPanels(ribbonLayerPanel, ribbonDrawingToolPanel, ribbonHistoryPanel);
    this.historyManager.setRibbonLayerPanel(ribbonLayerPanel);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
    this.statusPanel.setCanvas(this);
    this.mouseManager.setStatusPanel(statusPanel);
    this.ioManager.setStatusPanel(statusPanel);
  }

  /**
   * Creates a new project
   *
   * @param width The image width
   * @param height The image height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   create(width, height, filling) {
    this.paper.reset();
    this.paper.addLayer(Z4Translations.BACKGROUND_LAYER, width, height, filling, width, height);
    this.setSize(width, height);
    this.ribbonLayerPanel.reset();
    this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), null, true);
    this.drawingTools.length = 0;
    this.ribbonDrawingToolPanel.reset();
    Color.resetHistory();
    Z4GradientColor.resetHistory();
    Z4BiGradientColor.resetHistory();
    this.ribbonHistoryPanel.resetHistory(() => {
      this.afterCreate("", width, height);
      this.fitZoomIfNeeded();
      this.toHistory(json => this.ribbonHistoryPanel.addHistory(json, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
    });
  }

  /**
   * Creates a new project from an image file
   *
   * @param handle The file handle
   */
   createFromHandle(handle) {
    this.ioManager.createFromHandle(handle);
  }

  /**
   * Creates a new project from an image file
   *
   * @param file The file
   */
   createFromFile(file) {
    this.ioManager.createFromFile(file);
  }

  /**
   * Creates a new project from an image in the clipboard
   */
   createFromClipboard() {
    this.ioManager.createFromClipboard();
  }

  /**
   * The method called after create
   *
   * @param projectName The project name
   * @param width The width
   * @param height The height
   */
   afterCreate(projectName, width, height) {
    this.projectName = projectName;
    this.statusPanel.setProjectName(projectName);
    this.statusPanel.setProjectSize(width, height);
    if (!this.isOpenFromHistory) {
      this.statusPanel.setZoom(1);
      this.statusPanel.setDrawingDirection(Z4DrawingDirection.FREE);
      this.statusPanel.resetCanvasGridPanel(width, height, false);
      this.zoom = 1;
      this.mouseManager.setZoom(this.zoom);
      this.mouseManager.setMagneticGrid(null, 0, false);
      this.setDrawingDirection(Z4DrawingDirection.FREE);
      this.pathGrid = null;
      this.showLayerBounds = false;
      this.setSaved(true);
      this.changed = false;
    }
    this.isOpenFromHistory = false;
    this.canvas.width = width * this.zoom;
    this.canvas.height = height * this.zoom;
    this.canvasGrid.width = width * this.zoom;
    this.canvasGrid.height = height * this.zoom;
    this.canvasBounds.width = width * this.zoom;
    this.canvasBounds.height = height * this.zoom;
    this.canvasOverlay.width = width * this.zoom;
    this.canvasOverlay.height = height * this.zoom;
    this.drawCanvas();
    this.drawCanvasGrid();
    this.drawCanvasBounds();
    this.drawCanvasOverlay();
  }

  /**
   * Opens a project
   *
   * @param handle The file handle
   */
   openProjectFromHandle(handle) {
    this.handle = handle;
    this.ioManager.openProjectFromHandle(handle);
  }

  /**
   * Opens a project
   *
   * @param file The file
   */
   openProjectFromFile(file) {
    this.ioManager.openProjectFromFile(file);
  }

  /**
   * Opens an history
   *
   * @param json The history
   */
   openFromHistory(json) {
    this.isOpenFromHistory = true;
    this.historyManager.openFromHistory(json);
  }

  /**
   * Saves the project
   *
   * @param handle The file handle
   * @param apply The function to call after saving
   */
   saveProjectToHandle(handle, apply) {
    this.handle = handle;
    this.projectName = this.ioManager.saveProjectToHandle(handle, apply);
  }

  /**
   * Saves the project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
   saveProjectToFile(projectName, apply) {
    this.projectName = projectName;
    this.ioManager.saveProjectToFile(projectName, apply);
  }

  /**
   * Saves the history
   *
   * @param policies A comma-separated list of history management policies
   * indicating which criteria should perform saving
   */
   saveHistory(policies) {
    this.ribbonHistoryPanel.saveHistory(policies);
  }

  /**
   * Prepares the project for the history
   *
   * @param apply The function to call after preparation
   */
   toHistory(apply) {
    this.historyManager.toHistory(apply);
  }

  /**
   * Exports this project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
   exportToFile(filename, ext, quality) {
    this.ioManager.exportToFile(filename, ext, quality);
  }

  /**
   * Exports this project to an image file
   *
   * @param handle The file handle
   * @param quality The quality
   */
   exportToHandle(handle, quality) {
    this.ioManager.exportToHandle(handle, quality);
  }

  /**
   * Returns a layer
   *
   * @param index The index layer
   * @return The layer
   */
   getLayerAt(index) {
    return this.paper.getLayerAt(index);
  }

  /**
   * Adds a layer
   *
   * @param width The layer width
   * @param height The layer height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   addLayer(width, height, filling) {
    this.paper.addLayer(this.findLayerName(), width, height, filling, this.width, this.height);
    this.afterAddLayer();
    this.drawCanvas();
  }

  /**
   * Adds a layer from an image file
   *
   * @param handle The file handle
   */
   addLayerFromHandle(handle) {
    this.ioManager.addLayerFromHandle(handle);
  }

  /**
   * Adds a layer from an image file
   *
   * @param file The file
   */
   addLayerFromFile(file) {
    this.ioManager.addLayerFromFile(file);
  }

  /**
   * Adds a layer from an image in the clipboard
   */
   addLayerFromClipboard() {
    this.ioManager.addLayerFromClipboard();
  }

  /**
   * The method called after adding a layer
   */
   afterAddLayer() {
    this.changed = true;
    this.saveHistory("standard,tool");
    this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), null, true);
    this.setSaved(false);
  }

  /**
   * Duplicates a layer
   *
   * @param layer The layer
   */
   duplicateLayer(layer) {
    let offset = layer.getOffset();
    layer.convertToBlob(blob => {
      let image = document.createElement("img");
      image.onload = event => {
        this.paper.addLayerFromImage(this.findLayerName(), image, this.width, this.height);
        this.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.getLayersCount() - 1), duplicate => {
          duplicate.setOpacity(layer.getOpacity());
          duplicate.setCompositeOperation(layer.getCompositeOperation());
          duplicate.setHidden(layer.isHidden());
          duplicate.move(offset.x, offset.y);
        }, true);
        this.changed = true;
        this.saveHistory("standard,tool");
        this.setSaved(false);
        this.drawCanvas();
        return null;
      };
      image.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Deletes a layer
   *
   * @param layer The layer
   * @param fromMerge true if the delete is called from a merge action, false
   * otherwise
   * @return The layer index
   */
   deleteLayer(layer, fromMerge) {
    let index = this.paper.deleteLayer(layer);
    if (!fromMerge) {
      if (this.selectedLayer === layer) {
        let count = this.getLayersCount();
        this.setSelectedLayer(this.paper.getLayerAt(count - 1));
        document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ") .z4layerpreview-selector").textContent = Z4LayerPreview.SELECTED_LAYER_CONTENT;
        (document.querySelector(".z4layerpreview:nth-child(" + (count + (index < count ? 1 : 0)) + ")")).scrollIntoView();
      }
      this.changed = true;
      this.saveHistory("standard,tool");
      this.setSaved(false);
      this.drawCanvas();
    }
    return index;
  }

  /**
   * Moves a layer to a position
   *
   * @param layer The layer
   * @param position The new position
   * @return true if the move has been performed, false otherwise
   */
   moveLayer(layer, position) {
    if (this.paper.moveLayer(layer, position)) {
      this.changed = true;
      this.saveHistory("standard,tool");
      this.setSaved(false);
      this.drawCanvas();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Merges an array of layers
   *
   * @param layers The layers
   */
   mergeLayers(layers) {
    this.ioManager.mergeLayers(layers);
  }

  /**
   * Finds a layer name
   *
   * @return The layer name
   */
   findLayerName() {
    let counter = 0;
    let found = "";
    while (!found) {
      found = Z4Translations.LAYER + "_" + counter;
      for (let index = 0; index < this.getLayersCount(); index++) {
        if (found === this.paper.getLayerAt(index).getName()) {
          found = "";
        }
      }
      counter++;
    }
    return found;
  }

  /**
   * Sets the selected layer
   *
   * @param selectedLayer The selected layer
   */
   setSelectedLayer(selectedLayer) {
    this.setSelectedLayerAndAddLayerPreview(selectedLayer, null, false);
  }

  /**
   * Sets the selected layer and adds the layer preview
   *
   * @param selectedLayer The selected layer
   * @param apply The function to apply before adding the layer preview
   * @param add true to add the layer preview, false otherwise
   */
   setSelectedLayerAndAddLayerPreview(selectedLayer, apply, add) {
    this.selectedLayer = selectedLayer;
    this.mouseManager.setSelectedLayer(this.selectedLayer);
    if (apply) {
      apply(this.selectedLayer);
    }
    if (add) {
      this.ribbonLayerPanel.addLayerPreview(this.selectedLayer);
    }
  }

  /**
   * Returns the layers count
   *
   * @return The layers count
   */
   getLayersCount() {
    return this.paper.getLayersCount();
  }

  /**
   * Sets the visualization of the layer bounds
   *
   * @param showLayerBounds true to show the layer bounds, false otherwise
   */
   setShowLayerBounds(showLayerBounds) {
    this.showLayerBounds = showLayerBounds;
    this.drawCanvasBounds();
  }

  /**
   * Adds a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   addCanvasOverlayMode(canvasOverlayMode) {
    this.addRemoveCanvasOverlayMode(canvasOverlayMode, true);
  }

  /**
   * Removes a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   removeCanvasOverlayMode(canvasOverlayMode) {
    this.addRemoveCanvasOverlayMode(canvasOverlayMode, false);
  }

   addRemoveCanvasOverlayMode(canvasOverlayMode, add) {
    let index = this.canvasOverlayModes.indexOf(canvasOverlayMode);
    if (add && index === -1) {
      this.canvasOverlayModes.push(canvasOverlayMode);
      this.mouseManager.addCanvasOverlayMode(canvasOverlayMode);
    } else if (!add && index !== -1) {
      this.canvasOverlayModes.splice(index, 1);
      this.mouseManager.removeCanvasOverlayMode(canvasOverlayMode);
    }
    this.canvasOverlay.style.pointerEvents = this.canvasOverlayModes.length ? "auto" : "none";
    this.drawCanvasOverlay();
  }

  /**
   * Adds a drawing tool
   *
   * @param drawingTool The drawing tool
   */
   addDrawingTool(drawingTool) {
    this.drawingTools.push(drawingTool);
    this.setSelectedDrawingToolAndAddDrawingToolPreview(drawingTool, true);
    this.setSaved(false);
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param handle The file handle
   */
   addDrawingToolFromHandle(handle) {
    this.ioManager.addDrawingToolFromHandle(handle);
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param file The file
   */
   addDrawingToolFromFile(file) {
    this.ioManager.addDrawingToolFromFile(file);
  }

  /**
   * Replaces a drawing tool
   *
   * @param oldDrawingTool The old drawing tool
   * @param newDrawingTool The new drawing tool
   */
   replaceDrawingTool(oldDrawingTool, newDrawingTool) {
    let index = this.drawingTools.indexOf(oldDrawingTool);
    this.drawingTools[index] = newDrawingTool;
    if (this.selectedDrawingTool === oldDrawingTool) {
      this.setSelectedDrawingTool(newDrawingTool);
    }
    this.setSaved(false);
  }

  /**
   * Deletes a drawing tool
   *
   * @param drawingTool The drawing tool
   * @return The drawing tool index
   */
   deleteDrawingTool(drawingTool) {
    let index = this.drawingTools.indexOf(drawingTool);
    this.drawingTools.splice(index, 1);
    if (this.selectedDrawingTool !== drawingTool) {
    } else if (this.drawingTools.length) {
      this.setSelectedDrawingTool(this.drawingTools[this.drawingTools.length - 1]);
      document.querySelector(".z4drawingtoolpreview:nth-child(" + (this.drawingTools.length + (index < this.drawingTools.length ? 1 : 0)) + ") .z4drawingtoolpreview-selector").textContent = Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT;
      (document.querySelector(".z4drawingtoolpreview:nth-child(" + (this.drawingTools.length + (index < this.drawingTools.length ? 1 : 0)) + ")")).scrollIntoView();
    } else {
      this.setSelectedDrawingTool(null);
    }
    this.setSaved(false);
    return index;
  }

  /**
   * Finds a drawing tool name
   *
   * @return The drawing tool name
   */
   findDrawingToolName() {
    let counter = 0;
    let found = "";
    while (!found) {
      found = Z4Translations.DRAWING_TOOL + " " + counter;
      for (let index = 0; index < this.drawingTools.length; index++) {
        if (found === this.drawingTools[index].getName()) {
          found = "";
        }
      }
      counter++;
    }
    return found;
  }

  /**
   * Sets the selected drawing tool
   *
   * @param selectedDrawingTool The selected drawing tool
   */
   setSelectedDrawingTool(selectedDrawingTool) {
    this.setSelectedDrawingToolAndAddDrawingToolPreview(selectedDrawingTool, false);
  }

  /**
   * Sets the selected drawing tool and adds the drawing tool preview
   *
   * @param selectedDrawingTool The selected drawing tool
   * @param add true to add the drawing tool preview, false otherwise
   */
   setSelectedDrawingToolAndAddDrawingToolPreview(selectedDrawingTool, add) {
    this.selectedDrawingTool = selectedDrawingTool;
    this.mouseManager.setSelectedDrawingTool(selectedDrawingTool);
    this.saveHistory("tool");
    if (add) {
      this.ribbonDrawingToolPanel.addDrawingToolPreview(this.selectedDrawingTool);
    }
  }

  /**
   * Saves a drawing tool
   *
   * @param fileName The file name
   * @param drawingTool the drawing tool
   */
   saveDrawingToolToFile(fileName, drawingTool) {
    this.ioManager.saveDrawingToolToFile(fileName, drawingTool);
  }

  /**
   * Saves a drawing tool
   *
   * @param handle The file handle
   * @param drawingTool The drawing tool
   */
   saveDrawingToolToHandle(handle, drawingTool) {
    this.ioManager.saveDrawingToolToHandle(handle, drawingTool);
  }

  /**
   * Saves the drawing tools
   *
   * @param fileName The file name
   */
   saveDrawingToolsToFile(fileName) {
    this.ioManager.saveDrawingToolsToFile(fileName);
  }

  /**
   * Saves the drawing tools
   *
   * @param handle The file handle
   */
   saveDrawingToolsToHandle(handle) {
    this.ioManager.saveDrawingToolsToHandle(handle);
  }

  /**
   * Returns the project name
   *
   * @return The project name
   */
   getProjectName() {
    return this.projectName;
  }

  /**
   * Returns the file handle of this project
   *
   * @return The file handle of this project
   */
   getHandle() {
    return this.handle;
  }

  /**
   * Sets the size
   *
   * @param width The width
   * @param height The height
   */
   setSize(width, height) {
    this.width = width;
    this.height = height;
    this.mouseManager.setSize(this.getSize());
    this.ioManager.setSize(this.getSize());
    this.historyManager.setSize(this.getSize());
  }

  /**
   * Returns the size
   *
   * @return The size
   */
   getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Checks if this canvas is saved
   *
   * @return true if this canvas is saved, false otherwise
   */
   isSaved() {
    return this.saved;
  }

  /**
   * Sets the saved status of the canvas
   *
   * @param saved true to set the canvas as saved, false otherwise
   */
   setSaved(saved) {
    this.saved = saved;
    this.ribbonProjectPanel.setSaveEnabled(!this.saved);
  }

  /**
   * Checks if this canvas is changed
   *
   * @return true if this canvas is changed, false otherwise
   */
   isChanged() {
    return this.changed;
  }

  /**
   * Sets the changed status of the canvas
   *
   * @param changed true to set the canvas as changed, false otherwise
   */
   setChanged(changed) {
    this.changed = changed;
  }

  /**
   * Returns a pixel color
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
   getColorAt(x, y) {
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      let data = this.ctx.getImageData(x * this.zoom, y * this.zoom, 1, 1).data;
      return new Color(parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
    } else {
      return null;
    }
  }

  /**
   * Returns a pixel color in the selected layer
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
   getSelectedLayerColorAt(x, y) {
    return this.selectedLayer.getColorAt(x, y);
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom = zoom;
    this.mouseManager.setZoom(this.zoom);
    this.canvas.width = this.width * zoom;
    this.canvas.height = this.height * zoom;
    this.canvasGrid.width = this.width * zoom;
    this.canvasGrid.height = this.height * zoom;
    this.canvasBounds.width = this.width * zoom;
    this.canvasBounds.height = this.height * zoom;
    this.canvasOverlay.width = this.width * zoom;
    this.canvasOverlay.height = this.height * zoom;
    this.pathGrid = this.pathGrid ? this.createGrid() : null;
    this.drawCanvas();
    this.drawCanvasGrid();
    this.drawCanvasBounds();
    this.drawCanvasOverlay();
  }

  /**
   * Sets the zoom to fit the available space
   */
   fitZoom() {
    this.setZoom(Math.min((this.canvas.parentElement.clientWidth - 20) / this.width, (this.canvas.parentElement.clientHeight - 20) / this.height));
  }

  /**
   * Sets the zoom to fit the available space if needed, that is if the image is
   * bigger than the available space
   */
   fitZoomIfNeeded() {
    if ((this.canvas.parentElement.clientWidth - 20) < this.width || (this.canvas.parentElement.clientHeight - 20) < this.height) {
      this.fitZoom();
      this.statusPanel.setZoom(this.zoom);
    }
  }

   zoomInOut(apply) {
    if (this.zooming) {
    } else {
      this.zooming = true;
      let newZoom = apply();
      if (newZoom) {
        this.setZoom(newZoom);
        this.statusPanel.setZoom(this.zoom);
      }
      this.zooming = false;
    }
  }

  /**
   * Returns the drawing direction
   *
   * @return The drawing direction
   */
   getDrawingDirection() {
    return this.drawingDirection;
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
   setDrawingDirection(drawingDirection) {
    this.drawingDirection = drawingDirection;
    this.mouseManager.setDrawingDirection(drawingDirection);
  }

  /**
   * Sets the grid
   *
   * @param visible true if the grid is visible, false otherwise
   * @param center The grid center
   * @param plotWidth The grid plot width
   * @param dottedGrid true for the dotted grid, false otherwise
   * @param magnetic true for a magnetic grid, false otherwise
   * @param color The grid color
   */
   setGrid(visible, center, plotWidth, dottedGrid, magnetic, color) {
    this.centerGrid = center;
    this.plotWidthGrid = plotWidth;
    this.dottedGrid = dottedGrid;
    this.magneticGrid = magnetic;
    this.colorGrid = color;
    this.pathGrid = visible ? this.createGrid() : null;
    this.mouseManager.setMagneticGrid(center, plotWidth, visible && magnetic);
    this.drawCanvasGrid();
  }

   createGrid() {
    let grid = new Path2D();
    if (this.dottedGrid) {
      for (let x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createDottedGrid(grid, x);
      }
      for (let x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createDottedGrid(grid, x);
      }
    } else {
      for (let x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createLineGrid(grid, x, 0, x, this.height);
      }
      for (let x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createLineGrid(grid, x, 0, x, this.height);
      }
      for (let y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
        this.createLineGrid(grid, 0, y, this.width, y);
      }
      for (let y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
        this.createLineGrid(grid, 0, y, this.width, y);
      }
    }
    if (this.magneticGrid) {
      let magneticRadius = parseInt(this.plotWidthGrid * Z4Constants.MAGNETISM_PERCENTAGE);
      for (let x = this.centerGrid.x; x > 0; x -= this.plotWidthGrid) {
        this.createMagneticGrid(grid, x, magneticRadius);
      }
      for (let x = this.centerGrid.x; x < this.width; x += this.plotWidthGrid) {
        this.createMagneticGrid(grid, x, magneticRadius);
      }
    }
    return grid;
  }

   createDottedGrid(grid, x) {
    for (let y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
      grid.moveTo(x + 2 / this.zoom, y);
      grid.arc(x, y, 2 / this.zoom, 0, Z4Math.TWO_PI);
    }
    for (let y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
      grid.moveTo(x + 2 / this.zoom, y);
      grid.arc(x, y, 2 / this.zoom, 0, Z4Math.TWO_PI);
    }
  }

   createLineGrid(grid, x0, y0, x1, y1) {
    grid.moveTo(x0, y0);
    grid.lineTo(x1, y1);
  }

   createMagneticGrid(grid, x, magneticRadius) {
    for (let y = this.centerGrid.y; y > 0; y -= this.plotWidthGrid) {
      grid.moveTo(x + magneticRadius, y);
      grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
    }
    for (let y = this.centerGrid.y; y < this.height; y += this.plotWidthGrid) {
      grid.moveTo(x + magneticRadius, y);
      grid.arc(x, y, magneticRadius, 0, Z4Math.TWO_PI);
    }
  }

  /**
   * Rotates the canvas in clockwise
   */
   rotatePlus90() {
    this.resize(this.height, this.width);
  }

  /**
   * Resizes the canvas
   *
   * @param width The width
   * @param height The height
   */
   resize(width, height) {
    this.setSize(width, height);
    this.statusPanel.setProjectSize(this.width, this.height);
    this.statusPanel.resetCanvasGridPanel(this.width, this.height, true);
    this.canvas.width = this.width * this.zoom;
    this.canvas.height = this.height * this.zoom;
    this.canvasGrid.width = this.width * this.zoom;
    this.canvasGrid.height = this.height * this.zoom;
    this.canvasBounds.width = this.width * this.zoom;
    this.canvasBounds.height = this.height * this.zoom;
    this.canvasOverlay.width = this.width * this.zoom;
    this.canvasOverlay.height = this.height * this.zoom;
    this.drawCanvas();
    this.drawCanvasGrid();
    this.drawCanvasBounds();
    this.drawCanvasOverlay();
  }

  /**
   * Draws this canvas
   */
   drawCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);
    this.paper.draw(this.ctx, false);
    this.ctx.restore();
  }

   drawCanvasGrid() {
    this.ctxGrid.clearRect(0, 0, this.canvasGrid.width, this.canvasGrid.height);
    if (this.pathGrid) {
      this.ctxGrid.save();
      this.ctxGrid.scale(this.zoom, this.zoom);
      this.ctxGrid.strokeStyle = Z4Constants.getStyle(this.colorGrid.getRGBA_HEX());
      this.ctxGrid.lineWidth = 1 / this.zoom;
      this.ctxGrid.stroke(this.pathGrid);
      this.ctxGrid.beginPath();
      this.ctxGrid.arc(this.centerGrid.x, this.centerGrid.y, 4 / this.zoom, 0, Z4Math.TWO_PI);
      this.ctxGrid.fillStyle = Z4Constants.getStyle(this.colorGrid.getRGBA_HEX());
      this.ctxGrid.fill();
      this.ctxGrid.restore();
    }
  }

  /**
   * Draws the canvas (and layer) bounds
   */
   drawCanvasBounds() {
    this.ctxBounds.clearRect(0, 0, this.canvasBounds.width, this.canvasBounds.height);
    let show = false;
    let bounds = new Path2D();
    for (let index = 0; index < this.getLayersCount(); index++) {
      let layer = this.paper.getLayerAt(index);
      if (this.showLayerBounds || layer.isShowBounds()) {
        show = true;
        bounds.rect(layer.getOffset().x, layer.getOffset().y, layer.getSize().width, layer.getSize().height);
      }
    }
    if (show) {
      this.ctxBounds.save();
      this.ctxBounds.scale(this.zoom, this.zoom);
      this.ctxBounds.lineWidth = 3 / this.zoom;
      let dash = new Array();
      this.ctxBounds.strokeStyle = Z4Constants.getStyle("black");
      this.ctxBounds.setLineDash(dash);
      this.ctxBounds.stroke(bounds);
      dash.push(2 * this.ctxBounds.lineWidth, 2 * this.ctxBounds.lineWidth);
      this.ctxBounds.strokeStyle = Z4Constants.getStyle("white");
      this.ctxBounds.setLineDash(dash);
      this.ctxBounds.stroke(bounds);
      this.ctxBounds.restore();
    }
  }

  /**
   * Draws the canvas overlay
   */
   drawCanvasOverlay() {
    this.ctxOverlay.clearRect(0, 0, this.canvasOverlay.width, this.canvasOverlay.height);
    if (this.canvasOverlayModes.indexOf(Z4CanvasOverlayMode.PICK_COLOR) !== -1) {
    }
  }
}
/**
 * The history manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasHistoryManager {

   canvas = null;

   paper = null;

   size = null;

   ribbonLayerPanel = null;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   */
  constructor(canvas, paper) {
    this.canvas = canvas;
    this.paper = paper;
  }

  /**
   * Sets the ribbon panels
   *
   * @param size The size
   */
   setSize(size) {
    this.size = size;
  }

  /**
   * Sets the ribbon layer panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   */
   setRibbonLayerPanel(ribbonLayerPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
  }

  /**
   * Opens a canvas project from history
   *
   * @param json The history
   */
   openFromHistory(json) {
    this.paper.reset();
    this.ribbonLayerPanel.reset();
    this.canvas.setSize(json["width"], json["height"]);
    this.openLayerFromHistory(json, json["layers"], 0);
  }

   openLayerFromHistory(json, layers, index) {
    let image = document.createElement("img");
    image.onload = event => {
      this.paper.addLayerFromImage(layers[index]["name"], image, image.width, image.height);
      this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(index), layer => {
        layer.setOpacity(layers[index]["opacity"]);
        layer.setCompositeOperation(layers[index]["compositeOperation"]);
        layer.setHidden(layers[index]["hidden"]);
        layer.move(layers[index]["offsetX"], layers[index]["offsetY"]);
      }, true);
      if (index + 1 < layers.length) {
        this.openLayerFromHistory(json, layers, index + 1);
      } else {
        this.canvas.afterCreate(json["projectName"], json["width"], json["height"]);
        this.canvas.setSaved(false);
      }
      return null;
    };
    image.src = URL.createObjectURL(layers[index]["data"]);
  }

  /**
   * Prepares the canvas project for the history
   *
   * @param apply The function to call after preparation
   */
   toHistory(apply) {
    this.layerToJSON(null, new Array(), 0, apply);
  }

   layerToJSON(zip, layers, index, apply) {
    let layer = this.paper.getLayerAt(index);
    layer.convertToBlob(blob => {
      if (zip) {
        zip.file("layers/layer" + index + ".png", blob, null);
      }
      let offset = layer.getOffset();
      let layerJSON = new Object();
      if (!zip) {
        layerJSON["data"] = blob;
      }
      layerJSON["name"] = layer.getName();
      layerJSON["opacity"] = layer.getOpacity();
      layerJSON["compositeOperation"] = layer.getCompositeOperation();
      layerJSON["hidden"] = layer.isHidden();
      layerJSON["offsetX"] = offset.x;
      layerJSON["offsetY"] = offset.y;
      layers[index] = layerJSON;
      if (index + 1 === this.canvas.getLayersCount()) {
        let JSON = new Object();
        JSON["projectName"] = this.canvas.getProjectName();
        JSON["width"] = this.size.width;
        JSON["height"] = this.size.height;
        JSON["layers"] = layers;
        apply(JSON);
      } else {
        this.layerToJSON(zip, layers, index + 1, apply);
      }
    });
  }
}
/**
 * The I/O manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasIOManager {

   canvas = null;

   paper = null;

   drawingTools = null;

   size = null;

   ribbonLayerPanel = null;

   ribbonDrawingToolPanel = null;

   ribbonHistoryPanel = null;

   statusPanel = null;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param paper The paper
   * @param drawingTools The drawing tools
   */
  constructor(canvas, paper, drawingTools) {
    this.canvas = canvas;
    this.paper = paper;
    this.drawingTools = drawingTools;
  }

  /**
   * Sets the ribbon panels
   *
   * @param size The size
   */
   setSize(size) {
    this.size = size;
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonPanels(ribbonLayerPanel, ribbonDrawingToolPanel, ribbonHistoryPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Creates a new canvas project from an image file
   *
   * @param handle The file handle
   */
   createFromHandle(handle) {
    handle.getFile().then(file => {
      this.createFromFile(file);
    });
  }

  /**
   * Creates a new canvas project from an image file
   *
   * @param file The file
   */
   createFromFile(file) {
    Z4UI.pleaseWait(this.canvas, true, true, true, false, "", () => {
      let fileReader = new FileReader();
      fileReader.onload = event => this.createFromURL(file.name.substring(0, file.name.lastIndexOf('.')), fileReader.result, Z4Translations.FROM_FILE);
      fileReader.onerror = event => {
        Z4UI.pleaseWaitCompleted();
        JSOptionPane.showMessageDialog(Z4Translations.IMAGE_OPEN_ERROR_MESSAGE, Z4Translations.FROM_FILE, JSOptionPane.ERROR_MESSAGE, null);
        return null;
      };
      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Creates a new canvas project from an image in the clipboard
   */
   createFromClipboard() {
    Z4UI.pleaseWait(this.canvas, true, true, true, false, "", () => navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        if (imageType) {
          item.getType(imageType).then(blob => {
            this.createFromURL("", URL.createObjectURL(blob), Z4Translations.FROM_CLIPBOARD);
          });
        } else {
          Z4UI.pleaseWaitCompleted();
          JSOptionPane.showMessageDialog(Z4Translations.IMAGE_OPEN_ERROR_MESSAGE, Z4Translations.FROM_CLIPBOARD, JSOptionPane.ERROR_MESSAGE, null);
        }
      });
    }));
  }

   createFromURL(projectName, url, errorTitle) {
    let image = document.createElement("img");
    image.onload = event => {
      Z4UI.pleaseWaitCompleted();
      if (image.width <= Z4Constants.MAX_IMAGE_SIZE && image.height <= Z4Constants.MAX_IMAGE_SIZE) {
        this.paper.reset();
        this.paper.addLayerFromImage(Z4Translations.BACKGROUND_LAYER, image, image.width, image.height);
        this.canvas.setSize(image.width, image.height);
        this.ribbonLayerPanel.reset();
        this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(this.canvas.getLayersCount() - 1), null, true);
        this.drawingTools.length = 0;
        this.ribbonDrawingToolPanel.reset();
        Color.resetHistory();
        Z4GradientColor.resetHistory();
        Z4BiGradientColor.resetHistory();
        this.ribbonHistoryPanel.resetHistory(() => {
          this.canvas.afterCreate(projectName, image.width, image.height);
          this.canvas.fitZoomIfNeeded();
          this.canvas.toHistory(json => this.ribbonHistoryPanel.addHistory(json, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
        });
      } else {
        JSOptionPane.showMessageDialog(Z4Translations.IMAGE_TOO_BIG_MESSAGE.replace("$image_size$", image.width + " x " + image.height).replace("$max_image_size$", Z4Constants.MAX_IMAGE_SIZE + " x " + Z4Constants.MAX_IMAGE_SIZE), errorTitle, JSOptionPane.ERROR_MESSAGE, null);
      }
      return null;
    };
    image.onerror = event => {
      Z4UI.pleaseWaitCompleted();
      JSOptionPane.showMessageDialog(Z4Translations.IMAGE_OPEN_ERROR_MESSAGE, errorTitle, JSOptionPane.ERROR_MESSAGE, null);
      return null;
    };
    image.src = url;
    return null;
  }

  /**
   * Opens a canvas project
   *
   * @param handle The file handle
   */
   openProjectFromHandle(handle) {
    handle.getFile().then(file => {
      this.openProjectFromFile(file);
    });
  }

  /**
   * Opens a canvas project
   *
   * @param file The file
   */
   openProjectFromFile(file) {
    let onError = error => {
      Z4UI.pleaseWaitCompleted();
      JSOptionPane.showMessageDialog(Z4Translations.IMAGE_OPEN_ERROR_MESSAGE, Z4Translations.OPEN_PROJECT, JSOptionPane.ERROR_MESSAGE, null);
    };
    Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () => {
      let promise = new JSZip().loadAsync(file).then(zip => {
        let promise2 = zip.file("manifest.json").async("string", null).then(str => {
          this.paper.reset();
          this.ribbonLayerPanel.reset();
          this.drawingTools.length = 0;
          this.ribbonDrawingToolPanel.reset();
          Color.resetHistory();
          Z4GradientColor.resetHistory();
          Z4BiGradientColor.resetHistory();
          this.ribbonHistoryPanel.resetHistory(() => {
            let json = JSON.parse("" + str);
            this.canvas.setSize(json["width"], json["height"]);
            this.openLayer(zip, json, json["layers"], 0);
          });
        });
        eval("promise2.catch(onError);");
      });
      eval("promise.catch(onError);");
    });
  }

   openLayer(zip, json, layers, index) {
    zip.file("layers/layer" + index + ".png").async("blob", metadata => Z4UI.setPleaseWaitProgressBarValue(metadata["percent"])).then(blob => {
      let image = document.createElement("img");
      image.onload = event => {
        this.paper.addLayerFromImage(layers[index]["name"], image, image.width, image.height);
        this.canvas.setSelectedLayerAndAddLayerPreview(this.paper.getLayerAt(index), selectedLayer => {
          selectedLayer.setOpacity(layers[index]["opacity"]);
          selectedLayer.setCompositeOperation(layers[index]["compositeOperation"]);
          selectedLayer.setHidden(layers[index]["hidden"]);
          selectedLayer.move(layers[index]["offsetX"], layers[index]["offsetY"]);
        }, true);
        if (index + 1 < layers.length) {
          this.openLayer(zip, json, layers, index + 1);
        } else if (json["history"]) {
          this.jsonToHistory(zip, json, 0, json["currentKeyHistory"], 0);
        } else {
          this.jsonToArrays(zip, () => {
            this.canvas.afterCreate(json["projectName"], json["width"], json["height"]);
            this.canvas.fitZoomIfNeeded();
            this.canvas.toHistory(json2 => this.ribbonHistoryPanel.addHistory(json2, key => this.ribbonHistoryPanel.setCurrentKey(key), false));
            Z4UI.pleaseWaitCompleted();
          });
        }
        return null;
      };
      image.src = URL.createObjectURL(blob);
    });
  }

   jsonToHistory(zip, json, index, previousCurrentKey, newCurrentKey) {
    let history = json["history"];
    let key = history[index];
    let folder = "history/history_" + key + "/";
    zip.file(folder + "manifest.json").async("string", null).then(str => {
      let layerJSON = JSON.parse("" + str);
      this.layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, 0, key);
    });
  }

   layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, layerIndex, historyKey) {
    zip.file(folder + "layers/layer" + layerIndex + ".png").async("blob", metadata => Z4UI.setPleaseWaitProgressBarValue(metadata["percent"])).then(blob => {
      let layers = layerJSON["layers"];
      let layer = layers[layerIndex];
      layer["data"] = blob;
      if (layerIndex + 1 < layers.length) {
        this.layerToHistory(zip, json, index, previousCurrentKey, newCurrentKey, folder, layerJSON, layerIndex + 1, historyKey);
      } else if (index + 1 < (json["history"]).length) {
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey => this.jsonToHistory(zip, json, index + 1, previousCurrentKey, previousCurrentKey === historyKey ? currentKey : newCurrentKey), true);
      } else {
        this.ribbonHistoryPanel.addHistory(layerJSON, currentKey => this.jsonToArrays(zip, () => {
          this.ribbonHistoryPanel.setCurrentKey(previousCurrentKey === historyKey ? currentKey : newCurrentKey);
          this.canvas.afterCreate(json["projectName"], json["width"], json["height"]);
          this.canvas.fitZoomIfNeeded();
          Z4UI.pleaseWaitCompleted();
        }), true);
      }
    });
  }

   jsonToArrays(zip, apply) {
    this.jsonToArray(zip, "drawingTools", false, drawingTool => this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)), () => this.jsonToArray(zip, "colors", true, color => Color.pushHistory(Color.fromJSON(color)), () => this.jsonToArray(zip, "gradientcolors", true, color => Z4GradientColor.pushHistory(Z4GradientColor.fromJSON(color)), () => this.jsonToArray(zip, "bigradientcolors", true, color => Z4BiGradientColor.pushHistory(Z4BiGradientColor.fromJSON(color)), apply))));
  }

   jsonToArray(zip, name, reverse, applyObj, apply) {
    let zipObject = zip.file(name + ".json");
    if (zipObject) {
      zipObject.async("string", null).then(str => {
        let array = (JSON.parse(str))[name];
        if (reverse) {
          array.reverse().forEach(obj => applyObj(obj));
        } else {
          array.forEach(obj => applyObj(obj));
        }
        apply();
      });
    } else {
      apply();
    }
  }

  /**
   * Saves a canvas project
   *
   * @param handle The file handle
   * @param apply The function to call after saving
   * @return The project name
   */
   saveProjectToHandle(handle, apply) {
    let projectName = handle.name.substring(0, handle.name.lastIndexOf('.'));
    this.saveProject(projectName, (zipped, name) => handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
      writable.write(zipped);
      writable.close();
    }), apply);
    return projectName;
  }

  /**
   * Saves a canvas project
   *
   * @param projectName The project name
   * @param apply The function to call after saving
   */
   saveProjectToFile(projectName, apply) {
    this.saveProject(projectName, (zipped, name) => saveAs(zipped, name), apply);
  }

   saveProject(projectName, save, apply) {
    Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () => {
      this.statusPanel.setProjectName(projectName);
      let zip = new JSZip();
      this.layerToJSON(zip, projectName, new Array(), 0, obj => {
        let finish = () => {
          this.writeJSONArray(zip, "drawingTools", array => this.drawingTools.forEach(drawingTool => array.push(drawingTool.toJSON())));
          this.writeJSONArray(zip, "colors", array => Color.getHistory().forEach(color => array.push(color.getJSON())));
          this.writeJSONArray(zip, "gradientcolors", array => Z4GradientColor.getHistory().forEach(color => array.push(color.toJSON())));
          this.writeJSONArray(zip, "bigradientcolors", array => Z4BiGradientColor.getHistory().forEach(color => array.push(color.toJSON())));
          zip.file("manifest.json", JSON.stringify(obj), null);
          let options = new Object();
          options["type"] = "blob";
          options["compression"] = "DEFLATE";
          options["streamFiles"] = true;
          let compressionOptions = new Object();
          compressionOptions["level"] = 9;
          options["compressionOptions"] = compressionOptions;
          zip.generateAsync(options, metadata => Z4UI.setPleaseWaitProgressBarValue(metadata["percent"])).then(zipped => {
            save(zipped, projectName + ".z4i");
            this.canvas.setSaved(true);
            Z4UI.pleaseWaitCompleted();
            if (apply) {
              apply();
            }
          });
        };
        obj["currentKeyHistory"] = this.ribbonHistoryPanel.getCurrentKey();
        obj["history"] = new Array();
        this.historyToJSON(zip, obj, finish);
      });
    });
  }

   writeJSONArray(zip, name, apply) {
    let json = new Object();
    let array = new Array();
    apply(array);
    json[name] = array;
    zip.file(name + ".json", JSON.stringify(json), null);
  }

   layerToJSON(zip, projectName, layers, index, apply) {
    let layer = this.paper.getLayerAt(index);
    layer.convertToBlob(blob => {
      if (zip) {
        zip.file("layers/layer" + index + ".png", blob, null);
      }
      let offset = layer.getOffset();
      let layerJSON = new Object();
      if (!zip) {
        layerJSON["data"] = blob;
      }
      layerJSON["name"] = layer.getName();
      layerJSON["opacity"] = layer.getOpacity();
      layerJSON["compositeOperation"] = layer.getCompositeOperation();
      layerJSON["hidden"] = layer.isHidden();
      layerJSON["offsetX"] = offset.x;
      layerJSON["offsetY"] = offset.y;
      layers[index] = layerJSON;
      if (index + 1 === this.canvas.getLayersCount()) {
        let JSON = new Object();
        JSON["projectName"] = projectName;
        JSON["width"] = this.size.width;
        JSON["height"] = this.size.height;
        JSON["layers"] = layers;
        apply(JSON);
      } else {
        this.layerToJSON(zip, projectName, layers, index + 1, apply);
      }
    });
  }

   historyToJSON(zip, obj, finish) {
    this.ribbonHistoryPanel.iterateHistoryBuffer((key, value, apply) => {
      if (key !== -1) {
        (obj["history"]).push(key);
        let folder = "history/history_" + key + "/";
        let layers = value["layers"];
        layers.forEach((layer, index, array) => {
          zip.file(folder + "layers/layer" + index + ".png", layer["data"], null);
          layer["data"] = null;
        });
        zip.file(folder + "manifest.json", JSON.stringify(value), null);
        apply();
      } else {
        finish();
      }
    });
  }

  /**
   * Exports a canvas project to an image file
   *
   * @param filename The file name
   * @param ext The file extension
   * @param quality The quality
   */
   exportToFile(filename, ext, quality) {
    this.exportTo(ext, quality, blob => {
      let link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", filename + ext);
      document.body.appendChild(link);
      let event = document.createEvent("MouseEvents");
      event.initEvent("click", false, false);
      link.dispatchEvent(event);
      document.body.removeChild(link);
    });
  }

  /**
   * Exports a canvas project to an image file
   *
   * @param handle The file handle
   * @param quality The quality
   */
   exportToHandle(handle, quality) {
    handle.getFile().then(file => {
      this.exportTo(file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.')), quality, blob => handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
        writable.write(blob);
        writable.close();
      }));
    });
  }

   exportTo(ext, quality, apply) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () => {
      let offscreen = new OffscreenCanvas(this.size.width, this.size.height);
      let offscreenCtx = offscreen.getContext("2d");
      this.paper.draw(offscreenCtx, false);
      let options = new Object();
      options["type"] = ext === ".png" ? "image/png" : "image/jpeg";
      options["quality"] = quality;
      offscreen.convertToBlob(options).then(blob => {
        apply(blob);
      });
    });
  }

  /**
   * Adds a canvas layer from an image file
   *
   * @param handle The file handle
   */
   addLayerFromHandle(handle) {
    handle.getFile().then(file => {
      this.addLayerFromFile(file);
    });
  }

  /**
   * Adds a canvas layer from an image file
   *
   * @param file The file
   */
   addLayerFromFile(file) {
    Z4UI.pleaseWait(this.canvas, true, true, true, false, "", () => {
      let name = file.name.substring(0, file.name.lastIndexOf('.'));
      let fileReader = new FileReader();
      fileReader.onload = event => this.addLayerFromURL(name, fileReader.result, Z4Translations.FROM_FILE);
      fileReader.onerror = event => {
        Z4UI.pleaseWaitCompleted();
        JSOptionPane.showMessageDialog(Z4Translations.IMAGE_OPEN_ERROR_MESSAGE, Z4Translations.FROM_FILE, JSOptionPane.ERROR_MESSAGE, null);
        return null;
      };
      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Adds a canvas layer from an image in the clipboard
   */
   addLayerFromClipboard() {
    Z4UI.pleaseWait(this.canvas, true, true, true, false, "", () => navigator.clipboard.read().then(items => {
      items.forEach(item => {
        let imageType = item.types.find((type, index, array) => type.startsWith("image/"));
        if (imageType) {
          item.getType(imageType).then(blob => {
            this.addLayerFromURL(this.canvas.findLayerName(), URL.createObjectURL(blob), Z4Translations.FROM_CLIPBOARD);
          });
        } else {
          Z4UI.pleaseWaitCompleted();
          JSOptionPane.showMessageDialog(Z4Translations.IMAGE_OPEN_ERROR_MESSAGE, Z4Translations.FROM_CLIPBOARD, JSOptionPane.ERROR_MESSAGE, null);
        }
      });
    }));
  }

  /**
   * Merges an array of layers in the canvas
   *
   * @param layers The layers
   */
   mergeLayers(layers) {
    let offscreen = new OffscreenCanvas(this.size.width, this.size.height);
    let offscreenCtx = offscreen.getContext("2d");
    layers.forEach(layer => layer.draw(offscreenCtx, false));
    let options = new Object();
    options["type"] = "image/png";
    offscreen.convertToBlob(options).then(converted => {
      this.addLayerFromURL(this.canvas.findLayerName(), URL.createObjectURL(converted), Z4Translations.MERGE);
    });
  }

   addLayerFromURL(name, url, errorTitle) {
    let image = document.createElement("img");
    image.onload = event => {
      Z4UI.pleaseWaitCompleted();
      if (image.width <= Z4Constants.MAX_IMAGE_SIZE && image.height <= Z4Constants.MAX_IMAGE_SIZE) {
        this.paper.addLayerFromImage(name, image, this.size.width, this.size.height);
        this.canvas.afterAddLayer();
        this.canvas.drawCanvas();
      } else {
        JSOptionPane.showMessageDialog(Z4Translations.IMAGE_TOO_BIG_MESSAGE.replace("$image_size$", image.width + " x " + image.height).replace("$max_image_size$", Z4Constants.MAX_IMAGE_SIZE + " x " + Z4Constants.MAX_IMAGE_SIZE), errorTitle, JSOptionPane.ERROR_MESSAGE, null);
      }
      return null;
    };
    image.onerror = event => {
      Z4UI.pleaseWaitCompleted();
      JSOptionPane.showMessageDialog(Z4Translations.IMAGE_OPEN_ERROR_MESSAGE, errorTitle, JSOptionPane.ERROR_MESSAGE, null);
      return null;
    };
    image.src = url;
    return null;
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param handle The file handle
   */
   addDrawingToolFromHandle(handle) {
    handle.getFile().then(file => {
      this.addDrawingToolFromFile(file);
    });
  }

  /**
   * Adds a drawing tool from a file
   *
   * @param file The file
   */
   addDrawingToolFromFile(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        let json = JSON.parse(fileReader.result);
        if (file.name.toLowerCase().endsWith(".z4ts")) {
          (json["drawingTools"]).forEach(drawingTool => this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)));
        } else {
          this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(json));
        }
      } catch (ex) {
        JSOptionPane.showMessageDialog(Z4Translations.DRAWING_TOOL_OPEN_ERROR_MESSAGE, Z4Translations.FROM_FILE, JSOptionPane.ERROR_MESSAGE, null);
      }
      return null;
    };
    fileReader.onerror = event => {
      JSOptionPane.showMessageDialog(Z4Translations.DRAWING_TOOL_OPEN_ERROR_MESSAGE, Z4Translations.FROM_FILE, JSOptionPane.ERROR_MESSAGE, null);
      return null;
    };
    fileReader.readAsText(file);
  }

  /**
   * Saves a drawing tool
   *
   * @param fileName The file name
   * @param drawingTool the drawing tool
   */
   saveDrawingToolToFile(fileName, drawingTool) {
    if (!fileName.toLowerCase().endsWith(".z4t")) {
      fileName += ".z4t";
    }
    let blob = null;
    eval("blob = new Blob([JSON.stringify(drawingTool.toJSON())], {type: 'application/json'});");
    saveAs(blob, fileName);
  }

  /**
   * Saves a drawing tool
   *
   * @param handle The file handle
   * @param drawingTool The drawing tool
   */
   saveDrawingToolToHandle(handle, drawingTool) {
    handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
      writable.write(JSON.stringify(drawingTool.toJSON()));
      writable.close();
    });
  }

  /**
   * Saves the drawing tools
   *
   * @param fileName The file name
   */
   saveDrawingToolsToFile(fileName) {
    if (!fileName.toLowerCase().endsWith(".z4ts")) {
      fileName += ".z4ts";
    }
    this.saveDrawingTools(fileName, (json, name) => {
      let blob = null;
      eval("blob = new Blob([JSON.stringify(json)], {type: 'application/json'});");
      saveAs(blob, name);
    });
  }

  /**
   * Saves the drawing tools
   *
   * @param handle The file handle
   */
   saveDrawingToolsToHandle(handle) {
    let fileName = handle.name.substring(0, handle.name.lastIndexOf('.'));
    this.saveDrawingTools(fileName, (json, name) => handle.createWritable(new FileSystemWritableFileStreamCreateOptions()).then(writable => {
      writable.write(JSON.stringify(json));
      writable.close();
    }));
  }

   saveDrawingTools(fileName, save) {
    Z4UI.pleaseWait(this.canvas, false, false, false, false, "", () => {
      let array = new Array();
      this.drawingTools.forEach(drawingTool => array.push(drawingTool.toJSON()));
      let json = new Object();
      json["drawingTools"] = array;
      save(json, fileName);
    });
  }
}
/**
 * The mouse manager of a Z4Canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasMouseManager {

   canvas = null;

   ctx = null;

   selectedLayer = null;

   selectedDrawingTool = null;

   drawingDirection = Z4DrawingDirection.FREE;

   centerGrid = null;

   plotWidthGrid = 0;

   magneticGrid = false;

   size = null;

   zoom = 0.0;

   canvasOverlayModes = new Array();

   ribbonHistoryPanel = null;

   statusPanel = null;

   pressed = false;

   onStartX = 0.0;

   onStartY = 0.0;

  /**
   * Creates the object
   *
   * @param canvas The canvas
   * @param ctx The canvas context
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  /**
   * Sets the selected layer
   *
   * @param selectedLayer The selected layer
   */
   setSelectedLayer(selectedLayer) {
    this.selectedLayer = selectedLayer;
  }

  /**
   * Sets the selected drawing tool
   *
   * @param selectedDrawingTool The selected drawing tool
   */
   setSelectedDrawingTool(selectedDrawingTool) {
    this.selectedDrawingTool = selectedDrawingTool;
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
   setDrawingDirection(drawingDirection) {
    this.drawingDirection = drawingDirection;
  }

  /**
   * Sets the magnetic grid
   *
   * @param center The grid center
   * @param plotWidth The grid plot width
   * @param b true to enable the magnetic grid, false otherwise
   */
   setMagneticGrid(center, plotWidth, b) {
    this.centerGrid = center;
    this.plotWidthGrid = plotWidth;
    this.magneticGrid = b;
  }

  /**
   * Sets the size
   *
   * @param size The size
   */
   setSize(size) {
    this.size = size;
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    this.zoom = zoom;
  }

  /**
   * Adds a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   addCanvasOverlayMode(canvasOverlayMode) {
    if (this.canvasOverlayModes.indexOf(canvasOverlayMode) === -1) {
      this.canvasOverlayModes.push(canvasOverlayMode);
    }
  }

  /**
   * Removes a canvas overlay mode
   *
   * @param canvasOverlayMode The canvas overlay mode
   */
   removeCanvasOverlayMode(canvasOverlayMode) {
    let index = this.canvasOverlayModes.indexOf(canvasOverlayMode);
    if (index !== -1) {
      this.canvasOverlayModes.splice(index, 1);
    }
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonHistoryPanel(ribbonHistoryPanel) {
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * The mouse event manager
   *
   * @param event The mouse event
   * @param type The event type
   */
   onMouse(event, type) {
    let x = Math.min(this.size.width, Math.max(0, event.offsetX / this.zoom));
    let y = Math.min(this.size.height, Math.max(0, event.offsetY / this.zoom));
    let xParsed = parseInt(x);
    let yParsed = parseInt(y);
    if (this.canvasOverlayModes.indexOf(Z4CanvasOverlayMode.PICK_COLOR) !== -1) {
      switch(type) {
        case "up":
          this.statusPanel.colorPicked(this.canvas.getColorAt(xParsed, yParsed), this.canvas.getSelectedLayerColorAt(xParsed, yParsed));
          break;
        case "move":
          this.statusPanel.setMousePosition(xParsed, yParsed);
          break;
      }
    } else {
      switch(type) {
        case "enter":
          this.pressed = event.buttons === 1;
          this.onAction(Z4PointIteratorDrawingAction.START, x, y);
          this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
          break;
        case "down":
          this.pressed = true;
          this.onAction(Z4PointIteratorDrawingAction.START, x, y);
          break;
        case "move":
          this.statusPanel.setMousePosition(xParsed, yParsed);
          this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
          break;
        case "up":
          this.onStop(x, y);
          break;
        case "leave":
          if (this.pressed) {
            this.onStop(x, y);
          }
          break;
      }
    }
  }

   onAction(action, x, y) {
    let point = this.checkPoint(action, x, y);
    if (!this.selectedDrawingTool || !this.selectedLayer || !point) {
    } else if (this.pressed && this.selectedDrawingTool.drawAction(action, point.x, point.y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(action);
    }
  }

   onStop(x, y) {
    this.pressed = false;
    if (!this.selectedDrawingTool || !this.selectedLayer) {
    } else if (this.selectedDrawingTool.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.ribbonHistoryPanel.stopStandard();
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    } else {
      this.startStandard();
    }
  }

   checkPoint(action, x, y) {
    let point = this.magneticGrid ? Z4Math.nearestPointInGrid(x, y, this.centerGrid.x, this.centerGrid.y, this.plotWidthGrid, Z4Constants.MAGNETISM_PERCENTAGE) : new Z4Point(x, y);
    if (!point) {
      if (action === Z4PointIteratorDrawingAction.START) {
        this.pressed = false;
      }
      return null;
    } else if (action === Z4PointIteratorDrawingAction.START) {
      this.onStartX = x;
      this.onStartY = y;
      return point;
    } else if (this.drawingDirection === Z4DrawingDirection.FREE) {
      return point;
    } else if (this.drawingDirection === Z4DrawingDirection.HORIZONTAL) {
      return new Z4Point(point.x, this.onStartY);
    } else if (this.drawingDirection === Z4DrawingDirection.VERTICAL) {
      return new Z4Point(this.onStartX, point.y);
    } else {
      return null;
    }
  }

   iteratePoints(action) {
    if (action !== Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint()) ;
      if (this.selectedDrawingTool.isInfinitePointGenerator() && this.pressed) {
        setTimeout(() => this.iteratePoints(action), this.selectedDrawingTool.getInfinitePointGeneratorSleep());
      }
    } else if (this.selectedDrawingTool.getNextCountOnSTOP()) {
      Z4UI.pleaseWait(this.canvas, true, true, false, true, "", () => this.iteratePoint(0));
    } else {
      this.startStandard();
    }
  }

   iteratePoint(value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.selectedDrawingTool.getNextCountOnSTOP());
    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() => this.iteratePoint(value + 1));
    } else {
      this.startStandard();
      Z4UI.pleaseWaitCompleted();
    }
  }

   drawNextPoint() {
    let next = this.selectedDrawingTool.next();
    if (!next) {
      return false;
    } else if (next.intent === Z4DrawingPointIntent.DRAW_OBJECTS) {
      this.selectedLayer.drawTool(this.selectedDrawingTool, next);
      this.selectedLayer.getLayerPreview().drawLayer();
      this.canvas.drawCanvas();
      return true;
    } else {
      if (this.zoom !== 1) {
        next = new Z4DrawingPoint(Z4Vector.fromPoints(this.zoom * next.z4Vector.x0, this.zoom * next.z4Vector.y0, this.zoom * next.z4Vector.x, this.zoom * next.z4Vector.y), next.intensity, next.temporalPosition, next.intent, next.side, next.useVectorModuleAsSize);
      }
      if (next.intent === Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
        this.canvas.drawCanvas();
      }
      this.ctx.save();
      this.ctx.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.ctx.rotate(next.z4Vector.phase);
      this.selectedDrawingTool.draw(this.ctx, next);
      this.ctx.restore();
      return true;
    }
  }

   startStandard() {
    this.canvas.setChanged(true);
    this.canvas.setSaved(false);
    this.ribbonHistoryPanel.startStandard();
  }
}
/**
 * The canvas overlay mode
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasOverlayMode {

  /**
   * The canvas overlay is used to pick a color
   */
  static PICK_COLOR = 'PICK_COLOR';
}
/**
 * The drawing tool preview
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingToolPreview extends JSDropDown {

   summary = new JSPanel();

   name = new JSLabel();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   editor = new Z4DrawingToolPanel();

   ribbonDrawingToolPanel = null;

   canvas = null;

   drawingTool = null;

   oldDrawingTool = null;

   changed = false;

  /**
   * The text content for the selected button
   */
  static  SELECTED_DRAWING_TOOL_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_DRAWING_TOOL_CONTENT = "-";

  static  PREVIEW_SIZE = 48;

  constructor() {
    super(".z4drawingtoolpreview-editor");
    this.cssAddClass("z4drawingtoolpreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.changed = false;
        this.oldDrawingTool = this.drawingTool;
      } else if (this.changed) {
        this.canvas.setChanged(true);
        this.canvas.replaceDrawingTool(this.oldDrawingTool, this.drawingTool);
        if (JSON.stringify(this.oldDrawingTool.getSpatioTemporalColor().toJSON()) !== JSON.stringify(this.drawingTool.getSpatioTemporalColor().toJSON())) {
          Z4Constants.pushHistory(this.drawingTool.getSpatioTemporalColor());
        }
      }
    });
    this.name.getStyle().width = (Z4DrawingToolPreview.PREVIEW_SIZE + 15) + "px";
    this.preview.setAttribute("width", "" + Z4DrawingToolPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4DrawingToolPreview.PREVIEW_SIZE);
    this.summary.setLayout(new GridBagLayout());
    this.summary.add(this.name, new GBC(0, 0).w(2));
    this.summary.add(this.preview, new GBC(0, 1));
    let selector = new JSButton();
    selector.setText(Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4drawingtoolpreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event => {
      document.querySelectorAll(".z4drawingtoolpreview .z4drawingtoolpreview-selector").forEach(element => element.textContent = Z4DrawingToolPreview.UNSELECTED_DRAWING_TOOL_CONTENT);
      selector.setText(Z4DrawingToolPreview.SELECTED_DRAWING_TOOL_CONTENT);
      this.canvas.setSelectedDrawingTool(this.drawingTool);
    });
    this.summary.add(selector, new GBC(1, 1).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendChildInTree("summary", this.summary);
    this.editor.cssAddClass("z4drawingtoolpreview-editor");
    this.editor.addChangeListener(event => {
      this.changed = true;
      this.drawingTool = this.editor.getValue();
      this.name.setText(this.drawingTool.getName());
      this.setChildAttributeByQuery("summary", "title", this.drawingTool.getName());
      this.computePopupPosition();
      this.drawDemo();
    });
    this.appendChild(this.editor);
    this.editor.addAction(Z4Translations.DUPLICATE, new GBC(0, 0).a(GBC.NORTH).i(0, 1, 0, 0), event => {
      let json = this.drawingTool.toJSON();
      json["name"] = this.canvas.findDrawingToolName();
      this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(json));
      this.removeAttribute("open");
      setTimeout(() => document.querySelector(".z4drawingtoolpreview:nth-last-child(1)").setAttribute("open", "open"), 0);
    });
    this.editor.addAction(Z4Translations.SAVE_DRAWING_TOOL_AS, new GBC(1, 0).a(GBC.NORTH).i(0, 1, 0, 0), event => this.save());
    this.editor.addAction(Z4Translations.DELETE, new GBC(2, 0).a(GBC.NORTHEAST).wxy(1, 1), event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_DRAWING_TOOL_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.changed = true;
        let index = this.canvas.deleteDrawingTool(this.drawingTool);
        document.querySelector(".z4drawingtoolpreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
  }

  /**
   * Sets the riboon drawing tool panel
   *
   * @param ribbonDrawingToolPanel The ribbon drawing tool panel
   */
   setRibbonDrawingToolPanel(ribbonDrawingToolPanel) {
    this.ribbonDrawingToolPanel = ribbonDrawingToolPanel;
  }

  /**
   * Sets the drawing tool
   *
   * @param canvas The canvas
   * @param drawingTool The drawing tool
   */
   setDrawingTool(canvas, drawingTool) {
    this.canvas = canvas;
    this.drawingTool = drawingTool;
    this.name.setText(this.drawingTool.getName());
    this.editor.setValue(this.drawingTool);
    this.setChildAttributeByQuery("summary", "title", this.drawingTool.getName());
    this.drawDemo();
  }

   drawDemo() {
    if (this.drawingTool) {
      this.ctx.clearRect(0, 0, Z4DrawingToolPreview.PREVIEW_SIZE, Z4DrawingToolPreview.PREVIEW_SIZE);
      this.ctx.save();
      this.ctx.scale(0.1, 0.1);
      this.drawingTool.getPointIterator().drawDemo(this.ctx, this.drawingTool.getPainter(), this.drawingTool.getSpatioTemporalColor(), this.drawingTool.getProgression(), Z4DrawingToolPreview.PREVIEW_SIZE * 10, Z4DrawingToolPreview.PREVIEW_SIZE * 10, false);
      this.ctx.restore();
    }
  }

   save() {
    if (typeof window["showSaveFilePicker"] === "function") {
      this.saveToolsToHandle();
    } else {
      this.saveToolsToFile();
    }
  }

   saveToolsToFile() {
    let panel = new JSPanel();
    panel.setLayout(new BorderLayout(0, 0));
    let label = new JSLabel();
    label.setText(Z4Translations.FILENAME);
    panel.add(label, BorderLayout.NORTH);
    let fileName = new JSTextField();
    fileName.setText(this.drawingTool.getName());
    panel.add(fileName, BorderLayout.CENTER);
    JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener => fileName.addActionListener(event => listener(new ChangeEvent())), () => !!(fileName.getText()), response => {
      if (response === JSOptionPane.OK_OPTION) {
        this.canvas.saveDrawingToolToFile(fileName.getText(), this.drawingTool);
      }
    });
  }

   saveToolsToHandle() {
    let options = new FilePickerOptions();
    options.excludeAcceptAllOption = true;
    options.id = Z4Constants.TOOL_FILE_ID;
    options.multiple = false;
    options.suggestedName = this.drawingTool.getName();
    options.types = Z4Constants.PIZZAPAZZA_SAVE_TOOL_FILE_TYPE;
    JSFilePicker.showSaveFilePicker(options, handle => this.canvas.saveDrawingToolToHandle(handle, this.drawingTool));
  }
}
/**
 * The history preview
 *
 * @author gianpiero.diblasi
 */
class Z4HistoryPreview extends JSDropDown {

   summary = new JSPanel();

   preview = new JSComponent(document.createElement("canvas"));

   previewBig = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   ctxBig = this.previewBig.invoke("getContext('2d')");

   ribbonHistoryPanel = null;

   canvas = null;

   key = 0;

   json = null;

   zoom = 1;

   zoomBig = 1;

  static  PREVIEW_SIZE = 50;

  static  PREVIEW_BIG_SIZE = 500;

  /**
   * The text content for the selected button
   */
  static  SELECTED_HISTORY_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_HISTORY_CONTENT = "-";

  /**
   * Creates the object
   */
  constructor() {
    super(".z4historypreview-editor");
    this.cssAddClass("z4historypreview");
    this.summary.setLayout(new GridBagLayout());
    this.preview.setAttribute("width", "" + Z4HistoryPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4HistoryPreview.PREVIEW_SIZE);
    this.summary.add(this.preview, new GBC(0, 0));
    let selector = new JSButton();
    selector.setText(Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4historypreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event => {
      this.ribbonHistoryPanel.setCurrentKey(this.key);
      this.canvas.openFromHistory(this.json);
    });
    this.summary.add(selector, new GBC(1, 0).a(GBC.NORTH).i(0, 2, 0, 0));
    this.appendChildInTree("summary", this.summary);
    this.previewBig.setAttribute("width", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    this.previewBig.setAttribute("height", "" + Z4HistoryPreview.PREVIEW_BIG_SIZE);
    let panel = new JSPanel();
    panel.cssAddClass("z4historypreview-editor");
    panel.add(this.previewBig, null);
    this.appendChild(panel);
  }

  /**
   * Sets the ribbon history panel
   *
   * @param ribbonHistoryPanel The ribbon history panel
   */
   setRibbonHistoryPanel(ribbonHistoryPanel) {
    this.ribbonHistoryPanel = ribbonHistoryPanel;
  }

  /**
   * Sets the history
   *
   * @param key The history key
   * @param json The history json
   * @param canvas The canvas
   */
   setHistory(key, json, canvas) {
    this.key = key;
    this.json = json;
    this.canvas = canvas;
    this.cssAddClass("z4historypreview-" + key);
    let d = new Dimension(json["width"], json["height"]);
    this.zoom = this.setSize(this.preview, d, Z4HistoryPreview.PREVIEW_SIZE);
    this.zoomBig = this.setSize(this.previewBig, d, Z4HistoryPreview.PREVIEW_BIG_SIZE);
    this.drawHistory(this.ctx, this.zoom);
    this.drawHistory(this.ctxBig, this.zoomBig);
  }

   setSize(component, d, SIZE) {
    let ratio = d.width / d.height;
    let w = 0.0;
    let h = 0.0;
    if (ratio > 1) {
      w = SIZE;
      h = SIZE / ratio;
    } else {
      w = SIZE * ratio;
      h = SIZE;
    }
    component.setAttribute("width", "" + w);
    component.setAttribute("height", "" + h);
    component.getStyle().marginTop = (SIZE - h - 1) / 2 + "px";
    component.getStyle().marginBottom = (SIZE - h - 1) / 2 + "px";
    component.getStyle().marginLeft = (SIZE - w - 1) / 2 + "px";
    component.getStyle().marginRight = (SIZE - w - 1) / 2 + "px";
    return Math.min(w / d.width, h / d.height);
  }

   drawHistory(ctx, zoom) {
    ctx.scale(zoom, zoom);
    this.drawLayer(ctx, this.json["layers"], 0);
  }

   drawLayer(ctx, layers, index) {
    let layer = layers[index];
    if (!layer["hidden"]) {
      let image = document.createElement("img");
      image.onload = event => {
        ctx.save();
        ctx.globalAlpha = layer["opacity"];
        ctx.globalCompositeOperation = layer["compositeOperation"];
        ctx.drawImage(image, layer["offsetX"], layer["offsetY"]);
        ctx.restore();
        if (index < layers.length - 1) {
          this.drawLayer(ctx, layers, index + 1);
        }
        return null;
      };
      image.src = URL.createObjectURL(layer["data"]);
    } else if (index < layers.length - 1) {
      this.drawLayer(ctx, layers, index + 1);
    }
  }
}
/**
 * The layer preview
 *
 * @author gianpiero.diblasi
 */
class Z4LayerPreview extends JSDropDown {

   summary = new JSPanel();

   name = new JSLabel();

   eye = new JSButton();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   editor = new JSTabbedPane();

   editName = new JSTextField();

   size = new JSLabel();

   offsetXSlider = new JSSlider();

   offsetXSpinner = new JSSpinner();

   offsetYSlider = new JSSlider();

   offsetYSpinner = new JSSpinner();

   opacitySlider = new JSSlider();

   opacitySpinner = new JSSpinner();

   compositeOperations = new Array();

   compositeOperationsGroup = new ButtonGroup();

   delete = new JSButton();

   ribbonLayerPanel = null;

   canvas = null;

   layer = null;

   zoom = 1;

   changed = false;

  /**
   * The text content for the selected button
   */
  static  SELECTED_LAYER_CONTENT = "x";

  /**
   * The text content for the unselected button
   */
  static  UNSELECTED_LAYER_CONTENT = "-";

  /**
   * The text content for the visible button
   */
  static  VISIBLE_LAYER_CONTENT = "#";

  static  PREVIEW_SIZE = 50;

  constructor() {
    super(".z4layerpreview-editor");
    this.cssAddClass("z4layerpreview");
    this.addEventListener("toggle", event => {
      if ("" + this.getProperty("open") === "true") {
        this.changed = false;
        this.delete.setEnabled(this.canvas.getLayersCount() > 1);
      } else if (this.changed) {
        this.canvas.setChanged(true);
        this.canvas.saveHistory("standard,tool");
      }
    });
    this.name.getStyle().width = (Z4LayerPreview.PREVIEW_SIZE + 35) + "px";
    this.preview.setAttribute("width", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.preview.setAttribute("height", "" + Z4LayerPreview.PREVIEW_SIZE);
    this.summary.setLayout(new GridBagLayout());
    this.summary.add(this.name, new GBC(0, 0).w(3));
    this.summary.add(this.preview, new GBC(1, 1).h(3).f(GBC.BOTH));
    this.eye.setText(Z4LayerPreview.VISIBLE_LAYER_CONTENT);
    this.eye.setTooltip(Z4Translations.VISIBLE);
    this.eye.setContentAreaFilled(false);
    this.eye.addActionListener(event => {
      let b = !this.layer.isHidden();
      if (b) {
        this.eye.getStyle().removeProperty("color");
      } else {
        this.eye.getStyle().color = "var(--main-action-bgcolor)";
      }
      this.layer.setHidden(b);
      this.canvas.setChanged(true);
      this.canvas.setSaved(false);
      this.canvas.drawCanvas();
    });
    this.summary.add(this.eye, new GBC(0, 1).f(GBC.BOTH).i(0, 0, 0, 2));
    let selector = new JSButton();
    selector.setText(Z4LayerPreview.SELECTED_LAYER_CONTENT);
    selector.setTooltip(Z4Translations.SELECTED);
    selector.cssAddClass("z4layerpreview-selector");
    selector.getStyle().color = "var(--main-action-bgcolor)";
    selector.setContentAreaFilled(false);
    selector.addActionListener(event => {
      document.querySelectorAll(".z4layerpreview .z4layerpreview-selector").forEach(element => element.textContent = Z4LayerPreview.UNSELECTED_LAYER_CONTENT);
      selector.setText(Z4LayerPreview.SELECTED_LAYER_CONTENT);
      this.canvas.setSelectedLayer(this.layer);
    });
    this.summary.add(selector, new GBC(2, 1).f(GBC.BOTH).i(0, 2, 0, 0));
    let button = new JSButton();
    button.setText("\uD83E\uDC08");
    button.setTooltip(Z4Translations.MOVE_DOWN);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.move(-1));
    this.summary.add(button, new GBC(0, 2).f(GBC.BOTH).i(0, 0, 0, 2));
    button = new JSButton();
    button.setText("\u2BEC");
    button.setTooltip(Z4Translations.MOVE_BOTTOM);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.ribbonLayerPanel.moveLayer(this, this.layer, 0));
    this.summary.add(button, new GBC(0, 3).f(GBC.BOTH).i(0, 0, 0, 2));
    button = new JSButton();
    button.setText("\uD83E\uDC0A");
    button.setTooltip(Z4Translations.MOVE_UP);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.move(2));
    this.summary.add(button, new GBC(2, 2).f(GBC.BOTH).i(0, 2, 0, 0));
    button = new JSButton();
    button.setText("\u2BEE");
    button.setTooltip(Z4Translations.MOVE_TOP);
    button.getStyle().color = "var(--main-action-bgcolor)";
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.ribbonLayerPanel.moveLayer(this, this.layer, this.canvas.getLayersCount()));
    this.summary.add(button, new GBC(2, 3).f(GBC.BOTH).i(0, 2, 0, 0));
    Z4UI.addVLine(this.summary, new GBC(3, 0).h(4).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.appendChildInTree("summary", this.summary);
    this.editor.cssAddClass("z4layerpreview-editor");
    this.editor.addChangeListener(event => this.computePopupPosition());
    let panelBasic = new JSPanel();
    panelBasic.setLayout(new GridBagLayout());
    this.editName.addActionListener(event => {
      let newName = this.editName.getText();
      if (newName) {
        this.changed = true;
        this.canvas.setSaved(false);
        this.name.setText(newName);
        this.layer.setName(newName);
        this.setChildAttributeByQuery("summary", "title", newName);
      }
    });
    Z4UI.addLabel(panelBasic, Z4Translations.LAYER_NAME, new GBC(0, 0).a(GBC.WEST).wx(1));
    panelBasic.add(this.size, new GBC(1, 0).a(GBC.EAST).w(4));
    panelBasic.add(this.editName, new GBC(0, 1).w(5).a(GBC.WEST).f(GBC.HORIZONTAL).i(0, 0, 5, 0));
    Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_X, new GBC(0, 2).a(GBC.WEST));
    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event => this.onChange(true, this.offsetXSpinner.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    panelBasic.add(this.offsetXSpinner, new GBC(1, 2).a(GBC.EAST));
    this.offsetXSlider.getStyle().minWidth = "20rem";
    this.offsetXSlider.addChangeListener(event => this.onChange(false, this.offsetXSlider.getValueIsAdjusting(), this.offsetXSpinner, this.offsetXSlider));
    panelBasic.add(this.offsetXSlider, new GBC(0, 3).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    Z4UI.addLabel(panelBasic, Translations.JSColorChooser_OPACITY, new GBC(0, 4).a(GBC.WEST));
    this.opacitySpinner.cssAddClass("jsspinner_w_4rem");
    this.opacitySpinner.addChangeListener(event => this.onChange(true, this.opacitySpinner.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    panelBasic.add(this.opacitySpinner, new GBC(1, 4).a(GBC.EAST));
    this.opacitySlider.addChangeListener(event => this.onChange(false, this.opacitySlider.getValueIsAdjusting(), this.opacitySpinner, this.opacitySlider));
    this.opacitySlider.getStyle().minWidth = "20rem";
    panelBasic.add(this.opacitySlider, new GBC(0, 5).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    Z4UI.addVLine(panelBasic, new GBC(2, 2).h(6).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(panelBasic, Z4Translations.OFFSET_Y, new GBC(3, 5).h(3).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.addChangeListener(event => this.onChange(true, this.offsetYSpinner.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    panelBasic.add(this.offsetYSpinner, new GBC(3, 2).h(3).a(GBC.NORTH));
    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minHeight = "20rem";
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event => this.onChange(false, this.offsetYSlider.getValueIsAdjusting(), this.offsetYSpinner, this.offsetYSlider));
    panelBasic.add(this.offsetYSlider, new GBC(4, 2).h(6).wy(1).a(GBC.NORTH));
    let showLayerBounds = new JSCheckBox();
    showLayerBounds.setText(Z4Translations.SHOW_LAYER_BOUNDS);
    showLayerBounds.addActionListener(event => {
      this.layer.setShowBounds(showLayerBounds.isSelected());
      this.canvas.drawCanvasBounds();
    });
    panelBasic.add(showLayerBounds, new GBC(0, 6).a(GBC.NORTHWEST));
    button = new JSButton();
    button.setText(Z4Translations.DUPLICATE);
    button.addActionListener(event => {
      this.changed = true;
      this.canvas.duplicateLayer(this.layer);
      this.removeAttribute("open");
    });
    panelBasic.add(button, new GBC(0, 7).a(GBC.SOUTHWEST));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_LAYER_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.changed = true;
        let index = this.canvas.deleteLayer(this.layer, false);
        document.querySelector(".z4layerpreview:nth-child(" + (index + 1) + ")").remove();
      }
    }));
    panelBasic.add(this.delete, new GBC(1, 7).a(GBC.SOUTHEAST));
    this.editor.addTab(Z4Translations.BASIC, panelBasic);
    let panelAdvanced = new JSPanel();
    panelAdvanced.setLayout(new GridBagLayout());
    Z4UI.addLabel(panelAdvanced, Z4Translations.COMPOSITE_OPERATION, new GBC(0, 0).a(GBC.WEST));
    Z4Constants.COMPOSITE_OPERATION.forEach((array, index, parent) => {
      array.forEach((element, index2, array2) => {
        let radio = new JSRadioButton();
        radio.setContentAreaFilled(false);
        radio.setToggle();
        radio.setText(element);
        radio.setTooltip(Z4Translations["COMPOSITE_OPERATION_" + element.toUpperCase().replace("-", "_")]);
        radio.addActionListener(event => this.onAction(element));
        this.compositeOperations.push(radio);
        this.compositeOperationsGroup.add(radio);
        panelAdvanced.add(radio, new GBC(index2, index + 1).a(GBC.WEST).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
      });
    });
    this.editor.addTab(Z4Translations.ADVANCED, panelAdvanced);
    let panelTransform = new JSPanel();
    panelTransform.setLayout(new GridBagLayout());
    this.editor.addTab(Z4Translations.TRANSFORM, panelTransform);
    this.addButton(panelTransform, Z4Translations.FLIP_HORIZONTAL, 0, 0, event => {
      this.layer.flipHorizonal();
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.FLIP_VERTICAL, 1, 0, event => {
      this.layer.flipVertical();
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.RESIZE, 2, 0, event => {
      let layerSize = this.layer.getSize();
      let offsetCanvas = new OffscreenCanvas(layerSize.width, layerSize.height);
      this.layer.draw(offsetCanvas.getContext("2d"), true);
      let resizeImagePanel = new Z4ResizeImagePanel();
      resizeImagePanel.setCanvas(offsetCanvas, layerSize.width, layerSize.height);
      JSOptionPane.showInputDialog(resizeImagePanel, Z4Translations.RESIZE, listener => resizeImagePanel.addChangeListener(listener), () => {
        let resizeOptions = resizeImagePanel.getResizeOptions();
        let containerOK = 0 < resizeOptions.containerWidth && resizeOptions.containerWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.containerHeight && resizeOptions.containerHeight <= Z4Constants.MAX_IMAGE_SIZE;
        let contentOK = 0 < resizeOptions.contentWidth && resizeOptions.contentWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.contentHeight && resizeOptions.contentHeight <= Z4Constants.MAX_IMAGE_SIZE;
        return containerOK && contentOK;
      }, response => {
        if (response === JSOptionPane.OK_OPTION) {
          this.layer.resize(resizeImagePanel.getResizeOptions());
          this.setLayer(this.canvas, this.layer);
          this.afterTransform();
        }
      });
    });
    this.addButton(panelTransform, Z4Translations.ROTATE_PLUS_90, 0, 1, event => {
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.ROTATE_MINUS_90, 1, 1, event => {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTransform, Z4Translations.ROTATE_180, 2, 1, event => {
      this.layer.rotatePlus90();
      this.layer.rotatePlus90();
      this.setLayer(this.canvas, this.layer);
      this.afterTransform();
    });
    this.addButton(panelTransform, "", 3, 1, event => this.setLayer(this.canvas, this.layer)).cssAddClass("z4layerpreview-setlayer");
    this.appendChild(this.editor);
  }

   addButton(panel, text, gridx, gridy, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    panel.add(button, new GBC(gridx, gridy).f(GBC.HORIZONTAL).i(1, 1, 1, 1));
    return button;
  }

   afterTransform() {
    this.changed = true;
    this.drawLayer();
    this.canvas.setSaved(false);
    this.canvas.drawCanvas();
    this.canvas.drawCanvasBounds();
  }

   onChange(spTosl, adjusting, spinner, slider) {
    this.changed = true;
    this.canvas.setSaved(false);
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    if (adjusting) {
      this.editor.setAttribute("offset", "true");
    } else {
      this.editor.removeAttribute("offset");
    }
    this.layer.setOpacity(this.opacitySpinner.getValue() / 100);
    this.layer.move(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    this.canvas.drawCanvas();
    this.canvas.drawCanvasBounds();
  }

   onAction(text) {
    this.changed = true;
    this.canvas.setSaved(false);
    this.layer.setCompositeOperation(text);
    this.canvas.drawCanvas();
  }

   move(direction) {
    this.cssAddClass("z4layerpreview-move");
    let moveIndex = -1;
    let move = document.querySelector(".z4layerpreview-move");
    for (let index = 0; index < move.parentElement.children.length; index++) {
      if (move === move.parentElement.children.item(index)) {
        moveIndex = index;
      }
    }
    if ((direction < 0 && moveIndex > 0) || (direction > 0 && moveIndex < this.canvas.getLayersCount() - 1)) {
      this.removeAttribute("open");
      this.ribbonLayerPanel.moveLayer(this, this.layer, moveIndex + direction);
    }
    this.cssRemoveClass("z4layerpreview-move");
  }

  /**
   * Sets the riboon layer panel
   *
   * @param ribbonLayerPanel The ribbon layer panel
   */
   setRibbonLayerPanel(ribbonLayerPanel) {
    this.ribbonLayerPanel = ribbonLayerPanel;
  }

  /**
   * Sets the layer
   *
   * @param canvas The canvas
   * @param layer The layer
   */
   setLayer(canvas, layer) {
    this.canvas = canvas;
    this.layer = layer;
    this.layer.setLayerPreview(this);
    this.name.setText(this.layer.getName());
    this.size.setText(this.layer.getSize().width + " x " + this.layer.getSize().height);
    this.editName.setText(this.layer.getName());
    this.setChildAttributeByQuery("summary", "title", this.layer.getName());
    if (this.layer.isHidden()) {
      this.eye.getStyle().removeProperty("color");
    } else {
      this.eye.getStyle().color = "var(--main-action-bgcolor)";
    }
    let d = layer.getSize();
    let ratio = d.width / d.height;
    let w = ratio > 1 ? Z4LayerPreview.PREVIEW_SIZE : Z4LayerPreview.PREVIEW_SIZE * ratio;
    let h = ratio > 1 ? Z4LayerPreview.PREVIEW_SIZE / ratio : Z4LayerPreview.PREVIEW_SIZE;
    this.zoom = Math.min(w / d.width, h / d.height);
    this.preview.setAttribute("width", "" + w);
    this.preview.setAttribute("height", "" + h);
    this.preview.getStyle().marginTop = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginBottom = (Z4LayerPreview.PREVIEW_SIZE - h - 1) / 2 + "px";
    this.preview.getStyle().marginLeft = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    this.preview.getStyle().marginRight = (Z4LayerPreview.PREVIEW_SIZE - w - 1) / 2 + "px";
    let p = layer.getOffset();
    let dC = this.canvas.getSize();
    this.offsetXSlider.setMinimum(-d.width);
    this.offsetXSlider.setMaximum(dC.width);
    this.offsetXSlider.setValue(p.x);
    this.offsetXSpinner.setModel(new SpinnerNumberModel(p.x, -d.width, dC.width, 1));
    this.offsetYSlider.setMinimum(-d.height);
    this.offsetYSlider.setMaximum(dC.height);
    this.offsetYSlider.setValue(p.y);
    this.offsetYSpinner.setModel(new SpinnerNumberModel(p.y, -d.height, dC.height, 1));
    this.opacitySlider.setValue(parseInt(100 * layer.getOpacity()));
    this.opacitySpinner.setModel(new SpinnerNumberModel(parseInt(100 * layer.getOpacity()), 0, 100, 1));
    this.compositeOperations.forEach(button => button.setSelected(button.getText() === layer.getCompositeOperation()));
    this.drawLayer();
  }

  /**
   * Draws the layer
   */
   drawLayer() {
    if (this.layer) {
      this.ctx.save();
      this.ctx.scale(this.zoom, this.zoom);
      this.layer.draw(this.ctx, true);
      this.ctx.restore();
    }
  }
}
/**
 * The main frame of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Frame extends JSFrame {

   ribbon = new Z4Ribbon();

   canvas = new Z4Canvas();

   statusPanel = new Z4StatusPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4frame");
    this.ribbon.setCanvas(this.canvas);
    this.ribbon.setStatusPanel(this.statusPanel);
    this.canvas.setStatusPanel(this.statusPanel);
    this.getContentPane().add(this.ribbon, BorderLayout.NORTH);
    this.getContentPane().add(this.canvas, BorderLayout.CENTER);
    this.getContentPane().add(this.statusPanel, BorderLayout.SOUTH);
    this.canvas.create(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, new Color(0, 0, 0, 0));
    window.onbeforeunload = event => {
      if (!this.canvas.isSaved()) {
        event.preventDefault();
        event.returnValue = Z4Translations.PROJECT_NOT_SAVED_MESSAGE;
        return event.returnValue;
      } else {
        return null;
      }
    };
  }
}
/**
 * The orientation of a color progression panel
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgressionPanelOrientation {

  /**
   * The color progression panel is visualized horizontally with a
   * compact width
   */
  static HORIZONTALLY_COMPACT = 'HORIZONTALLY_COMPACT';
  /**
   * The color progression panel is visualized horizontally with a
   * compact height
   */
  static VERTICALLY_COMPACT = 'VERTICALLY_COMPACT';
}
/**
 * The orientation of a lighting panel
 *
 * @author gianpiero.diblasi
 */
class Z4LightingPanelOrientation {

  /**
   * The lighting panel is visualized horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The lighting panel is visualized vertically
   */
  static VERTICAL = 'VERTICAL';
}
/**
 * The abstract panel to manage fillers
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractFillerPanel extends JSPanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   offscreenCanvas = new OffscreenCanvas(Z4AbstractFillerPanel.SIZE / Z4AbstractFillerPanel.RESCALE, Z4AbstractFillerPanel.SIZE / Z4AbstractFillerPanel.RESCALE);

   offscreenCtx = this.offscreenCanvas.getContext("2d");

   xSlider = new JSSlider();

   xSpinner = new JSSpinner();

   ySlider = new JSSlider();

   ySpinner = new JSSpinner();

   gradientColor = new Z4GradientColor();

   radios = new Array();

   points = new Array();

   width = Z4Constants.DEFAULT_IMAGE_SIZE;

   height = Z4Constants.DEFAULT_IMAGE_SIZE;

   selectedIndex = 0;

   selectedOption = null;

   pressed = false;

  static  SIZE = 180;

  static  SELECTOR_RADIUS = 7;

  static  RESCALE = 3;

  /**
   * Creates the object
   *
   * @param count The number of points managed by this panel
   * @param options The available options
   */
  constructor(count, options) {
    super();
    this.cssAddClass("z4abstractfillerpanel");
    this.setLayout(new GridBagLayout());
    let panelOptions = new JSPanel();
    this.add(panelOptions, new GBC(0, 0).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));
    this.preview.setProperty("width", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.setProperty("height", "" + Z4AbstractFillerPanel.SIZE);
    this.preview.addEventListener("mouseenter", event => this.onMouse(event, "enter"));
    this.preview.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.add(this.preview, new GBC(0, 1).wh(2, 2).wxy(1, 1).i(2, 2, 2, 2));
    Z4UI.addLabel(this, "y", new GBC(2, 2).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.ySpinner.cssAddClass("jsspinner-vertical");
    this.ySpinner.cssAddClass("jsspinner_h_4rem");
    this.ySpinner.setModel(new SpinnerNumberModel(0, 0, this.height, 1));
    this.ySpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.ySpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.ySpinner.addChangeListener(event => this.onChange(true, this.ySpinner.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.add(this.ySpinner, new GBC(2, 1).wy(1).a(GBC.NORTHEAST));
    this.ySlider.setMaximum(this.height);
    this.ySlider.setOrientation(JSSlider.VERTICAL);
    this.ySlider.setInverted(true);
    this.ySlider.getStyle().minHeight = "20rem";
    this.ySlider.getStyle().minWidth = "1.5rem";
    this.ySlider.addChangeListener(event => this.onChange(false, this.ySlider.getValueIsAdjusting(), this.ySpinner, this.ySlider, false));
    this.add(this.ySlider, new GBC(3, 1).h(2).a(GBC.EAST));
    Z4UI.addHLine(this, new GBC(0, 3).w(4).a(GBC.WEST).f(GBC.HORIZONTAL).i(2, 1, 2, 1));
    Z4UI.addLabel(this, "x", new GBC(0, 4).a(GBC.WEST));
    this.xSpinner.setModel(new SpinnerNumberModel(0, 0, this.width, 1));
    this.xSpinner.cssAddClass("jsspinner_w_4rem");
    this.xSpinner.addChangeListener(event => this.onChange(true, this.xSpinner.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.add(this.xSpinner, new GBC(1, 4).w(3).a(GBC.EAST));
    this.xSlider.setMaximum(this.width);
    this.xSlider.getStyle().minWidth = "20rem";
    this.xSlider.addChangeListener(event => this.onChange(false, this.xSlider.getValueIsAdjusting(), this.xSpinner, this.xSlider, true));
    this.add(this.xSlider, new GBC(0, 5).w(4).a(GBC.NORTH).f(GBC.HORIZONTAL));
    let panelRadios = new JSPanel();
    this.add(panelRadios, new GBC(0, 6).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));
    if (options) {
      let buttonGroupOptions = new ButtonGroup();
      options.forEach((option, index, array) => {
        let radio = new JSRadioButton();
        radio.setContentAreaFilled(false);
        radio.setToggle();
        radio.setSelected(index === 0);
        if (index === 0) {
          this.selectedOption = option;
        }
        radio.setIcon(new Z4EmptyImageProducer(option));
        radio.addActionListener(event => {
          this.selectedOption = option;
          this.drawPreview(false);
        });
        buttonGroupOptions.add(radio);
        panelOptions.add(radio, null);
      });
    }
    let buttonGroupRadios = new ButtonGroup();
    for (let index = 0; index < count; index++) {
      let idx = index;
      let radio = new JSRadioButton();
      radio.setText("" + (index + 1));
      radio.setSelected(index === 0);
      radio.addActionListener(event => this.onRadio(idx));
      this.radios.push(radio);
      buttonGroupRadios.add(radio);
      panelRadios.add(radio, null);
    }
    this.pushPointPositions(this.points, this.width, this.height);
    this.setXY();
  }

   onRadio(index) {
    this.selectedIndex = index;
    this.setXY();
    this.drawPreview(false);
  }

   onChange(spTosl, adjusting, spinner, slider, isX) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    this.setPointPosition(this.points, this.selectedIndex, isX ? slider.getValue() : this.points[this.selectedIndex].x, !isX ? slider.getValue() : this.points[this.selectedIndex].y, this.width, this.height);
    this.drawPreview(adjusting);
  }

   onMouse(event, type) {
    let w = parseInt(this.preview.getProperty("width"));
    let h = parseInt(this.preview.getProperty("height"));
    switch(type) {
      case "enter":
        break;
      case "down":
        this.points.map(point => new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) => {
          if (this.isPointEnabled(index) && Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) <= Z4AbstractFillerPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.radios[this.selectedIndex].setSelected(true);
            this.setXY();
            this.drawPreview(false);
          }
        });
        break;
      case "move":
        if (this.pressed) {
          this.setPointPosition(this.points, this.selectedIndex, parseInt(this.width * event.offsetX / w), parseInt(this.height * event.offsetY / h), this.width, this.height);
          this.setXY();
          this.drawPreview(true);
        } else {
          this.preview.getStyle().cursor = "default";
          this.points.map(point => new Point(w * point.x / this.width, h * point.y / this.height)).forEach((point, index, array) => {
            if (this.isPointEnabled(index) && Z4Math.distance(point.x, point.y, event.offsetX, event.offsetY) <= Z4AbstractFillerPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          });
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        break;
      case "leave":
        if (this.pressed) {
          this.pressed = false;
          this.drawPreview(false);
        }
        break;
    }
  }

  /**
   * Sets the position of a point
   *
   * @param points The points
   * @param selectedIndex The selected index of the point
   * @param x The x-axis coordinate of the point
   * @param y The y-axis coordinate of the point
   * @param width The preview width
   * @param height The preview height
   */
   setPointPosition(points, selectedIndex, x, y, width, height) {
  }

  /**
   * Requests a call to the setPointPosition method
   */
   requestSetPointPosition() {
    this.setPointPosition(this.points, this.selectedIndex, this.points[this.selectedIndex].x, this.points[this.selectedIndex].y, this.width, this.height);
  }

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
   setSize(width, height) {
    this.width = width;
    this.height = height;
    this.ySpinner.setModel(new SpinnerNumberModel(0, 0, this.height, 1));
    this.ySlider.setMaximum(this.height);
    this.xSpinner.setModel(new SpinnerNumberModel(0, 0, this.width, 1));
    this.xSlider.setMaximum(this.width);
    this.points.length = 0;
    this.pushPointPositions(this.points, this.width, this.height);
    this.setXY();
    let ratio = width / height;
    this.preview.setProperty("width", "" + parseInt(ratio > 1 ? Z4AbstractFillerPanel.SIZE : Z4AbstractFillerPanel.SIZE * ratio));
    this.preview.setProperty("height", "" + parseInt(ratio > 1 ? Z4AbstractFillerPanel.SIZE / ratio : Z4AbstractFillerPanel.SIZE));
    this.offscreenCanvas = new OffscreenCanvas(parseInt(this.preview.getProperty("width")) / Z4AbstractFillerPanel.RESCALE, parseInt(this.preview.getProperty("height")) / Z4AbstractFillerPanel.RESCALE);
    this.offscreenCtx = this.offscreenCanvas.getContext("2d");
    this.drawPreview(false);
  }

  /**
   * Sets the gradient color to use
   *
   * @param gradientColor The gradient color
   */
   setGradientColor(gradientColor) {
    this.gradientColor = gradientColor;
    this.drawPreview(false);
  }

  /**
   * Pushes the point positions
   *
   * @param points The points
   * @param width The preview width
   * @param height The preview height
   */
   pushPointPositions(points, width, height) {
  }

   setXY() {
    this.xSlider.setValue(this.points[this.selectedIndex].x);
    this.xSpinner.setValue(this.points[this.selectedIndex].x);
    this.ySlider.setValue(this.points[this.selectedIndex].y);
    this.ySpinner.setValue(this.points[this.selectedIndex].y);
  }

  /**
   * Sets the enabled property of all points
   */
   setPointsEnabled() {
    this.radios.forEach((radio, index, array) => {
      let b = this.isPointEnabled(index);
      radio.setEnabled(b);
      if (!b && radio.isSelected()) {
        this.radios[0].setSelected(true);
        this.selectedIndex = 0;
        this.setXY();
        this.drawPreview(false);
      }
    });
  }

  /**
   * Returns the selected filler
   *
   * @return The selected filler
   */
   getSelectedFiller() {
    return this.getFiller(this.gradientColor, this.points, this.selectedOption);
  }

  /**
   * Draws the preview
   *
   * @param adjusting true if the value is adjusting, false otherwise
   */
   drawPreview(adjusting) {
    let w = parseInt(this.preview.getProperty("width"));
    let h = parseInt(this.preview.getProperty("height"));
    if (w > 0 && h > 0) {
      this.ctx.clearRect(0, 0, w, h);
      let map = this.points.map(point => new Point(w * point.x / this.width, h * point.y / this.height));
      if (adjusting && this.needsRescale(this.selectedOption)) {
        let imageData = this.offscreenCtx.createImageData(w / Z4AbstractFillerPanel.RESCALE, h / Z4AbstractFillerPanel.RESCALE);
        this.getFiller(this.gradientColor, map.map(point => new Point(point.x / Z4AbstractFillerPanel.RESCALE, point.y / Z4AbstractFillerPanel.RESCALE)), this.selectedOption).fill(imageData);
        this.offscreenCtx.putImageData(imageData, 0, 0);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0, w, h);
      } else {
        let imageData = this.ctx.createImageData(w, h);
        this.getFiller(this.gradientColor, map, this.selectedOption).fill(imageData);
        this.ctx.putImageData(imageData, 0, 0);
      }
      this.ctx.save();
      map.forEach((point, index, array) => this.drawCircle(point, index));
      this.ctx.restore();
      this.ctx.save();
      this.drawObjects(this.ctx, map);
      this.ctx.restore();
    }
  }

  /**
   * Check if a rescale is needed during drawing
   *
   * @param option The selected option
   * @return true if a rescale is needed during drawing, false otherwise
   */
   needsRescale(option) {
  }

  /**
   * Returns the filler
   *
   * @param gradientColor The color used to fill
   * @param points The points
   * @param option The selected option
   * @return The filler
   */
   getFiller(gradientColor, points, option) {
  }

   drawCircle(point, index) {
    if (this.isPointEnabled(index)) {
      this.ctx.lineWidth = 3;
      let dash = new Array();
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, Z4AbstractFillerPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
      this.ctx.strokeStyle = Z4Constants.getStyle(index === this.selectedIndex ? "red" : "black");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();
      dash.push(2.5, 2.5);
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, Z4AbstractFillerPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
      this.ctx.strokeStyle = Z4Constants.getStyle("white");
      this.ctx.setLineDash(dash);
      this.ctx.stroke();
    }
  }

  /**
   * Checks if a point is enabled
   *
   * @param index The index
   * @return true if the point is enabled, false otherwise
   */
   isPointEnabled(index) {
  }

  /**
   * Draws other objects
   *
   * @param ctx The context
   * @param mappedPoints The (mapped) points
   */
   drawObjects(ctx, mappedPoints) {
  }
}
/**
 * The panel to manage a (multi) bezier filler
 *
 * @author gianpiero.diblasi
 */
class Z4BezierFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(5, new Array(Z4BoundaryBehavior.STOP_AT_BOUNDARY, Z4BoundaryBehavior.FILL_AT_BOUNDARY, Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, Z4BoundaryBehavior.REPEAT_AT_BOUNDARY));
    this.cssAddClass("z4bezierfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(0, 3 * height / 4));
    points.push(new Point(width / 4, height / 8));
    points.push(new Point(3 * width / 4, height / 8));
    points.push(new Point(width, 3 * height / 4));
    points.push(new Point(width / 4, 7 * height / 8));
  }

   needsRescale(option) {
    return true;
  }

   getFiller(gradientColor, points, option) {
    return new Z4BezierFiller(gradientColor, points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y, parseInt(Z4Math.distance(points[0].x, points[0].y, points[4].x, points[4].y)), option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[4].x, mappedPoints[4].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[4].x, mappedPoints[4].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
/**
 * The panel to manage a (multi) conic filler
 *
 * @author gianpiero.diblasi
 */
class Z4ConicFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(false, true));
    this.cssAddClass("z4conicfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4ConicFiller(gradientColor, points[0].x, points[0].y, Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y), option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
/**
 * The panel to manage a (multi) linear filler
 *
 * @author gianpiero.diblasi
 */
class Z4LinearFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(Z4BoundaryBehavior.STOP_AT_BOUNDARY, Z4BoundaryBehavior.FILL_AT_BOUNDARY, Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, Z4BoundaryBehavior.REPEAT_AT_BOUNDARY));
    this.cssAddClass("z4linearfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(0, height / 2));
    points.push(new Point(width, height / 2));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4LinearFiller(gradientColor, points[0].x, points[0].y, points[1].x, points[1].y, option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
/**
 * The panel to manage a (multi) sinusoidal filler
 *
 * @author gianpiero.diblasi
 */
class Z4SinusoidalFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(4, new Array(Z4BoundaryBehavior.STOP_AT_BOUNDARY, Z4BoundaryBehavior.FILL_AT_BOUNDARY, Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, Z4BoundaryBehavior.REPEAT_AT_BOUNDARY));
    this.cssAddClass("z4sinusoidalfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    let angle1 = 0.0;
    let radius1 = 0.0;
    let point1 = null;
    let angle2 = 0.0;
    let radius2 = 0.0;
    let point2 = null;
    let angle3 = 0.0;
    let radius3 = 0.0;
    let point3 = null;
    switch(selectedIndex) {
      case 0:
        let offsetX = points[0].x - x;
        let offsetY = points[0].y - y;
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y);
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, points[2].x, points[2].y);
        radius3 = Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y);
        angle3 = Z4Math.atan(points[0].x, points[0].y, points[3].x, points[3].y);
        points[0] = new Point(x, y);
        point1 = this.getPoint(points[0].x, points[0].y, points[1].x - offsetX, points[1].y - offsetY, radius1, angle1, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        point2 = this.getPoint(points[0].x, points[0].y, points[2].x - offsetX, points[2].y - offsetY, radius2, angle2, width, height);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        point3 = this.getPoint(points[0].x, points[0].y, points[3].x - offsetX, points[3].y - offsetY, radius3, angle3, width, height);
        points[3] = new Point(Math.round(point3.x), Math.round(point3.y));
        break;
      case 1:
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        radius3 = Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y);
        angle3 = Z4Math.atan(points[0].x, points[0].y, x, y) + Math.PI;
        point2 = this.getPoint(points[0].x, points[0].y, points[0].x + radius2 * Math.cos(angle2), points[0].y + radius2 * Math.sin(angle2), radius2, angle2, width, height);
        point3 = this.getPoint(points[0].x, points[0].y, points[0].x + radius3 * Math.cos(angle3), points[0].y + radius3 * Math.sin(angle3), radius3, angle3, width, height);
        points[1] = new Point(x, y);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        points[3] = new Point(Math.round(point3.x), Math.round(point3.y));
        break;
      case 2:
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
        radius3 = Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y);
        angle3 = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        point1 = this.getPoint(points[0].x, points[0].y, points[0].x + radius1 * Math.cos(angle1), points[0].y + radius1 * Math.sin(angle1), radius1, angle1, width, height);
        point3 = this.getPoint(points[0].x, points[0].y, points[0].x + radius3 * Math.cos(angle3), points[0].y + radius3 * Math.sin(angle3), radius3, angle3, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        points[2] = new Point(x, y);
        points[3] = new Point(Math.round(point3.x), Math.round(point3.y));
        break;
      case 3:
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, x, y) + Math.PI;
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
        point1 = this.getPoint(points[0].x, points[0].y, points[0].x + radius1 * Math.cos(angle1), points[0].y + radius1 * Math.sin(angle1), radius1, angle1, width, height);
        point2 = this.getPoint(points[0].x, points[0].y, points[0].x + radius2 * Math.cos(angle2), points[0].y + radius2 * Math.sin(angle2), radius2, angle2, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        points[3] = new Point(x, y);
        break;
    }
  }

   getPoint(cx, cy, x, y, radius, angle, width, height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width / 2, height / 8));
    points.push(new Point(width, height / 2));
    points.push(new Point(width / 2, height));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4SinusoidalFiller(gradientColor, points[0].x, points[0].y, Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y), Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y), Z4Math.distance(points[0].x, points[0].y, points[3].x, points[3].y), Z4Math.atan(points[0].x, points[0].y, points[2].x, points[2].y), option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[3].x, mappedPoints[3].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
/**
 * The panel to manage a (multi) spiral filler
 *
 * @author gianpiero.diblasi
 */
class Z4SpiralFillerPanel extends Z4AbstractFillerPanel {

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(false, true));
    this.cssAddClass("z4spiralfillerpanel");
    this.drawPreview(false);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    points[selectedIndex] = new Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4SpiralFiller(gradientColor, points[0].x, points[0].y, Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y), Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y), option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
/**
 * The panel to manage a texture filler
 *
 * @author gianpiero.diblasi
 */
class Z4TextureFillerPanel extends Z4AbstractFillerPanel {

   colorPanel = new Z4ColorPanel();

   free = new JSRadioButton();

   lockRatio = new JSRadioButton();

   lock = new JSRadioButton();

   group = new ButtonGroup();

   imageData = new ImageData(Z4TextureFillerPanel.DEFAULT_SIZE, Z4TextureFillerPanel.DEFAULT_SIZE);

   backgroundColor = new Color(0, 0, 0, 0);

   newImage = true;

  static  DEFAULT_SIZE = 50;

  /**
   * Creates the object
   */
  constructor() {
    super(2, new Array(false, true));
    Z4UI.addLabel(this, Z4Translations.DIMENSION, new GBC(0, 7).w(4).a(GBC.WEST));
    let panel = new JSPanel();
    this.add(panel, new GBC(0, 8).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));
    this.free.setText(Z4Translations.FREE);
    this.free.setSelected(true);
    this.group.add(this.free);
    panel.add(this.free, null);
    this.lockRatio.setText(Z4Translations.LOCK_ASPECT_RATIO);
    this.group.add(this.lockRatio);
    panel.add(this.lockRatio, null);
    this.lock.setText(Z4Translations.LOCK);
    this.group.add(this.lock);
    panel.add(this.lock, null);
    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.add(panel, new GBC(0, 9).w(4).wx(1).f(GBC.HORIZONTAL));
    let button = new JSButton();
    button.setText(Z4Translations.PATTERN);
    button.addActionListener(event => this.selectPattern());
    panel.add(button, new GBC(0, 0).a(GBC.SOUTHWEST).i(0, 0, 0, 25));
    this.colorPanel.setLabel(Z4Translations.BACKGROUND_COLOR);
    this.colorPanel.setValue(this.backgroundColor);
    this.colorPanel.addChangeListener(event => {
      this.backgroundColor = this.colorPanel.getValue();
      this.drawPreview(false);
    });
    panel.add(this.colorPanel, new GBC(1, 0).wx(1).f(GBC.HORIZONTAL));
    let data = this.imageData.data;
    for (let y = 0; y < Z4TextureFillerPanel.DEFAULT_SIZE; y++) {
      for (let x = 0; x < Z4TextureFillerPanel.DEFAULT_SIZE; x++) {
        let index = (y * Z4TextureFillerPanel.DEFAULT_SIZE + x) * 4;
        if (Z4Math.distance(x, y, Z4TextureFillerPanel.DEFAULT_SIZE / 2, Z4TextureFillerPanel.DEFAULT_SIZE / 2) > Z4TextureFillerPanel.DEFAULT_SIZE / 2) {
        } else if (y < Z4TextureFillerPanel.DEFAULT_SIZE / 2) {
          data[index] = 255;
          data[index + 1] = 255;
          data[index + 2] = 255;
          data[index + 3] = 255;
        } else {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          data[index + 3] = 255;
        }
      }
    }
    this.cssAddClass("z4texturefillerpanel");
    this.drawPreview(false);
  }

   selectPattern() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TEXTURE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => handle.getFile().then(file => {
        this.openTexture(file);
      })));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.openTexture(file)));
    }
  }

   openTexture(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let image = document.createElement("img");
      image.onload = event2 => {
        let offscreen = new OffscreenCanvas(image.width, image.height);
        let offscreenCtx = offscreen.getContext("2d");
        offscreenCtx.drawImage(image, 0, 0);
        this.imageData = offscreenCtx.getImageData(0, 0, image.width, image.height);
        this.newImage = true;
        this.requestSetPointPosition();
        this.drawPreview(false);
        return null;
      };
      image.src = fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    if (this.newImage) {
      points[0] = new Point(0, 0);
      points[1] = new Point(Math.min(width, this.imageData.width), Math.min(height, this.imageData.height));
    } else if (this.free.isSelected()) {
      points[selectedIndex] = new Point(x, y);
    } else if (this.lockRatio.isSelected()) {
      let distance = Z4Math.distance(points[1 - selectedIndex].x, points[1 - selectedIndex].y, x, y);
      let angle = Z4Math.atan(points[1 - selectedIndex].x, points[1 - selectedIndex].y, points[selectedIndex].x, points[selectedIndex].y);
      points[selectedIndex] = new Point(Math.round(points[1 - selectedIndex].x + distance * Math.cos(angle)), Math.round(points[1 - selectedIndex].y + distance * Math.sin(angle)));
    } else if (this.lock.isSelected()) {
      let offsetX = points[selectedIndex].x - x;
      let offsetY = points[selectedIndex].y - y;
      let newX = points[1 - selectedIndex].x - offsetX;
      let newY = points[1 - selectedIndex].y - offsetY;
      if (0 <= newX && newX < width && 0 <= newY && newY < height) {
        points[selectedIndex] = new Point(x, y);
        points[1 - selectedIndex] = new Point(newX, newY);
      }
    }
    this.newImage = false;
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(0, 0));
    points.push(new Point(Math.min(width, Z4TextureFillerPanel.DEFAULT_SIZE), Math.min(height, Z4TextureFillerPanel.DEFAULT_SIZE)));
  }

   needsRescale(option) {
    return false;
  }

   getFiller(gradientColor, points, option) {
    return new Z4TextureFiller(this.imageData, points[0].x, points[0].y, points[1].x, points[1].y, this.backgroundColor, option);
  }

   isPointEnabled(index) {
    return true;
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
/**
 * The panel to manage a (multi) (infinite-)vertex filler
 *
 * @author gianpiero.diblasi
 */
class Z4VertexBasedFillerPanel extends Z4AbstractFillerPanel {

   star = new JSCheckBox();

   vertexCounter = new JSSlider();

   regular = new JSCheckBox();

  /**
   * Creates the object
   */
  constructor() {
    super(3, new Array(Z4BoundaryBehavior.STOP_AT_BOUNDARY, Z4BoundaryBehavior.FILL_AT_BOUNDARY, Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY, Z4BoundaryBehavior.REPEAT_AT_BOUNDARY));
    Z4UI.addLabel(this, Z4Translations.VERTICES, new GBC(0, 7).a(GBC.WEST));
    this.star.setText(Z4Translations.STAR);
    this.star.setEnabled(false);
    this.star.addActionListener(event => {
      this.setIcons();
      this.drawPreview(false);
    });
    this.add(this.star, new GBC(1, 7).w(3).a(GBC.EAST));
    let vertexModelAndRenderer = new DefaultSliderModelAndRenderer();
    for (let vertex = 3; vertex < 10; vertex++) {
      vertexModelAndRenderer.addElement("" + vertex);
    }
    vertexModelAndRenderer.addElement("\u221E");
    this.vertexCounter.setModelAndRenderer(vertexModelAndRenderer);
    this.vertexCounter.setValue(7);
    this.vertexCounter.addChangeListener(event => {
      this.star.setEnabled(this.vertexCounter.getValue() !== 7);
      this.setIcons();
      this.drawPreview(false);
    });
    this.add(this.vertexCounter, new GBC(0, 8).w(4).a(GBC.WEST).f(GBC.HORIZONTAL));
    this.getChilStyleByQuery("*:nth-child(13) datalist option:nth-child(8)").fontSize = "larger";
    this.regular.setText(Z4Translations.REGULAR);
    this.regular.addActionListener(event => {
      this.setPointsEnabled();
      this.drawPreview(false);
    });
    this.appendChildInTree("*:nth-child(10)", this.regular);
    this.cssAddClass("z4ellipticfillerpanel");
    this.drawPreview(false);
  }

   setIcons() {
    this.cssRemoveClass("z4ellipticfillerpanel");
    this.cssRemoveClass("z4starfillerpanel");
    this.cssRemoveClass("z4polygonfillerpanel");
    if (this.vertexCounter.getValue() === 7) {
      this.cssAddClass("z4ellipticfillerpanel");
    } else if (this.star.isSelected()) {
      this.cssAddClass("z4starfillerpanel");
    } else {
      this.cssAddClass("z4polygonfillerpanel");
    }
  }

   setPointPosition(points, selectedIndex, x, y, width, height) {
    let angle1 = 0.0;
    let radius1 = 0.0;
    let point1 = null;
    let angle2 = 0.0;
    let radius2 = 0.0;
    let point2 = null;
    switch(selectedIndex) {
      case 0:
        let offsetX = points[0].x - x;
        let offsetY = points[0].y - y;
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y);
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, points[2].x, points[2].y);
        points[0] = new Point(x, y);
        point1 = this.getPoint(points[0].x, points[0].y, points[1].x - offsetX, points[1].y - offsetY, radius1, angle1, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        point2 = this.getPoint(points[0].x, points[0].y, points[2].x - offsetX, points[2].y - offsetY, radius2, angle2, width, height);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        break;
      case 1:
        radius2 = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
        angle2 = Z4Math.atan(points[0].x, points[0].y, x, y) - Z4Math.HALF_PI;
        point2 = this.getPoint(points[0].x, points[0].y, points[0].x + radius2 * Math.cos(angle2), points[0].y + radius2 * Math.sin(angle2), radius2, angle2, width, height);
        points[1] = new Point(x, y);
        points[2] = new Point(Math.round(point2.x), Math.round(point2.y));
        break;
      case 2:
        radius1 = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
        angle1 = Z4Math.atan(points[0].x, points[0].y, x, y) + Z4Math.HALF_PI;
        point1 = this.getPoint(points[0].x, points[0].y, points[0].x + radius1 * Math.cos(angle1), points[0].y + radius1 * Math.sin(angle1), radius1, angle1, width, height);
        points[1] = new Point(Math.round(point1.x), Math.round(point1.y));
        points[2] = new Point(x, y);
        break;
    }
  }

   getPoint(cx, cy, x, y, radius, angle, width, height) {
    while ((x < 0 || x > width || y < 0 || y > height) && radius > 0) {
      radius = Math.max(0, radius - 0.05);
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    return new Z4Point(x, y);
  }

   pushPointPositions(points, width, height) {
    points.push(new Point(width / 2, height / 2));
    points.push(new Point(width, height / 2));
    points.push(new Point(width / 2, 0));
  }

   needsRescale(option) {
    if (option === Z4BoundaryBehavior.STOP_AT_BOUNDARY || option === Z4BoundaryBehavior.FILL_AT_BOUNDARY) {
      return false;
    } else if (option === Z4BoundaryBehavior.SYMMETRIC_AT_BOUNDARY || option === Z4BoundaryBehavior.REPEAT_AT_BOUNDARY) {
      return this.vertexCounter.getValue() !== 7;
    } else {
      return true;
    }
  }

   getFiller(gradientColor, points, option) {
    let rx = Z4Math.distance(points[0].x, points[0].y, points[1].x, points[1].y);
    let ry = Z4Math.distance(points[0].x, points[0].y, points[2].x, points[2].y);
    let angle = Z4Math.atan(points[0].x, points[0].y, points[1].x, points[1].y);
    let vertex = this.vertexCounter.getValue();
    if (vertex === 7) {
      return new Z4EllipticFiller(gradientColor, points[0].x, points[0].y, rx, this.regular.isSelected() ? rx : ry, angle, option);
    } else if (this.star.isSelected()) {
      return new Z4StarFiller(gradientColor, points[0].x, points[0].y, rx, this.regular.isSelected() ? rx : ry, angle, vertex + 3, option);
    } else {
      return new Z4PolygonFiller(gradientColor, points[0].x, points[0].y, rx, this.regular.isSelected() ? rx : ry, angle, vertex + 3, option);
    }
  }

   isPointEnabled(index) {
    return index !== 2 || !this.regular.isSelected();
  }

   drawObjects(ctx, mappedPoints) {
    ctx.lineWidth = 3;
    let dash = new Array();
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    if (!this.regular.isSelected()) {
      ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
      ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    }
    ctx.strokeStyle = Z4Constants.getStyle("black");
    ctx.setLineDash(dash);
    ctx.stroke();
    dash.push(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
    ctx.lineTo(mappedPoints[1].x, mappedPoints[1].y);
    if (!this.regular.isSelected()) {
      ctx.moveTo(mappedPoints[0].x, mappedPoints[0].y);
      ctx.lineTo(mappedPoints[2].x, mappedPoints[2].y);
    }
    ctx.strokeStyle = Z4Constants.getStyle("white");
    ctx.setLineDash(dash);
    ctx.stroke();
  }
}
/**
 * The orientation of a fanciful value panel
 *
 * @author gianpiero.diblasi
 */
class Z4FancifulValuePanelOrientation {

  /**
   * The fanciful value panel is visualized horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The fanciful value panel is visualized vertically
   */
  static VERTICAL = 'VERTICAL';
  /**
   * The fanciful value panel is visualized vertically with components
   * visualized horizontally
   */
  static HORIZONTALLY_VERTICAL = 'HORIZONTALLY_VERTICAL';
}
/**
 * The orientation of a (signed) random value panel
 *
 * @author gianpiero.diblasi
 */
class Z4RandomValuePanelOrientation {

  /**
   * The random value panel is visualized horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The random value panel is visualized vertically
   */
  static VERTICAL = 'VERTICAL';
  /**
   * The random value panel is visualized vertically with components visualized
   * horizontally
   */
  static HORIZONTALLY_VERTICAL = 'HORIZONTALLY_VERTICAL';
}
/**
 * The orientation of a rotation panel
 *
 * @author gianpiero.diblasi
 */
class Z4RotationPanelOrientation {

  /**
   * The rotation panel is visualized horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The rotation panel is visualized vertically
   */
  static VERTICAL = 'VERTICAL';
}
/**
 * The orientation of a signed value panel
 *
 * @author gianpiero.diblasi
 */
class Z4SignedValuePanelOrientation {

  /**
   * The signed value panel is visualized horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The signed value panel is visualized vertically
   */
  static VERTICAL = 'VERTICAL';
}
/**
 * The orientation of a sign panel
 *
 * @author gianpiero.diblasi
 */
class Z4SignPanelOrientation {

  /**
   * The sign panel is visualized horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The sign panel is visualized vertically
   */
  static VERTICAL = 'VERTICAL';
  /**
   * The sign panel is visualized as a square
   */
  static SQUARED = 'SQUARED';
}
/**
 * The orientation of a whirlpool panel
 *
 * @author gianpiero.diblasi
 */
class Z4WhirlpoolPanelOrientation {

  /**
   * The whirlpool panel is visualized horizontally
   */
  static HORIZONTAL = 'HORIZONTAL';
  /**
   * The whirlpool panel is visualized vertically
   */
  static VERTICAL = 'VERTICAL';
}
/**
 * The abstract panel for all ribbon panels
 *
 * @author gianpiero.diblasi
 */
class Z4AbstractRibbonPanel extends JSPanel {

  /**
   * Creates the object
   */
  constructor() {
    super();
  }

  /**
   * Adds a button
   *
   * @param text The text
   * @param enabled true to enable the button, false otherwise
   * @param gridx The grid x
   * @param gridy The grid y
   * @param border The border type
   * @param top The top margin
   * @param listener The listener
   * @return The added button
   */
   addButton(text, enabled, gridx, gridy, border, top, listener) {
    let button = new JSButton();
    button.setText(text);
    button.setEnabled(enabled);
    button.setContentAreaFilled(false);
    button.addActionListener(listener);
    let gbc = new GBC(gridx, gridy).a(GBC.NORTHWEST);
    switch(border) {
      case "left":
        gbc.i(top, 5, 0, 0).f(GBC.HORIZONTAL);
        button.getStyle().borderTopRightRadius = "0px";
        button.getStyle().borderBottomRightRadius = "0px";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "both":
        gbc.i(top, 0, 0, 0).f(GBC.HORIZONTAL);
        button.getStyle().borderRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        button.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        gbc.i(top, 0, 0, 5).f(GBC.HORIZONTAL);
        button.getStyle().borderTopLeftRadius = "0px";
        button.getStyle().borderBottomLeftRadius = "0px";
        button.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      default:
        gbc.i(top, 5, 0, 5);
        break;
    }
    this.add(button, gbc);
    return button;
  }
}
/**
 * The ribbon panel containing the drawing tool menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonDrawingToolPanel extends Z4AbstractRibbonPanel {

   drawingToolsPreview = new JSPanel();

   statusPanel = null;

   canvas = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbondrawingtoolpanel");
    Z4UI.addLabel(this, Z4Translations.NEW_DRAWING_TOOL, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", 0, event => this.create());
    this.addButton(Z4Translations.FROM_FILE, true, 1, 1, "both", 0, event => this.open());
    this.addButton(Z4Translations.FROM_LIBRARY, true, 2, 1, "right", 0, event => this.openFromLibrary());
    Z4UI.addVLine(this, new GBC(3, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.addButton(Z4Translations.SAVE_DRAWING_TOOLS_AS, true, 4, 1, "", 0, event => this.save());
    Z4UI.addVLine(this, new GBC(5, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.drawingToolsPreview.setLayout(new BoxLayout(this.drawingToolsPreview, BoxLayout.X_AXIS));
    this.drawingToolsPreview.getStyle().overflowX = "scroll";
    this.add(this.drawingToolsPreview, new GBC(6, 0).h(2).wx(1).f(GBC.BOTH));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

   create() {
    this.canvas.addDrawingTool(new Z4DrawingTool(this.canvas.findDrawingToolName(), new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)), new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, -1, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0)), Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)), new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE)));
    setTimeout(() => document.querySelector(".z4drawingtoolpreview:nth-last-child(1)").setAttribute("open", "open"), 0);
  }

   open() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TOOL_FILE_ID;
      options.multiple = true;
      options.types = Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.addDrawingToolFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog(".z4t,.z4ts", JSFileChooser.MULTIPLE_SELECTION, 0, files => files.forEach(file => this.canvas.addDrawingToolFromFile(file)));
    }
  }

   openFromLibrary() {
    let panel = new Z4OpenDrawingToolsFromLibraryPanel();
    JSOptionPane.showInputDialog(panel, Z4Translations.FROM_LIBRARY, listener => panel.addChangeListener(listener), () => !!(panel.getSelectedDrawingTools().length), response => {
      if (response === JSOptionPane.OK_OPTION) {
        panel.getSelectedDrawingTools().forEach(drawingTool => this.canvas.addDrawingTool(Z4DrawingTool.fromJSON(drawingTool)));
      }
    });
  }

   save() {
    if (typeof window["showSaveFilePicker"] === "function") {
      this.saveToolsToHandle();
    } else {
      this.saveToolsToFile();
    }
  }

   saveToolsToFile() {
    let panel = new JSPanel();
    panel.setLayout(new BorderLayout(0, 0));
    let label = new JSLabel();
    label.setText(Z4Translations.FILENAME);
    panel.add(label, BorderLayout.NORTH);
    let fileName = new JSTextField();
    fileName.setText(this.canvas.getProjectName());
    panel.add(fileName, BorderLayout.CENTER);
    JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener => fileName.addActionListener(event => listener(new ChangeEvent())), () => !!(fileName.getText()), response => {
      if (response === JSOptionPane.OK_OPTION) {
        this.canvas.saveDrawingToolsToFile(fileName.getText());
      }
    });
  }

   saveToolsToHandle() {
    let options = new FilePickerOptions();
    options.excludeAcceptAllOption = true;
    options.id = Z4Constants.TOOL_FILE_ID;
    options.multiple = false;
    options.suggestedName = this.canvas.getProjectName();
    options.types = Z4Constants.PIZZAPAZZA_SAVE_TOOLS_FILE_TYPE;
    JSFilePicker.showSaveFilePicker(options, handle => this.canvas.saveDrawingToolsToHandle(handle));
  }

  /**
   * Resets the drawing tools preview
   */
   reset() {
    this.drawingToolsPreview.setProperty("innerHTML", "");
  }

  /**
   * Adds a new drawing tool preview
   *
   * @param drawingTool The drawing tool
   */
   addDrawingToolPreview(drawingTool) {
    let preview = new Z4DrawingToolPreview();
    preview.setRibbonDrawingToolPanel(this);
    preview.setDrawingTool(this.canvas, drawingTool);
    document.querySelectorAll(".z4drawingtoolpreview .z4drawingtoolpreview-selector").forEach(element => element.textContent = Z4DrawingToolPreview.UNSELECTED_DRAWING_TOOL_CONTENT);
    this.drawingToolsPreview.add(preview, null);
    preview.invoke("scrollIntoView()");
  }
}
/**
 * The ribbon panel containing the help
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonHelpPanel extends Z4AbstractRibbonPanel {

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 5));
    this.cssAddClass("z4ribbonhelppanel");
    let button = new JSButton();
    button.setText(Z4Translations.ABOUT);
    button.setContentAreaFilled(false);
    button.addActionListener(event => this.showAbout());
    this.add(button, null);
    button = new JSButton();
    button.cssAddClass("z4check-install");
    button.setProperty("innerHTML", Z4Translations.INSTALL);
    button.setContentAreaFilled(false);
    this.add(button, null);
    button = new JSButton();
    button.cssAddClass("z4check-update");
    button.setText(Z4Translations.CHECK_UPDATE);
    button.setContentAreaFilled(false);
    this.add(button, null);
  }

   showAbout() {
    let regExp = new RegExp("pizzApazzA-bundle-.*js");
    document.querySelectorAll("script").forEach(script => {
      let src = script.getAttribute("src");
      if (regExp.test(src)) {
        let offset = 22;
        let start = src.indexOf("pizzApazzA-bundle-min-");
        if (start === -1) {
          offset = 18;
          start = src.indexOf("pizzApazzA-bundle-");
        }
        let end = src.indexOf(".js");
        let version = src.substring(start + offset, end);
        let panel = new JSPanel();
        panel.cssAddClass("z4ribbonhelppanel-about");
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        let component = new JSComponent(document.createElement("img"));
        component.cssAddClass("z4ribbonhelppanel-splash");
        panel.add(component, null);
        let label = new JSLabel();
        label.setProperty("innerHTML", Z4Translations.BASED_ON.replace("$version$", version));
        label.getStyle().marginTop = "5px";
        label.getStyle().maxWidth = "500px";
        panel.add(label, null);
        JSOptionPane.showMessageDialog(panel, Z4Translations.ABOUT, JSOptionPane.INFORMATION_MESSAGE, null);
      }
    });
  }
}
/**
 * The ribbon panel containing the history
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonHistoryPanel extends Z4AbstractRibbonPanel {

   undo = null;

   redo = null;

   save = null;

   consolidate = null;

   historyPreview = new JSPanel();

   canvas = null;

   statusPanel = null;

   dbName = null;

   database = null;

   currentKey = 0;

   z4historyManagement = null;

   z4savingDelay = 0;

   z4savingInterval = 0;

   timerID = -1;

   standardID = -1;

   standardRand = 0.0;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonhistorypanel");
    this.undo = this.addButton(Z4Translations.UNDO, false, 0, 0, "left", 5, event => this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.upperBound(this.currentKey, true), "prev").onsuccess = event2 => this.undoRedo(event2));
    this.redo = this.addButton(Z4Translations.REDO, false, 1, 0, "right", 5, event => this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event2 => this.undoRedo(event2));
    this.save = this.addButton(Z4Translations.SAVE, false, 2, 0, "", 5, event => this.saveHistory("manual"));
    this.consolidate = this.addButton(Z4Translations.CONSOLIDATE, false, 3, 0, "", 5, event => JSOptionPane.showConfirmDialog(Z4Translations.CONSOLIDATE_MESSAGE, Z4Translations.CONSOLIDATE, JSOptionPane.YES_NO_OPTION, JSOptionPane.WARNING_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.canvas.setChanged(false);
        this.resetHistory(() => this.canvas.toHistory(json => this.addHistory(json, key => this.setCurrentKey(key), false)));
      }
    }));
    Z4UI.addVLine(this, new GBC(4, 0).h(2).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.historyPreview.setLayout(new BoxLayout(this.historyPreview, BoxLayout.X_AXIS));
    this.historyPreview.getStyle().overflowX = "scroll";
    this.add(this.historyPreview, new GBC(5, 0).h(2).wx(1).f(GBC.BOTH));
    window.onunload = event => {
      window.indexedDB.deleteDatabase(this.dbName);
      return null;
    };
  }

   undoRedo(event2) {
    let cursor = event2.target["result"];
    this.setCurrentKey(cursor.key);
    this.canvas.openFromHistory(cursor["value"]);
    (document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey)).scrollIntoView();
    return null;
  }

  /**
   * Resets the history
   *
   * @param apply The function to call after reset
   */
   resetHistory(apply) {
    this.clearIntervals();
    this.undo.setEnabled(false);
    this.redo.setEnabled(false);
    this.consolidate.setEnabled(false);
    this.historyPreview.setProperty("innerHTML", "");
    if (this.dbName) {
      window.indexedDB.deleteDatabase(this.dbName);
    }
    this.dbName = "pizzapazza_" + new Date().getTime();
    window.indexedDB.open(this.dbName, 1).onupgradeneeded = event => {
      this.database = event.target["result"];
      let options = new Object();
      options["autoIncrement"] = true;
      this.database.createObjectStore("history", options).transaction.oncomplete = event2 => {
        this.setIntervals();
        apply();
        return null;
      };
      return null;
    };
  }

  /**
   * Saves the history
   *
   * @param policies A comma-separated list of history management policies
   * indicating which criteria should perform saving
   */
   saveHistory(policies) {
    if (this.canvas.isChanged()) {
      if (policies.indexOf(this.z4historyManagement) !== -1) {
        this.database.transaction("history", "readwrite").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event2 => {
          let cursor = event2.target["result"];
          if (cursor) {
            document.querySelector(".z4historypreview.z4historypreview-" + cursor.key).remove();
            cursor.delete().onsuccess = event3 => {
              cursor.continue();
              return null;
            };
          } else {
            this.canvas.toHistory(json => {
              this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event => {
                this.undo.setEnabled(true);
                this.redo.setEnabled(false);
                this.consolidate.setEnabled(true);
                this.canvas.setChanged(false);
                this.currentKey = event.target["result"];
                let hPreview = new Z4HistoryPreview();
                hPreview.setHistory(this.currentKey, json, this.canvas);
                hPreview.setRibbonHistoryPanel(this);
                this.historyPreview.add(hPreview, null);
                document.querySelectorAll(".z4historypreview .z4historypreview-selector").forEach(element => element.textContent = Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
                document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey + " .z4historypreview-selector").textContent = Z4HistoryPreview.SELECTED_HISTORY_CONTENT;
                (document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey)).scrollIntoView();
                return null;
              };
            });
          }
          return null;
        };
      }
    }
  }

  /**
   * Adds an element to the history
   *
   * @param json The element
   * @param apply The function to call after the add
   * @param consolidate true to enable the consolidate button, false otherwise
   */
   addHistory(json, apply, consolidate) {
    this.database.transaction("history", "readwrite").objectStore("history").add(json).onsuccess = event => {
      this.consolidate.setEnabled(consolidate);
      let key = event.target["result"];
      let hPreview = new Z4HistoryPreview();
      hPreview.setHistory(key, json, this.canvas);
      hPreview.setRibbonHistoryPanel(this);
      this.historyPreview.add(hPreview, null);
      apply(key);
      return null;
    };
  }

  /**
   * Iterates over the history buffer
   *
   * @param apply The function to apply
   */
   iterateHistoryBuffer(apply) {
    this.database.transaction("history", "readonly").objectStore("history").openCursor().onsuccess = event => {
      let cursor = event.target["result"];
      if (cursor) {
        apply(cursor.key, cursor["value"], () => cursor.continue());
      } else {
        apply(-1, null, null);
      }
      return null;
    };
  }

  /**
   * Sets the current key in the history buffer
   *
   * @param currentKey The current key in the history buffer
   */
   setCurrentKey(currentKey) {
    this.currentKey = currentKey;
    document.querySelectorAll(".z4historypreview .z4historypreview-selector").forEach(element => element.textContent = Z4HistoryPreview.UNSELECTED_HISTORY_CONTENT);
    document.querySelector(".z4historypreview.z4historypreview-" + this.currentKey + " .z4historypreview-selector").textContent = Z4HistoryPreview.SELECTED_HISTORY_CONTENT;
    this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.upperBound(this.currentKey, true)).onsuccess = event => {
      this.undo.setEnabled(!!(event.target["result"]));
      return null;
    };
    this.database.transaction("history", "readonly").objectStore("history").openCursor(IDBKeyRange.lowerBound(this.currentKey, true)).onsuccess = event => {
      this.redo.setEnabled(!!(event.target["result"]));
      return null;
    };
  }

  /**
   * Returns the current key in the history buffer
   *
   * @return The current key in the history buffer
   */
   getCurrentKey() {
    return this.currentKey;
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Starts the timer for the standard saving
   */
   startStandard() {
    if (this.z4historyManagement === "standard") {
      this.clearIntervals();
      this.standardRand = Math.random();
      let rnd = this.standardRand;
      this.standardID = setTimeout(() => {
        if (this.standardRand === rnd) {
          this.saveHistory("standard");
        }
      }, this.z4savingDelay);
    }
  }

  /**
   * Stops the timer for the standard saving
   */
   stopStandard() {
    if (this.z4historyManagement === "standard") {
      this.clearIntervals();
      this.standardRand = Math.random();
    }
  }

  /**
   * Sets the history management settings
   *
   * @param z4historyManagement The history management policy
   * @param z4savingDelay The saving delay (used if z4historyManagement =
   * standard)
   * @param z4savingInterval The saving interval (used if z4historyManagement =
   * timer)
   */
   setHistoryManagementSettings(z4historyManagement, z4savingDelay, z4savingInterval) {
    this.z4historyManagement = z4historyManagement;
    this.z4savingDelay = z4savingDelay;
    this.z4savingInterval = z4savingInterval;
    this.save.setEnabled(z4historyManagement === "manual");
    this.clearIntervals();
    this.setIntervals();
  }

   clearIntervals() {
    if (this.timerID !== -1) {
      clearInterval(this.timerID);
      this.timerID = -1;
    }
    if (this.standardID !== -1) {
      clearTimeout(this.standardID);
      this.standardID = -1;
    }
  }

   setIntervals() {
    switch(this.z4historyManagement) {
      case "standard":
        break;
      case "timer":
        this.timerID = setInterval(() => this.saveHistory("timer"), this.z4savingInterval);
        break;
      case "manual":
        break;
      case "tool":
        break;
    }
  }
}
/**
 * The ribbon panel containing the layer menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonLayerPanel extends Z4AbstractRibbonPanel {

   showLayerBounds = new JSCheckBox();

   layersPreview = new JSPanel();

   statusPanel = null;

   canvas = null;

   layerDnD = null;

   previewDnD = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonlayerpanel");
    Z4UI.addLabel(this, Z4Translations.NEW_LAYER, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", 0, event => this.addFromColor());
    this.addButton(Z4Translations.FROM_CLIPBOARD, typeof navigator.clipboard["read"] === "function", 1, 1, "both", 0, event => this.addFromClipboard());
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", 0, event => this.addFromFile());
    Z4UI.addVLine(this, new GBC(3, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.addButton(Z4Translations.MERGE, true, 4, 1, "", 0, event => this.merge());
    this.showLayerBounds.setText(Z4Translations.SHOW_LAYER_BOUNDS);
    this.showLayerBounds.addActionListener(event => this.canvas.setShowLayerBounds(this.showLayerBounds.isSelected()));
    this.add(this.showLayerBounds, new GBC(4, 2).a(GBC.NORTH));
    Z4UI.addVLine(this, new GBC(5, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    this.layersPreview.setLayout(new BoxLayout(this.layersPreview, BoxLayout.X_AXIS));
    this.layersPreview.getStyle().overflowX = "scroll";
    this.layersPreview.addEventListener("dragenter", event => event.preventDefault());
    this.layersPreview.addEventListener("dragover", event => event.preventDefault());
    this.layersPreview.addEventListener("dragleave", event => event.preventDefault());
    this.layersPreview.addEventListener("drop", event => {
      event.preventDefault();
      let evt = event;
      let rect = this.previewDnD.invoke("getBoundingClientRect()");
      let rectLayers = this.layersPreview.invoke("getBoundingClientRect()");
      let index = parseInt((evt.clientX - rectLayers.left) / rect.width);
      this.moveLayer(this.previewDnD, this.layerDnD, index);
    });
    this.add(this.layersPreview, new GBC(6, 0).h(3).wx(1).f(GBC.BOTH));
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

  /**
   * Moves a layer
   *
   * @param preview The layer preview
   * @param layer The layer
   * @param index The new index layer
   */
   moveLayer(preview, layer, index) {
    if (!this.canvas.moveLayer(layer, index)) {
    } else if (index < this.canvas.getLayersCount()) {
      index = Math.min(this.canvas.getLayersCount(), index + 1);
      this.layersPreview.insertBefore(preview, "details:nth-child(" + index + ")");
    } else {
      this.layersPreview.add(preview, null);
    }
  }

   addFromColor() {
    let canvasSize = this.canvas.getSize();
    let panel = new Z4NewImagePanel();
    panel.setSelectedSize(canvasSize.width, canvasSize.height);
    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener => panel.addChangeListener(listener), () => {
      let size = panel.getSelectedSize();
      return 0 < size.width && size.width <= Z4Constants.MAX_IMAGE_SIZE && 0 < size.height && size.height <= Z4Constants.MAX_IMAGE_SIZE;
    }, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let size = panel.getSelectedSize();
        let filling = panel.getSelectedFilling();
        this.canvas.addLayer(size.width, size.height, filling);
        Z4Constants.pushHistory(filling);
      }
    });
  }

   addFromFile() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.addLayerFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.addLayerFromFile(file)));
    }
  }

   addFromClipboard() {
    this.canvas.addLayerFromClipboard();
  }

   merge() {
    let panel = new Z4MergeLayerPanel();
    panel.setCanvas(this.canvas);
    JSOptionPane.showInputDialog(panel, Z4Translations.MERGE, listener => panel.addChangeListener(listener), () => panel.getSelectedLayers().length > 1, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let selected = panel.getSelectedLayers();
        selected.forEach(layer => {
          let index = this.canvas.deleteLayer(layer, true);
          document.querySelector(".z4layerpreview:nth-child(" + (index + 1) + ")").remove();
        });
        this.canvas.mergeLayers(selected);
      }
    });
  }

  /**
   * Resets the layers preview
   */
   reset() {
    this.showLayerBounds.setSelected(false);
    this.layersPreview.setProperty("innerHTML", "");
  }

  /**
   * Adds a new layer preview
   *
   * @param layer The layer
   */
   addLayerPreview(layer) {
    let preview = new Z4LayerPreview();
    preview.setRibbonLayerPanel(this);
    preview.setLayer(this.canvas, layer);
    preview.setChildAttributeByQuery("summary", "draggable", "true");
    preview.addEventListener("dragstart", event => {
      (event).dataTransfer.effectAllowed = "move";
      this.layerDnD = layer;
      this.previewDnD = preview;
    });
    document.querySelectorAll(".z4layerpreview .z4layerpreview-selector").forEach(element => element.textContent = Z4LayerPreview.UNSELECTED_LAYER_CONTENT);
    this.layersPreview.add(preview, null);
    preview.invoke("scrollIntoView()");
  }
}
/**
 * The ribbon panel containing the project menus
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonProjectPanel extends Z4AbstractRibbonPanel {

   canvas = null;

   statusPanel = null;

   saveProjectButton = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonprojectpanel");
    Z4UI.addLabel(this, Z4Translations.NEW_PROJECT, new GBC(0, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.CREATE, true, 0, 1, "left", 0, event => this.checkSaved(Z4Translations.CREATE, () => this.createFromColor()));
    this.addButton(Z4Translations.FROM_CLIPBOARD, typeof navigator.clipboard["read"] === "function", 1, 1, "both", 0, event => this.checkSaved(Z4Translations.FROM_CLIPBOARD, () => this.createFromClipboard()));
    this.addButton(Z4Translations.FROM_FILE, true, 2, 1, "right", 0, event => this.checkSaved(Z4Translations.FROM_FILE, () => this.createFromFile()));
    Z4UI.addVLine(this, new GBC(3, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.OPEN, new GBC(4, 0).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.OPEN_PROJECT, true, 4, 1, "", 0, event => this.checkSaved(Z4Translations.OPEN_PROJECT, () => this.openProject()));
    Z4UI.addVLine(this, new GBC(5, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.SAVE, new GBC(6, 0).w(2).a(GBC.WEST).i(5, 5, 2, 0));
    this.saveProjectButton = this.addButton(Z4Translations.SAVE_PROJECT, false, 6, 1, "left", 0, event => this.saveProject(null, false));
    this.addButton(Z4Translations.SAVE_PROJECT_AS, true, 7, 1, "right", 0, event => this.saveProject(null, true));
    this.addButton(Z4Translations.EXPORT, true, 6, 2, "", 0, event => this.exportToFile());
    Z4UI.addVLine(this, new GBC(9, 0).h(3).wy(1).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.TRANSFORM, new GBC(10, 0).w(3).a(GBC.WEST).i(5, 5, 2, 0));
    this.addButton(Z4Translations.FLIP_HORIZONTAL, true, 10, 1, "left", 0, event => this.flip(layer => layer.flipHorizonal(), (centerCanvas, offsetLayer, sizeLayer) => new Point(2 * centerCanvas.x - offsetLayer.x - sizeLayer.width, offsetLayer.y))).getStyle().marginBottom = "5px";
    this.addButton(Z4Translations.FLIP_VERTICAL, true, 11, 1, "both", 0, event => this.flip(layer => layer.flipVertical(), (centerCanvas, offsetLayer, sizeLayer) => new Point(offsetLayer.x, 2 * centerCanvas.y - offsetLayer.y - sizeLayer.height))).getStyle().marginBottom = "5px";
    this.addButton(Z4Translations.RESIZE, true, 12, 1, "right", 0, event => {
      let canvasSize = this.canvas.getSize();
      let offsetCanvas = new OffscreenCanvas(canvasSize.width, canvasSize.height);
      let offsetContext = offsetCanvas.getContext("2d");
      for (let index = 0; index < this.canvas.getLayersCount(); index++) {
        this.canvas.getLayerAt(index).draw(offsetContext, false);
      }
      let resizeImagePanel = new Z4ResizeImagePanel();
      resizeImagePanel.setCanvas(offsetCanvas, canvasSize.width, canvasSize.height);
      JSOptionPane.showInputDialog(resizeImagePanel, Z4Translations.RESIZE, listener => resizeImagePanel.addChangeListener(listener), () => {
        let resizeOptions = resizeImagePanel.getResizeOptions();
        let containerOK = 0 < resizeOptions.containerWidth && resizeOptions.containerWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.containerHeight && resizeOptions.containerHeight <= Z4Constants.MAX_IMAGE_SIZE;
        let contentOK = 0 < resizeOptions.contentWidth && resizeOptions.contentWidth <= Z4Constants.MAX_IMAGE_SIZE && 0 < resizeOptions.contentHeight && resizeOptions.contentHeight <= Z4Constants.MAX_IMAGE_SIZE;
        return containerOK && contentOK;
      }, response => {
        if (response === JSOptionPane.OK_OPTION) {
          let resizeOptions = resizeImagePanel.getResizeOptions();
          let scaleW = resizeOptions.contentWidth / canvasSize.width;
          let scaleH = resizeOptions.contentHeight / canvasSize.height;
          for (let index = 0; index < this.canvas.getLayersCount(); index++) {
            let layer = this.canvas.getLayerAt(index);
            let layerOffset = layer.getOffset();
            let layerSize = layer.getSize();
            layer.resize(new Z4ResizeOptions(parseInt(layerSize.width * scaleW), parseInt(layerSize.height * scaleH), parseInt(layerSize.width * scaleW), parseInt(layerSize.height * scaleH), 0, 0));
            layer.move(resizeOptions.contentOffsetX + parseInt(layerOffset.x * scaleW), resizeOptions.contentOffsetY + parseInt(layerOffset.y * scaleH));
          }
          this.canvas.resize(resizeOptions.containerWidth, resizeOptions.containerHeight);
          document.querySelectorAll(".z4layerpreview .z4layerpreview-setlayer").forEach(element => (element).click());
          this.afterTransform();
        }
      });
    }).getStyle().marginBottom = "5px";
    this.addButton(Z4Translations.ROTATE_PLUS_90, true, 10, 2, "left", 0, event => {
      this.rotatePlus90();
      document.querySelectorAll(".z4layerpreview .z4layerpreview-setlayer").forEach(element => (element).click());
      this.afterTransform();
    });
    this.addButton(Z4Translations.ROTATE_MINUS_90, true, 11, 2, "both", 0, event => {
      this.rotatePlus90();
      this.rotatePlus90();
      this.rotatePlus90();
      document.querySelectorAll(".z4layerpreview .z4layerpreview-setlayer").forEach(element => (element).click());
      this.afterTransform();
    });
    this.addButton(Z4Translations.ROTATE_180, true, 12, 2, "right", 0, event => {
      this.rotatePlus90();
      this.rotatePlus90();
      document.querySelectorAll(".z4layerpreview .z4layerpreview-setlayer").forEach(element => (element).click());
      this.afterTransform();
    });
    Z4UI.addVLine(this, new GBC(16, 0).h(3).wxy(1, 1).f(GBC.VERTICAL).i(1, 2, 1, 2));
  }

   flip(operation, apply) {
    let sizeCanvas = this.canvas.getSize();
    let centerCanvas = new Point(sizeCanvas.width / 2, sizeCanvas.height / 2);
    for (let index = 0; index < this.canvas.getLayersCount(); index++) {
      let layer = this.canvas.getLayerAt(index);
      operation(layer);
      let newOffset = apply(centerCanvas, layer.getOffset(), layer.getSize());
      layer.move(newOffset.x, newOffset.y);
    }
    document.querySelectorAll(".z4layerpreview .z4layerpreview-setlayer").forEach(element => (element).click());
    this.afterTransform();
  }

   rotatePlus90() {
    let sizeCanvas = this.canvas.getSize();
    let centerCanvas = new Point(sizeCanvas.width / 2, sizeCanvas.height / 2);
    for (let index = 0; index < this.canvas.getLayersCount(); index++) {
      let layer = this.canvas.getLayerAt(index);
      let offsetLayer = layer.getOffset();
      let sizeLayer = layer.getSize();
      layer.rotatePlus90();
      layer.move(2 * centerCanvas.y - offsetLayer.y - sizeLayer.height, offsetLayer.x);
    }
    this.canvas.rotatePlus90();
  }

   afterTransform() {
    this.canvas.setSaved(false);
    this.canvas.drawCanvas();
    this.canvas.drawCanvasBounds();
    this.canvas.setChanged(true);
    this.canvas.saveHistory("standard,tool");
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
    this.canvas.addEventListener("dragenter", event => this.onDrop(event, false));
    this.canvas.addEventListener("dragover", event => this.onDrop(event, false));
    this.canvas.addEventListener("dragleave", event => this.onDrop(event, false));
    this.canvas.addEventListener("drop", event => this.onDrop(event, true));
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.statusPanel = statusPanel;
  }

   checkSaved(title, apply) {
    if (this.canvas.isSaved()) {
      apply();
    } else {
      JSOptionPane.showConfirmDialog(Z4Translations.PROJECT_NOT_SAVED_MESSAGE, title, JSOptionPane.YES_NO_CANCEL_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
        switch(response) {
          case JSOptionPane.YES_OPTION:
            this.saveProject(apply, false);
            break;
          case JSOptionPane.NO_OPTION:
            apply();
            break;
        }
      });
    }
  }

   createFromColor() {
    let panel = new Z4NewImagePanel();
    JSOptionPane.showInputDialog(panel, Z4Translations.CREATE, listener => panel.addChangeListener(listener), () => {
      let size = panel.getSelectedSize();
      return 0 < size.width && size.width <= Z4Constants.MAX_IMAGE_SIZE && 0 < size.height && size.height <= Z4Constants.MAX_IMAGE_SIZE;
    }, response => {
      if (response === JSOptionPane.OK_OPTION) {
        let size = panel.getSelectedSize();
        let filling = panel.getSelectedFilling();
        this.canvas.create(size.width, size.height, filling);
        Z4Constants.pushHistory(filling);
      }
    });
  }

   createFromFile() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.createFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.createFromFile(file)));
    }
  }

   createFromClipboard() {
    this.canvas.createFromClipboard();
  }

   openProject() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.PIZZAPAZZA_PROJECT_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => this.canvas.openProjectFromHandle(handle)));
    } else {
      JSFileChooser.showOpenDialog(".z4i", JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.canvas.openProjectFromFile(file)));
    }
  }

   saveProject(apply, as) {
    if (typeof window["showSaveFilePicker"] === "function") {
      this.saveProjectToHandle(apply, as);
    } else {
      this.saveProjectToFile(apply, as);
    }
  }

   saveProjectToFile(apply, as) {
    if (as || !this.canvas.getProjectName()) {
      let panel = new JSPanel();
      panel.setLayout(new BorderLayout(0, 0));
      let label = new JSLabel();
      label.setText(Z4Translations.PROJECT_NAME);
      panel.add(label, BorderLayout.NORTH);
      let projectName = new JSTextField();
      projectName.setText(this.canvas.getProjectName());
      panel.add(projectName, BorderLayout.CENTER);
      JSOptionPane.showInputDialog(panel, Z4Translations.SAVE, listener => projectName.addActionListener(event => listener(new ChangeEvent())), () => !!(projectName.getText()), response => {
        if (response === JSOptionPane.OK_OPTION) {
          this.canvas.saveProjectToFile(projectName.getText(), apply);
        }
      });
    } else {
      this.canvas.saveProjectToFile(this.canvas.getProjectName(), apply);
    }
  }

   saveProjectToHandle(apply, as) {
    if (as || !this.canvas.getHandle()) {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.suggestedName = this.canvas.getProjectName();
      options.types = Z4Constants.PIZZAPAZZA_PROJECT_FILE_TYPE;
      JSFilePicker.showSaveFilePicker(options, handle => this.canvas.saveProjectToHandle(handle, apply));
    } else {
      this.canvas.saveProjectToHandle(this.canvas.getHandle(), apply);
    }
  }

   exportToFile() {
    if (typeof window["showSaveFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.IMAGE_FILE_ID;
      options.multiple = false;
      options.suggestedName = this.canvas.getProjectName();
      options.types = Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE;
      JSFilePicker.showSaveFilePicker(options, handle => this.export(handle));
    } else {
      this.export(null);
    }
  }

   export(handle) {
    if (!handle) {
      let panel = new Z4ExportToFilePanel();
      panel.setFilename(this.canvas.getProjectName());
      JSOptionPane.showInputDialog(panel, Z4Translations.EXPORT, listener => panel.addChangeListener(listener), () => panel.isValid(), response => {
        if (response === JSOptionPane.OK_OPTION) {
          this.canvas.exportToFile(panel.getFilename(), panel.getFileExtension(), panel.getQuality());
        }
      });
    } else if (handle.name.toLowerCase().endsWith(".png")) {
      this.canvas.exportToHandle(handle, 0);
    } else {
      handle.getFile().then(file => {
        let panel = new Z4ExportToFilePanel();
        panel.setFilename(file.name);
        panel.setFilenameEditable(false);
        panel.setFileExtension(".jpg");
        panel.setFileExtensionEnabled(false);
        JSOptionPane.showInputDialog(panel, Z4Translations.EXPORT, listener => panel.addChangeListener(listener), () => panel.isValid(), response => {
          if (response === JSOptionPane.OK_OPTION) {
            this.canvas.exportToHandle(handle, panel.getQuality());
          }
        });
      });
    }
  }

   onDrop(event, doUpload) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
    let files = new Array();
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i]["kind"] === "file") {
          let file = (event.dataTransfer.items[i]).getAsFile();
          files.push(file ? file : event.dataTransfer.items[i]);
        }
      }
    } else {
      event.dataTransfer.files.forEach(file => files.push(file));
    }
    if (files[0]) {
      event.dataTransfer.dropEffect = "copy";
      if (!doUpload) {
      } else if (files[0].name.toLowerCase().endsWith(".z4i")) {
        this.checkSaved(Z4Translations.OPEN_PROJECT, () => this.canvas.openProjectFromFile(files[0]));
      } else if (Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.some((format, index, array) => files[0].name.toLowerCase().endsWith(format))) {
        this.checkSaved(Z4Translations.FROM_FILE, () => this.canvas.createFromFile(files[0]));
      }
    }
  }

  /**
   * Enables the save project button
   *
   * @param b true to enable the save project button, false otherwise
   */
   setSaveEnabled(b) {
    this.saveProjectButton.setEnabled(b);
  }
}
/**
 * The ribbon panel containing the settings
 *
 * @author gianpiero.diblasi
 */
class Z4RibbonSettingsPanel extends Z4AbstractRibbonPanel {

   language = new JSComboBox();

   theme = new JSComboBox();

   color = new JSColorChooser();

   historyManagement = new JSComboBox();

   historyManagementDescription = new JSLabel();

   savingInterval = new JSComboBox();

   savingDelay = new JSComboBox();

   historyPanel = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4ribbonsettingspanel");
    Z4UI.addLabel(this, Z4Translations.LANGUAGE, new GBC(0, 0).a(GBC.WEST).i(5, 5, 2, 0));
    let languageModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    languageModelAndRenderer.addElement(new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE));
    languageModelAndRenderer.addElement(new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE));
    this.language.setModelAndRenderer(languageModelAndRenderer);
    this.language.setSelectedItem(Z4Translations.CURRENT_LANGUAGE);
    this.language.addActionListener(event => this.onchangeLanguage());
    this.add(this.language, new GBC(0, 1).f(GBC.HORIZONTAL).i(0, 5, 0, 5));
    Z4UI.addLabel(this, Z4Translations.THEME, new GBC(1, 0).a(GBC.WEST).i(5, 5, 2, 0));
    let selectedTheme = null;
    let z4theme = localStorage.getItem("z4theme");
    switch(z4theme) {
      case "light":
      case "dark":
      case "auto":
        selectedTheme = new KeyValue(z4theme, Z4Translations["THEME_" + z4theme.toUpperCase()]);
        break;
      default:
        selectedTheme = new KeyValue("auto", Z4Translations.THEME_AUTO);
        break;
    }
    let themeModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    themeModelAndRenderer.addElement(new KeyValue("auto", Z4Translations.THEME_AUTO));
    themeModelAndRenderer.addElement(new KeyValue("light", Z4Translations.THEME_LIGHT));
    themeModelAndRenderer.addElement(new KeyValue("dark", Z4Translations.THEME_DARK));
    this.theme.setModelAndRenderer(themeModelAndRenderer);
    this.theme.setSelectedItem(selectedTheme);
    this.theme.addActionListener(event => this.onchangeTheme());
    this.add(this.theme, new GBC(1, 1).f(GBC.HORIZONTAL).i(0, 5, 0, 5));
    Z4UI.addLabel(this, Z4Translations.THEME_COLOR, new GBC(2, 0).a(GBC.WEST).i(5, 5, 2, 0));
    let themeColor = localStorage.getItem("z4color");
    this.color.setSelectedColor(Color.fromRGB_HEX(themeColor ? themeColor : "#0d6efd"));
    this.color.setOpacityVisible(false);
    this.color.addChangeListener(event => this.onchangeColor());
    this.add(this.color, new GBC(2, 1).f(GBC.HORIZONTAL).i(0, 5, 0, 5));
    Z4UI.addVLine(this, new GBC(3, 0).h(3).wy(1).a(GBC.EAST).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(this, Z4Translations.HISTORY_MANAGEMENT, new GBC(4, 0).a(GBC.WEST).i(5, 5, 2, 0));
    let selectedHistoryManagement = null;
    let z4historyManagement = localStorage.getItem("z4historymanagement");
    switch(z4historyManagement) {
      case "standard":
      case "timer":
      case "manual":
      case "tool":
        selectedHistoryManagement = new KeyValue(z4historyManagement, Z4Translations[z4historyManagement.toUpperCase() + "_POLICY"]);
        break;
      default:
        selectedHistoryManagement = new KeyValue("standard", Z4Translations.STANDARD_POLICY);
        break;
    }
    let historyManagementModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    historyManagementModelAndRenderer.addElement(new KeyValue("standard", Z4Translations.STANDARD_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue("timer", Z4Translations.TIMER_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue("manual", Z4Translations.MANUAL_POLICY));
    historyManagementModelAndRenderer.addElement(new KeyValue("tool", Z4Translations.TOOL_POLICY));
    this.historyManagement.getStyle().minWidth = "18rem";
    this.historyManagement.setModelAndRenderer(historyManagementModelAndRenderer);
    this.historyManagement.setSelectedItem(selectedHistoryManagement);
    this.historyManagement.addActionListener(event => this.onchangeHistoryManagementSettings());
    this.add(this.historyManagement, new GBC(4, 1).a(GBC.WEST).i(0, 5, 0, 5));
    this.historyManagementDescription.setText(Z4Translations[selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"]);
    this.add(this.historyManagementDescription, new GBC(4, 2).w(3).wx(1).a(GBC.NORTHWEST).i(5, 0, 0, 0));
    Z4UI.addLabel(this, Z4Translations.SAVING_DELAY, new GBC(5, 0).a(GBC.WEST).i(5, 5, 2, 0));
    let savingDelayValue = parseInt(localStorage.getItem("z4savingdelay"));
    savingDelayValue = savingDelayValue ? savingDelayValue : 1000;
    let savingDelayString = savingDelayValue < 1000 ? savingDelayValue + "ms" : (savingDelayValue / 1000 + "s");
    let selectedSavingDelay = new KeyValue(savingDelayValue, savingDelayString);
    let savingDelayModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    savingDelayModelAndRenderer.addElement(new KeyValue(100, "100ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue(200, "200ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue(500, "500ms"));
    savingDelayModelAndRenderer.addElement(new KeyValue(1000, "1s"));
    savingDelayModelAndRenderer.addElement(new KeyValue(2000, "2s"));
    savingDelayModelAndRenderer.addElement(new KeyValue(5000, "5s"));
    this.savingDelay.getStyle().minWidth = "6rem";
    this.savingDelay.setEnabled(selectedHistoryManagement.key === "standard");
    this.savingDelay.setModelAndRenderer(savingDelayModelAndRenderer);
    this.savingDelay.setSelectedItem(selectedSavingDelay);
    this.savingDelay.addActionListener(event => this.onchangeHistoryManagementSettings());
    this.add(this.savingDelay, new GBC(5, 1).a(GBC.WEST).i(0, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.SAVING_INTERVAL, new GBC(6, 0).a(GBC.WEST).i(5, 5, 2, 0));
    let savingIntervalValue = parseInt(localStorage.getItem("z4savinginterval"));
    savingIntervalValue = savingIntervalValue ? savingIntervalValue : 60000;
    let savingIntervalString = savingIntervalValue < 60000 ? savingIntervalValue / 1000 + "s" : (savingIntervalValue / 60000 + "min");
    let selectedSavingInterval = new KeyValue(savingIntervalValue, savingIntervalString);
    let savingIntervalModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    savingIntervalModelAndRenderer.addElement(new KeyValue(10000, "10s"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(30000, "30s"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000, "1m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000 * 2, "2m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000 * 3, "3m"));
    savingIntervalModelAndRenderer.addElement(new KeyValue(60000 * 5, "5m"));
    this.savingInterval.getStyle().minWidth = "6rem";
    this.savingInterval.setEnabled(selectedHistoryManagement.key === "timer");
    this.savingInterval.setModelAndRenderer(savingIntervalModelAndRenderer);
    this.savingInterval.setSelectedItem(selectedSavingInterval);
    this.savingInterval.addActionListener(event => this.onchangeHistoryManagementSettings());
    this.add(this.savingInterval, new GBC(6, 1).a(GBC.WEST).i(0, 5, 0, 0));
    Z4UI.addVLine(this, new GBC(7, 0).h(3).wy(1).a(GBC.EAST).f(GBC.VERTICAL).i(1, 2, 1, 2));
    let reset = new JSButton();
    reset.setText(Z4Translations.RESET);
    reset.setContentAreaFilled(false);
    reset.addActionListener(event => this.onreset());
    this.add(reset, new GBC(8, 1).a(GBC.BOTH).i(0, 5, 0, 5));
  }

   onchangeLanguage() {
    localStorage.setItem("z4language", (this.language.getSelectedItem()).key);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.LANGUAGE, JSOptionPane.INFORMATION_MESSAGE, null);
  }

   onchangeTheme() {
    localStorage.setItem("z4theme", (this.theme.getSelectedItem()).key);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.THEME, JSOptionPane.INFORMATION_MESSAGE, null);
  }

   onchangeColor() {
    if (!this.color.getValueIsAdjusting()) {
      localStorage.setItem("z4color", this.color.getSelectedColor().getRGB_HEX());
      JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.THEME_COLOR, JSOptionPane.INFORMATION_MESSAGE, null);
    }
  }

   onchangeHistoryManagementSettings() {
    let selectedHistoryManagement = this.historyManagement.getSelectedItem();
    localStorage.setItem("z4historymanagement", selectedHistoryManagement.key);
    this.historyManagementDescription.setText(Z4Translations[selectedHistoryManagement.key.toUpperCase() + "_POLICY_DESCRIPTION"]);
    let selectedSavingDelay = this.savingDelay.getSelectedItem();
    localStorage.setItem("z4savingdelay", "" + selectedSavingDelay.key);
    let selectedSavingInterval = this.savingInterval.getSelectedItem();
    localStorage.setItem("z4savinginterval", "" + selectedSavingInterval.key);
    this.savingDelay.setEnabled(selectedHistoryManagement.key === "standard");
    this.savingInterval.setEnabled(selectedHistoryManagement.key === "timer");
    this.historyPanel.setHistoryManagementSettings(selectedHistoryManagement.key, selectedSavingDelay.key, selectedSavingInterval.key);
  }

   onreset() {
    localStorage.removeItem("z4language");
    localStorage.removeItem("z4theme");
    localStorage.removeItem("z4color");
    localStorage.removeItem("z4historymanagement");
    localStorage.removeItem("z4savingdelay");
    localStorage.removeItem("z4savinginterval");
    this.historyManagement.setSelectedItem(new KeyValue("standard", Z4Translations.STANDARD_POLICY));
    this.historyManagementDescription.setText(Z4Translations.STANDARD_POLICY_DESCRIPTION);
    this.savingDelay.setSelectedItem(new KeyValue(1000, "1s"));
    this.savingDelay.setEnabled(true);
    this.savingInterval.setSelectedItem(new KeyValue(60000, "1min"));
    this.savingInterval.setEnabled(false);
    this.historyPanel.setHistoryManagementSettings("standard", 1000, 60000);
    JSOptionPane.showMessageDialog(Z4Translations.REFRESH_PAGE_MESSAGE, Z4Translations.RESET, JSOptionPane.INFORMATION_MESSAGE, null);
  }

  /**
   * Sets the history panel
   *
   * @param historyPanel The history panel
   */
   setHistoryPanel(historyPanel) {
    this.historyPanel = historyPanel;
    let selectedHistoryManagement = this.historyManagement.getSelectedItem();
    let selectedSavingDelay = this.savingDelay.getSelectedItem();
    let selectedSavingInterval = this.savingInterval.getSelectedItem();
    this.historyPanel.setHistoryManagementSettings(selectedHistoryManagement.key, selectedSavingDelay.key, selectedSavingInterval.key);
  }
}
/**
 * The abstract panel of all panels able to manage a "value"
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
class Z4AbstractValuePanel extends JSPanel {

  /**
   * The value
   */
   value = null;

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4abstractvaluepanel");
  }

  /**
   * Sets the value
   *
   * @param value The value
   */
   setValue(value) {
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.value;
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * to call to invoke a change event
   */
   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
/**
 * The panel to manage a bigradient color
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColorPanel extends Z4AbstractValuePanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   biRippleSpinner = new JSSpinner();

   biRippleSlider = new JSSlider();

   rippleSpinner = new JSSpinner();

   rippleSlider = new JSSlider();

   colorPanel = new Z4ColorPanel();

   biDelete = new JSButton();

   delete = new JSButton();

   space = null;

   time = null;

   biSelectedIndex = 0;

   selectedIndex = 0;

   pressed = false;

   valueIsAdjusting = false;

   width = Z4BiGradientColorPanel.SIZE;

   height = Z4BiGradientColorPanel.SIZE;

  static  SELECTOR_RADIUS = 7;

  static  SIZE = 200;

  static  TOLERANCE = 0.1;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4bigradientcolorpanel");
    this.setLayout(new GridBagLayout());
    this.add(new JSLabel(), new GBC(0, 0).w(3).wy(1));
    this.space = Z4UI.addLabel(this, Z4Translations.SPACE, new GBC(1, 1).w(2).a(GBC.SOUTHEAST));
    this.time = Z4UI.addLabel(this, Z4Translations.TIME, new GBC(0, 2).wh(3, 2).a(GBC.SOUTHEAST));
    this.time.cssAddClass("jslabel-vertical");
    this.preview.setProperty("width", "" + this.width);
    this.preview.setProperty("height", "" + this.height);
    this.preview.addEventListener("mouseenter", event => this.onMouse(event, "enter"));
    this.preview.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.add(this.preview, new GBC(1, 2).wh(2, 2));
    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(3, 3).h(2).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.biRippleSpinner.cssAddClass("jsspinner-vertical");
    this.biRippleSpinner.cssAddClass("jsspinner_h_4rem");
    this.biRippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.biRippleSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.biRippleSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.biRippleSpinner.addChangeListener(event => this.onRippleChange(true, this.biRippleSpinner.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.add(this.biRippleSpinner, new GBC(3, 0).h(3).a(GBC.NORTHEAST).i(0, 5, 0, 0));
    this.biRippleSlider.setValue(0);
    this.biRippleSlider.setOrientation(JSSlider.VERTICAL);
    this.biRippleSlider.setInverted(true);
    this.biRippleSlider.getStyle().minHeight = "20rem";
    this.biRippleSlider.getStyle().minWidth = "1.5rem";
    this.biRippleSlider.addChangeListener(event => this.onRippleChange(false, this.biRippleSlider.getValueIsAdjusting(), this.biRippleSpinner, this.biRippleSlider, true));
    this.add(this.biRippleSlider, new GBC(4, 0).h(5).a(GBC.EAST));
    let panel = new JSPanel();
    panel.cssAddClass("jspanel-vertical");
    this.add(panel, new GBC(5, 0).h(5).a(GBC.NORTH).f(GBC.BOTH));
    let button = new JSButton();
    button.cssAddClass("jsbutton-vertical");
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      this.value.mirror();
      this.afterOperation(this.value.getColorAtIndex(this.biSelectedIndex));
      this.onchange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.cssAddClass("jsbutton-vertical");
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      this.value.reverse();
      this.drawPreview(false);
      this.onchange();
    });
    panel.add(button, null);
    this.biDelete.cssAddClass("jsbutton-vertical");
    this.biDelete.setText(Z4Translations.DELETE);
    this.biDelete.setEnabled(false);
    this.biDelete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.value.removeColor(this.value.getColorPositionAtIndex(this.biSelectedIndex));
        this.biSelectedIndex = 0;
        this.afterOperation(this.value.getColorAtIndex(this.biSelectedIndex));
        this.onchange();
      }
    }));
    panel.add(this.biDelete, null);
    this.add(new JSLabel(), new GBC(0, 4).w(3).wy(1));
    Z4UI.addHLine(this, new GBC(0, 5).w(6).a(GBC.WEST).f(GBC.HORIZONTAL).i(2, 1, 2, 1));
    this.colorPanel.addChangeListener(event => {
      let gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
      gradientColor.addColor(this.colorPanel.getValue(), gradientColor.getColorPositionAtIndex(this.selectedIndex));
      this.drawPreview(false);
      this.onchange();
    });
    this.add(this.colorPanel, new GBC(0, 6).w(4).wx(1).f(GBC.HORIZONTAL));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        let gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
        gradientColor.removeColor(gradientColor.getColorPositionAtIndex(this.selectedIndex));
        this.selectedIndex = 0;
        this.afterOperation(gradientColor);
        this.onchange();
      }
    }));
    this.add(this.delete, new GBC(4, 6).w(2).a(GBC.EAST).i(0, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(0, 7).w(2).a(GBC.WEST));
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.addChangeListener(event => this.onRippleChange(true, this.rippleSpinner.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.add(this.rippleSpinner, new GBC(3, 7).w(3).a(GBC.EAST).i(5, 0, 0, 0));
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event => this.onRippleChange(false, this.rippleSlider.getValueIsAdjusting(), this.rippleSpinner, this.rippleSlider, false));
    this.add(this.rippleSlider, new GBC(0, 8).w(6).a(GBC.NORTH).f(GBC.HORIZONTAL));
    panel = new JSPanel();
    this.add(panel, new GBC(0, 9).w(5).a(GBC.NORTH).f(GBC.HORIZONTAL));
    button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      let gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
      gradientColor.mirror();
      this.afterOperation(gradientColor);
      this.onchange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      let gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
      gradientColor.reverse();
      this.afterOperation(gradientColor);
      this.onchange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.cssAddClass("z4bigradientcolorpanel-history");
    button.setIcon(new Z4EmptyImageProducer(""));
    button.setTooltip(Z4Translations.HISTORY);
    button.addActionListener(event => this.showHistory());
    this.add(button, new GBC(5, 9).a(GBC.EAST));
    this.setValue(new Z4BiGradientColor());
  }

   onMouse(event, type) {
    switch(type) {
      case "enter":
        break;
      case "down":
        for (let biIndex = 0; biIndex < this.value.getColorCount(); biIndex++) {
          let biPosition = this.value.getColorPositionAtIndex(biIndex);
          let gradientColor = this.value.getColorAtIndex(biIndex);
          for (let index = 0; index < gradientColor.getColorCount(); index++) {
            let position = gradientColor.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * this.width, biPosition * this.height, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
              this.pressed = true;
              this.biSelectedIndex = biIndex;
              this.selectedIndex = index;
              this.afterOperation(gradientColor);
            }
          }
        }
        if (!this.pressed && !this.value.isPositionOccupied(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE)) {
          let gradientColor = this.value.getColorAt(event.offsetY / this.height, false);
          while (gradientColor.getColorCount() > 2) {
            gradientColor.removeColor(gradientColor.getColorPositionAtIndex(1));
          }
          if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
            gradientColor.addColor(gradientColor.getColorAt(event.offsetX / this.width, false), event.offsetX / this.width);
          }
          gradientColor.mergeOverlapping(Z4BiGradientColorPanel.TOLERANCE);
          this.value.addColor(gradientColor, event.offsetY / this.height);
          this.pressed = true;
          this.setPointer(event, true);
          this.onchange();
        }
        if (!this.pressed) {
          let biPosition = this.value.getPosition(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE);
          let gradientColor = this.value.getColorAt(biPosition, false);
          if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
            gradientColor.addColor(gradientColor.getColorAt(event.offsetX / this.width, false), event.offsetX / this.width);
            this.setPointer(event, true);
          }
        }
        break;
      case "move":
        if (this.pressed) {
          let biPosition = this.value.getColorPositionAtIndex(this.biSelectedIndex);
          let biPositionBefore = this.value.getColorPositionAtIndex(this.biSelectedIndex - 1);
          let biPositionAfter = this.value.getColorPositionAtIndex(this.biSelectedIndex + 1);
          let newBiPosition = event.offsetY / this.height;
          let gradientColor = this.value.getColorAtIndex(this.biSelectedIndex);
          let position = gradientColor.getColorPositionAtIndex(this.selectedIndex);
          let positionBefore = gradientColor.getColorPositionAtIndex(this.selectedIndex - 1);
          let positionAfter = gradientColor.getColorPositionAtIndex(this.selectedIndex + 1);
          let newPosition = event.offsetX / this.width;
          if (this.biSelectedIndex !== 0 && this.biSelectedIndex !== this.value.getColorCount() - 1 && biPositionBefore < newBiPosition - Z4BiGradientColorPanel.TOLERANCE && biPositionAfter > newBiPosition + Z4BiGradientColorPanel.TOLERANCE) {
            this.value.removeColor(biPosition);
            this.value.addColor(gradientColor, newBiPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.onchange();
          }
          if (this.selectedIndex !== 0 && this.selectedIndex !== gradientColor.getColorCount() - 1 && positionBefore < newPosition - Z4BiGradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4BiGradientColorPanel.TOLERANCE) {
            let color = gradientColor.getColorAtIndex(this.selectedIndex);
            gradientColor.removeColor(position);
            gradientColor.addColor(color, newPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.onchange();
          }
        } else {
          this.preview.getStyle().cursor = "default";
          this.setPointer(event, false);
          if (this.preview.getStyle().cursor === "default" && !this.value.isPositionOccupied(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE)) {
            this.preview.getStyle().cursor = "copy";
          }
          if (this.preview.getStyle().cursor === "default") {
            let biPosition = this.value.getPosition(event.offsetY / this.height, Z4BiGradientColorPanel.TOLERANCE);
            let gradientColor = this.value.getColorAt(biPosition, false);
            if (!gradientColor.isPositionOccupied(event.offsetX / this.width, Z4BiGradientColorPanel.TOLERANCE)) {
              this.preview.getStyle().cursor = "copy";
            }
          }
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        this.valueIsAdjusting = false;
        this.onchange();
        break;
      case "leave":
        if (this.pressed) {
          this.pressed = false;
          this.drawPreview(false);
          this.valueIsAdjusting = false;
          this.onchange();
        }
        break;
    }
  }

   setPointer(event, setOther) {
    for (let biIndex = 0; biIndex < this.value.getColorCount(); biIndex++) {
      let biPosition = this.value.getColorPositionAtIndex(biIndex);
      let gradientColor = this.value.getColorAtIndex(biIndex);
      for (let index = 0; index < gradientColor.getColorCount(); index++) {
        let position = gradientColor.getColorPositionAtIndex(index);
        if (Z4Math.distance(position * this.width, biPosition * this.height, event.offsetX, event.offsetY) <= Z4BiGradientColorPanel.SELECTOR_RADIUS) {
          if (setOther) {
            this.biSelectedIndex = biIndex;
            this.selectedIndex = index;
            this.afterOperation(gradientColor);
          }
          this.preview.getStyle().cursor = "pointer";
        }
      }
    }
  }

   onRippleChange(spTosl, adjusting, spinner, slider, isBi) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    if (isBi) {
      this.value.setRipple(slider.getValue() / 100);
    } else {
      this.value.setGradientRipple(slider.getValue() / 100);
    }
    this.drawPreview(adjusting);
    this.valueIsAdjusting = adjusting;
    this.onchange();
  }

   afterOperation(gradientColor) {
    this.colorPanel.setValue(this.value.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex));
    this.biDelete.setEnabled(this.biSelectedIndex !== 0 && this.biSelectedIndex !== this.value.getColorCount() - 1);
    this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== gradientColor.getColorCount() - 1);
    this.drawPreview(false);
  }

   showHistory() {
    let scrollPanel = new JSPanel();
    scrollPanel.cssAddClass("z4bigradientcolorpanel-scrollpanel");
    scrollPanel.getStyle().height = ((Z4BiGradientColorPanel.SIZE / 2 + 6) * 4 + 5) + "px";
    let historyPanel = new JSPanel();
    historyPanel.setLayout(new GridBagLayout());
    historyPanel.cssAddClass("z4bigradientcolorpanel-historypanel");
    scrollPanel.add(historyPanel, null);
    let radios = new Array();
    let previews = new Array();
    let buttonGroup = new ButtonGroup();
    Z4BiGradientColor.getHistory().forEach((gradientColor, index, array) => {
      let radio = new JSRadioButton();
      buttonGroup.add(radio);
      radios.push(radio);
      let previewHistory = new JSComponent(document.createElement("canvas"));
      previewHistory.setProperty("width", "" + Z4BiGradientColorPanel.SIZE / 2);
      previewHistory.setProperty("height", "" + Z4BiGradientColorPanel.SIZE / 2);
      previewHistory.getStyle().width = Z4BiGradientColorPanel.SIZE / 2 + "px";
      previewHistory.getStyle().height = Z4BiGradientColorPanel.SIZE / 2 + "px";
      previews.push(previewHistory);
      this.putImageData(previewHistory.invoke("getContext('2d')"), gradientColor, Z4BiGradientColorPanel.SIZE / 2, Z4BiGradientColorPanel.SIZE / 2);
      historyPanel.add(radio, new GBC((index % 4) * 2, parseInt(index / 4)));
      historyPanel.add(previewHistory, new GBC((index % 4) * 2 + 1, parseInt(index / 4)).wx(1).a(GBC.WEST).i(2, 0, 2, 20));
    });
    JSOptionPane.showInputDialog(scrollPanel, Z4Translations.HISTORY, listener => {
      radios.forEach(radio => radio.addActionListener(event => listener(new ChangeEvent())));
      previews.forEach((previewHistory, index, array) => previewHistory.addEventListener("mousedown", event => {
        radios[index].setSelected(true);
        listener(new ChangeEvent());
      }));
      previews.forEach((previewHistory, index, array) => previewHistory.addEventListener("dblclick", event => {
        radios[index].setSelected(true);
        listener(new ChangeEvent());
        ((document.querySelector(".z4bigradientcolorpanel-historypanel")).closest(".jsdialog").querySelector(".jsoptionpane-option-0")).click();
      }));
    }, () => radios.some((radio, index, array) => radio.isSelected()), response => {
      if (response === JSOptionPane.OK_OPTION) {
        this.setValue(Z4BiGradientColor.getHistory()[radios.findIndex(radio => radio.isSelected())]);
      }
    });
  }

   drawPreview(adjusting) {
    if (this.width > 0 && this.height > 0) {
      this.putImageData(this.ctx, this.value, this.width, this.height);
      for (let biIndex = 0; biIndex < this.value.getColorCount(); biIndex++) {
        let biPosition = this.value.getColorPositionAtIndex(biIndex);
        let gradientColor = this.value.getColorAtIndex(biIndex);
        for (let index = 0; index < gradientColor.getColorCount(); index++) {
          this.drawCircle(biPosition, gradientColor.getColorPositionAtIndex(index), biIndex, index);
        }
      }
    }
  }

   putImageData(ctx, bigradientColor, width, height) {
    let imageData = ctx.createImageData(width, height);
    let data = imageData.data;
    for (let y = 0; y < height; y++) {
      let gradientColor = bigradientColor.getColorAt(y / height, true);
      for (let x = 0; x < width; x++) {
        let color = gradientColor.getColorAt(x / width, true);
        let index = (y * width + x) * 4;
        data[index] = color.red;
        data[index + 1] = color.green;
        data[index + 2] = color.blue;
        data[index + 3] = color.alpha;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

   drawCircle(biPosition, position, biIndex, index) {
    this.ctx.lineWidth = 3;
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * this.width, biPosition * this.height, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.getStyle(biIndex === this.biSelectedIndex && index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * this.width, biPosition * this.height, Z4BiGradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.getStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Sets the visibility of the space and time labels
   *
   * @param b true to show the space and time labels, false otherwise
   */
   setSpaceTimeLabelsVisible(b) {
    this.space.getStyle().visibility = b ? "visible" : "hidden";
    this.time.getStyle().visibility = b ? "visible" : "hidden";
  }

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
   setSize(width, height) {
    let ratio = width / height;
    this.width = parseInt(ratio > 1 ? Z4BiGradientColorPanel.SIZE : Z4BiGradientColorPanel.SIZE * ratio);
    this.height = parseInt(ratio > 1 ? Z4BiGradientColorPanel.SIZE / ratio : Z4BiGradientColorPanel.SIZE);
    this.preview.setProperty("width", "" + this.width);
    this.preview.setProperty("height", "" + this.height);
    this.drawPreview(false);
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   getValue() {
    return Z4BiGradientColor.fromJSON(this.value.toJSON());
  }

   setValue(value) {
    this.value = Z4BiGradientColor.fromJSON(value.toJSON());
    this.colorPanel.setValue(this.value.getColorAtIndex(this.biSelectedIndex).getColorAtIndex(this.selectedIndex));
    this.drawPreview(false);
  }
}
/**
 * The panale to manage a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorPanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   colorPreview = new JSColorPreview();

   edit = new JSButton();

   opacityVisible = true;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4colorpanel");
    this.setLayout(new GridBagLayout());
    this.add(this.label, new GBC(0, 0).w(2).a(GBC.WEST));
    this.add(this.colorPreview, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL));
    this.edit.setText(Z4Translations.EDIT);
    this.edit.addActionListener(event => {
      JSColorChooser.showDialog(Z4Translations.COLOR, this.value, this.opacityVisible, null, c => {
        this.setValue(c);
        this.onchange();
      });
    });
    this.add(this.edit, new GBC(1, 1).i(0, 5, 0, 0));
    this.setValue(new Color(0, 0, 0, 255));
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.label.setText(label);
  }

   setValue(value) {
    this.value = value;
    this.colorPreview.setColor(value);
    let rgb = new Array();
    let hsl = new Array();
    rgb[0] = value.red;
    rgb[1] = value.green;
    rgb[2] = value.blue;
    Color.RGBtoHSL(rgb, hsl);
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.edit.setEnabled(b);
  }

  /**
   * Sets the visibility of the edit button
   *
   * @param b true to show the edit button, false otherwise
   */
   setEditButtonVisible(b) {
    this.edit.getStyle().display = b ? "flex" : "none";
  }

  /**
   * Sets the visibility of the opacity selector
   *
   * @param b true to show the opacity selector, false otherwise
   */
   setOpacityVisible(b) {
    this.opacityVisible = b;
  }
}
/**
 * The panel to manage the progression of a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgressionPanel extends Z4AbstractValuePanel {

   lightingPanel = new Z4LightingPanel(Z4LightingPanelOrientation.HORIZONTAL);

   radios = new Array();

   temporalStepSlider = new JSSlider();

   temporalStepSpinner = new JSSpinner();

   resetOnStartMoving = new JSToggleButton();

   enabled = true;

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4colorprogressionpanel");
    this.setLayout(new GridBagLayout());
    let panel = new JSPanel();
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(2).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.X_AXIS));
      this.add(panel, new GBC(2, 0).a(GBC.EAST));
      this.addRadio(Z4ColorProgressionBehavior.SPATIAL, panel, buttonGroup, "left");
      this.addRadio(Z4ColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerh");
      this.addRadio(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerh");
      this.addRadio(Z4ColorProgressionBehavior.RANDOM, panel, buttonGroup, "right");
      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(0, 1).w(2).a(GBC.WEST));
      this.add(this.temporalStepSpinner, new GBC(2, 1).a(GBC.EAST).i(1, 0, 0, 0));
      this.add(this.temporalStepSlider, new GBC(0, 2).w(3));
      this.add(this.resetOnStartMoving, new GBC(0, 3).a(GBC.WEST).wx(1));
      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(1, 3).a(GBC.EAST).i(0, 0, 0, 2));
      this.add(this.lightingPanel, new GBC(2, 3).a(GBC.EAST));
    } else if (orientation === Z4ColorProgressionPanelOrientation.VERTICALLY_COMPACT) {
      Z4UI.addLabel(this, Z4Translations.FILLING, new GBC(0, 0).w(4).a(GBC.WEST));
      panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
      this.add(panel, new GBC(0, 1).h(3).i(0, 0, 0, 1));
      this.addRadio(Z4ColorProgressionBehavior.SPATIAL, panel, buttonGroup, "top");
      this.addRadio(Z4ColorProgressionBehavior.TEMPORAL, panel, buttonGroup, "centerv");
      this.addRadio(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, panel, buttonGroup, "centerv");
      this.addRadio(Z4ColorProgressionBehavior.RANDOM, panel, buttonGroup, "bottom");
      Z4UI.addLabel(this, Z4Translations.STEP, new GBC(1, 1).w(2).a(GBC.WEST));
      this.add(this.temporalStepSpinner, new GBC(3, 1).a(GBC.EAST));
      this.add(this.temporalStepSlider, new GBC(1, 2).w(3));
      this.add(this.resetOnStartMoving, new GBC(1, 3).a(GBC.WEST).wx(1));
      Z4UI.addLabel(this, Z4Translations.LIGHTING, new GBC(2, 3).a(GBC.EAST).i(0, 0, 0, 2));
      this.add(this.lightingPanel, new GBC(3, 3).a(GBC.EAST));
    }
    this.temporalStepSpinner.setModel(new SpinnerNumberModel(1, 1, 100, 1));
    this.temporalStepSpinner.cssAddClass("jsspinner_w_4rem");
    this.temporalStepSpinner.addChangeListener(event => this.onTemporalStepChange(true, this.temporalStepSpinner.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.temporalStepSlider.setMinimum(1);
    this.temporalStepSlider.setMaximum(100);
    this.temporalStepSlider.setValue(1);
    this.temporalStepSlider.getStyle().minWidth = "20rem";
    this.temporalStepSlider.addChangeListener(event => this.onTemporalStepChange(false, this.temporalStepSlider.getValueIsAdjusting(), this.temporalStepSpinner, this.temporalStepSlider));
    this.resetOnStartMoving.setContentAreaFilled(false);
    this.resetOnStartMoving.cssAddClass("z4colorprogressionpanel-toggle");
    this.resetOnStartMoving.getStyle().padding = "1px";
    this.resetOnStartMoving.setTooltip(Z4Translations.RESET_ON_START_MOVING);
    this.resetOnStartMoving.setIcon(new Z4EmptyImageProducer(""));
    this.resetOnStartMoving.addActionListener(event => {
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });
    this.lightingPanel.addChangeListener(event => {
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });
    this.setValue(new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0.1, false, Z4Lighting.NONE));
    this.setProgressionSettings(Z4PointIteratorType.STAMPER, null, true, false, false);
  }

   addRadio(behavior, panel, buttonGroup, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4colorprogressionpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.temporalStepSpinner.setEnabled(behavior === Z4ColorProgressionBehavior.TEMPORAL);
      this.temporalStepSlider.setEnabled(behavior === Z4ColorProgressionBehavior.TEMPORAL);
      this.valueIsAdjusting = false;
      this.onProgressionChange();
    });
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerh":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      case "top":
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerv":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottom":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    panel.add(radio, null);
  }

   onTemporalStepChange(spTosl, adjusting, spinner, slider) {
    if (spTosl) {
      slider.setValue(spinner.getValue());
    } else {
      spinner.setValue(slider.getValue());
    }
    this.valueIsAdjusting = adjusting;
    this.onProgressionChange();
  }

   onProgressionChange() {
    this.resetOnStartMoving.setContentAreaFilled(this.resetOnStartMoving.isSelected());
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "SPATIAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
            break;
          case "TEMPORAL":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
            break;
          case "RANDOM":
            this.value = new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, this.temporalStepSlider.getValue() / 100, this.resetOnStartMoving.isSelected(), this.lightingPanel.getValue());
            break;
        }
      }
    });
    this.onchange();
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the progression settings
   *
   * @param type The point iterator type
   * @param options Options relative to the point iterator
   * @param isColor true if the color is a flat color, false otherwise
   * @param isGradientColor true if the color is a gradient color, false
   * otherwise
   * @param isBiGradientColor true if the color is a bigradient color, false
   * otherwise
   */
   setProgressionSettings(type, options, isColor, isGradientColor, isBiGradientColor) {
    if (type === Z4PointIteratorType.AIRBRUSH) {
      Object.keys(this.radios).forEach(key => (this.radios[key]).cssAddClass("z4colorprogressionpanel-airbrush-radio"));
    } else {
      Object.keys(this.radios).forEach(key => (this.radios[key]).cssRemoveClass("z4colorprogressionpanel-airbrush-radio"));
    }
    if (isColor) {
      Object.keys(this.radios).forEach(key => {
        let radio = this.radios[key];
        radio.setContentAreaFilled(false);
        radio.getStyle().visibility = "hidden";
      });
      let spatial = this.radios["" + Z4ColorProgressionBehavior.SPATIAL];
      spatial.setContentAreaFilled(true);
      if (!spatial.isSelected()) {
        spatial.setSelected(true);
        this.onProgressionChange();
      }
    } else if (isGradientColor) {
      Object.keys(this.radios).forEach(key => {
        let radio = this.radios[key];
        radio.setEnabled(this.enabled);
        radio.getStyle().visibility = "visible";
      });
      if (type === Z4PointIteratorType.STAMPER || (type === Z4PointIteratorType.SPIROGRAPH && !options["drawWhileMoving"]) || type === Z4PointIteratorType.SCATTERER) {
        let relative = this.radios["" + Z4ColorProgressionBehavior.RELATIVE_TO_PATH];
        relative.setEnabled(false);
        relative.setContentAreaFilled(false);
        if (relative.isSelected()) {
          (this.radios["" + Z4ColorProgressionBehavior.SPATIAL]).setSelected(true);
          (this.radios["" + Z4ColorProgressionBehavior.SPATIAL]).setContentAreaFilled(true);
          this.onProgressionChange();
        }
      }
    } else if (isBiGradientColor) {
      Object.keys(this.radios).forEach(key => {
        let radio = this.radios[key];
        radio.setEnabled(this.enabled);
        radio.getStyle().visibility = "visible";
      });
      let spatial = this.radios["" + Z4ColorProgressionBehavior.SPATIAL];
      spatial.setEnabled(false);
      spatial.setContentAreaFilled(false);
      let relative = this.radios["" + Z4ColorProgressionBehavior.RELATIVE_TO_PATH];
      if (type === Z4PointIteratorType.STAMPER || (type === Z4PointIteratorType.SPIROGRAPH && options["drawWhileMoving"]) || type === Z4PointIteratorType.SCATTERER) {
        relative.setEnabled(false);
        relative.setContentAreaFilled(false);
      }
      if (spatial.isSelected() || (type === Z4PointIteratorType.STAMPER && relative.isSelected()) || (type === Z4PointIteratorType.SPIROGRAPH && !options["drawWhileMoving"] && relative.isSelected()) || (type === Z4PointIteratorType.SCATTERER && relative.isSelected())) {
        (this.radios["" + Z4ColorProgressionBehavior.TEMPORAL]).setSelected(true);
        (this.radios["" + Z4ColorProgressionBehavior.TEMPORAL]).setContentAreaFilled(true);
        this.temporalStepSpinner.setEnabled(this.enabled);
        this.temporalStepSlider.setEnabled(this.enabled);
        this.onProgressionChange();
      }
    }
  }

   setValue(value) {
    this.value = value;
    this.lightingPanel.setValue(value.getLighting());
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getColorProgressionBehavior()]).setSelected(true);
    (this.radios["" + value.getColorProgressionBehavior()]).setContentAreaFilled(true);
    this.temporalStepSpinner.setValue(value.getTemporalStepProgression() * 100);
    this.temporalStepSpinner.setEnabled(value.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL);
    this.temporalStepSlider.setValue(parseInt(value.getTemporalStepProgression() * 100));
    this.temporalStepSlider.setEnabled(value.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL);
    this.resetOnStartMoving.setSelected(value.isResetOnStartMoving());
    this.resetOnStartMoving.setContentAreaFilled(value.isResetOnStartMoving());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.enabled = b;
    this.resetOnStartMoving.setEnabled(b);
    this.lightingPanel.setEnabled(b);
    Object.keys(this.radios).forEach(key => {
      let radio = this.radios[key];
      radio.setEnabled(b);
      if (radio.isSelected()) {
        this.temporalStepSpinner.setEnabled(b && ("" + key) !== ("" + Z4ColorProgressionBehavior.TEMPORAL));
        this.temporalStepSlider.setEnabled(b && ("" + key) !== ("" + Z4ColorProgressionBehavior.TEMPORAL));
      }
    });
  }
}
/**
 * The panel to manage a gradient color
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColorPanel extends Z4AbstractValuePanel {

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   rippleSpinner = new JSSpinner();

   rippleSlider = new JSSlider();

   colorPanel = new Z4ColorPanel();

   delete = new JSButton();

   selectedIndex = 0;

   pressed = false;

   valueIsAdjusting = false;

  static  SELECTOR_RADIUS = 7;

  static  WIDTH = 200;

  static  HEIGHT = 50;

  static  TOLERANCE = 0.1;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4gradientcolorpanel");
    this.setLayout(new GridBagLayout());
    this.preview.setProperty("width", "" + Z4GradientColorPanel.WIDTH);
    this.preview.setProperty("height", "" + Z4GradientColorPanel.HEIGHT);
    this.preview.addEventListener("mouseenter", event => this.onMouse(event, "enter"));
    this.preview.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    this.preview.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.preview.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.preview.addEventListener("mouseup", event => this.onMouse(event, "up"));
    this.add(this.preview, new GBC(0, 0).w(3).i(0, 0, 5, 0));
    this.colorPanel.addChangeListener(event => {
      this.value.addColor(this.colorPanel.getValue(), this.value.getColorPositionAtIndex(this.selectedIndex));
      this.drawPreview(false);
      this.onchange();
    });
    this.add(this.colorPanel, new GBC(0, 1).w(2).wx(1).f(GBC.HORIZONTAL));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_COLOR_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.value.removeColor(this.value.getColorPositionAtIndex(this.selectedIndex));
        this.selectedIndex = 0;
        this.afterOperation();
        this.onchange();
      }
    }));
    this.add(this.delete, new GBC(2, 1).a(GBC.WEST).i(0, 5, 0, 0));
    Z4UI.addLabel(this, Z4Translations.RIPPLE, new GBC(0, 2).a(GBC.WEST));
    this.rippleSpinner.cssAddClass("jsspinner_w_4rem");
    this.rippleSpinner.setModel(new SpinnerNumberModel(0, 0, 100, 1));
    this.rippleSpinner.addChangeListener(event => this.onRippleChange(true, this.rippleSpinner.getValueIsAdjusting()));
    this.add(this.rippleSpinner, new GBC(1, 2).w(2).a(GBC.EAST).i(5, 0, 0, 0));
    this.rippleSlider.setValue(0);
    this.rippleSlider.getStyle().minWidth = "20rem";
    this.rippleSlider.addChangeListener(event => this.onRippleChange(false, this.rippleSlider.getValueIsAdjusting()));
    this.add(this.rippleSlider, new GBC(0, 3).w(3).a(GBC.NORTH).f(GBC.HORIZONTAL));
    let panel = new JSPanel();
    this.add(panel, new GBC(0, 4).w(2).a(GBC.NORTH).f(GBC.HORIZONTAL));
    let button = new JSButton();
    button.setText(Z4Translations.MIRRORED);
    button.addActionListener(event => {
      this.value.mirror();
      this.afterOperation();
      this.onchange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.setText(Z4Translations.INVERTED);
    button.addActionListener(event => {
      this.value.reverse();
      this.drawPreview(false);
      this.onchange();
    });
    panel.add(button, null);
    button = new JSButton();
    button.cssAddClass("z4gradientcolorpanel-history");
    button.setIcon(new Z4EmptyImageProducer(""));
    button.setTooltip(Z4Translations.HISTORY);
    button.addActionListener(event => this.showHistory());
    this.add(button, new GBC(2, 4).a(GBC.EAST));
    this.setValue(new Z4GradientColor());
  }

   onMouse(event, type) {
    switch(type) {
      case "enter":
        break;
      case "down":
        for (let index = 0; index < this.value.getColorCount(); index++) {
          let position = this.value.getColorPositionAtIndex(index);
          if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.pressed = true;
            this.selectedIndex = index;
            this.afterOperation();
          }
        }
        if (!this.pressed && !this.value.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE) && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
          this.value.addColor(this.value.getColorAt(event.offsetX / Z4GradientColorPanel.WIDTH, false), event.offsetX / Z4GradientColorPanel.WIDTH);
          this.pressed = true;
          for (let index = 0; index < this.value.getColorCount(); index++) {
            let position = this.value.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.selectedIndex = index;
              this.afterOperation();
              this.onchange();
            }
          }
          this.preview.getStyle().cursor = "pointer";
        }
        break;
      case "move":
        if (this.pressed) {
          let position = this.value.getColorPositionAtIndex(this.selectedIndex);
          let positionBefore = this.value.getColorPositionAtIndex(this.selectedIndex - 1);
          let positionAfter = this.value.getColorPositionAtIndex(this.selectedIndex + 1);
          let newPosition = event.offsetX / Z4GradientColorPanel.WIDTH;
          if (this.selectedIndex !== 0 && this.selectedIndex !== this.value.getColorCount() - 1 && positionBefore < newPosition - Z4GradientColorPanel.TOLERANCE && positionAfter > newPosition + Z4GradientColorPanel.TOLERANCE) {
            let color = this.value.getColorAtIndex(this.selectedIndex);
            this.value.removeColor(position);
            this.value.addColor(color, newPosition);
            this.drawPreview(true);
            this.valueIsAdjusting = true;
            this.onchange();
          }
        } else {
          this.preview.getStyle().cursor = "default";
          for (let index = 0; index < this.value.getColorCount(); index++) {
            let position = this.value.getColorPositionAtIndex(index);
            if (Z4Math.distance(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, event.offsetX, event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
              this.preview.getStyle().cursor = "pointer";
            }
          }
          if (this.preview.getStyle().cursor === "default" && !this.value.isPositionOccupied(event.offsetX / Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.TOLERANCE) && Math.abs(Z4GradientColorPanel.HEIGHT / 2 - event.offsetY) <= Z4GradientColorPanel.SELECTOR_RADIUS) {
            this.preview.getStyle().cursor = "copy";
          }
        }
        break;
      case "up":
        this.pressed = false;
        this.drawPreview(false);
        this.valueIsAdjusting = false;
        this.onchange();
        break;
      case "leave":
        if (this.pressed) {
          this.pressed = false;
          this.drawPreview(false);
          this.valueIsAdjusting = false;
          this.onchange();
        }
        break;
    }
  }

   onRippleChange(spTosl, adjusting) {
    if (spTosl) {
      this.rippleSlider.setValue(this.rippleSpinner.getValue());
    } else {
      this.rippleSpinner.setValue(this.rippleSlider.getValue());
    }
    this.value.setRipple(this.rippleSlider.getValue() / 100);
    this.drawPreview(adjusting);
    this.valueIsAdjusting = adjusting;
    this.onchange();
  }

   afterOperation() {
    this.colorPanel.setValue(this.value.getColorAtIndex(this.selectedIndex));
    this.delete.setEnabled(this.selectedIndex !== 0 && this.selectedIndex !== this.value.getColorCount() - 1);
    this.drawPreview(false);
  }

   showHistory() {
    let scrollPanel = new JSPanel();
    scrollPanel.cssAddClass("z4gradientcolorpanel-scrollpanel");
    scrollPanel.getStyle().height = ((Z4GradientColorPanel.HEIGHT + 6) * 8 + 5) + "px";
    let historyPanel = new JSPanel();
    historyPanel.setLayout(new GridBagLayout());
    historyPanel.cssAddClass("z4gradientcolorpanel-historypanel");
    scrollPanel.add(historyPanel, null);
    let radios = new Array();
    let previews = new Array();
    let buttonGroup = new ButtonGroup();
    Z4GradientColor.getHistory().forEach((gradientColor, index, array) => {
      let radio = new JSRadioButton();
      buttonGroup.add(radio);
      radios.push(radio);
      let previewHistory = new JSComponent(document.createElement("canvas"));
      previewHistory.setProperty("width", "" + Z4GradientColorPanel.WIDTH);
      previewHistory.setProperty("height", "" + Z4GradientColorPanel.HEIGHT);
      previewHistory.getStyle().height = Z4GradientColorPanel.HEIGHT + "px";
      previews.push(previewHistory);
      this.putImageData(previewHistory.invoke("getContext('2d')"), gradientColor);
      historyPanel.add(radio, new GBC((index % 2) * 2, parseInt(index / 2)));
      historyPanel.add(previewHistory, new GBC((index % 2) * 2 + 1, parseInt(index / 2)).i(2, 0, 2, 20).wx(1).f(GBC.HORIZONTAL));
    });
    JSOptionPane.showInputDialog(scrollPanel, Z4Translations.HISTORY, listener => {
      radios.forEach(radio => radio.addActionListener(event => listener(new ChangeEvent())));
      previews.forEach((previewHistory, index, array) => previewHistory.addEventListener("mousedown", event => {
        radios[index].setSelected(true);
        listener(new ChangeEvent());
      }));
      previews.forEach((previewHistory, index, array) => previewHistory.addEventListener("dblclick", event => {
        radios[index].setSelected(true);
        listener(new ChangeEvent());
        ((document.querySelector(".z4gradientcolorpanel-historypanel")).closest(".jsdialog").querySelector(".jsoptionpane-option-0")).click();
      }));
    }, () => radios.some((radio, index, array) => radio.isSelected()), response => {
      if (response === JSOptionPane.OK_OPTION) {
        this.setValue(Z4GradientColor.getHistory()[radios.findIndex(radio => radio.isSelected())]);
      }
    });
  }

   drawPreview(adjusting) {
    this.putImageData(this.ctx, this.value);
    for (let index = 0; index < this.value.getColorCount(); index++) {
      this.drawCircle(this.value.getColorPositionAtIndex(index), index);
    }
  }

   putImageData(ctx, gradientColor) {
    let imageData = ctx.createImageData(Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT);
    let data = imageData.data;
    for (let x = 0; x < Z4GradientColorPanel.WIDTH; x++) {
      let color = gradientColor.getColorAt(x / Z4GradientColorPanel.WIDTH, true);
      for (let y = 0; y < Z4GradientColorPanel.HEIGHT; y++) {
        let idx = (y * Z4GradientColorPanel.WIDTH + x) * 4;
        data[idx] = color.red;
        data[idx + 1] = color.green;
        data[idx + 2] = color.blue;
        data[idx + 3] = color.alpha;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

   drawCircle(position, index) {
    this.ctx.lineWidth = 3;
    let dash = new Array();
    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.getStyle(index === this.selectedIndex ? "red" : "black");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
    dash.push(2.5, 2.5);
    this.ctx.beginPath();
    this.ctx.arc(position * Z4GradientColorPanel.WIDTH, Z4GradientColorPanel.HEIGHT / 2, Z4GradientColorPanel.SELECTOR_RADIUS, 0, 2 * Math.PI);
    this.ctx.strokeStyle = Z4Constants.getStyle("white");
    this.ctx.setLineDash(dash);
    this.ctx.stroke();
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   getValue() {
    return Z4GradientColor.fromJSON(this.value.toJSON());
  }

   setValue(value) {
    this.value = Z4GradientColor.fromJSON(value.toJSON());
    this.colorPanel.setValue(this.value.getColorAtIndex(this.selectedIndex));
    this.drawPreview(false);
  }
}
/**
 * The panel to manage the lighting of a color
 *
 * @author gianpiero.diblasi
 */
class Z4LightingPanel extends Z4AbstractValuePanel {

   radios = new Array();

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4lightingpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4LightingPanelOrientation.HORIZONTAL) {
      this.addRadio(Z4Lighting.NONE, buttonGroup, 0, 0, "left");
      this.addRadio(Z4Lighting.LIGHTED_IN_OUT, buttonGroup, 1, 0, "centerh");
      this.addRadio(Z4Lighting.LIGHTED_OUT_IN, buttonGroup, 2, 0, "centerh");
      this.addRadio(Z4Lighting.DARKENED_IN_OUT, buttonGroup, 3, 0, "centerh");
      this.addRadio(Z4Lighting.DARKENED_OUT_IN, buttonGroup, 4, 0, "right");
    } else if (orientation === Z4LightingPanelOrientation.VERTICAL) {
      this.addRadio(Z4Lighting.NONE, buttonGroup, 0, 0, "top");
      this.addRadio(Z4Lighting.LIGHTED_IN_OUT, buttonGroup, 0, 1, "centerv");
      this.addRadio(Z4Lighting.LIGHTED_OUT_IN, buttonGroup, 0, 2, "centerv");
      this.addRadio(Z4Lighting.DARKENED_IN_OUT, buttonGroup, 0, 3, "centerv");
      this.addRadio(Z4Lighting.DARKENED_OUT_IN, buttonGroup, 0, 4, "bottom");
    }
    this.setValue(Z4Lighting.NONE);
  }

   addRadio(lighting, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4lightingpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations[("" + lighting).replace("NONE", "NONE_HER").replace("_IN_OUT", "").replace("_OUT_IN", "")]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(lighting));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.value = lighting;
      this.onchange();
    });
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerh":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      case "top":
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerv":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottom":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + lighting] = radio;
    this.add(radio, new GBC(x, y));
  }

   setValue(value) {
    this.value = value;
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value]).setSelected(true);
    (this.radios["" + value]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
  }
}
/**
 * The abstract panel to edit a Z4PointIterator
 *
 * @author gianpiero.diblasi
 * @param <T> The point iterator type
 */
class Z4PointIteratorPanel extends Z4AbstractValuePanel {

  /**
   * The rotation panel
   */
   rotation = new Z4RotationPanel(Z4RotationPanelOrientation.HORIZONTAL);

  /**
   * true if value is adjusting, false otherwise
   */
   valueIsAdjusting = false;

  /**
   * true if the panel is enabled, false otherwise
   */
   enabled = true;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4pointiteratorpanel");
    this.setLayout(new GridBagLayout());
    this.rotation.setLabel(Z4Translations.ROTATION);
    this.rotation.cssAddClass("z4abstractvaluepanel-titled");
    this.rotation.addChangeListener(event => this.onIteratorChange(this.rotation.getValueIsAdjusting()));
  }

  /**
   * The method to call on iterator changes
   *
   * @param valueIsAdjusting true if value is adjusting, false otherwise
   */
   onIteratorChange(valueIsAdjusting) {
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.rotation.setValue(value.getRotation());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.enabled = b;
    this.rotation.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4Airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4AirbrushPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   radiusSpinner = new JSSpinner();

   radiusSlider = new JSSlider();

   speed = new JSSlider();

   speedLabel = new JSLabel();

   gaussianCorrectionSpinner = new JSSpinner();

   gaussianCorrectionSlider = new JSSlider();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4airbrushpanel");
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0).h(6).i(0, 0, 0, 1));
    Z4UI.addLabel(this, Z4Translations.RADIUS, new GBC(1, 0).a(GBC.WEST));
    this.radiusSpinner.cssAddClass("jsspinner_w_4rem");
    this.radiusSpinner.setModel(new SpinnerNumberModel(100, 1, 500, 1));
    this.radiusSpinner.addChangeListener(event => {
      this.radiusSlider.setValue(this.radiusSpinner.getValue());
      this.onIteratorChange(this.radiusSpinner.getValueIsAdjusting());
    });
    this.add(this.radiusSpinner, new GBC(2, 0).a(GBC.EAST));
    this.radiusSlider.setMinimum(1);
    this.radiusSlider.setMaximum(500);
    this.radiusSlider.getStyle().minWidth = "18rem";
    this.radiusSlider.addChangeListener(event => {
      this.radiusSpinner.setValue(this.radiusSlider.getValue());
      this.onIteratorChange(this.radiusSlider.getValueIsAdjusting());
    });
    this.add(this.radiusSlider, new GBC(1, 1).w(2).f(GBC.HORIZONTAL));
    Z4UI.addLabel(this, Z4Translations.GAUSSIAN_CORRECTION, new GBC(1, 2).a(GBC.WEST));
    this.gaussianCorrectionSpinner.cssAddClass("jsspinner_w_4rem");
    this.gaussianCorrectionSpinner.setModel(new SpinnerNumberModel(10, 1, 100, 1));
    this.gaussianCorrectionSpinner.addChangeListener(event => {
      this.gaussianCorrectionSlider.setValue(this.gaussianCorrectionSpinner.getValue());
      this.onIteratorChange(this.gaussianCorrectionSpinner.getValueIsAdjusting());
    });
    this.add(this.gaussianCorrectionSpinner, new GBC(2, 2).a(GBC.EAST));
    this.gaussianCorrectionSlider.setMinimum(1);
    this.gaussianCorrectionSlider.setMaximum(100);
    this.gaussianCorrectionSlider.addChangeListener(event => {
      this.gaussianCorrectionSpinner.setValue(this.gaussianCorrectionSlider.getValue());
      this.onIteratorChange(this.gaussianCorrectionSlider.getValueIsAdjusting());
    });
    this.add(this.gaussianCorrectionSlider, new GBC(1, 3).w(2).f(GBC.HORIZONTAL));
    Z4UI.addLabel(this, Z4Translations.SPEED, new GBC(1, 4).wx(1).a(GBC.WEST));
    this.add(this.speedLabel, new GBC(2, 4));
    this.speed.setMinimum(1);
    this.speed.setMaximum(10);
    this.speed.addChangeListener(event => this.onIteratorChange(this.speed.getValueIsAdjusting()));
    this.add(this.speed, new GBC(1, 5).w(2).f(GBC.HORIZONTAL).wy(1).a(GBC.NORTH));
    this.add(this.rotation, new GBC(3, 0).h(6).a(GBC.NORTH).i(1, 1, 0, 0));
    this.setValue(new Z4Airbrush(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), 100, 5, 10, new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.speedLabel.setText("" + this.speed.getValue());
    this.value = new Z4Airbrush(this.multiplicity.getValue(), this.radiusSlider.getValue(), this.speed.getValue(), this.gaussianCorrectionSlider.getValue(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.radiusSpinner.setValue(value.getRadius());
    this.radiusSlider.setValue(value.getRadius());
    this.speed.setValue(value.getSpeed());
    this.speedLabel.setText("" + value.getSpeed());
    this.gaussianCorrectionSpinner.setValue(value.getGaussianCorrection());
    this.gaussianCorrectionSlider.setValue(value.getGaussianCorrection());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.radiusSpinner.setEnabled(b);
    this.radiusSlider.setEnabled(b);
    this.speed.setEnabled(b);
    this.gaussianCorrectionSpinner.setEnabled(b);
    this.gaussianCorrectionSlider.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4Scatterer
 *
 * @author gianpiero.diblasi
 */
class Z4ScattererPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   scattering = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4scattererpanel");
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0));
    this.scattering.setSignsVisible(false);
    this.scattering.setLabel(Z4Translations.SCATTERING);
    this.scattering.cssAddClass("z4abstractvaluepanel-titled");
    this.scattering.addChangeListener(event => this.onIteratorChange(this.scattering.getValueIsAdjusting()));
    this.add(this.scattering, new GBC(0, 1).i(1, 0, 0, 0));
    this.add(this.rotation, new GBC(1, 0).h(2).a(GBC.NORTH).i(0, 1, 0, 0));
    this.setValue(new Z4Scatterer(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.value = new Z4Scatterer(this.multiplicity.getValue(), this.scattering.getValue(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.scattering.setValue(value.getScattering());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.scattering.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4Spirograph
 *
 * @author gianpiero.diblasi
 */
class Z4SpirographPanel extends Z4PointIteratorPanel {

   drawWhileMoving = new JSCheckBox();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4spirographpanel");
    this.drawWhileMoving.setText(Z4Translations.DRAW_WHILE_MOVING);
    this.drawWhileMoving.addActionListener(event => this.onIteratorChange(false));
    this.add(this.drawWhileMoving, new GBC(0, 0).a(GBC.WEST));
    this.add(this.rotation, new GBC(0, 1));
    this.setValue(new Z4Spirograph(true, new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.value = new Z4Spirograph(this.drawWhileMoving.isSelected(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.drawWhileMoving.setSelected(value.isDrawWhileMoving());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.drawWhileMoving.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4Stamper
 *
 * @author gianpiero.diblasi
 */
class Z4StamperPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4stamperpanel");
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0));
    this.push.setSignsVisible(false);
    this.push.setLabel(Z4Translations.PUSH);
    this.push.cssAddClass("z4abstractvaluepanel-titled");
    this.push.addChangeListener(event => this.onIteratorChange(this.push.getValueIsAdjusting()));
    this.add(this.push, new GBC(0, 1).i(1, 0, 0, 0));
    this.add(this.rotation, new GBC(1, 0).h(2).a(GBC.NORTH).i(0, 1, 0, 0));
    this.setValue(new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.value = new Z4Stamper(this.multiplicity.getValue(), this.push.getValue(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.push.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4Tracer
 *
 * @author gianpiero.diblasi
 */
class Z4TracerPanel extends Z4PointIteratorPanel {

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   push = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   step = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   assistedDrawing = new JSCheckBox();

   attack = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   sustain = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   release = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL);

   endlessSustain = new JSCheckBox();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4tracerpanel");
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.setConstantRange(1, 50);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.addChangeListener(event => this.onIteratorChange(this.multiplicity.getValueIsAdjusting()));
    this.add(this.multiplicity, new GBC(0, 0).i(0, 0, 0, 1));
    this.push.setSignsVisible(false);
    this.push.setLabel(Z4Translations.PUSH);
    this.push.cssAddClass("z4abstractvaluepanel-titled");
    this.push.addChangeListener(event => this.onIteratorChange(this.push.getValueIsAdjusting()));
    this.add(this.push, new GBC(1, 0).i(0, 0, 0, 1));
    this.step.setSignsVisible(false);
    this.step.setConstantRange(1, 50);
    this.step.setLabel(Z4Translations.STEP);
    this.step.cssAddClass("z4abstractvaluepanel-titled");
    this.step.addChangeListener(event => this.onIteratorChange(this.step.getValueIsAdjusting()));
    this.add(this.step, new GBC(2, 0).i(0, 0, 0, 5));
    this.attack.setSignsVisible(false);
    this.attack.setLabel(Z4Translations.ATTACK);
    this.attack.cssAddClass("z4abstractvaluepanel-titled");
    this.attack.addChangeListener(event => this.onIteratorChange(this.attack.getValueIsAdjusting()));
    this.add(this.attack, new GBC(3, 0).i(0, 0, 0, 1));
    this.sustain.setSignsVisible(false);
    this.sustain.setLabel(Z4Translations.SUSTAIN);
    this.sustain.cssAddClass("z4abstractvaluepanel-titled");
    this.sustain.addChangeListener(event => this.onIteratorChange(this.sustain.getValueIsAdjusting()));
    this.sustain.add(this.endlessSustain, new GBC(0, 4).w(3).a(GBC.WEST));
    this.add(this.sustain, new GBC(4, 0).h(2).a(GBC.NORTH).i(0, 0, 0, 1));
    this.endlessSustain.setText(Z4Translations.ENDLESS);
    this.endlessSustain.addActionListener(event => this.onIteratorChange(false));
    this.release.setSignsVisible(false);
    this.release.setLabel(Z4Translations.RELEASE);
    this.release.cssAddClass("z4abstractvaluepanel-titled");
    this.release.addChangeListener(event => this.onIteratorChange(this.release.getValueIsAdjusting()));
    this.add(this.release, new GBC(5, 0));
    this.assistedDrawing.setText(Z4Translations.ASSISTED_DRAWING);
    this.assistedDrawing.addActionListener(event => this.onIteratorChange(false));
    this.add(this.assistedDrawing, new GBC(3, 1).a(GBC.NORTHWEST));
    this.add(this.rotation, new GBC(0, 1).w(3).a(GBC.WEST).i(1, 0, 0, 0));
    this.setValue(new Z4Tracer(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), true, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), true, new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)));
  }

   onIteratorChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.sustain.setEnabled(this.enabled && !this.endlessSustain.isSelected());
    this.release.setEnabled(this.enabled && !this.endlessSustain.isSelected());
    this.value = new Z4Tracer(this.multiplicity.getValue(), this.push.getValue(), this.attack.getValue(), this.sustain.getValue(), this.release.getValue(), this.endlessSustain.isSelected(), this.step.getValue(), this.assistedDrawing.isSelected(), this.rotation.getValue());
    this.onchange();
  }

   setValue(value) {
    super.setValue(value);
    this.multiplicity.setValue(value.getMultiplicity());
    this.push.setValue(value.getPush());
    this.attack.setValue(value.getAttack());
    this.sustain.setValue(value.getSustain());
    this.sustain.setEnabled(this.enabled && !value.isEndlessSustain());
    this.release.setValue(value.getRelease());
    this.release.setEnabled(this.enabled && !value.isEndlessSustain());
    this.endlessSustain.setSelected(value.isEndlessSustain());
    this.step.setValue(value.getStep());
    this.assistedDrawing.setSelected(value.isAssistedDrawing());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.multiplicity.setEnabled(b);
    this.push.setEnabled(b);
    this.attack.setEnabled(b);
    this.sustain.setEnabled(b && !this.endlessSustain.isSelected());
    this.release.setEnabled(b && !this.endlessSustain.isSelected());
    this.endlessSustain.setEnabled(b);
    this.step.setEnabled(b);
    this.assistedDrawing.setEnabled(b);
  }
}
/**
 * The abstract panel to manage a (signed) random value
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
class Z4AbstractRandomValuePanel extends Z4AbstractValuePanel {

  /**
   * The value panel
   */
   valuePanel = null;

  /**
   * The array of random behaviors
   */
   radios = new Array();

  /**
   * The length panel
   */
   lengthPanel = null;

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param signed true for a signed random value, false otherwise
   * @param orientation The orientation
   */
  constructor(signed, orientation) {
    super();
    this.cssAddClass("z4abstractrandomvaluepanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4RandomValuePanelOrientation.HORIZONTAL) {
      this.valuePanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.valuePanel, new GBC(0, 0).h(2).a(GBC.SOUTH).i(0, 0, 0, 1));
      this.addRadio(Z4RandomValueBehavior.CLASSIC, buttonGroup, 1, 0, "topleft");
      this.addRadio(Z4RandomValueBehavior.BEZIER, buttonGroup, 2, 0, "topright");
      this.addRadio(Z4RandomValueBehavior.POLYLINE, buttonGroup, 1, 1, "bottomleft");
      this.addRadio(Z4RandomValueBehavior.STEPPED, buttonGroup, 2, 1, "bottomright");
      this.lengthPanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.lengthPanel, new GBC(3, 0).h(2).a(GBC.SOUTH));
    } else if (orientation === Z4RandomValuePanelOrientation.VERTICAL) {
      this.valuePanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.valuePanel, new GBC(0, 0).w(4).f(GBC.HORIZONTAL).i(0, 0, 1, 0));
      this.addRadio(Z4RandomValueBehavior.CLASSIC, buttonGroup, 0, 1, "left");
      this.addRadio(Z4RandomValueBehavior.BEZIER, buttonGroup, 1, 1, "center");
      this.addRadio(Z4RandomValueBehavior.POLYLINE, buttonGroup, 2, 1, "center");
      this.addRadio(Z4RandomValueBehavior.STEPPED, buttonGroup, 3, 1, "right");
      this.lengthPanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.lengthPanel, new GBC(0, 2).w(4).f(GBC.HORIZONTAL));
    } else if (orientation === Z4RandomValuePanelOrientation.HORIZONTALLY_VERTICAL) {
      this.valuePanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.valuePanel, new GBC(0, 0).w(3).a(GBC.EAST));
      this.addRadio(Z4RandomValueBehavior.CLASSIC, buttonGroup, 0, 1, "topleft");
      this.addRadio(Z4RandomValueBehavior.BEZIER, buttonGroup, 1, 1, "topright");
      this.addRadio(Z4RandomValueBehavior.POLYLINE, buttonGroup, 0, 2, "bottomleft");
      this.addRadio(Z4RandomValueBehavior.STEPPED, buttonGroup, 1, 2, "bottomright");
      this.lengthPanel = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.lengthPanel, new GBC(2, 1).h(2).i(0, 1, 0, 0));
    } else {
      this.valuePanel = null;
      this.lengthPanel = null;
    }
    this.valuePanel.setSignVisible(signed);
    this.valuePanel.addChangeListener(event => {
      this.valueIsAdjusting = this.valuePanel.getValueIsAdjusting();
      this.onRandomValueChange();
      this.onchange();
    });
    this.lengthPanel.setLabel(Z4Translations.LENGTH);
    this.lengthPanel.setSignVisible(false);
    this.lengthPanel.addChangeListener(event => {
      this.valueIsAdjusting = this.lengthPanel.getValueIsAdjusting();
      this.onRandomValueChange();
      this.onchange();
    });
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4abstractrandomvaluepanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.lengthPanel.setEnabled(behavior !== Z4RandomValueBehavior.CLASSIC);
      this.onRandomValueChange();
      this.onchange();
    });
    let gbc = new GBC(x, y);
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "center":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      case "topleft":
        gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "topright":
        gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomright":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    this.add(radio, gbc);
  }

   onRandomValueChange() {
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.valuePanel.setLabel(label);
  }

  /**
   * Sets the range
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
   setRange(min, max) {
    this.valuePanel.setRange(min, max);
  }

  /**
   * Sets the range of the length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive)
   */
   setLengthRange(min, max) {
    this.lengthPanel.setRange(min, max);
  }

   setEnabled(b) {
    this.valuePanel.setEnabled(b);
    Object.keys(this.radios).forEach(key => {
      let radio = this.radios[key];
      radio.setEnabled(b);
      if (radio.isSelected()) {
        this.lengthPanel.setEnabled(b && ("" + key) !== ("" + Z4RandomValueBehavior.CLASSIC));
      }
    });
  }
}
/**
 * The panel to manage a random value
 *
 * @author gianpiero.diblasi
 */
class Z4RandomValuePanel extends Z4AbstractRandomValuePanel {

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super(false, orientation);
    this.cssAddClass("z4randomvaluepanel");
    this.setValue(new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0));
  }

   onRandomValueChange() {
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "CLASSIC":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.CLASSIC, this.lengthPanel.getValue().getValue());
            break;
          case "BEZIER":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.BEZIER, this.lengthPanel.getValue().getValue());
            break;
          case "POLYLINE":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.POLYLINE, this.lengthPanel.getValue().getValue());
            break;
          case "STEPPED":
            this.value = new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.STEPPED, this.lengthPanel.getValue().getValue());
            break;
        }
      }
    });
  }

   setValue(value) {
    this.value = value;
    this.valuePanel.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getValue()));
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getRandomValueBehavior()]).setSelected(true);
    (this.radios["" + value.getRandomValueBehavior()]).setContentAreaFilled(true);
    this.lengthPanel.setEnabled(value.getRandomValueBehavior() !== Z4RandomValueBehavior.CLASSIC);
    this.lengthPanel.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getLength()));
  }
}
/**
 * The panel to manage a signed random value
 *
 * @author gianpiero.diblasi
 */
class Z4SignedRandomValuePanel extends Z4AbstractRandomValuePanel {

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super(true, orientation);
    this.cssAddClass("z4signedrandomvaluepanel");
    this.setValue(new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)));
  }

   onRandomValueChange() {
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "CLASSIC":
            this.value = new Z4SignedRandomValue(this.valuePanel.getValue().getSign(), new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.CLASSIC, this.lengthPanel.getValue().getValue()));
            break;
          case "BEZIER":
            this.value = new Z4SignedRandomValue(this.valuePanel.getValue().getSign(), new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.BEZIER, this.lengthPanel.getValue().getValue()));
            break;
          case "POLYLINE":
            this.value = new Z4SignedRandomValue(this.valuePanel.getValue().getSign(), new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.POLYLINE, this.lengthPanel.getValue().getValue()));
            break;
          case "STEPPED":
            this.value = new Z4SignedRandomValue(this.valuePanel.getValue().getSign(), new Z4RandomValue(this.valuePanel.getValue().getValue(), Z4RandomValueBehavior.STEPPED, this.lengthPanel.getValue().getValue()));
            break;
        }
      }
    });
  }

   setValue(value) {
    this.value = value;
    this.valuePanel.setValue(new Z4SignedValue(value.getSign(), value.getValue().getValue()));
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getValue().getRandomValueBehavior()]).setSelected(true);
    (this.radios["" + value.getValue().getRandomValueBehavior()]).setContentAreaFilled(true);
    this.lengthPanel.setEnabled(value.getValue().getRandomValueBehavior() !== Z4RandomValueBehavior.CLASSIC);
    this.lengthPanel.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getValue().getLength()));
  }
}
/**
 * The panel to manage a fanciful value
 *
 * @author gianpiero.diblasi
 */
class Z4FancifulValuePanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   uniformSign = new JSToggleButton();

   sign = null;

   constant = null;

   random = null;

   signedRandom = null;

   signsVisible = true;

   valueIsAdjusting = false;

   orientation = null;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4fancifulvaluepanel");
    this.setLayout(new GridBagLayout());
    this.orientation = orientation;
    if (orientation === Z4FancifulValuePanelOrientation.HORIZONTAL) {
      this.add(this.label, new GBC(0, 0).w(2).wx(1).a(GBC.WEST));
      this.add(this.uniformSign, new GBC(2, 0).w(2).a(GBC.EAST));
      this.sign = new Z4SignPanel(Z4SignPanelOrientation.SQUARED);
      this.add(this.sign, new GBC(0, 1).i(0, 0, 0, 2).a(GBC.SOUTH));
      this.constant = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.constant, new GBC(1, 1).i(0, 0, 0, 2));
      this.random = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
      this.add(this.random, new GBC(2, 1));
      this.signedRandom = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTAL);
      this.add(this.signedRandom, new GBC(3, 1));
    } else if (orientation === Z4FancifulValuePanelOrientation.VERTICAL) {
      this.add(this.label, new GBC(0, 0).a(GBC.WEST));
      this.add(this.uniformSign, new GBC(1, 0).a(GBC.EAST));
      this.sign = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
      this.add(this.sign, new GBC(0, 1).w(2).i(1, 0, 0, 0));
      this.constant = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.constant, new GBC(0, 2).w(2).i(0, 0, 2, 0).f(GBC.HORIZONTAL));
      this.random = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
      this.add(this.random, new GBC(0, 3).w(2));
      this.signedRandom = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.VERTICAL);
      this.add(this.signedRandom, new GBC(0, 4).w(2));
    } else if (orientation === Z4FancifulValuePanelOrientation.HORIZONTALLY_VERTICAL) {
      this.add(this.label, new GBC(0, 0).w(2).wx(1).a(GBC.WEST));
      this.add(this.uniformSign, new GBC(2, 0).a(GBC.EAST));
      this.sign = new Z4SignPanel(Z4SignPanelOrientation.SQUARED);
      this.add(this.sign, new GBC(0, 1).a(GBC.SOUTH));
      this.constant = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.constant, new GBC(1, 1).w(2).a(GBC.EAST));
      this.random = new Z4RandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTALLY_VERTICAL);
      this.add(this.random, new GBC(0, 2).w(3).a(GBC.EAST));
      this.signedRandom = new Z4SignedRandomValuePanel(Z4RandomValuePanelOrientation.HORIZONTALLY_VERTICAL);
      this.add(this.signedRandom, new GBC(0, 3).w(3).a(GBC.EAST));
    } else {
      this.sign = null;
      this.constant = null;
      this.random = null;
      this.signedRandom = null;
    }
    this.uniformSign.cssAddClass("z4fancifulvaluepanel-uniform-sign");
    this.uniformSign.getStyle().padding = "1px";
    this.uniformSign.setTooltip(Z4Translations.UNIFORM_SIGN);
    this.uniformSign.setIcon(new Z4EmptyImageProducer(""));
    this.uniformSign.addActionListener(event => this.onFancifulValueChange(false));
    this.sign.getStyle().display = "none";
    this.sign.addChangeListener(event => this.onFancifulValueChange(false));
    this.constant.setLabel(Z4Translations.CONSTANT);
    this.constant.addChangeListener(event => this.onFancifulValueChange(this.constant.getValueIsAdjusting()));
    this.random.setLabel(Z4Translations.RANDOM);
    this.random.getStyle().display = "none";
    this.random.addChangeListener(event => this.onFancifulValueChange(this.random.getValueIsAdjusting()));
    this.signedRandom.setLabel(Z4Translations.RANDOM);
    this.signedRandom.addChangeListener(event => this.onFancifulValueChange(this.signedRandom.getValueIsAdjusting()));
    this.setValue(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false));
  }

   onFancifulValueChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.uniformSign.setContentAreaFilled(this.uniformSign.isSelected());
    if (!this.signsVisible) {
      this.signedRandom.setValue(new Z4SignedRandomValue(this.signedRandom.getValue().getSign(), this.random.getValue()));
    } else if (this.uniformSign.isSelected()) {
      this.constant.setValue(new Z4SignedValue(this.sign.getValue(), this.constant.getValue().getValue()));
      this.signedRandom.setValue(new Z4SignedRandomValue(this.sign.getValue(), this.random.getValue()));
    } else {
      this.sign.setValue(this.constant.getValue().getSign());
      this.random.setValue(this.signedRandom.getValue().getValue());
    }
    this.value = new Z4FancifulValue(this.constant.getValue(), this.signedRandom.getValue(), this.uniformSign.isSelected());
    this.setSignsVisible(this.signsVisible);
    this.onchange();
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.label.setText(label);
  }

  /**
   * Sets the range of the constant component
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
   setConstantRange(min, max) {
    this.constant.setRange(min, max);
  }

  /**
   * Sets the range of the random component
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
   setRandomRange(min, max) {
    this.random.setRange(min, max);
    this.signedRandom.setRange(min, max);
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
   setRandomLengthRange(min, max) {
    this.random.setLengthRange(min, max);
    this.signedRandom.setLengthRange(min, max);
  }

  /**
   * Sets the visibility of the signs
   *
   * @param visible true to make the signs visible, false otherwise
   */
   setSignsVisible(visible) {
    this.signsVisible = visible;
    this.uniformSign.getStyle().display = visible ? "flex" : "none";
    this.sign.getStyle().display = visible && this.uniformSign.isSelected() ? "grid" : "none";
    this.constant.setSignVisible(visible && !this.uniformSign.isSelected());
    this.random.getStyle().display = visible && !this.uniformSign.isSelected() ? "none" : "grid";
    this.signedRandom.getStyle().display = visible && !this.uniformSign.isSelected() ? "grid" : "none";
    if (this.orientation === Z4FancifulValuePanelOrientation.VERTICAL) {
      let rect = this.random.invoke("getBoundingClientRect()");
      let signedRect = this.signedRandom.invoke("getBoundingClientRect()");
      this.constant.getStyle().minWidth = Math.max(rect.width, signedRect.width) + "px";
    }
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.sign.setValue(value.getConstant().getSign());
    this.constant.setValue(value.getConstant());
    this.random.setValue(value.getRandom().getValue());
    this.signedRandom.setValue(value.getRandom());
    this.uniformSign.setSelected(value.isUniformSign());
    this.uniformSign.setContentAreaFilled(value.isUniformSign());
    this.setSignsVisible(this.signsVisible);
  }

   setEnabled(b) {
    this.uniformSign.setEnabled(b);
    this.sign.setEnabled(b);
    this.constant.setEnabled(b);
    this.random.setEnabled(b);
    this.signedRandom.setEnabled(b);
  }
}
/**
 * The panel to manage a rotation
 *
 * @author gianpiero.diblasi
 */
class Z4RotationPanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   startAngle = null;

   angle = null;

   radios = new Array();

   delayed = new JSToggleButton();

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4rotationpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4RotationPanelOrientation.HORIZONTAL) {
      this.cssAddClass("z4rotationpanel-horizontal");
      this.add(this.label, new GBC(0, 0));
      this.startAngle = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.HORIZONTAL);
      this.add(this.startAngle, new GBC(1, 0).h(2).a(GBC.SOUTHEAST).wx(1).i(0, 0, 0, 1));
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
      this.add(this.angle, new GBC(0, 2).w(4).i(1, 0, 0, 0));
      this.addRadio(Z4RotationBehavior.FIXED, buttonGroup, 2, 0, "topleft");
      this.addRadio(Z4RotationBehavior.CUMULATIVE, buttonGroup, 3, 0, "topright");
      this.addRadio(Z4RotationBehavior.RELATIVE_TO_PATH, buttonGroup, 2, 1, "bottomleft");
      this.delayed.getStyle().borderTopLeftRadius = "0px";
      this.delayed.getStyle().borderBottomLeftRadius = "0px";
      this.delayed.getStyle().borderTopRightRadius = "0px";
      this.delayed.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
      this.delayed.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
      this.add(this.delayed, new GBC(3, 1));
    } else if (orientation === Z4RotationPanelOrientation.VERTICAL) {
      this.cssAddClass("z4rotationpanel-vertical");
      this.add(this.label, new GBC(0, 0).w(4).a(GBC.WEST));
      this.startAngle = new Z4SignedValuePanel(Z4SignedValuePanelOrientation.VERTICAL);
      this.add(this.startAngle, new GBC(0, 1).w(4).f(GBC.HORIZONTAL).i(0, 0, 1, 0));
      this.addRadio(Z4RotationBehavior.FIXED, buttonGroup, 0, 2, "left");
      this.addRadio(Z4RotationBehavior.CUMULATIVE, buttonGroup, 1, 2, "center");
      this.addRadio(Z4RotationBehavior.RELATIVE_TO_PATH, buttonGroup, 2, 2, "center");
      this.delayed.getStyle().borderTopLeftRadius = "0px";
      this.delayed.getStyle().borderBottomLeftRadius = "0px";
      this.delayed.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
      this.add(this.delayed, new GBC(3, 2));
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
      this.add(this.angle, new GBC(0, 3).w(4).i(1, 0, 0, 0));
    } else {
      this.startAngle = null;
      this.angle = null;
    }
    this.startAngle.setRange(0, 360);
    this.startAngle.setSignVisible(false);
    this.startAngle.setLabel(Z4Translations.FIXED);
    this.startAngle.addChangeListener(event => this.onRotationChange(this.startAngle.getValueIsAdjusting()));
    this.angle.setLabel(Z4Translations.VARIABLE);
    this.angle.setConstantRange(0, 180);
    this.angle.setRandomRange(0, 180);
    this.angle.addChangeListener(event => this.onRotationChange(this.angle.getValueIsAdjusting()));
    this.delayed.cssAddClass("z4rotationpanel-delayed");
    this.delayed.getStyle().padding = "1px";
    this.delayed.setTooltip(Z4Translations.DELAYED);
    this.delayed.setIcon(new Z4EmptyImageProducer(""));
    this.delayed.addActionListener(event => this.onRotationChange(false));
    this.setValue(new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false));
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4rotationpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.onRotationChange(false);
    });
    let gbc = new GBC(x, y);
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "center":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "topleft":
        gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "topright":
        gbc.a(GBC.SOUTH).wy(1);
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    this.add(radio, gbc);
  }

   onRotationChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    this.delayed.setContentAreaFilled(this.delayed.isSelected());
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "FIXED":
            this.value = new Z4Rotation(this.startAngle.getValue().getValue(), this.angle.getValue(), Z4RotationBehavior.FIXED, this.delayed.isSelected());
            break;
          case "CUMULATIVE":
            this.value = new Z4Rotation(this.startAngle.getValue().getValue(), this.angle.getValue(), Z4RotationBehavior.CUMULATIVE, this.delayed.isSelected());
            break;
          case "RELATIVE_TO_PATH":
            this.value = new Z4Rotation(this.startAngle.getValue().getValue(), this.angle.getValue(), Z4RotationBehavior.RELATIVE_TO_PATH, this.delayed.isSelected());
            break;
        }
      }
    });
    this.onchange();
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.label.setText(label);
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   */
   setRandomLengthRange(min, max) {
    this.angle.setRandomLengthRange(min, max);
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.startAngle.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), value.getStartAngle()));
    this.angle.setValue(value.getAngle());
    this.delayed.setSelected(value.isDelayed());
    this.delayed.setContentAreaFilled(value.isDelayed());
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getRotationBehavior()]).setSelected(true);
    (this.radios["" + value.getRotationBehavior()]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    this.startAngle.setEnabled(b);
    this.angle.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    this.delayed.setEnabled(b);
  }
}
/**
 * The panel to manage a signed value
 *
 * @author gianpiero.diblasi
 */
class Z4SignedValuePanel extends Z4AbstractValuePanel {

   label = new JSLabel();

   signPanel = null;

   valueSpinner = new JSSpinner();

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4signedvaluepanel");
    this.setLayout(new GridBagLayout());
    if (orientation === Z4SignedValuePanelOrientation.HORIZONTAL) {
      this.add(this.label, new GBC(1, 0).a(GBC.WEST));
      this.signPanel = new Z4SignPanel(Z4SignPanelOrientation.SQUARED);
      this.add(this.signPanel, new GBC(0, 0).h(2).a(GBC.SOUTH));
      this.add(this.valueSpinner, new GBC(1, 1).a(GBC.SOUTH).i(0, 1, 0, 0));
    } else if (orientation === Z4SignedValuePanelOrientation.VERTICAL) {
      this.add(this.label, new GBC(0, 0).a(GBC.WEST));
      this.signPanel = new Z4SignPanel(Z4SignPanelOrientation.HORIZONTAL);
      this.add(this.signPanel, new GBC(0, 1));
      this.add(this.valueSpinner, new GBC(0, 2).wx(1).f(GBC.HORIZONTAL).i(1, 0, 0, 0));
    } else {
      this.signPanel = null;
    }
    this.signPanel.addChangeListener(event => this.onSignedValueChange());
    this.valueSpinner.cssAddClass("jsspinner_w_4rem");
    this.valueSpinner.setModel(new SpinnerNumberModel(0, 0, 50, 1));
    this.valueSpinner.addChangeListener(event => this.onSignedValueChange());
    this.setValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0));
  }

   onSignedValueChange() {
    this.value = new Z4SignedValue(this.signPanel.getValue(), this.valueSpinner.getValue());
    this.onchange();
  }

  /**
   * Sets the label
   *
   * @param label The label
   */
   setLabel(label) {
    this.label.setText(label);
  }

  /**
   * Sets the range
   *
   * @param min The minumum (positive) value
   * @param max The maximum (positive) value
   */
   setRange(min, max) {
    this.valueSpinner.setModel(new SpinnerNumberModel(min, min, max, 1));
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueSpinner.getValueIsAdjusting();
  }

   setValue(value) {
    this.value = value;
    this.signPanel.setValue(value.getSign());
    this.valueSpinner.setValue(value.getValue());
  }

   setEnabled(b) {
    this.signPanel.setEnabled(b);
    this.valueSpinner.setEnabled(b);
  }

  /**
   * Sets the visibility of the sign
   *
   * @param visible true to make the sign visible, false otherwise
   */
   setSignVisible(visible) {
    this.signPanel.getStyle().display = visible ? "grid" : "none";
  }
}
/**
 * The panel to manage a sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignPanel extends Z4AbstractValuePanel {

   radios = new Array();

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4signpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4SignPanelOrientation.HORIZONTAL) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "left");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "centerh");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 2, 0, "centerh");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 3, 0, "right");
    } else if (orientation === Z4SignPanelOrientation.VERTICAL) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "top");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 0, 1, "centerv");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 0, 2, "centerv");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 0, 3, "bottom");
    } else if (orientation === Z4SignPanelOrientation.SQUARED) {
      this.addRadio(Z4SignBehavior.POSITIVE, buttonGroup, 0, 0, "topleft");
      this.addRadio(Z4SignBehavior.NEGATIVE, buttonGroup, 1, 0, "topright");
      this.addRadio(Z4SignBehavior.RANDOM, buttonGroup, 0, 1, "bottomleft");
      this.addRadio(Z4SignBehavior.ALTERNATE, buttonGroup, 1, 1, "bottomright");
    }
    this.setValue(new Z4Sign(Z4SignBehavior.RANDOM));
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4signpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations["" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.value = new Z4Sign(behavior);
      this.onchange();
    });
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerh":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
      case "top":
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "centerv":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottom":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
      case "topleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "topright":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderBottom = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomleft":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
      case "bottomright":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderTop = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    this.add(radio, new GBC(x, y));
  }

   setValue(value) {
    this.value = value;
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getSignBehavior()]).setSelected(true);
    (this.radios["" + value.getSignBehavior()]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
  }
}
/**
 * The panel to manage a whirlpool
 *
 * @author gianpiero.diblasi
 */
class Z4WhirlpoolPanel extends Z4AbstractValuePanel {

   angle = null;

   radios = new Array();

   enabled = true;

   valueIsAdjusting = false;

  /**
   * Creates the object
   *
   * @param orientation The orientation
   */
  constructor(orientation) {
    super();
    this.cssAddClass("z4whirlpoolpanel");
    this.setLayout(new GridBagLayout());
    let buttonGroup = new ButtonGroup();
    if (orientation === Z4WhirlpoolPanelOrientation.HORIZONTAL) {
      Z4UI.addLabel(this, Z4Translations.WHIRLPOOL, new GBC(0, 0).a(GBC.WEST).wx(1));
      this.addRadio(Z4WhirlpoolBehavior.NONE, buttonGroup, 1, 0, "left");
      this.addRadio(Z4WhirlpoolBehavior.FORWARD, buttonGroup, 2, 0, "center");
      this.addRadio(Z4WhirlpoolBehavior.BACKWARD, buttonGroup, 3, 0, "right");
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);
      this.add(this.angle, new GBC(0, 1).w(4));
    } else if (orientation === Z4WhirlpoolPanelOrientation.VERTICAL) {
      Z4UI.addLabel(this, Z4Translations.WHIRLPOOL, new GBC(0, 0).w(4).a(GBC.WEST));
      this.addRadio(Z4WhirlpoolBehavior.NONE, buttonGroup, 0, 1, "left");
      this.addRadio(Z4WhirlpoolBehavior.FORWARD, buttonGroup, 1, 1, "center");
      this.addRadio(Z4WhirlpoolBehavior.BACKWARD, buttonGroup, 2, 1, "right");
      Z4UI.addLabel(this, "", new GBC(3, 1).wx(1));
      this.angle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);
      this.add(this.angle, new GBC(0, 2).w(4));
    } else {
      this.angle = null;
    }
    this.angle.setLabel(Z4Translations.ANGLE);
    this.angle.setSignsVisible(false);
    this.angle.setConstantRange(0, 90);
    this.angle.setRandomRange(0, 90);
    this.angle.addChangeListener(event => this.onWhirlpoolChange(this.angle.getValueIsAdjusting()));
    this.setValue(new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.RANDOM), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.RANDOM), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false)));
  }

   addRadio(behavior, buttonGroup, x, y, border) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4whirlpoolpanel-radio");
    radio.getStyle().padding = "1px";
    radio.setTooltip(Z4Translations[behavior === Z4WhirlpoolBehavior.NONE ? "NONE_HIM" : "" + behavior]);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(behavior));
    radio.addActionListener(event => {
      Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
      radio.setContentAreaFilled(true);
      this.onWhirlpoolChange(false);
    });
    let gbc = new GBC(x, y);
    switch(border) {
      case "left":
        radio.getStyle().borderTopRightRadius = "0px";
        radio.getStyle().borderBottomRightRadius = "0px";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "center":
        radio.getStyle().borderRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        radio.getStyle().borderRight = "1px solid var(--main-action-bgcolor)";
        break;
      case "right":
        radio.getStyle().borderTopLeftRadius = "0px";
        radio.getStyle().borderBottomLeftRadius = "0px";
        radio.getStyle().borderLeft = "1px solid var(--main-action-bgcolor)";
        break;
    }
    buttonGroup.add(radio);
    this.radios["" + behavior] = radio;
    this.add(radio, gbc);
  }

   onWhirlpoolChange(valueIsAdjusting) {
    this.valueIsAdjusting = valueIsAdjusting;
    Object.keys(this.radios).forEach(key => {
      if ((this.radios[key]).isSelected()) {
        switch("" + key) {
          case "NONE":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, this.angle.getValue());
            break;
          case "FORWARD":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.FORWARD, this.angle.getValue());
            break;
          case "BACKWARD":
            this.value = new Z4Whirlpool(Z4WhirlpoolBehavior.BACKWARD, this.angle.getValue());
            break;
        }
      }
    });
    this.angle.setEnabled(this.enabled && this.value.getWhirlpoolBehavior() !== Z4WhirlpoolBehavior.NONE);
    this.onchange();
  }

  /**
   * Sets the range of the random length
   *
   * @param min The minumum value
   * @param max The maximum value
   */
   setRandomLengthRange(min, max) {
    this.angle.setRandomLengthRange(min, max);
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.angle.setValue(value.getAngle());
    this.angle.setEnabled(this.enabled && value.getWhirlpoolBehavior() !== Z4WhirlpoolBehavior.NONE);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setContentAreaFilled(false));
    (this.radios["" + value.getWhirlpoolBehavior()]).setSelected(true);
    (this.radios["" + value.getWhirlpoolBehavior()]).setContentAreaFilled(true);
  }

   setEnabled(b) {
    this.enabled = b;
    this.angle.setEnabled(b && this.value.getWhirlpoolBehavior() !== Z4WhirlpoolBehavior.NONE);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
  }
}
/**
 * The abstract panel to edit a Z4Painter
 *
 * @author gianpiero.diblasi
 * @param <T> The painter type
 */
class Z4PainterPanel extends Z4AbstractValuePanel {

  /**
   * true if value is adjusting, false otherwise
   */
   valueIsAdjusting = false;

  /**
   * true if the panel is enabled, false otherwise
   */
   enabled = true;

  constructor() {
    super();
    this.cssAddClass("z4painterpanel");
    this.setLayout(new GridBagLayout());
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.enabled = b;
  }
}
/**
 * The panel to edit a Z4BrushPainter
 *
 * @author gianpiero.diblasi
 */
class Z4BrushPainterPanel extends Z4PainterPanel {

   width = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   thickness = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   pattern = document.createElement("img");

   open = new JSButton();

   delete = new JSButton();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4brushpainterpanel");
    this.width.setSignsVisible(false);
    this.width.setConstantRange(1, 150);
    this.width.setLabel(Z4Translations.WIDTH);
    this.width.cssAddClass("z4abstractvaluepanel-titled");
    this.width.addChangeListener(event => this.onbrushchange(this.width.getValueIsAdjusting(), this.value.getPattern()));
    this.add(this.width, new GBC(0, 0).h(3).i(1, 0, 0, 1));
    this.thickness.setSignsVisible(false);
    this.thickness.setConstantRange(1, 15);
    this.thickness.setLabel(Z4Translations.THICKNESS);
    this.thickness.cssAddClass("z4abstractvaluepanel-titled");
    this.thickness.addChangeListener(event => this.onbrushchange(this.thickness.getValueIsAdjusting(), this.value.getPattern()));
    this.add(this.thickness, new GBC(1, 0).h(3).i(0, 0, 0, 1));
    Z4UI.addLabel(this, Z4Translations.PATTERN, new GBC(2, 0).w(2).a(GBC.WEST));
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "150px";
    div.getStyle().height = "150px";
    div.getStyle().border = "2px solid var(--main-action-bgcolor)";
    div.getStyle().borderRadius = "var(--roundness)";
    div.getStyle().display = "flex";
    div.getStyle().alignItems = "center";
    div.getStyle().justifyContent = "center";
    this.add(div, new GBC(2, 1).wxy(1, 1).w(2));
    this.pattern.style.maxWidth = "150px";
    this.pattern.style.maxHeight = "150px";
    div.appendNodeChild(this.pattern);
    this.open.setText(Z4Translations.OPEN);
    this.open.addActionListener(event => this.selectPattern());
    this.add(this.open, new GBC(2, 2).i(0, 0, 0, 1).a(GBC.EAST).wx(1));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_PATTERN_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.onbrushchange(false, null);
      }
    }));
    this.add(this.delete, new GBC(3, 2));
    this.setValue(new Z4BrushPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 2), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), null));
  }

   selectPattern() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TEXTURE_FILE_ID;
      options.multiple = false;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => handle.getFile().then(file => {
        this.openTexture(file);
      })));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.openTexture(file)));
    }
  }

   openTexture(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let image = new Image();
      image.onload = event2 => {
        this.onbrushchange(false, image);
        return null;
      };
      image.src = fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

   onbrushchange(b, pattern) {
    this.valueIsAdjusting = b;
    this.value = new Z4BrushPainter(this.width.getValue(), this.thickness.getValue(), pattern);
    if (this.value.getPattern()) {
      this.pattern.src = this.value.getPattern().src;
      this.delete.setEnabled(this.enabled);
    } else {
      this.pattern.removeAttribute("src");
      this.delete.setEnabled(false);
    }
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    this.width.setValue(this.value.getWidth());
    this.thickness.setValue(this.value.getThickness());
    if (this.value.getPattern()) {
      this.pattern.src = this.value.getPattern().src;
      this.delete.setEnabled(this.enabled);
    } else {
      this.pattern.removeAttribute("src");
      this.delete.setEnabled(false);
    }
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.width.setEnabled(b);
    this.thickness.setEnabled(b);
    this.open.setEnabled(b);
    this.delete.setEnabled(b && this.value.getPattern());
  }
}
/**
 * The panel to edit a Z4CenteredFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4CenteredFigurePainterPanel extends Z4PainterPanel {

   radios = new Array();

   sample = new JSComponent(document.createElement("img"));

   size = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   angle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   angle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   tension = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   multiplicity = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   hole = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   whirlpool = new Z4WhirlpoolPanel(Z4WhirlpoolPanelOrientation.VERTICAL);

   coverSpinner = new JSSpinner();

   coverSlider = new JSSlider();

   shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowColorPanel = new Z4ColorPanel();

   borderSize = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   borderColorPanel = new Z4ColorPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4centeredfigurepainterpanel");
    let tabbedPane = new JSTabbedPane();
    this.add(tabbedPane, new GBC(0, 0));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.SHAPE, panel);
    this.sample.cssAddClass("z4centeredfigurepainterpanel-sample");
    panel.add(this.sample, new GBC(0, 0).wy(1));
    let panelType = new JSPanel();
    panelType.setLayout(new GridLayout(3, 2, 1, 1));
    panel.add(panelType, new GBC(0, 1).h(3).i(0, 0, 0, 1));
    let buttonGroup = new ButtonGroup();
    this.addRadio(Z4CenteredFigurePainterType.TYPE_0, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_3, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_1, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_4, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_2, panelType, buttonGroup);
    this.addRadio(Z4CenteredFigurePainterType.TYPE_5, panelType, buttonGroup);
    this.size.setSignsVisible(false);
    this.size.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    this.size.setConstantRange(1, 50);
    this.size.setLabel(Z4Translations.DIMENSION);
    this.size.cssAddClass("z4abstractvaluepanel-titled");
    this.size.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    this.size.addChangeListener(event => this.onfigurechange(this.size.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.size, new GBC(1, 0).h(2).i(1, 0, 0, 1));
    this.tension.setSignsVisible(false);
    this.tension.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    this.tension.setConstantRange(1, 100);
    this.tension.setLabel(Z4Translations.TENSION + " (\u03C4)");
    this.tension.cssAddClass("z4abstractvaluepanel-titled");
    this.tension.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    this.tension.addChangeListener(event => this.onfigurechange(this.tension.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.tension, new GBC(2, 0).h(2).i(1, 0, 0, 1));
    this.angle1.setSignsVisible(false);
    this.angle1.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    this.angle1.setConstantRange(0, 360);
    this.angle1.setRandomRange(0, 90);
    this.angle1.setLabel(Z4Translations.ANGLE + " 1 (\u03B11)");
    this.angle1.cssAddClass("z4abstractvaluepanel-titled");
    this.angle1.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    this.angle1.addChangeListener(event => this.onfigurechange(this.angle1.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.angle1, new GBC(3, 0).h(2).i(1, 0, 0, 1));
    this.angle2.setSignsVisible(false);
    this.angle2.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    this.angle2.setConstantRange(0, 360);
    this.angle2.setRandomRange(0, 90);
    this.angle2.setLabel(Z4Translations.ANGLE + " 2 (\u03B12)");
    this.angle2.cssAddClass("z4abstractvaluepanel-titled");
    this.angle2.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    this.angle2.addChangeListener(event => this.onfigurechange(this.angle2.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.angle2, new GBC(4, 0).h(2).i(1, 0, 0, 1));
    this.multiplicity.setSignsVisible(false);
    this.multiplicity.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    this.multiplicity.setConstantRange(3, 10);
    this.multiplicity.setLabel(Z4Translations.MULTIPLICITY);
    this.multiplicity.cssAddClass("z4abstractvaluepanel-titled");
    this.multiplicity.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    this.multiplicity.addChangeListener(event => this.onfigurechange(this.multiplicity.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.multiplicity, new GBC(5, 0).h(2).i(1, 0, 0, 1));
    this.hole.setSignsVisible(false);
    this.hole.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    this.hole.setLabel(Z4Translations.HOLE);
    this.hole.cssAddClass("z4abstractvaluepanel-titled");
    this.hole.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    this.hole.addChangeListener(event => this.onfigurechange(this.hole.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.hole, new GBC(6, 0).h(2).i(1, 0, 0, 1));
    this.whirlpool.cssAddClass("z4abstractvaluepanel-titled");
    this.whirlpool.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    this.whirlpool.addChangeListener(event => this.onfigurechange(this.whirlpool.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.whirlpool, new GBC(7, 0).a(GBC.NORTH).h(4).i(1, 0, 0, 0));
    Z4UI.addLabel(panel, Z4Translations.COVER, new GBC(1, 2).w(2).a(GBC.WEST));
    this.coverSpinner.cssAddClass("jsspinner_w_4rem");
    this.coverSpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.coverSpinner.addChangeListener(event => this.onfigurechange(this.coverSpinner.getValueIsAdjusting(), null, null, this.coverSpinner.getValue()));
    panel.add(this.coverSpinner, new GBC(3, 2).a(GBC.EAST).i(1, 0, 0, 0));
    this.coverSlider.addChangeListener(event => this.onfigurechange(this.coverSlider.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    panel.add(this.coverSlider, new GBC(1, 3).w(3).f(GBC.HORIZONTAL));
    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event => this.onfigurechange(this.shadowShiftX.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event => this.onfigurechange(this.shadowShiftY.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    this.shadowColorPanel.addChangeListener(event => this.onfigurechange(false, this.shadowColorPanel.getValue(), null, this.coverSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPanel);
    this.borderSize.setSignsVisible(false);
    this.borderSize.setLabel(Z4Translations.DIMENSION);
    this.borderSize.cssAddClass("z4abstractvaluepanel-titled");
    this.borderSize.addChangeListener(event => this.onfigurechange(this.borderSize.getValueIsAdjusting(), null, null, this.coverSlider.getValue()));
    this.borderColorPanel.addChangeListener(event => this.onfigurechange(false, null, this.borderColorPanel.getValue(), this.coverSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderSize, null, this.borderColorPanel);
    this.setValue(new Z4CenteredFigurePainter(Z4CenteredFigurePainterType.TYPE_0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 3), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Whirlpool(Z4WhirlpoolBehavior.NONE, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false)), 100, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255)));
  }

   addRadio(centeredFigurePainterType, panel, buttonGroup) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4centeredfigurepainterpanel-radio");
    radio.getStyle().marginBottom = "1px";
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(centeredFigurePainterType));
    radio.addActionListener(event => this.onfigurechange(false, null, null, this.coverSlider.getValue()));
    buttonGroup.add(radio);
    this.radios["" + centeredFigurePainterType] = radio;
    panel.add(radio, null);
  }

   createPanel(tabbedPane, text, p1, p2, colorPanel) {
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(text, panel);
    panel.add(p1, new GBC(0, 1).i(1, 0, 1, 0));
    if (p2) {
      panel.add(p2, new GBC(0, 2));
    }
    colorPanel.setLabel(Z4Translations.FILLING_COLOR);
    panel.add(colorPanel, new GBC(0, 3).f(GBC.HORIZONTAL));
  }

   onfigurechange(b, shadowColor, borderColor, cover) {
    this.valueIsAdjusting = b;
    this.coverSpinner.setValue(cover);
    this.coverSlider.setValue(cover);
    let type = null;
    switch("" + Object.keys(this.radios).find((key, index, array) => (this.radios[key]).isSelected())) {
      case "TYPE_0":
        type = Z4CenteredFigurePainterType.TYPE_0;
        break;
      case "TYPE_1":
        type = Z4CenteredFigurePainterType.TYPE_1;
        break;
      case "TYPE_2":
        type = Z4CenteredFigurePainterType.TYPE_2;
        break;
      case "TYPE_3":
        type = Z4CenteredFigurePainterType.TYPE_3;
        break;
      case "TYPE_4":
        type = Z4CenteredFigurePainterType.TYPE_4;
        break;
      case "TYPE_5":
        type = Z4CenteredFigurePainterType.TYPE_5;
        break;
    }
    this.value = new Z4CenteredFigurePainter(type, this.size.getValue(), this.angle1.getValue(), this.angle2.getValue(), this.tension.getValue(), this.multiplicity.getValue(), this.hole.getValue(), this.whirlpool.getValue(), this.coverSlider.getValue(), this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), shadowColor ? shadowColor : this.value.getShadowColor(), this.borderSize.getValue(), borderColor ? borderColor : this.value.getBorderColor());
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample0_1_2");
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample3_4_5");
    if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_0 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_1 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_2) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample0_1_2");
    } else if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample3_4_5");
    }
    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getCenteredFigurePainterType()]).setSelected(true);
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample0_1_2");
    this.sample.cssRemoveClass("z4centeredfigurepainterpanel-sample3_4_5");
    if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_0 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_1 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_2) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample0_1_2");
    } else if (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5) {
      this.sample.cssAddClass("z4centeredfigurepainterpanel-sample3_4_5");
    }
    this.size.setValue(this.value.getSize());
    this.angle1.setValue(this.value.getAngle1());
    this.angle1.setEnabled(this.enabled && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setValue(this.value.getAngle2());
    this.angle2.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setValue(this.value.getTension());
    this.tension.setEnabled(this.enabled && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.multiplicity.setValue(this.value.getMultiplicity());
    this.hole.setValue(this.value.getHole());
    this.whirlpool.setValue(this.value.getWhirlpool());
    this.coverSpinner.setValue(this.value.getCover());
    this.coverSlider.setValue(this.value.getCover());
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPanel.setValue(this.value.getShadowColor());
    this.borderSize.setValue(this.value.getBorderSize());
    this.borderColorPanel.setValue(this.value.getBorderColor());
  }

   setEnabled(b) {
    super.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    this.size.setEnabled(b);
    this.angle1.setEnabled(b && this.value.getCenteredFigurePainterType() !== Z4CenteredFigurePainterType.TYPE_5);
    this.angle2.setEnabled(b && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.tension.setEnabled(b && (this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_3 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_4 || this.value.getCenteredFigurePainterType() === Z4CenteredFigurePainterType.TYPE_5));
    this.multiplicity.setEnabled(b);
    this.hole.setEnabled(b);
    this.whirlpool.setEnabled(b);
    this.coverSpinner.setEnabled(b);
    this.coverSlider.setEnabled(b);
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.shadowColorPanel.setEnabled(b);
    this.borderSize.setEnabled(b);
    this.borderColorPanel.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4DropPainter
 *
 * @author gianpiero.diblasi
 */
class Z4DropPainterPanel extends Z4PainterPanel {

   radios = new Array();

   radius = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   intensitySpinner = new JSSpinner();

   intensitySlider = new JSSlider();

   gaussianCorrectionSpinner = new JSSpinner();

   gaussianCorrectionSlider = new JSSlider();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4droppainterpanel");
    let panelType = new JSPanel();
    this.add(panelType, new GBC(0, 0).w(2));
    let buttonGroup = new ButtonGroup();
    this.addRadio(Z4DropPainterType.THOUSAND_POINTS, panelType, buttonGroup);
    this.addRadio(Z4DropPainterType.THOUSAND_LINES, panelType, buttonGroup);
    this.addRadio(Z4DropPainterType.THOUSAND_AREAS, panelType, buttonGroup);
    this.radius.setSignsVisible(false);
    this.radius.setConstantRange(1, 100);
    this.radius.setLabel(Z4Translations.RADIUS);
    this.radius.cssAddClass("z4abstractvaluepanel-titled");
    this.radius.addChangeListener(event => this.ondropchange(this.radius.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.radius, new GBC(0, 1).w(2).i(0, 0, 1, 0));
    Z4UI.addLabel(this, Z4Translations.INTENSITY, new GBC(0, 2).a(GBC.WEST));
    this.intensitySpinner.cssAddClass("jsspinner_w_4rem");
    this.intensitySpinner.setModel(new SpinnerNumberModel(20, 1, 200, 1));
    this.intensitySpinner.addChangeListener(event => this.ondropchange(this.intensitySpinner.getValueIsAdjusting(), this.intensitySpinner.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.intensitySpinner, new GBC(1, 2).a(GBC.EAST));
    this.intensitySlider.setMinimum(1);
    this.intensitySlider.setMaximum(200);
    this.intensitySlider.addChangeListener(event => this.ondropchange(this.intensitySlider.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.intensitySlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));
    Z4UI.addLabel(this, Z4Translations.GAUSSIAN_CORRECTION, new GBC(0, 4).a(GBC.WEST));
    this.gaussianCorrectionSpinner.cssAddClass("jsspinner_w_4rem");
    this.gaussianCorrectionSpinner.setModel(new SpinnerNumberModel(10, 1, 100, 1));
    this.gaussianCorrectionSpinner.addChangeListener(event => this.ondropchange(this.gaussianCorrectionSpinner.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSpinner.getValue()));
    this.add(this.gaussianCorrectionSpinner, new GBC(1, 4).a(GBC.EAST));
    this.gaussianCorrectionSlider.setMinimum(1);
    this.gaussianCorrectionSlider.setMaximum(100);
    this.gaussianCorrectionSlider.addChangeListener(event => this.ondropchange(this.gaussianCorrectionSlider.getValueIsAdjusting(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    this.add(this.gaussianCorrectionSlider, new GBC(0, 5).w(2).f(GBC.HORIZONTAL));
    this.setValue(new Z4DropPainter(Z4DropPainterType.THOUSAND_POINTS, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), 20, 10));
  }

   addRadio(dropPainterType, panel, buttonGroup) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4droppainterpanel-radio");
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(dropPainterType));
    radio.addActionListener(event => this.ondropchange(false, this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue()));
    buttonGroup.add(radio);
    this.radios["" + dropPainterType] = radio;
    panel.add(radio, null);
  }

   ondropchange(b, intensity, gaussianCorrection) {
    this.valueIsAdjusting = b;
    this.intensitySpinner.setValue(intensity);
    this.intensitySlider.setValue(intensity);
    this.gaussianCorrectionSpinner.setValue(gaussianCorrection);
    this.gaussianCorrectionSlider.setValue(gaussianCorrection);
    let type = null;
    switch("" + Object.keys(this.radios).find((key, index, array) => (this.radios[key]).isSelected())) {
      case "THOUSAND_POINTS":
        type = Z4DropPainterType.THOUSAND_POINTS;
        break;
      case "THOUSAND_LINES":
        type = Z4DropPainterType.THOUSAND_LINES;
        break;
      case "THOUSAND_AREAS":
        type = Z4DropPainterType.THOUSAND_AREAS;
        break;
    }
    this.value = new Z4DropPainter(type, this.radius.getValue(), this.intensitySlider.getValue(), this.gaussianCorrectionSlider.getValue());
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getDropPainterType()]).setSelected(true);
    this.radius.setValue(this.value.getRadius());
    this.intensitySpinner.setValue(this.value.getIntensity());
    this.intensitySlider.setValue(this.value.getIntensity());
    this.gaussianCorrectionSpinner.setValue(this.value.getGaussianCorrection());
    this.gaussianCorrectionSlider.setValue(this.value.getGaussianCorrection());
  }

   setEnabled(b) {
    super.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    this.radius.setEnabled(b);
    this.intensitySpinner.setEnabled(b);
    this.intensitySlider.setEnabled(b);
    this.gaussianCorrectionSpinner.setEnabled(b);
    this.gaussianCorrectionSlider.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4NaturalFigurePainter
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainterPanel extends Z4PainterPanel {

   radios = new Array();

   radiosClosure = new Array();

   sample = new JSComponent(document.createElement("img"));

   size = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   internalAngle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   externalAngle1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   internalAngle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   externalAngle2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   internalTension1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   externalTension1 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   internalTension2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   externalTension2 = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.VERTICAL);

   externalForceAngle = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   externalForceTension = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   indentationSpinner = new JSSpinner();

   indentationSlider = new JSSlider();

   shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowColorPanel = new Z4ColorPanel();

   borderSize = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   borderColorPanel = new Z4ColorPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4naturalfigurepainterpanel");
    let tabbedPane = new JSTabbedPane();
    this.add(tabbedPane, new GBC(0, 0));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.BASIC, panel);
    let panelType = new JSPanel();
    panel.add(panelType, new GBC(0, 0).w(2));
    let buttonGroup = new ButtonGroup();
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_0, panelType, this.radios, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_1, panelType, this.radios, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_2, panelType, this.radios, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterType.TYPE_3, panelType, this.radios, buttonGroup);
    buttonGroup = new ButtonGroup();
    this.addRadio("" + Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0, panelType, this.radiosClosure, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1, panelType, this.radiosClosure, buttonGroup);
    this.addRadio("" + Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2, panelType, this.radiosClosure, buttonGroup);
    this.size.setSignsVisible(false);
    this.size.setConstantRange(1, 200);
    this.size.setLabel(Z4Translations.DIMENSION);
    this.size.cssAddClass("z4abstractvaluepanel-titled");
    this.size.addChangeListener(event => this.onfigurechange(this.size.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.size, new GBC(0, 1).w(2).i(0, 0, 1, 0));
    Z4UI.addLabel(panel, Z4Translations.INDENTATION, new GBC(0, 2).a(GBC.WEST));
    this.indentationSpinner.cssAddClass("jsspinner_w_4rem");
    this.indentationSpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.indentationSpinner.addChangeListener(event => this.onfigurechange(this.indentationSpinner.getValueIsAdjusting(), null, null, this.indentationSpinner.getValue()));
    panel.add(this.indentationSpinner, new GBC(1, 2).a(GBC.EAST));
    this.indentationSlider.addChangeListener(event => this.onfigurechange(this.indentationSlider.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.indentationSlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));
    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.POINTS, panel);
    this.sample.cssAddClass("z4naturalfigurepainterpanel-sample");
    panel.add(this.sample, new GBC(0, 0).h(2));
    this.createPoint(panel, this.internalAngle1, this.internalTension1, Z4Translations.INTERNAL_BASE_POINT, "i1", 1);
    this.createPoint(panel, this.externalAngle1, this.externalTension1, Z4Translations.EXTERNAL_BASE_POINT, "e1", 3);
    this.createPoint(panel, this.internalAngle2, this.internalTension2, Z4Translations.INTERNAL_TERMINAL_POINT, "i2", 5);
    this.createPoint(panel, this.externalAngle2, this.externalTension2, Z4Translations.EXTERNAL_TERMINAL_POINT, "e2", 7);
    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.EXTERNAL_FORCE, panel);
    this.externalForceAngle.setConstantRange(0, 360);
    this.externalForceAngle.setRandomRange(0, 90);
    this.externalForceAngle.setLabel(Z4Translations.ANGLE + " (\u03B1)");
    this.externalForceAngle.cssAddClass("z4abstractvaluepanel-titled");
    this.externalForceAngle.addChangeListener(event => this.onfigurechange(this.externalForceAngle.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalForceAngle, new GBC(0, 0).i(1, 0, 0, 1));
    this.externalForceTension.setSignsVisible(false);
    this.externalForceTension.setConstantRange(0, 100);
    this.externalForceTension.setLabel(Z4Translations.TENSION + " (\u03C4)");
    this.externalForceTension.cssAddClass("z4abstractvaluepanel-titled");
    this.externalForceTension.addChangeListener(event => this.onfigurechange(this.externalForceTension.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(this.externalForceTension, new GBC(1, 0).a(GBC.SOUTH));
    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event => this.onfigurechange(this.shadowShiftX.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event => this.onfigurechange(this.shadowShiftY.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    this.shadowColorPanel.addChangeListener(event => this.onfigurechange(false, this.shadowColorPanel.getValue(), null, this.indentationSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPanel);
    this.borderSize.setSignsVisible(false);
    this.borderSize.setLabel(Z4Translations.DIMENSION);
    this.borderSize.cssAddClass("z4abstractvaluepanel-titled");
    this.borderSize.addChangeListener(event => this.onfigurechange(this.borderSize.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    this.borderColorPanel.addChangeListener(event => this.onfigurechange(false, null, this.borderColorPanel.getValue(), this.indentationSlider.getValue()));
    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderSize, null, this.borderColorPanel);
    this.setValue(new Z4NaturalFigurePainter(Z4NaturalFigurePainterType.TYPE_0, Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 50), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 45), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 25), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), 0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255)));
  }

   addRadio(object, panel, radios, buttonGroup) {
    let radio = new JSRadioButton();
    radio.cssAddClass("z4naturalfigurepainterpanel-radio");
    radio.setContentAreaFilled(false);
    radio.setToggle();
    radio.setIcon(new Z4EmptyImageProducer(object));
    radio.addActionListener(event => this.onfigurechange(false, null, null, this.indentationSlider.getValue()));
    buttonGroup.add(radio);
    radios[object] = radio;
    panel.add(radio, null);
  }

   createPoint(panel, angle, tension, title, suffix, x) {
    Z4UI.addLabel(panel, title, new GBC(x, 0).w(2).a(GBC.WEST)).getStyle().fontWeight = "bold";
    angle.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    angle.setSignsVisible(false);
    angle.setConstantRange(0, 360);
    angle.setRandomRange(0, 90);
    angle.setLabel(Z4Translations.ANGLE + " (\u03B1" + suffix + ")");
    angle.cssAddClass("z4abstractvaluepanel-titled");
    angle.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    angle.addChangeListener(event => this.onfigurechange(angle.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(angle, new GBC(x, 1).i(0, 0, 0, 1));
    tension.getStyle().setProperty("grid-template-areas", "\"p1 p1\"\n\"p3 p3\"\n\"p4 p4\"\n\"p5 p5\"\n\"p6 p6\"");
    tension.setSignsVisible(false);
    tension.setConstantRange(1, 100);
    tension.setLabel(Z4Translations.TENSION + " (\u03C4" + suffix + ")");
    tension.cssAddClass("z4abstractvaluepanel-titled");
    tension.getChilStyleByQuery("label:nth-child(1)").fontSize = "smaller";
    tension.addChangeListener(event => this.onfigurechange(tension.getValueIsAdjusting(), null, null, this.indentationSlider.getValue()));
    panel.add(tension, new GBC(x + 1, 1).i(0, 0, 0, 1));
  }

   createPanel(tabbedPane, text, p1, p2, colorPanel) {
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(text, panel);
    panel.add(p1, new GBC(0, 1).i(1, 0, 1, 0));
    if (p2) {
      panel.add(p2, new GBC(0, 2));
    }
    colorPanel.setLabel(Z4Translations.FILLING_COLOR);
    panel.add(colorPanel, new GBC(0, 3).f(GBC.HORIZONTAL));
  }

   onfigurechange(b, shadowColor, borderColor, indentation) {
    this.valueIsAdjusting = b;
    this.indentationSpinner.setValue(indentation);
    this.indentationSlider.setValue(indentation);
    let type = null;
    switch("" + Object.keys(this.radios).find((key, index, array) => (this.radios[key]).isSelected())) {
      case "TYPE_0":
        type = Z4NaturalFigurePainterType.TYPE_0;
        break;
      case "TYPE_1":
        type = Z4NaturalFigurePainterType.TYPE_1;
        break;
      case "TYPE_2":
        type = Z4NaturalFigurePainterType.TYPE_2;
        break;
      case "TYPE_3":
        type = Z4NaturalFigurePainterType.TYPE_3;
        break;
    }
    let controlPointClosure = null;
    switch("" + Object.keys(this.radiosClosure).find((key, index, array) => (this.radiosClosure[key]).isSelected())) {
      case "CONTROL_POINT_CLOSURE_0":
        controlPointClosure = Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0;
        break;
      case "CONTROL_POINT_CLOSURE_1":
        controlPointClosure = Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1;
        break;
      case "CONTROL_POINT_CLOSURE_2":
        controlPointClosure = Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2;
        break;
    }
    this.value = new Z4NaturalFigurePainter(type, controlPointClosure, this.size.getValue(), this.internalAngle1.getValue(), this.externalAngle1.getValue(), this.internalAngle2.getValue(), this.externalAngle2.getValue(), this.internalTension1.getValue(), this.externalTension1.getValue(), this.internalTension2.getValue(), this.externalTension2.getValue(), this.indentationSlider.getValue(), this.externalForceAngle.getValue(), this.externalForceTension.getValue(), this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), shadowColor ? shadowColor : this.value.getShadowColor(), this.borderSize.getValue(), borderColor ? borderColor : this.value.getBorderColor());
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    (this.radios["" + value.getNaturalFigurePainterType()]).setSelected(true);
    (this.radiosClosure["" + value.getControlPointClosure()]).setSelected(true);
    this.size.setValue(this.value.getSize());
    this.internalAngle1.setValue(this.value.getInternalAngle1());
    this.externalAngle1.setValue(this.value.getExternalAngle1());
    this.internalAngle2.setValue(this.value.getInternalAngle2());
    this.externalAngle2.setValue(this.value.getExternalAngle2());
    this.internalTension1.setValue(this.value.getInternalTension1());
    this.externalTension1.setValue(this.value.getExternalTension1());
    this.internalTension2.setValue(this.value.getInternalTension2());
    this.externalTension2.setValue(this.value.getExternalTension2());
    this.externalForceAngle.setValue(this.value.getExternalForceAngle());
    this.externalForceTension.setValue(this.value.getExternalForceTension());
    this.indentationSpinner.setValue(this.value.getIndentation());
    this.indentationSlider.setValue(this.value.getIndentation());
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPanel.setValue(this.value.getShadowColor());
    this.borderSize.setValue(this.value.getBorderSize());
    this.borderColorPanel.setValue(this.value.getBorderColor());
  }

   setEnabled(b) {
    super.setEnabled(b);
    Object.keys(this.radios).forEach(key => (this.radios[key]).setEnabled(b));
    Object.keys(this.radiosClosure).forEach(key => (this.radiosClosure[key]).setEnabled(b));
    this.size.setEnabled(b);
    this.internalAngle1.setEnabled(b);
    this.externalAngle1.setEnabled(b);
    this.internalAngle2.setEnabled(b);
    this.externalAngle2.setEnabled(b);
    this.internalTension1.setEnabled(b);
    this.externalTension1.setEnabled(b);
    this.internalTension2.setEnabled(b);
    this.externalTension2.setEnabled(b);
    this.externalForceAngle.setEnabled(b);
    this.externalForceTension.setEnabled(b);
    this.indentationSpinner.setEnabled(b);
    this.indentationSlider.setEnabled(b);
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.shadowColorPanel.setEnabled(b);
    this.borderSize.setEnabled(b);
    this.borderColorPanel.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4PatternPainter
 *
 * @author gianpiero.diblasi
 */
class Z4PatternPainterPanel extends Z4PainterPanel {

   panel = new JSComponent(document.createElement("div"));

   checkBoxs = new Array();

   open = new JSButton();

   delete = new JSButton();

   randomSequence = new JSCheckBox();

   multiSize = new JSCheckBox();

   checkBoxDnD = null;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4patternpainterpanel");
    Z4UI.addLabel(this, Z4Translations.PATTERNS, new GBC(0, 0).w(3).a(GBC.WEST));
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "400px";
    div.getStyle().height = "200px";
    div.getStyle().border = "2px solid var(--main-action-bgcolor)";
    div.getStyle().borderRadius = "var(--roundness)";
    div.getStyle().overflowY = "auto";
    this.panel.getStyle().display = "flex";
    this.panel.getStyle().flexFlow = "row wrap";
    this.panel.getStyle().setProperty("gap", "10px");
    this.panel.addEventListener("dragenter", event => event.preventDefault());
    this.panel.addEventListener("dragover", event => {
      event.preventDefault();
      let evt = event;
      let index = this.checkBoxs.findIndex(checkBox => {
        let rect = checkBox.invoke("getBoundingClientRect()");
        return evt.clientX < rect.left + rect.width && evt.clientY < rect.top + rect.height;
      });
      this.checkBoxs.forEach((checkBox, idx, array) => {
        checkBox.getStyle().backgroundColor = index === idx ? "var(--main-action-bgcolor)" : "transparent";
        checkBox.getStyle().borderRadius = "var(--roundness)";
      });
    });
    this.panel.addEventListener("dragleave", event => {
      event.preventDefault();
      this.checkBoxs.forEach((checkBox, idx, array) => {
        checkBox.getStyle().removeProperty("backgroundColor");
        checkBox.getStyle().removeProperty("borderRadius");
      });
    });
    this.panel.addEventListener("drop", event => {
      event.preventDefault();
      this.checkBoxs.forEach((checkBox, idx, array) => {
        checkBox.getStyle().removeProperty("backgroundColor");
        checkBox.getStyle().removeProperty("borderRadius");
      });
      let evt = event;
      let index = this.checkBoxs.findIndex(checkBox => {
        let rect = checkBox.invoke("getBoundingClientRect()");
        return evt.clientX < rect.left + rect.width && evt.clientY < rect.top + rect.height;
      });
      this.moveCheckBox(index);
    });
    div.appendChild(this.panel);
    this.add(div, new GBC(0, 1).w(3));
    this.open.setText(Z4Translations.OPEN);
    this.open.addActionListener(event => this.selectPattern());
    this.add(this.open, new GBC(1, 2).h(2).a(GBC.NORTH).i(1, 0, 0, 1));
    this.delete.setText(Z4Translations.DELETE);
    this.delete.setEnabled(false);
    this.delete.addActionListener(event => JSOptionPane.showConfirmDialog(Z4Translations.DELETE_PATTERNS_MESSAGE, Z4Translations.DELETE, JSOptionPane.YES_NO_OPTION, JSOptionPane.QUESTION_MESSAGE, response => {
      if (response === JSOptionPane.YES_OPTION) {
        this.onpatternDelete();
      }
    }));
    this.add(this.delete, new GBC(2, 2).h(2).a(GBC.NORTH).i(1, 0, 0, 0));
    this.randomSequence.setText(Z4Translations.RANDOM_SEQUENCE);
    this.randomSequence.addActionListener(event => this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.randomSequence, new GBC(0, 2).wx(1).a(GBC.WEST));
    this.multiSize.setText(Z4Translations.MULTI_DIMENSION);
    this.multiSize.addActionListener(event => this.onpatternchange(false, this.value.getPatterns()));
    this.add(this.multiSize, new GBC(0, 3).a(GBC.WEST));
    this.setValue(new Z4PatternPainter(new Array(), false, false));
  }

   selectPattern() {
    if (typeof window["showOpenFilePicker"] === "function") {
      let options = new FilePickerOptions();
      options.excludeAcceptAllOption = true;
      options.id = Z4Constants.TEXTURE_FILE_ID;
      options.multiple = true;
      options.types = Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE;
      JSFilePicker.showOpenFilePicker(options, 0, handles => handles.forEach(handle => handle.getFile().then(file => {
        this.openTexture(file);
      })));
    } else {
      JSFileChooser.showOpenDialog("" + Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT.join(","), JSFileChooser.SINGLE_SELECTION, 0, files => files.forEach(file => this.openTexture(file)));
    }
  }

   openTexture(file) {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      let checkBox = this.createCheckBox(fileReader.result);
      this.checkBoxs.push(checkBox);
      this.panel.appendChild(checkBox);
      let image = new Image();
      image.onload = event2 => {
        checkBox.setTooltip(image.width + "x" + image.height);
        this.onpatternAdd(image);
        return null;
      };
      image.src = fileReader.result;
      return null;
    };
    fileReader.readAsDataURL(file);
  }

   onpatternAdd(pattern) {
    let patterns = this.value.getPatterns().slice();
    patterns.push(pattern);
    this.onpatternchange(false, patterns);
  }

   onpatternDelete() {
    this.delete.setEnabled(false);
    let patterns = this.value.getPatterns().filter((pattern, index, array) => !this.checkBoxs[index].isSelected());
    this.checkBoxs = this.checkBoxs.filter(checkBox => !checkBox.isSelected());
    this.panel.clearContent();
    this.checkBoxs.forEach(checkBox => this.panel.appendChild(checkBox));
    this.onpatternchange(false, patterns);
  }

   onpatternchange(b, patterns) {
    this.valueIsAdjusting = b;
    this.value = new Z4PatternPainter(patterns, this.randomSequence.isSelected(), this.multiSize.isSelected());
    this.onchange();
  }

   moveCheckBox(index) {
    let newPosition = Math.min(this.checkBoxs.length, index);
    let currentPosition = this.checkBoxs.indexOf(this.checkBoxDnD);
    if (newPosition < currentPosition) {
      let patterns = this.value.getPatterns().slice();
      patterns.splice(newPosition, 0, patterns.splice(currentPosition, 1)[0]);
      this.onpatternchange(false, patterns);
      this.setValue(this.value);
    } else if (newPosition > currentPosition) {
      let patterns = this.value.getPatterns().slice();
      patterns.splice(newPosition, 0, patterns[currentPosition]);
      patterns.splice(currentPosition, 1);
      this.onpatternchange(false, patterns);
      this.setValue(this.value);
    }
  }

   setValue(value) {
    this.value = value;
    this.panel.clearContent();
    this.checkBoxs.length = 0;
    this.value.getPatterns().forEach(image => {
      let checkBox = this.createCheckBox(image.src);
      checkBox.setTooltip(image.width + "x" + image.height);
      this.checkBoxs.push(checkBox);
      this.panel.appendChild(checkBox);
    });
    this.delete.setEnabled(false);
    this.randomSequence.setSelected(this.value.isRandomSequence());
    this.multiSize.setSelected(this.value.isMultiSize());
  }

   createCheckBox(src) {
    let checkBox = new JSCheckBox();
    checkBox.setIcon(new DefaultHTMLImageProducer("", src));
    checkBox.getStyle().flexDirection = "row-reverse";
    checkBox.getStyle().marginLeft = "5px";
    checkBox.getChilStyleByQuery("img").width = "30px";
    checkBox.addActionListener(event2 => this.delete.setEnabled(!!(this.checkBoxs.filter(cb => cb.isSelected()).length)));
    checkBox.setAttribute("draggable", "true");
    checkBox.addEventListener("dragstart", event => {
      (event).dataTransfer.effectAllowed = "move";
      this.checkBoxDnD = checkBox;
    });
    return checkBox;
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.checkBoxs.forEach(checkBox => checkBox.setEnabled(b));
    this.open.setEnabled(b);
    this.delete.setEnabled(b && this.checkBoxs.filter(checkBox => checkBox.isSelected()).length);
    this.randomSequence.setEnabled(b);
    this.multiSize.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4Shape2DPainter
 *
 * @author gianpiero.diblasi
 */
class Z4Shape2DPainterPanel extends Z4PainterPanel {

   width = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   height = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   regular = new JSCheckBox();

   star = new JSCheckBox();

   vertexCounter = new JSSlider();

   shadowShiftX = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowShiftY = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   shadowColorPanel = new Z4ColorPanel();

   borderWidth = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   borderHeight = new Z4FancifulValuePanel(Z4FancifulValuePanelOrientation.HORIZONTAL);

   borderColorPanel = new Z4ColorPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4shape2dpainterpanel");
    let tabbedPane = new JSTabbedPane();
    this.add(tabbedPane, new GBC(0, 0));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(Z4Translations.DIMENSION, panel);
    this.width.setSignsVisible(false);
    this.width.setConstantRange(1, 50);
    this.width.setLabel(Z4Translations.WIDTH);
    this.width.cssAddClass("z4abstractvaluepanel-titled");
    this.width.addChangeListener(event => this.onshape2dchange(this.width.getValueIsAdjusting(), null, null));
    panel.add(this.width, new GBC(0, 0).w(3).a(GBC.WEST).i(1, 0, 1, 0));
    this.height.setSignsVisible(false);
    this.height.setConstantRange(1, 50);
    this.height.setLabel(Z4Translations.HEIGHT);
    this.height.cssAddClass("z4abstractvaluepanel-titled");
    this.height.addChangeListener(event => this.onshape2dchange(this.height.getValueIsAdjusting(), null, null));
    panel.add(this.height, new GBC(0, 1).w(3).a(GBC.WEST));
    Z4UI.addLabel(panel, Z4Translations.VERTICES, new GBC(0, 2).wx(1).a(GBC.WEST));
    this.regular.setText(Z4Translations.REGULAR);
    this.regular.addActionListener(event => this.onshape2dchange(false, null, null));
    panel.add(this.regular, new GBC(1, 2).a(GBC.EAST).i(0, 0, 0, 5));
    this.star.setText(Z4Translations.STAR);
    this.star.addActionListener(event => this.onshape2dchange(false, null, null));
    panel.add(this.star, new GBC(2, 2).a(GBC.EAST));
    let vertexModelAndRenderer = new DefaultSliderModelAndRenderer();
    for (let vertex = 3; vertex < 10; vertex++) {
      vertexModelAndRenderer.addElement("" + vertex);
    }
    vertexModelAndRenderer.addElement("\u221E");
    this.vertexCounter.setModelAndRenderer(vertexModelAndRenderer);
    this.vertexCounter.addChangeListener(event => this.onshape2dchange(false, null, null));
    panel.add(this.vertexCounter, new GBC(0, 3).w(3).f(GBC.HORIZONTAL));
    this.vertexCounter.getChilStyleByQuery("datalist option:nth-child(8)").fontSize = "larger";
    this.shadowShiftX.setLabel(Z4Translations.DELTA_X);
    this.shadowShiftX.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftX.addChangeListener(event => this.onshape2dchange(this.shadowShiftX.getValueIsAdjusting(), null, null));
    this.shadowShiftY.setLabel(Z4Translations.DELTA_Y);
    this.shadowShiftY.cssAddClass("z4abstractvaluepanel-titled");
    this.shadowShiftY.addChangeListener(event => this.onshape2dchange(this.shadowShiftY.getValueIsAdjusting(), null, null));
    this.shadowColorPanel.addChangeListener(event => this.onshape2dchange(false, this.shadowColorPanel.getValue(), null));
    this.createPanel(tabbedPane, Z4Translations.SHADOW, this.shadowShiftX, this.shadowShiftY, this.shadowColorPanel);
    this.borderWidth.setSignsVisible(false);
    this.borderWidth.setLabel(Z4Translations.WIDTH);
    this.borderWidth.cssAddClass("z4abstractvaluepanel-titled");
    this.borderWidth.addChangeListener(event => this.onshape2dchange(this.borderWidth.getValueIsAdjusting(), null, null));
    this.borderHeight.setSignsVisible(false);
    this.borderHeight.setLabel(Z4Translations.HEIGHT);
    this.borderHeight.cssAddClass("z4abstractvaluepanel-titled");
    this.borderHeight.addChangeListener(event => this.onshape2dchange(this.borderHeight.getValueIsAdjusting(), null, null));
    this.borderColorPanel.addChangeListener(event => this.onshape2dchange(false, null, this.borderColorPanel.getValue()));
    this.createPanel(tabbedPane, Z4Translations.BORDER, this.borderWidth, this.borderHeight, this.borderColorPanel);
    this.setValue(new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, -1, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 255)));
  }

   createPanel(tabbedPane, text, p1, p2, colorPanel) {
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    tabbedPane.addTab(text, panel);
    panel.add(p1, new GBC(0, 1).i(1, 0, 1, 0));
    panel.add(p2, new GBC(0, 2));
    colorPanel.setLabel(Z4Translations.FILLING_COLOR);
    panel.add(colorPanel, new GBC(0, 3).f(GBC.HORIZONTAL));
  }

   onshape2dchange(b, shadowColor, borderColor) {
    this.valueIsAdjusting = b;
    let vCount = this.vertexCounter.getValue();
    this.height.setEnabled(this.enabled && !this.regular.isSelected());
    this.star.setEnabled(this.enabled && vCount !== 7);
    this.value = new Z4Shape2DPainter(this.width.getValue(), this.height.getValue(), this.regular.isSelected(), this.star.isSelected(), vCount === 7 ? -1 : vCount + 3, this.shadowShiftX.getValue(), this.shadowShiftY.getValue(), shadowColor ? shadowColor : this.value.getShadowColor(), this.borderWidth.getValue(), this.borderHeight.getValue(), borderColor ? borderColor : this.value.getBorderColor());
    this.onchange();
  }

   setValue(value) {
    this.value = value;
    let vCount = this.value.getVertices();
    this.width.setValue(this.value.getWidth());
    this.height.setValue(this.value.getHeight());
    this.height.setEnabled(this.enabled && !this.value.isRegular());
    this.regular.setSelected(this.value.isRegular());
    this.star.setSelected(this.value.isStar());
    this.star.setEnabled(this.enabled && vCount !== -1);
    this.vertexCounter.setValue(vCount === -1 ? 7 : vCount - 3);
    this.shadowShiftX.setValue(this.value.getShadowShiftX());
    this.shadowShiftY.setValue(this.value.getShadowShiftY());
    this.shadowColorPanel.setValue(this.value.getShadowColor());
    this.borderWidth.setValue(this.value.getBorderWidth());
    this.borderHeight.setValue(this.value.getBorderHeight());
    this.borderColorPanel.setValue(this.value.getBorderColor());
  }

   setEnabled(b) {
    super.setEnabled(b);
    this.width.setEnabled(b);
    this.height.setEnabled(b && !this.regular.isSelected());
    this.regular.setEnabled(b);
    this.star.setEnabled(b && this.vertexCounter.getValue() !== 7);
    this.vertexCounter.setEnabled(b);
    this.shadowShiftX.setEnabled(b);
    this.shadowShiftY.setEnabled(b);
    this.shadowColorPanel.setEnabled(b);
    this.borderWidth.setEnabled(b);
    this.borderHeight.setEnabled(b);
    this.borderColorPanel.setEnabled(b);
  }
}
/**
 * The panel to edit a Z4DrawingTool
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingToolPanel extends Z4AbstractValuePanel {

   name = new JSTextField();

   selectedPointInterator = new JSButton();

   selectedPainter = new JSButton();

   selectedSpatioTemporalColor = new JSButton();

   selectedColorProgression = new JSButton();

   pane = new JSTabbedPane();

   transparent1 = new JSButton();

   swatchesPanel1 = new JSColorMiniSwatchesPanel();

   preview1 = new JSComponent(document.createElement("canvas"));

   ctx1 = this.preview1.invoke("getContext('2d')");

   transparent2 = new JSButton();

   swatchesPanel2 = new JSColorMiniSwatchesPanel();

   preview2 = new JSComponent(document.createElement("canvas"));

   ctx2 = this.preview2.invoke("getContext('2d')");

   transparentTryMe = new JSButton();

   swatchesPanelTryMe = new JSColorMiniSwatchesPanel();

   previewTryMe = new JSComponent(document.createElement("canvas"));

   ctxTryMe = this.previewTryMe.invoke("getContext('2d')");

   radios = new Array();

   cardPanel = new JSPanel();

   cardLayout = new CardLayout(0, 0);

   cardPanels = new Array();

   actions = new JSPanel();

   selectedPointInteratorCard = null;

   selectedPainterCard = null;

   selectedSpatioTemporalColorCard = null;

   valueIsAdjusting = false;

   previewColor = null;

   widthTryMe = 700;

   heightTryMe = 600;

   offscreenObjects = new OffscreenCanvas(this.widthTryMe, this.heightTryMe);

   offscreenCtxObjects = this.offscreenObjects.getContext("2d");

   offscreenBounds = new OffscreenCanvas(this.widthTryMe, this.heightTryMe);

   offscreenCtxBounds = this.offscreenBounds.getContext("2d");

   pressedTryMe = false;

   tabbedPaneID = "z4drawingtoolpanel_" + new Date().getTime() + "_" + parseInt(1000 * Math.random());

   currentTimeoutID = 0;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4drawingtoolpanel");
    Z4UI.addLabel(this, Z4Translations.DRAWING_TOOL_NAME, new GBC(0, 0).w(2).a(GBC.WEST));
    this.name.addActionListener(event => {
      this.createValue();
      this.onchange();
    });
    this.add(this.name, new GBC(0, 1).wx(1).f(GBC.HORIZONTAL).i(0, 0, 5, 0));
    let selected = new JSPanel();
    selected.setLayout(new BoxLayout(selected, BoxLayout.X_AXIS));
    this.setSelectedButton(this.selectedPointInterator);
    this.selectedPointInterator.addActionListener(event => this.selectCard(this.selectedPointInteratorCard));
    selected.add(this.selectedPointInterator, null);
    this.setSelectedButton(this.selectedPainter);
    this.selectedPainter.addActionListener(event => this.selectCard(this.selectedPainterCard));
    selected.add(this.selectedPainter, null);
    this.setSelectedButton(this.selectedSpatioTemporalColor);
    selected.add(this.selectedSpatioTemporalColor, null);
    this.selectedSpatioTemporalColor.addActionListener(event => this.selectCard(this.selectedSpatioTemporalColorCard));
    this.setSelectedButton(this.selectedColorProgression);
    selected.add(this.selectedColorProgression, null);
    this.selectedColorProgression.addActionListener(event => this.selectCard("COLOR-PROGRESSION"));
    this.add(selected, new GBC(1, 0).h(2).a(GBC.SOUTH).i(0, 0, 5, 0));
    this.pane.setID(this.tabbedPaneID);
    this.pane.setTabPlacement(JSTabbedPane.LEFT);
    this.add(this.pane, new GBC(0, 2).w(2).wxy(1, 1).f(GBC.BOTH));
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.pane.addTab(Z4Translations.SETTINGS, panel);
    let panelRadioContainer = new JSPanel();
    panelRadioContainer.setLayout(new GridBagLayout());
    this.cardPanel.setLayout(this.cardLayout);
    panel.add(this.cardPanel, new GBC(0, 0).a(GBC.NORTH).h(2).wxy(1, 1));
    let buttonGroup = new ButtonGroup();
    let panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panelRadioContainer.add(panelRadio, new GBC(0, 0).a(GBC.NORTH).i(150, 0, 0, 15));
    this.addRadioButton(panelRadio, buttonGroup, "STAMPER");
    this.addRadioButton(panelRadio, buttonGroup, "TRACER");
    this.addRadioButton(panelRadio, buttonGroup, "AIRBRUSH");
    this.addRadioButton(panelRadio, buttonGroup, "SPIROGRAPH");
    this.addRadioButton(panelRadio, buttonGroup, "SCATTERER");
    panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panelRadioContainer.add(panelRadio, new GBC(1, 0).a(GBC.NORTH).i(150, 0, 0, 15));
    this.addRadioButton(panelRadio, buttonGroup, "SHAPE2D");
    this.addRadioButton(panelRadio, buttonGroup, "DROP");
    this.addRadioButton(panelRadio, buttonGroup, "BRUSH");
    this.addRadioButton(panelRadio, buttonGroup, "PATTERN");
    this.addRadioButton(panelRadio, buttonGroup, "CENTERED-FIGURE");
    this.addRadioButton(panelRadio, buttonGroup, "NATURAL-FIGURE");
    panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    panelRadioContainer.add(panelRadio, new GBC(2, 0).a(GBC.NORTH).i(150, 0, 0, 5));
    this.addRadioButton(panelRadio, buttonGroup, "COLOR");
    this.addRadioButton(panelRadio, buttonGroup, "GRADIENT-COLOR");
    this.addRadioButton(panelRadio, buttonGroup, "BIGRADIENT-COLOR");
    panelRadio.add(this.getHLine(), null);
    this.addRadioButton(panelRadio, buttonGroup, "COLOR-PROGRESSION");
    this.addPreview(panel, 0, 2, this.transparent1, this.swatchesPanel1, this.preview1, 500, 300, new GBC(0, 3), false);
    this.addPreview(panel, 1, 0, this.transparent2, this.swatchesPanel2, this.preview2, 300, 500, new GBC(1, 1).a(GBC.NORTH).i(0, 5, 0, 0), true);
    panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.pane.addTab(Z4Translations.TRY_ME, panel);
    this.addTryMe(panel);
    this.actions.setLayout(new GridBagLayout());
    this.pane.addTab(Z4Translations.ACTIONS, this.actions);
    this.pane.appendChildInTree(".west ul", panelRadioContainer);
    this.setValue(new Z4DrawingTool(Z4Translations.DRAWING_TOOL, new Z4Stamper(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 1), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4Rotation(0, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), Z4RotationBehavior.FIXED, false)), new Z4Shape2DPainter(new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 10), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), false, false, -1, new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Z4FancifulValue(new Z4SignedValue(new Z4Sign(Z4SignBehavior.POSITIVE), 0), new Z4SignedRandomValue(new Z4Sign(Z4SignBehavior.POSITIVE), new Z4RandomValue(0, Z4RandomValueBehavior.CLASSIC, 0)), false), new Color(0, 0, 0, 0)), Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255)), new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE)));
  }

   setSelectedButton(button) {
    button.setContentAreaFilled(false);
    button.getStyle().minHeight = "43px";
    button.getStyle().marginLeft = "1px";
    button.cssAddClass("z4drawingtoolpanel-selected");
    button.setIcon(new Z4EmptyImageProducer(""));
  }

   addRadioButton(panelRadio, buttonGroup, card) {
    let radio = new JSRadioButton();
    radio.setContentAreaFilled(false);
    radio.getStyle().marginBottom = "1px";
    radio.getStyle().minHeight = "25px";
    radio.setToggle();
    radio.cssAddClass("z4drawingtoolpanel-selector");
    radio.cssAddClass("z4drawingtoolpanel-selector-" + card.toLowerCase());
    radio.setIcon(new Z4EmptyImageProducer(card));
    radio.addActionListener(event => this.selectCard(card));
    this.radios[card] = radio;
    buttonGroup.add(radio);
    panelRadio.add(radio, null);
  }

   selectCard(card) {
    (document.querySelector("#" + this.tabbedPaneID + " > .west > ul > li:nth-child(2) input")).click();
    switch(card) {
      case "STAMPER":
      case "TRACER":
      case "AIRBRUSH":
      case "SPIROGRAPH":
      case "SCATTERER":
        new Array("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected", "z4drawingtoolpanel-scatterer-selected").forEach(css => this.selectedPointInterator.cssRemoveClass(css));
        this.selectedPointInteratorCard = this.check(this.selectedPointInterator, card, card.toLowerCase(), null, true);
        break;
      case "SHAPE2D":
      case "DROP":
      case "BRUSH":
      case "PATTERN":
      case "CENTERED-FIGURE":
      case "NATURAL-FIGURE":
        new Array("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-drop-selected", "z4drawingtoolpanel-brush-selected", "z4drawingtoolpanel-pattern-selected", "z4drawingtoolpanel-centered-figure-selected", "z4drawingtoolpanel-natural-figure-selected").forEach(css => this.selectedPainter.cssRemoveClass(css));
        this.selectedPainterCard = this.check(this.selectedPainter, card, card.toLowerCase(), null, true);
        break;
      case "COLOR":
      case "GRADIENT-COLOR":
      case "BIGRADIENT-COLOR":
        new Array("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css => this.selectedSpatioTemporalColor.cssRemoveClass(css));
        this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, card, card.toLowerCase(), null, true);
        break;
      case "COLOR-PROGRESSION":
        this.check(this.selectedColorProgression, "COLOR-PROGRESSION", null, null, true);
        break;
    }
    this.transparent1.getStyle().display = card === "BIGRADIENT-COLOR" ? "none" : "flex";
    this.swatchesPanel1.getStyle().display = card === "BIGRADIENT-COLOR" ? "none" : "flex";
    this.preview1.getStyle().display = card === "BIGRADIENT-COLOR" ? "none" : "flex";
    this.transparent2.getStyle().display = card === "BIGRADIENT-COLOR" ? "flex" : "none";
    this.swatchesPanel2.getStyle().display = card === "BIGRADIENT-COLOR" ? "flex" : "none";
    this.preview2.getStyle().display = card === "BIGRADIENT-COLOR" ? "flex" : "none";
    this.valueIsAdjusting = false;
    this.createValue();
    this.drawPreview();
    this.onchange();
  }

   getHLine() {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().width = "100%";
    div.getStyle().margin = "21px 1px 22px 1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    return div;
  }

   addPreview(panel, x, y, transparent, swatchesPanel, preview, width, height, gbc, hide) {
    let colors = new JSPanel();
    panel.add(colors, new GBC(x, y));
    transparent.addActionListener(event => {
      this.previewColor = null;
      this.drawPreview();
    });
    transparent.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(transparent, null);
    swatchesPanel.addActionListener(event => {
      this.previewColor = swatchesPanel.getSelectedColor();
      this.drawPreview();
    });
    colors.add(swatchesPanel, null);
    preview.setProperty("width", "" + width);
    preview.setProperty("height", "" + height);
    preview.cssAddClass("z4drawingtoolpanel-preview");
    panel.add(preview, gbc);
    if (hide) {
      transparent.getStyle().display = "none";
      swatchesPanel.getStyle().display = "none";
      preview.getStyle().display = "none";
    }
  }

   addTryMe(panel) {
    let colors = new JSPanel();
    panel.add(colors, new GBC(0, 0));
    this.transparentTryMe.addActionListener(event => {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
    });
    this.transparentTryMe.cssAddClass("z4drawingtoolpanel-transparent");
    colors.add(this.transparentTryMe, null);
    this.swatchesPanelTryMe.addActionListener(event => {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.ctxTryMe.fillStyle = Z4Constants.getStyle(this.swatchesPanelTryMe.getSelectedColor().getRGBA_HEX());
      this.ctxTryMe.fillRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxObjects.fillStyle = Z4Constants.getStyle(this.swatchesPanelTryMe.getSelectedColor().getRGBA_HEX());
      this.offscreenCtxObjects.fillRect(0, 0, this.widthTryMe, this.heightTryMe);
    });
    colors.add(this.swatchesPanelTryMe, null);
    this.previewTryMe.setProperty("width", "" + this.widthTryMe);
    this.previewTryMe.setProperty("height", "" + this.heightTryMe);
    this.previewTryMe.cssAddClass("z4drawingtoolpanel-preview");
    this.previewTryMe.addEventListener("mouseenter", event => this.onMouse(event, "enter"));
    this.previewTryMe.addEventListener("mouseleave", event => this.onMouse(event, "leave"));
    this.previewTryMe.addEventListener("mousedown", event => this.onMouse(event, "down"));
    this.previewTryMe.addEventListener("mousemove", event => this.onMouse(event, "move"));
    this.previewTryMe.addEventListener("mouseup", event => this.onMouse(event, "up"));
    panel.add(this.previewTryMe, new GBC(0, 1).wxy(1, 1).a(GBC.NORTH));
  }

   onMouse(event, type) {
    let x = Math.min(this.widthTryMe, Math.max(0, event.offsetX));
    let y = Math.min(this.heightTryMe, Math.max(0, event.offsetY));
    switch(type) {
      case "enter":
        this.pressedTryMe = event.buttons === 1;
        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
        break;
      case "down":
        this.pressedTryMe = true;
        this.onAction(Z4PointIteratorDrawingAction.START, x, y);
        break;
      case "move":
        this.onAction(Z4PointIteratorDrawingAction.CONTINUE, x, y);
        break;
      case "up":
        this.onStop(x, y);
        break;
      case "leave":
        if (this.pressedTryMe) {
          this.onStop(x, y);
        }
        break;
    }
  }

   onAction(action, x, y) {
    if (this.pressedTryMe && this.value.drawAction(action, x, y)) {
      this.iteratePoints(action);
    }
  }

   onStop(x, y) {
    this.pressedTryMe = false;
    if (this.value.drawAction(Z4PointIteratorDrawingAction.STOP, x, y)) {
      this.iteratePoints(Z4PointIteratorDrawingAction.STOP);
    }
  }

   iteratePoints(action) {
    if (action !== Z4PointIteratorDrawingAction.STOP) {
      while (this.drawNextPoint()) ;
      if (this.value.isInfinitePointGenerator() && this.pressedTryMe) {
        setTimeout(() => this.iteratePoints(action), this.value.getInfinitePointGeneratorSleep());
      }
    } else if (this.value.getNextCountOnSTOP()) {
      this.ctxTryMe.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
      Z4UI.pleaseWait(this.previewTryMe, true, true, false, true, "", () => this.iteratePoint(0));
    }
  }

   iteratePoint(value) {
    Z4UI.setPleaseWaitProgressBarValue(100 * value / this.value.getNextCountOnSTOP());
    if (this.drawNextPoint()) {
      Z4UI.pleaseWaitAdvanced(() => this.iteratePoint(value + 1));
    } else {
      Z4UI.pleaseWaitCompleted();
    }
  }

   drawNextPoint() {
    let next = this.value.next();
    if (!next) {
      return false;
    } else if (next.intent === Z4DrawingPointIntent.DRAW_OBJECTS) {
      this.offscreenCtxObjects.save();
      this.offscreenCtxObjects.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.offscreenCtxObjects.rotate(next.z4Vector.phase);
      this.value.draw(this.offscreenCtxObjects, next);
      this.offscreenCtxObjects.restore();
      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
      return true;
    } else {
      if (next.intent === Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
        this.offscreenCtxBounds.clearRect(0, 0, this.widthTryMe, this.heightTryMe);
      }
      this.offscreenCtxBounds.save();
      this.offscreenCtxBounds.translate(next.z4Vector.x0, next.z4Vector.y0);
      this.offscreenCtxBounds.rotate(next.z4Vector.phase);
      this.value.draw(this.offscreenCtxBounds, next);
      this.offscreenCtxBounds.restore();
      this.ctxTryMe.drawImage(this.offscreenObjects, 0, 0);
      this.ctxTryMe.drawImage(this.offscreenBounds, 0, 0);
      return true;
    }
  }

  /**
   * Adds an action
   *
   * @param text The text
   * @param gbc The constraints
   * @param listener The listener
   */
   addAction(text, gbc, listener) {
    let button = new JSButton();
    button.setText(text);
    button.addActionListener(listener);
    this.actions.add(button, gbc);
  }

  /**
   * Returns if the value is adjusting
   *
   * @return true if the value is adjusting, false otherwise
   */
   getValueIsAdjusting() {
    return this.valueIsAdjusting;
  }

   setValue(value) {
    this.value = value;
    this.name.setText(value.getName());
    this.setPointInterator();
    this.setPainter();
    this.setSpatioTemporalColor();
    this.setColorProgression();
    this.setColorProgressionSettings();
    this.drawPreview();
  }

   setPointInterator() {
    new Array("z4drawingtoolpanel-stamper-selected", "z4drawingtoolpanel-tracer-selected", "z4drawingtoolpanel-airbrush-selected", "z4drawingtoolpanel-spirograph-selected", "z4drawingtoolpanel-scatterer-selected").forEach(css => this.selectedPointInterator.cssRemoveClass(css));
    if (this.value.getPointIterator().getType() === Z4PointIteratorType.STAMPER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "STAMPER", "stamper", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.TRACER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "TRACER", "tracer", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.AIRBRUSH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "AIRBRUSH", "airbrush", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.SPIROGRAPH) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SPIROGRAPH", "spirograph", this.value.getPointIterator(), true);
    } else if (this.value.getPointIterator().getType() === Z4PointIteratorType.SCATTERER) {
      this.selectedPointInteratorCard = this.check(this.selectedPointInterator, "SCATTERER", "scatterer", this.value.getPointIterator(), true);
    }
  }

   setPainter() {
    new Array("z4drawingtoolpanel-shape2d-selected", "z4drawingtoolpanel-drop-selected", "z4drawingtoolpanel-brush-selected", "z4drawingtoolpanel-pattern-selected", "z4drawingtoolpanel-centered-figure-selected", "z4drawingtoolpanel-natural-figure-selected").forEach(css => this.selectedPainter.cssRemoveClass(css));
    if (this.value.getPainter().getType() === Z4PainterType.SHAPE_2D) {
      this.selectedPainterCard = this.check(this.selectedPainter, "SHAPE2D", "shape2d", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.DROP) {
      this.selectedPainterCard = this.check(this.selectedPainter, "DROP", "drop", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.BRUSH) {
      this.selectedPainterCard = this.check(this.selectedPainter, "BRUSH", "brush", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.PATTERN) {
      this.selectedPainterCard = this.check(this.selectedPainter, "PATTERN", "pattern", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.CENTERED_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "CENTERED-FIGURE", "centered-figure", this.value.getPainter(), false);
    } else if (this.value.getPainter().getType() === Z4PainterType.NATURAL_FIGURE) {
      this.selectedPainterCard = this.check(this.selectedPainter, "NATURAL-FIGURE", "natural-figure", this.value.getPainter(), false);
    }
  }

   setSpatioTemporalColor() {
    new Array("z4drawingtoolpanel-color-selected", "z4drawingtoolpanel-gradient-color-selected", "z4drawingtoolpanel-bigradient-color-selected").forEach(css => this.selectedSpatioTemporalColor.cssRemoveClass(css));
    if (this.value.getSpatioTemporalColor().isColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "COLOR", "color", this.value.getSpatioTemporalColor().getColor(), false);
    } else if (this.value.getSpatioTemporalColor().isGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "GRADIENT-COLOR", "gradient-color", this.value.getSpatioTemporalColor().getGradientColor(), false);
    } else if (this.value.getSpatioTemporalColor().isBiGradientColor()) {
      this.selectedSpatioTemporalColorCard = this.check(this.selectedSpatioTemporalColor, "BIGRADIENT-COLOR", "bigradient-color", this.value.getSpatioTemporalColor().getBiGradientColor(), false);
    }
  }

   setColorProgression() {
    new Array("z4drawingtoolpanel-spatial-selected", "z4drawingtoolpanel-temporal-selected", "z4drawingtoolpanel-relativetopath-selected", "z4drawingtoolpanel-random-selected", "z4drawingtoolpanel-airbrush-spatial-selected", "z4drawingtoolpanel-airbrush-temporal-selected", "z4drawingtoolpanel-airbrush-relativetopath-selected", "z4drawingtoolpanel-airbrush-random-selected").forEach(css => this.selectedColorProgression.cssRemoveClass(css));
    let css = (this.value.getPointIterator().getType() === Z4PointIteratorType.AIRBRUSH ? "airbrush-" : "") + ("" + this.value.getProgression().getColorProgressionBehavior()).toLowerCase().replaceAll("_", "");
    this.check(this.selectedColorProgression, "COLOR-PROGRESSION", css, this.value.getProgression(), false);
  }

   check(selected, card, css, value, show) {
    if (css) {
      selected.cssAddClass("z4drawingtoolpanel-" + css + "-selected");
    }
    if (!this.cardPanels[card]) {
      switch(card) {
        case "STAMPER":
          this.cardPanels[card] = new Z4StamperPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "TRACER":
          this.cardPanels[card] = new Z4TracerPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "AIRBRUSH":
          this.cardPanels[card] = new Z4AirbrushPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "SPIROGRAPH":
          this.cardPanels[card] = new Z4SpirographPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "SCATTERER":
          this.cardPanels[card] = new Z4ScattererPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "SHAPE2D":
          this.cardPanels[card] = new Z4Shape2DPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "DROP":
          this.cardPanels[card] = new Z4DropPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "BRUSH":
          this.cardPanels[card] = new Z4BrushPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "PATTERN":
          this.cardPanels[card] = new Z4PatternPainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "CENTERED-FIGURE":
          this.cardPanels[card] = new Z4CenteredFigurePainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "NATURAL-FIGURE":
          this.cardPanels[card] = new Z4NaturalFigurePainterPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "COLOR":
          this.cardPanels[card] = new Z4ColorPanel();
          (this.cardPanels[card]).getStyle().minWidth = "15rem";
          break;
        case "GRADIENT-COLOR":
          this.cardPanels[card] = new Z4GradientColorPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "BIGRADIENT-COLOR":
          this.cardPanels[card] = new Z4BiGradientColorPanel();
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
        case "COLOR-PROGRESSION":
          this.cardPanels[card] = new Z4ColorProgressionPanel(Z4ColorProgressionPanelOrientation.HORIZONTALLY_COMPACT);
          (this.cardPanels[card]).addChangeListener(event => this.valueIsAdjusting = (this.cardPanels[card]).getValueIsAdjusting());
          break;
      }
      (this.cardPanels[card]).addChangeListener(event => {
        this.createValue();
        this.drawPreview();
        this.onchange();
      });
      this.cardPanel.add(this.cardPanels[card], card);
    }
    if (value) {
      (this.cardPanels[card]).setValue(value);
    }
    if (show) {
      (this.radios[card]).setSelected(true);
      this.cardLayout.show(this.cardPanel, card);
    }
    return card;
  }

   createValue() {
    let pointIterator = (this.cardPanels[this.selectedPointInteratorCard]).getValue();
    let options = new Object();
    if (pointIterator.getType() === Z4PointIteratorType.SPIROGRAPH) {
      options["drawWhileMoving"] = (pointIterator).isDrawWhileMoving();
    }
    let painter = (this.cardPanels[this.selectedPainterCard]).getValue();
    let spatioTemporalColor = null;
    let colorProgressionPanel = this.cardPanels["COLOR-PROGRESSION"];
    switch(this.selectedSpatioTemporalColorCard) {
      case "COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, true, false, false);
        break;
      case "GRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromGradientColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, false, true, false);
        break;
      case "BIGRADIENT-COLOR":
        spatioTemporalColor = Z4SpatioTemporalColor.fromBiGradientColor((this.cardPanels[this.selectedSpatioTemporalColorCard]).getValue());
        colorProgressionPanel.setProgressionSettings(pointIterator.getType(), options, false, false, true);
        break;
    }
    let progression = colorProgressionPanel.getValue();
    let currentName = this.name.getText();
    this.value = new Z4DrawingTool(currentName ? currentName : Z4Translations.DRAWING_TOOL, pointIterator, painter, spatioTemporalColor, progression);
    this.setColorProgression();
  }

   setColorProgressionSettings() {
    let options = new Object();
    if (this.value.getPointIterator().getType() === Z4PointIteratorType.SPIROGRAPH) {
      options["drawWhileMoving"] = (this.value.getPointIterator()).isDrawWhileMoving();
    }
    (this.cardPanels["COLOR-PROGRESSION"]).setProgressionSettings(this.value.getPointIterator().getType(), options, this.value.getSpatioTemporalColor().isColor(), this.value.getSpatioTemporalColor().isGradientColor(), this.value.getSpatioTemporalColor().isBiGradientColor());
  }

   drawPreview() {
    clearTimeout(this.currentTimeoutID);
    this.currentTimeoutID = setTimeout(() => {
      if (this.preview1.getStyle().display !== "none") {
        this.ctx1.clearRect(0, 0, 500, 300);
        if (this.previewColor) {
          this.ctx1.fillStyle = Z4Constants.getStyle(this.previewColor.getRGBA_HEX());
          this.ctx1.fillRect(0, 0, 500, 300);
        }
        this.value.getPointIterator().drawDemo(this.ctx1, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 500, 300, this.valueIsAdjusting);
      } else {
        this.ctx2.clearRect(0, 0, 300, 500);
        if (this.previewColor) {
          this.ctx2.fillStyle = Z4Constants.getStyle(this.previewColor.getRGBA_HEX());
          this.ctx2.fillRect(0, 0, 300, 500);
        }
        this.value.getPointIterator().drawDemo(this.ctx2, this.value.getPainter(), this.value.getSpatioTemporalColor(), this.value.getProgression(), 300, 500, this.valueIsAdjusting);
      }
    }, 0);
  }
}
/**
 * The panel to manage the grid of a canvas
 *
 * @author gianpiero.diblasi
 */
class Z4CanvasGridPanel extends JSDropDown {

   showGridLabel = new JSComponent(document.createElement("img"));

   dottedGridLabel = new JSComponent(document.createElement("img"));

   magneticGridLabel = new JSComponent(document.createElement("img"));

   colorPanelLabel = new Z4ColorPanel();

   xLabel = new JSLabel();

   yLabel = new JSLabel();

   distanceLabel = new JSLabel();

   angleLabel = new JSLabel();

   deltaXLabel = new JSLabel();

   deltaYLabel = new JSLabel();

   vline1 = null;

   vline2 = null;

   vline3 = null;

   showGridCheckBox = new JSCheckBox();

   dottedGridCheckBox = new JSCheckBox();

   magneticGridCheckBox = new JSCheckBox();

   colorPanel = new Z4ColorPanel();

   offsetXSlider = new JSSlider();

   offsetXSpinner = new JSSpinner();

   offsetYSlider = new JSSlider();

   offsetYSpinner = new JSSpinner();

   plotWidthSlider = new JSSlider();

   plotWidthSpinner = new JSSpinner();

   canvas = null;

   center = null;

  /**
   * Creates the object
   */
  constructor() {
    super(".z4canvasgridpanel-editor");
    this.cssAddClass("z4canvasgridpanel");
    let summary = new JSPanel();
    summary.setLayout(new GridBagLayout());
    this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid");
    summary.add(this.showGridLabel, new GBC(0, 0).h(2).i(0, 0, 0, 5));
    this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid");
    summary.add(this.dottedGridLabel, new GBC(1, 0).h(2).i(0, 0, 0, 5));
    this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid");
    summary.add(this.magneticGridLabel, new GBC(2, 0).h(2).i(0, 0, 0, 5));
    this.colorPanelLabel.setEditButtonVisible(false);
    this.colorPanelLabel.getChilStyleByQuery(".jscolorpreview").height = "14px";
    this.colorPanelLabel.getStyle().width = "14px";
    summary.add(this.colorPanelLabel, new GBC(3, 0).h(2));
    this.vline1 = Z4UI.addVLine(summary, new GBC(4, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.xLabel.getStyle().fontFamily = "monospace";
    this.xLabel.getStyle().fontSize = "smaller";
    summary.add(this.xLabel, new GBC(5, 0));
    this.yLabel.getStyle().fontFamily = "monospace";
    this.yLabel.getStyle().fontSize = "smaller";
    summary.add(this.yLabel, new GBC(5, 1).a(GBC.WEST));
    this.vline2 = Z4UI.addVLine(summary, new GBC(6, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.distanceLabel.getStyle().fontFamily = "monospace";
    this.distanceLabel.getStyle().fontSize = "smaller";
    summary.add(this.distanceLabel, new GBC(7, 0));
    this.angleLabel.getStyle().fontFamily = "monospace";
    this.angleLabel.getStyle().fontSize = "smaller";
    summary.add(this.angleLabel, new GBC(7, 1));
    this.vline3 = Z4UI.addVLine(summary, new GBC(8, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.deltaXLabel.getStyle().fontFamily = "monospace";
    this.deltaXLabel.getStyle().fontSize = "smaller";
    summary.add(this.deltaXLabel, new GBC(9, 0));
    this.deltaYLabel.getStyle().fontFamily = "monospace";
    this.deltaYLabel.getStyle().fontSize = "smaller";
    summary.add(this.deltaYLabel, new GBC(9, 1).a(GBC.WEST));
    this.appendChildInTree("summary", summary);
    let panel = new JSPanel();
    panel.cssAddClass("z4canvasgridpanel-editor");
    panel.setLayout(new GridBagLayout());
    this.showGridCheckBox.setText(Z4Translations.SHOW_GRID);
    this.showGridCheckBox.addActionListener(event => this.onchange(false, null, null));
    panel.add(this.showGridCheckBox, new GBC(0, 7).w(2).a(GBC.WEST));
    this.dottedGridCheckBox.setText(Z4Translations.DOTTED_GRID);
    this.dottedGridCheckBox.addActionListener(event => this.onchange(false, null, null));
    panel.add(this.dottedGridCheckBox, new GBC(0, 6).w(2).a(GBC.WEST));
    this.magneticGridCheckBox.setText(Z4Translations.MAGNETIC_GRID);
    this.magneticGridCheckBox.addActionListener(event => this.onchange(false, null, null));
    panel.add(this.magneticGridCheckBox, new GBC(0, 5).w(2).a(GBC.WEST));
    this.colorPanel.setLabel(Z4Translations.COLOR);
    this.colorPanel.setOpacityVisible(false);
    this.colorPanel.addChangeListener(event => this.onchange(false, null, null));
    panel.add(this.colorPanel, new GBC(0, 4).w(2).a(GBC.WEST).f(GBC.HORIZONTAL));
    this.plotWidthSlider.addChangeListener(event => this.onchange(false, this.plotWidthSpinner, this.plotWidthSlider));
    panel.add(this.plotWidthSlider, new GBC(0, 3).w(2).f(GBC.HORIZONTAL));
    this.plotWidthSpinner.cssAddClass("jsspinner_w_4rem");
    this.plotWidthSpinner.addChangeListener(event => this.onchange(true, this.plotWidthSpinner, this.plotWidthSlider));
    panel.add(this.plotWidthSpinner, new GBC(1, 2).a(GBC.EAST));
    Z4UI.addLabel(panel, Z4Translations.PLOT_WIDTH, new GBC(0, 2).a(GBC.WEST));
    this.offsetXSlider.getStyle().minWidth = "20.4rem";
    this.offsetXSlider.addChangeListener(event => this.onchange(false, this.offsetXSpinner, this.offsetXSlider));
    panel.add(this.offsetXSlider, new GBC(0, 1).w(2).f(GBC.HORIZONTAL));
    this.offsetXSpinner.cssAddClass("jsspinner_w_4rem");
    this.offsetXSpinner.addChangeListener(event => this.onchange(true, this.offsetXSpinner, this.offsetXSlider));
    panel.add(this.offsetXSpinner, new GBC(1, 0).a(GBC.EAST));
    Z4UI.addLabel(panel, Z4Translations.OFFSET_X, new GBC(0, 0).a(GBC.WEST));
    Z4UI.addVLine(panel, new GBC(2, 0).h(8).f(GBC.VERTICAL).i(1, 2, 1, 2));
    Z4UI.addLabel(panel, Z4Translations.OFFSET_Y, new GBC(3, 4).h(4).a(GBC.SOUTH)).cssAddClass("jslabel-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner-vertical");
    this.offsetYSpinner.cssAddClass("jsspinner_h_4rem");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(2)", "textContent", "\u25B6");
    this.offsetYSpinner.setChildPropertyByQuery("*:nth-child(3)", "textContent", "\u25C0");
    this.offsetYSpinner.addChangeListener(event => this.onchange(true, this.offsetYSpinner, this.offsetYSlider));
    panel.add(this.offsetYSpinner, new GBC(3, 0).h(4).a(GBC.NORTH));
    this.offsetYSlider.setOrientation(JSSlider.VERTICAL);
    this.offsetYSlider.setInverted(true);
    this.offsetYSlider.getStyle().minWidth = "1.5rem";
    this.offsetYSlider.addChangeListener(event => this.onchange(false, this.offsetYSpinner, this.offsetYSlider));
    panel.add(this.offsetYSlider, new GBC(4, 0).h(8).wy(1).a(GBC.NORTH).f(GBC.VERTICAL));
    this.appendChild(panel);
    this.reset(Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.DEFAULT_IMAGE_SIZE, false);
  }

   onchange(spTosl, spinner, slider) {
    if (spinner && spTosl) {
      slider.setValue(spinner.getValue());
    } else if (spinner) {
      spinner.setValue(slider.getValue());
    }
    this.center = new Point(this.offsetXSlider.getValue(), this.offsetYSlider.getValue());
    this.showGridLabel.cssRemoveClass("z4canvasgridpanel-showgrid-on");
    this.showGridLabel.cssRemoveClass("z4canvasgridpanel-showgrid-off");
    this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid-" + (this.showGridCheckBox.isSelected() ? "on" : "off"));
    this.dottedGridLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.dottedGridLabel.cssRemoveClass("z4canvasgridpanel-dottedgrid-on");
    this.dottedGridLabel.cssRemoveClass("z4canvasgridpanel-dottedgrid-off");
    this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid-" + (this.dottedGridCheckBox.isSelected() ? "on" : "off"));
    this.dottedGridCheckBox.setEnabled(this.showGridCheckBox.isSelected());
    this.magneticGridLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.magneticGridLabel.cssRemoveClass("z4canvasgridpanel-magneticgrid-on");
    this.magneticGridLabel.cssRemoveClass("z4canvasgridpanel-magneticgrid-off");
    this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid-" + (this.magneticGridCheckBox.isSelected() ? "on" : "off"));
    this.magneticGridCheckBox.setEnabled(this.showGridCheckBox.isSelected());
    this.colorPanelLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.colorPanelLabel.setValue(this.colorPanel.getValue());
    this.colorPanel.setEnabled(this.showGridCheckBox.isSelected());
    this.xLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.xLabel.setText("X: " + new Number(this.center.x).toFixed(0).padStart(4, "\u00A0") + "px");
    this.yLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.yLabel.setText("Y: " + new Number(this.center.y).toFixed(0).padStart(4, "\u00A0") + "px");
    this.distanceLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.angleLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.deltaXLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.deltaYLabel.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline1.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline2.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.vline3.getStyle().visibility = this.showGridCheckBox.isSelected() ? "visible" : "hidden";
    this.plotWidthSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.plotWidthSlider.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetXSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetXSlider.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetYSpinner.setEnabled(this.showGridCheckBox.isSelected());
    this.offsetYSlider.setEnabled(this.showGridCheckBox.isSelected());
    this.canvas.setGrid(this.showGridCheckBox.isSelected(), this.center, this.plotWidthSlider.getValue(), this.dottedGridCheckBox.isSelected(), this.magneticGridCheckBox.isSelected(), this.colorPanelLabel.getValue());
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
   setMousePosition(x, y) {
    let distance = Z4Math.distance(this.center.x, this.center.y, x, y);
    let angle = Z4Math.rad2deg(Z4Math.atan(this.center.x, this.center.y, x, y));
    let deltaX = Math.abs(this.center.x - x);
    let deltaY = Math.abs(this.center.y - y);
    let diff = 0;
    eval("diff = Z4Translations.DISTANCE.length - Z4Translations.ANGLE.length;");
    this.distanceLabel.setText(Z4Translations.DISTANCE + ": " + new Number(distance).toFixed(2).padStart(7 + (diff < 0 ? -diff : 0), "\u00A0") + "px");
    this.angleLabel.setText(Z4Translations.ANGLE + ": " + new Number(angle).toFixed(2).padStart(7 + (diff > 0 ? diff : 0), "\u00A0") + "\u00B0\u00A0");
    this.deltaXLabel.setText(Z4Translations.DELTA_X + ": " + new Number(deltaX).toFixed(0).padStart(4, "\u00A0") + "px");
    this.deltaYLabel.setText(Z4Translations.DELTA_Y + ": " + new Number(deltaY).toFixed(0).padStart(4, "\u00A0") + "px");
  }

  /**
   * Resets the panel
   *
   * @param width The canvas width
   * @param height The canvas height
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
   reset(width, height, resetOnlySize) {
    let value = 0.0;
    if (!resetOnlySize) {
      this.showGridLabel.cssRemoveClass("z4canvasgridpanel-showgrid-on");
      this.showGridLabel.cssAddClass("z4canvasgridpanel-showgrid-off");
      this.showGridCheckBox.setSelected(false);
      this.dottedGridLabel.getStyle().visibility = "hidden";
      this.dottedGridLabel.cssRemoveClass("z4canvasgridpanel-dottedgrid-on");
      this.dottedGridLabel.cssAddClass("z4canvasgridpanel-dottedgrid-off");
      this.dottedGridCheckBox.setSelected(false);
      this.dottedGridCheckBox.setEnabled(false);
      this.magneticGridLabel.getStyle().visibility = "hidden";
      this.magneticGridLabel.cssRemoveClass("z4canvasgridpanel-magneticgrid-on");
      this.magneticGridLabel.cssAddClass("z4canvasgridpanel-magneticgrid-off");
      this.magneticGridCheckBox.setSelected(false);
      this.magneticGridCheckBox.setEnabled(false);
      this.colorPanelLabel.getStyle().visibility = "hidden";
      this.colorPanelLabel.setValue(new Color(0, 0, 0, 255));
      this.colorPanel.setEnabled(false);
      this.colorPanel.setValue(new Color(0, 0, 0, 255));
      this.xLabel.getStyle().visibility = "hidden";
      this.yLabel.getStyle().visibility = "hidden";
      this.distanceLabel.getStyle().visibility = "hidden";
      this.angleLabel.getStyle().visibility = "hidden";
      this.deltaXLabel.getStyle().visibility = "hidden";
      this.deltaYLabel.getStyle().visibility = "hidden";
      this.vline1.getStyle().visibility = "hidden";
      this.vline2.getStyle().visibility = "hidden";
      this.vline3.getStyle().visibility = "hidden";
      value = 20;
    } else {
      value = this.plotWidthSpinner.getValue();
    }
    this.plotWidthSpinner.setEnabled(false);
    this.plotWidthSpinner.setModel(new SpinnerNumberModel(value, 5, parseInt(Math.min(width, height) / 2), 1));
    this.plotWidthSlider.setEnabled(false);
    this.plotWidthSlider.setMinimum(5);
    this.plotWidthSlider.setMaximum(parseInt(Math.min(width, height) / 2));
    this.plotWidthSlider.setValue(value);
    this.center = new Point(parseInt(width / 2), parseInt(height / 2));
    this.offsetXSpinner.setEnabled(false);
    this.offsetXSpinner.setModel(new SpinnerNumberModel(this.center.x, 0, width, 1));
    this.offsetXSlider.setEnabled(false);
    this.offsetXSlider.setMaximum(width);
    this.offsetXSlider.setValue(this.center.x);
    this.offsetYSpinner.setEnabled(false);
    this.offsetYSpinner.setModel(new SpinnerNumberModel(this.center.y, 0, height, 1));
    this.offsetYSlider.setEnabled(false);
    this.offsetYSlider.setMaximum(height);
    this.offsetYSlider.setValue(this.center.y);
  }
}
/**
 * The panel to configure the export to file
 *
 * @author gianpiero.diblasi
 */
class Z4ExportToFilePanel extends JSPanel {

   filename = new JSTextField();

   png = new JSRadioButton();

   jpg = new JSRadioButton();

   qualitySlider = new JSSlider();

   qualitySpinner = new JSSpinner();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4exporttofilepanel");
    this.setLayout(new GridBagLayout());
    Z4UI.addLabel(this, Z4Translations.FILENAME, new GBC(0, 0).a(GBC.WEST));
    this.filename.addActionListener(event => this.onchange());
    this.add(this.filename, new GBC(0, 1).w(2).f(GBC.HORIZONTAL).wx(1));
    let group = new ButtonGroup();
    group.add(this.png);
    group.add(this.jpg);
    this.addRadio(this.png, true, "PNG", 0);
    this.addRadio(this.jpg, false, "JPG", 1);
    Z4UI.addLabel(this, Z4Translations.QUALITY, new GBC(0, 3).a(GBC.WEST));
    this.qualitySlider.setEnabled(false);
    this.qualitySlider.setValue(100);
    this.qualitySlider.addChangeListener(event => this.qualitySpinner.setValue(this.qualitySlider.getValue()));
    this.add(this.qualitySlider, new GBC(0, 4).w(2).f(GBC.HORIZONTAL).wx(1));
    this.qualitySpinner.cssAddClass("jsspinner_w_3rem");
    this.qualitySpinner.setEnabled(false);
    this.qualitySpinner.setModel(new SpinnerNumberModel(100, 0, 100, 1));
    this.qualitySpinner.addChangeListener(event => this.qualitySlider.setValue(this.qualitySpinner.getValue()));
    this.add(this.qualitySpinner, new GBC(1, 3).a(GBC.EAST));
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

   addRadio(button, selected, text, gridx) {
    button.setSelected(selected);
    button.setText(text);
    button.addActionListener(event => {
      this.qualitySlider.setEnabled(!selected);
      this.qualitySpinner.setEnabled(!selected);
    });
    this.add(button, new GBC(gridx, 2).a(GBC.WEST));
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Check if this panel has a valid content
   *
   * @return true if this panel has a valid content, false otherwise
   */
   isValid() {
    return !!(this.filename.getText());
  }

  /**
   * Sets the file name
   *
   * @param filename The file name
   */
   setFilename(filename) {
    this.filename.setText(filename);
  }

  /**
   * Returns the file name
   *
   * @return The file name
   */
   getFilename() {
    return this.filename.getText();
  }

  /**
   * Sets the editability of the file name
   *
   * @param b true to sets the editability of the file name, false otherwise
   */
   setFilenameEditable(b) {
    this.filename.setEditable(b);
  }

  /**
   * Returns the file extension
   *
   * @return The file extension
   */
   getFileExtension() {
    return this.png.isSelected() ? ".png" : ".jpg";
  }

  /**
   * Sets the file extension
   *
   * @param ext The file extension
   */
   setFileExtension(ext) {
    switch(ext) {
      case ".png":
        this.png.setSelected(true);
        break;
      case ".jpg":
        this.jpg.setSelected(true);
        break;
    }
    this.qualitySlider.setEnabled(ext === ".jpg");
    this.qualitySpinner.setEnabled(ext === ".jpg");
  }

  /**
   * Enables the extensions
   *
   * @param b true to enable the extensions, false othewise
   */
   setFileExtensionEnabled(b) {
    this.png.setEnabled(b);
    this.jpg.setEnabled(b);
  }

  /**
   * Returns the quality in the range [0,1]
   *
   * @return The quality in the range [0,1]
   */
   getQuality() {
    return this.qualitySpinner.getValue() / 100;
  }
}
/**
 * The panel to manage a filling
 *
 * @author gianpiero.diblasi
 */
class Z4FillingPanel extends JSPanel {

   cardFillerSelectors = new Array("FLAT", "LINEAR", "VERTEX", "CONIC", "SPIRAL", "BEZIER", "SINUSOIDAL", "TEXTURE", "BIGRADIENT");

   cardFillerPanels = new Array(new JSPanel(), null, null, null, null, null, null, null, new JSPanel());

   cardFillerEvalPanels = new Array("", "new Z4LinearFillerPanel()", "new Z4VertexBasedFillerPanel()", "new Z4ConicFillerPanel()", "new Z4SpiralFillerPanel()", "new Z4BezierFillerPanel()", "new Z4SinusoidalFillerPanel()", "new Z4TextureFillerPanel()", "");

   cardColorSelectors = new Array("FLAT", "GRADIENT", "NONE", "BIGRADIENT");

   cardColorPanels = new Array(new Z4ColorPanel(), new Z4GradientColorPanel(), new JSPanel(), new Z4BiGradientColorPanel());

   width = Z4Constants.DEFAULT_IMAGE_SIZE;

   height = Z4Constants.DEFAULT_IMAGE_SIZE;

   selectedFillerSelector = "FLAT";

   selectedFillerPanel = this.cardFillerPanels[0];

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.setLayout(new GridBagLayout());
    this.cssAddClass("z4fillingpanel");
    let panelRadio = new JSPanel();
    panelRadio.setLayout(new BoxLayout(panelRadio, BoxLayout.Y_AXIS));
    this.add(panelRadio, new GBC(0, 0).wy(1));
    Z4UI.addVLine(this, new GBC(1, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));
    let panelColor = new JSPanel();
    let cardColor = new CardLayout(0, 0);
    panelColor.setLayout(cardColor);
    this.add(panelColor, new GBC(2, 0).wxy(1, 1).a(GBC.NORTH).i(5, 0, 0, 0));
    Z4UI.addVLine(this, new GBC(3, 0).wy(1).a(GBC.NORTH).f(GBC.VERTICAL).i(1, 5, 1, 5));
    let panelFiller = new JSPanel();
    let cardFiller = new CardLayout(0, 0);
    panelFiller.setLayout(cardFiller);
    panelFiller.getStyle().display = "none";
    this.add(panelFiller, new GBC(4, 0).wxy(1, 1).a(GBC.NORTH));
    let colorPanel = this.cardColorPanels[0];
    colorPanel.setLabel(Z4Translations.FILLING_COLOR);
    colorPanel.setValue(new Color(255, 255, 255, 255));
    colorPanel.getStyle().minWidth = "15rem";
    let gradientColorPanel = this.cardColorPanels[1];
    gradientColorPanel.addChangeListener(event => {
      switch(this.selectedFillerSelector) {
        case "FLAT":
          break;
        case "LINEAR":
        case "VERTEX":
        case "CONIC":
        case "SPIRAL":
        case "BEZIER":
        case "SINUSOIDAL":
          (this.selectedFillerPanel).setGradientColor(gradientColorPanel.getValue());
          (this.selectedFillerPanel).drawPreview(gradientColorPanel.getValueIsAdjusting());
          break;
        case "TEXTURE":
          break;
        case "BIGRADIENT":
      }
    });
    (this.cardColorPanels[3]).setSpaceTimeLabelsVisible(false);
    let buttonGroup = new ButtonGroup();
    this.cardFillerSelectors.forEach((card, index, array) => {
      let radio = new JSRadioButton();
      radio.setContentAreaFilled(false);
      radio.getStyle().marginBottom = "1px";
      radio.setToggle();
      radio.setSelected(index === 0);
      radio.setIcon(new Z4EmptyImageProducer(index));
      radio.addActionListener(event => {
        this.selectedFillerSelector = card;
        if (this.cardFillerPanels[index]) {
          this.selectedFillerPanel = this.cardFillerPanels[index];
          this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
        } else if (card === "BEZIER") {
          Z4UI.pleaseWait(this, false, false, false, false, "", () => {
            this.selectedFillerPanel = eval(this.cardFillerEvalPanels[index]);
            this.afterEval(panelFiller, card, index, gradientColorPanel);
            this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
          });
        } else {
          this.selectedFillerPanel = eval(this.cardFillerEvalPanels[index]);
          this.afterEval(panelFiller, card, index, gradientColorPanel);
          this.afterSelection(panelFiller, cardFiller, card, panelColor, cardColor);
        }
      });
      buttonGroup.add(radio);
      panelRadio.add(radio, null);
      switch(card) {
        case "FLAT":
          panelFiller.add(this.cardFillerPanels[index], card);
          break;
        case "LINEAR":
        case "VERTEX":
        case "CONIC":
        case "SPIRAL":
        case "BEZIER":
        case "SINUSOIDAL":
        case "TEXTURE":
          break;
        case "BIGRADIENT":
          panelFiller.add(this.cardFillerPanels[index], card);
          break;
      }
    });
    this.cardColorSelectors.forEach((card, index, array) => panelColor.add(this.cardColorPanels[index], card));
  }

   afterEval(panelFiller, card, index, gradientColorPanel) {
    (this.selectedFillerPanel).setSize(this.width, this.height);
    (this.selectedFillerPanel).setGradientColor(gradientColorPanel.getValue());
    this.cardFillerPanels[index] = this.selectedFillerPanel;
    panelFiller.add(this.selectedFillerPanel, card);
  }

   afterSelection(panelFiller, cardFiller, card, panelColor, cardColor) {
    cardFiller.show(panelFiller, card);
    switch(card) {
      case "FLAT":
        cardColor.show(panelColor, "FLAT");
        panelFiller.getStyle().display = "none";
        panelColor.getStyle().display = "block";
        break;
      case "LINEAR":
      case "VERTEX":
      case "CONIC":
      case "SPIRAL":
      case "BEZIER":
      case "SINUSOIDAL":
        cardColor.show(panelColor, "GRADIENT");
        panelFiller.getStyle().display = "block";
        panelColor.getStyle().display = "block";
        (this.selectedFillerPanel).drawPreview(false);
        break;
      case "TEXTURE":
        cardColor.show(panelColor, "NONE");
        panelFiller.getStyle().display = "block";
        panelColor.getStyle().display = "none";
        break;
      case "BIGRADIENT":
        cardColor.show(panelColor, "BIGRADIENT");
        panelFiller.getStyle().display = "none";
        panelColor.getStyle().display = "block";
        break;
    }
  }

  /**
   * Returns the selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   *
   * @return The selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   getSelectedFilling() {
    switch(this.selectedFillerSelector) {
      case "FLAT":
        return (this.cardColorPanels[0]).getValue();
      case "LINEAR":
      case "VERTEX":
      case "CONIC":
      case "SPIRAL":
      case "BEZIER":
      case "SINUSOIDAL":
      case "TEXTURE":
        return (this.selectedFillerPanel).getSelectedFiller();
      case "BIGRADIENT":
        return (this.cardColorPanels[3]).getValue();
      default:
        return null;
    }
  }

  /**
   * Sets the preview size
   *
   * @param width The width
   * @param height The height
   */
   setSize(width, height) {
    if (width > 0 && height > 0) {
      this.width = width;
      this.height = height;
      this.cardFillerSelectors.forEach((card, index, array) => {
        switch(card) {
          case "FLAT":
            break;
          case "LINEAR":
          case "VERTEX":
          case "CONIC":
          case "SPIRAL":
          case "BEZIER":
          case "SINUSOIDAL":
          case "TEXTURE":
            if (this.cardFillerPanels[index]) {
              (this.cardFillerPanels[index]).setSize(width, height);
            }
            break;
          case "BIGRADIENT":
            break;
        }
      });
      this.cardColorSelectors.forEach((card, index, array) => {
        switch(card) {
          case "FLAT":
            break;
          case "GRADIENT":
            break;
          case "NONE":
            break;
          case "BIGRADIENT":
            (this.cardColorPanels[index]).setSize(width, height);
            break;
        }
      });
    }
  }
}
/**
 * The panel to merge layers
 *
 * @author gianpiero.diblasi
 */
class Z4MergeLayerPanel extends JSPanel {

   checkboxes = new Array();

   layers = new Array();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4mergelayerpanel");
    this.setLayout(new GridBagLayout());
    let button = new JSButton();
    button.setText(Z4Translations.MERGE_VISIBLE_LAYERS);
    button.addActionListener(event => {
      this.layers.forEach((layer, index, array) => this.checkboxes[index].setSelected(!layer.isHidden()));
      this.onchange();
    });
    this.add(button, new GBC(0, 0).i(0, 0, 0, 2));
    button = new JSButton();
    button.setText(Z4Translations.MERGE_ALL_LAYERS);
    button.addActionListener(event => {
      this.checkboxes.forEach((checkbox, index, array) => checkbox.setSelected(true));
      this.onchange();
    });
    this.add(button, new GBC(1, 0).i(0, 2, 0, 0));
  }

  /**
   * Returns the selected layers
   *
   * @return The selected layers
   */
   getSelectedLayers() {
    let selected = new Array();
    this.checkboxes.forEach((checkbox, index, array) => {
      if (checkbox.isSelected()) {
        selected.push(this.layers[index]);
      }
    });
    return selected;
  }

  /**
   * Sets the canvas
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    for (let index = 0; index < canvas.getLayersCount(); index++) {
      let layer = canvas.getLayerAt(index);
      let label = new JSLabel();
      label.setText(Z4LayerPreview.VISIBLE_LAYER_CONTENT);
      if (!layer.isHidden()) {
        label.getStyle().color = "var(--main-action-bgcolor)";
      }
      this.add(label, new GBC(0, index + 1).a(GBC.EAST).i(0, 0, 0, 2));
      let checkbox = new JSCheckBox();
      checkbox.setText(layer.getName());
      checkbox.addActionListener(event => this.onchange());
      this.add(checkbox, new GBC(1, index + 1).a(GBC.WEST));
      this.checkboxes.push(checkbox);
      this.layers.push(layer);
    }
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }
}
/**
 * The panel to create a new image
 *
 * @author gianpiero.diblasi
 */
class Z4NewImagePanel extends JSTabbedPane {

   width = new JSSpinner();

   height = new JSSpinner();

   resolution = new JSSpinner();

   dimensionMM = new JSLabel();

   dimensionIN = new JSLabel();

   fillingPanel = new Z4FillingPanel();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4newimagepanel");
    this.getStyle().width = "60rem";
    this.getStyle().height = "45rem";
    let panel = new JSPanel();
    panel.setLayout(new GridBagLayout());
    this.addTab(Z4Translations.DIMENSION, panel);
    Z4UI.addLabel(panel, Z4Translations.WIDTH + " (px)", new GBC(1, 0).a(GBC.WEST).i(5, 0, 0, 5));
    this.addSpinner(panel, this.width, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 1);
    Z4UI.addLabel(panel, Z4Translations.HEIGHT + " (px)", new GBC(2, 0).a(GBC.WEST).i(5, 5, 0, 5));
    this.addSpinner(panel, this.height, Z4Constants.DEFAULT_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 2, 1);
    Z4UI.addLabel(panel, Z4Translations.RESOLUTION + " (dpi)", new GBC(3, 0).a(GBC.WEST).i(5, 0, 0, 5));
    this.addSpinner(panel, this.resolution, Z4Constants.DEFAULT_DPI, Z4Constants.MAX_DPI, 3, 1);
    panel.add(this.dimensionMM, new GBC(1, 2).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    panel.add(this.dimensionIN, new GBC(1, 3).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    let p1 = new JSPanel();
    p1.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 5));
    Z4Constants.STANDARD_IMAGE_SIZE.forEach(dimension => this.addButton(p1, dimension));
    panel.add(p1, new GBC(0, 4).w(5).i(5, 0, 0, 0));
    let p2 = new JSPanel();
    p2.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 5));
    Z4Constants.STANDARD_IMAGE_SIZE.forEach(dimension => this.addButton(p2, new Dimension(dimension.height, dimension.width)));
    panel.add(p2, new GBC(0, 5).w(5).wy(1).a(GBC.NORTH).i(5, 0, 0, 0));
    this.addTab(Z4Translations.FILLING, this.fillingPanel);
    this.setDimensions();
  }

   addSpinner(panel, spinner, value, max, gridx, gridy) {
    spinner.setModel(new SpinnerNumberModel(value, 1, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event => this.setDimensions());
    panel.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 0, 0, 5));
  }

   addButton(panel, dimension) {
    let button = new JSButton();
    button.setText(dimension.width + " x " + dimension.height);
    button.addActionListener(event => {
      this.width.setValue(dimension.width);
      this.height.setValue(dimension.height);
      this.setDimensions();
    });
    panel.add(button, null);
  }

   setDimensions() {
    let w = this.width.getValue();
    let h = this.height.getValue();
    let res = this.resolution.getValue();
    let dimWIN = w / res;
    let dimHIN = h / res;
    this.dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    this.dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
    this.fillingPanel.setSize(w, h);
    this.onchange();
  }

  /**
   * Sets the selected size
   *
   * @param width The selected width
   * @param height The selected height
   */
   setSelectedSize(width, height) {
    this.width.setValue(width);
    this.height.setValue(height);
    this.setDimensions();
  }

  /**
   * Returns the selected size
   *
   * @return The selected size
   */
   getSelectedSize() {
    return new Dimension(this.width.getValue(), this.height.getValue());
  }

  /**
   * Returns the selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   *
   * @return The selected filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   */
   getSelectedFilling() {
    return this.fillingPanel.getSelectedFilling();
  }

   addChangeListener(listener) {
    this.listeners.push(listener);
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
/**
 * The panel to open the drawing tools from library
 *
 * @author gianpiero.diblasi
 */
class Z4OpenDrawingToolsFromLibraryPanel extends JSPanel {

   checkboxes = new Array();

   drawingTools = new Array();

   listeners = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4opendrawingtoolsfromlibrarypanel");
    this.setLayout(new GridBagLayout());
    let json = null;
    eval("json = z4drawingtool_library");
    json.sort((obj1, obj2) => {
      let name1 = obj1[Z4Translations.CURRENT_LANGUAGE.key];
      let name2 = obj2[Z4Translations.CURRENT_LANGUAGE.key];
      let response = 0;
      eval("response = name1 < name2 ? -1 : +1");
      return response;
    }).forEach((obj, index, array) => {
      let checkbox = new JSCheckBox();
      checkbox.setText(obj[Z4Translations.CURRENT_LANGUAGE.key]);
      checkbox.addActionListener(event => this.onchange());
      this.add(checkbox, new GBC(0, index).a(GBC.WEST));
      this.checkboxes.push(checkbox);
      let z4drawingtool = obj["z4drawingtool"];
      z4drawingtool["name"] = obj[Z4Translations.CURRENT_LANGUAGE.key];
      this.drawingTools.push(z4drawingtool);
    });
  }

  /**
   * Returns the selected drawing tools
   *
   * @return The selected drawing tools
   */
   getSelectedDrawingTools() {
    let selected = new Array();
    this.checkboxes.forEach((checkbox, index, array) => {
      if (checkbox.isSelected()) {
        selected.push(this.drawingTools[index]);
      }
    });
    return selected;
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }
}
/**
 * The panel to resize an image
 *
 * @author gianpiero.diblasi
 */
class Z4ResizeImagePanel extends JSPanel {

   containerWidth = new JSSpinner();

   containerHeight = new JSSpinner();

   containerResolution = new JSSpinner();

   containerLockRatio = new JSCheckBox();

   containerDimensionMM = new JSLabel();

   containerDimensionIN = new JSLabel();

   contentWidth = new JSSpinner();

   contentHeight = new JSSpinner();

   contentResolution = new JSSpinner();

   contentLockRatio = new JSCheckBox();

   contentDimensionMM = new JSLabel();

   contentDimensionIN = new JSLabel();

   contentOffsetX = new JSSpinner();

   contentOffsetY = new JSSpinner();

   centerContent = new JSButton();

   resizeLayerAdaptContent = new JSRadioButton();

   resizeLayerAndContent = new JSRadioButton();

   resizeLayer = new JSRadioButton();

   resizeContent = new JSRadioButton();

   preview = new JSComponent(document.createElement("canvas"));

   ctx = this.preview.invoke("getContext('2d')");

   canvas = null;

   canvasWidth = Z4Constants.DEFAULT_IMAGE_SIZE;

   canvasHeight = Z4Constants.DEFAULT_IMAGE_SIZE;

   canvasRatio = 1;

   listeners = new Array();

  static  SIZE = 150;

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4resizeimagepanel");
    this.setLayout(new GridBagLayout());
    Z4UI.addLabel(this, Z4Translations.CONTAINER, new GBC(0, 0).a(GBC.WEST).w(3)).getStyle().fontWeight = "bold";
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 1).a(GBC.WEST));
    this.addSpinner(this.containerWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 2, this.containerWidth, this.containerHeight, this.containerLockRatio);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 1).a(GBC.WEST));
    this.addSpinner(this.containerHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 2, this.containerWidth, this.containerHeight, this.containerLockRatio);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 1).a(GBC.WEST));
    this.addSpinner(this.containerResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 2, this.containerWidth, this.containerHeight, this.containerLockRatio);
    this.add(this.containerDimensionMM, new GBC(0, 3).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.containerDimensionIN, new GBC(0, 4).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.addCheckBox(this.containerLockRatio, this.containerWidth, this.containerHeight);
    this.add(this.containerLockRatio, new GBC(0, 5).a(GBC.WEST).w(3));
    Z4UI.addLabel(this, Z4Translations.CONTENT, new GBC(0, 6).a(GBC.WEST).w(3)).getStyle().fontWeight = "bold";
    Z4UI.addLabel(this, Z4Translations.WIDTH + " (px)", new GBC(0, 7).a(GBC.WEST));
    this.addSpinner(this.contentWidth, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 0, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.HEIGHT + " (px)", new GBC(1, 7).a(GBC.WEST));
    this.addSpinner(this.contentHeight, Z4Constants.DEFAULT_IMAGE_SIZE, 1, Z4Constants.MAX_IMAGE_SIZE, 1, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.RESOLUTION + " (dpi)", new GBC(2, 7).a(GBC.WEST));
    this.addSpinner(this.contentResolution, Z4Constants.DEFAULT_DPI, 1, Z4Constants.MAX_DPI, 2, 8, this.contentWidth, this.contentHeight, this.contentLockRatio);
    this.add(this.contentDimensionMM, new GBC(0, 9).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.add(this.contentDimensionIN, new GBC(0, 10).w(3).f(GBC.HORIZONTAL).i(2, 0, 0, 0));
    this.addCheckBox(this.contentLockRatio, this.contentWidth, this.contentHeight);
    this.add(this.contentLockRatio, new GBC(0, 11).a(GBC.WEST).w(3));
    Z4UI.addLabel(this, Z4Translations.OFFSET_X, new GBC(0, 12).a(GBC.WEST));
    this.addSpinner(this.contentOffsetX, 0, -Z4Constants.MAX_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 0, 13, this.contentWidth, this.contentHeight, this.contentLockRatio);
    Z4UI.addLabel(this, Z4Translations.OFFSET_Y, new GBC(1, 12).a(GBC.WEST));
    this.addSpinner(this.contentOffsetY, 0, -Z4Constants.MAX_IMAGE_SIZE, Z4Constants.MAX_IMAGE_SIZE, 1, 13, this.contentWidth, this.contentHeight, this.contentLockRatio);
    this.centerContent.setContentAreaFilled(false);
    this.centerContent.setText(Z4Translations.CENTER_VERB);
    this.centerContent.addActionListener(event => {
      this.contentOffsetX.setValue(parseInt((this.containerWidth.getValue() - this.contentWidth.getValue()) / 2));
      this.contentOffsetY.setValue(parseInt((this.containerHeight.getValue() - this.contentHeight.getValue()) / 2));
      this.setDimensions();
    });
    this.add(this.centerContent, new GBC(2, 13));
    let panel = new JSPanel();
    panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
    this.add(panel, new GBC(3, 0).h(6).a(GBC.NORTHWEST));
    let buttonGroup = new ButtonGroup();
    this.addRadio(panel, this.resizeLayerAdaptContent, buttonGroup, Z4Translations.RESIZE_CONTAINER_AND_ADAPT_CONTENT, true);
    this.addRadio(panel, this.resizeLayerAndContent, buttonGroup, Z4Translations.RESIZE_CONTAINER_AND_CONTENT, false);
    this.addRadio(panel, this.resizeLayer, buttonGroup, Z4Translations.RESIZE_CONTAINER, false);
    this.addRadio(panel, this.resizeContent, buttonGroup, Z4Translations.RESIZE_CONTENT, false);
    this.add(this.preview, new GBC(3, 6).h(8).wxy(1, 1));
    this.setDimensions();
  }

   addSpinner(spinner, value, min, max, gridx, gridy, width, height, lockRatio) {
    spinner.setModel(new SpinnerNumberModel(value, min, max, 1));
    spinner.getStyle().minWidth = "6.6rem";
    spinner.getChilStyleByQuery("input[type=number]").minWidth = "5.5rem";
    spinner.getChilStyleByQuery("input[type=number]").width = "5.5rem";
    spinner.addChangeListener(event => {
      let size = this.computeDimension(width, height, lockRatio.isSelected(), spinner === width, spinner === height);
      width.setValue(size.width);
      height.setValue(size.height);
      this.setDimensions();
    });
    this.add(spinner, new GBC(gridx, gridy).a(GBC.WEST).i(0, 0, 0, 5));
  }

   addCheckBox(checkBox, width, height) {
    checkBox.setText(Z4Translations.LOCK_ASPECT_RATIO);
    checkBox.setSelected(true);
    checkBox.addActionListener(event => {
      let size = this.computeDimension(width, height, checkBox.isSelected(), true, false);
      width.setValue(size.width);
      height.setValue(size.height);
      this.setDimensions();
    });
  }

   addRadio(panel, radio, buttonGroup, text, selected) {
    radio.setText(text);
    radio.setSelected(selected);
    radio.addActionListener(event => this.setDimensions());
    buttonGroup.add(radio);
    panel.add(radio, null);
  }

   computeDimension(width, height, lockRatio, isW, isH) {
    let w = width.getValue();
    let h = height.getValue();
    if (!lockRatio) {
    } else if (isW) {
      h = parseInt(w / this.canvasRatio);
      if (h < 1) {
        w = parseInt(this.canvasRatio);
        h = 1;
      } else if (h > Z4Constants.MAX_IMAGE_SIZE) {
        w = parseInt(Z4Constants.MAX_IMAGE_SIZE * this.canvasRatio);
        h = Z4Constants.MAX_IMAGE_SIZE;
      }
    } else if (isH) {
      w = parseInt(h * this.canvasRatio);
      if (w < 1) {
        w = 1;
        h = parseInt(1 / this.canvasRatio);
      } else if (w > Z4Constants.MAX_IMAGE_SIZE) {
        w = Z4Constants.MAX_IMAGE_SIZE;
        h = parseInt(Z4Constants.MAX_IMAGE_SIZE / this.canvasRatio);
      }
    }
    return new Dimension(w, h);
  }

   setDimensions() {
    if (this.resizeLayerAdaptContent.isSelected()) {
      this.setComponentsEnabled(true, false, false);
      this.contentWidth.setValue(this.containerWidth.getValue());
      this.contentHeight.setValue(this.containerHeight.getValue());
      this.contentOffsetX.setValue(0);
      this.contentOffsetY.setValue(0);
    } else if (this.resizeLayerAndContent.isSelected()) {
      this.setComponentsEnabled(true, true, true);
    } else if (this.resizeLayer.isSelected()) {
      this.setComponentsEnabled(true, false, true);
      this.contentWidth.setValue(this.canvasWidth);
      this.contentHeight.setValue(this.canvasHeight);
    } else if (this.resizeContent.isSelected()) {
      this.setComponentsEnabled(false, true, true);
      this.containerWidth.setValue(this.canvasWidth);
      this.containerHeight.setValue(this.canvasHeight);
    }
    this.setLabels(this.containerWidth, this.containerHeight, this.containerResolution, this.containerDimensionMM, this.containerDimensionIN);
    this.setLabels(this.contentWidth, this.contentHeight, this.contentResolution, this.contentDimensionMM, this.contentDimensionIN);
    let containerW = this.containerWidth.getValue();
    let containerH = this.containerHeight.getValue();
    let newRatio = containerW / containerH;
    let previewW = newRatio > 1 ? Z4ResizeImagePanel.SIZE : Z4ResizeImagePanel.SIZE * newRatio;
    let previewH = newRatio > 1 ? Z4ResizeImagePanel.SIZE / newRatio : Z4ResizeImagePanel.SIZE;
    this.preview.setProperty("width", "" + parseInt(previewW));
    this.preview.setProperty("height", "" + parseInt(previewH));
    if (this.canvas) {
      let scaleW = previewW / containerW;
      let scaleH = previewH / containerH;
      this.ctx.save();
      this.ctx.scale(scaleW, scaleH);
      this.ctx.drawImage(this.canvas, this.contentOffsetX.getValue(), this.contentOffsetY.getValue(), this.contentWidth.getValue(), this.contentHeight.getValue());
      this.ctx.restore();
    }
    this.onchange();
  }

   setComponentsEnabled(container, content, offset) {
    this.containerWidth.setEnabled(container);
    this.containerHeight.setEnabled(container);
    this.containerLockRatio.setEnabled(container);
    this.contentWidth.setEnabled(content);
    this.contentHeight.setEnabled(content);
    this.contentLockRatio.setEnabled(content);
    this.contentOffsetX.setEnabled(offset);
    this.contentOffsetY.setEnabled(offset);
    this.centerContent.setEnabled(offset);
  }

   setLabels(width, height, resolution, dimensionMM, dimensionIN) {
    let w = width.getValue();
    let h = height.getValue();
    let res = resolution.getValue();
    let dimWIN = w / res;
    let dimHIN = h / res;
    dimensionMM.setText(new Number(dimWIN * 25.4).toFixed(2) + " x " + new Number(dimHIN * 25.4).toFixed(2) + " mm");
    dimensionIN.setText(new Number(dimWIN).toFixed(2) + " x " + new Number(dimHIN).toFixed(2) + " inch");
  }

  /**
   * Sets the canvas to resize
   *
   * @param canvas The canvas to resize;
   * @param width The canvas width
   * @param height The canvas height
   */
   setCanvas(canvas, width, height) {
    this.canvas = canvas;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.canvasRatio = width / height;
    this.containerWidth.setValue(width);
    this.containerHeight.setValue(height);
    this.contentWidth.setValue(width);
    this.contentHeight.setValue(height);
    this.setDimensions();
  }

  /**
   * Returns the resize options
   *
   * @return The resize options
   */
   getResizeOptions() {
    return new Z4ResizeOptions(this.containerWidth.getValue(), this.containerHeight.getValue(), this.contentWidth.getValue(), this.contentHeight.getValue(), this.contentOffsetX.getValue(), this.contentOffsetY.getValue());
  }

  /**
   * Adds a change listener
   *
   * @param listener The listener
   */
   addChangeListener(listener) {
    this.listeners.push(listener);
  }

   onchange() {
    let event = new ChangeEvent();
    this.listeners.forEach(listener => {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.stateChanged(event);
      }
    });
  }
}
/**
 * The status panel
 *
 * @author gianpiero.diblasi
 */
class Z4StatusPanel extends JSPanel {

   canvas = null;

   projectName = new JSLabel();

   projectSize = new JSLabel();

   zoom = new JSComboBox();

   mousePosition = new JSLabel();

   projectColor = new JSLabel();

   layerColor = new JSLabel();

   projectColorPreview = new JSColorPreview();

   layerColorPreview = new JSColorPreview();

   pickProjectColor = new JSToggleButton();

   pickLayerColor = new JSToggleButton();

   drawingDirection = new JSButton();

   canvasGridPanel = new Z4CanvasGridPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4statuspanel");
    this.setLayout(new GridBagLayout());
    this.projectName.cssAddClass("z4statuspanel-projectname");
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": ");
    this.add(this.projectName, new GBC(0, 0).w(2).a(GBC.WEST).i(0, 5, 0, 0));
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + Z4Constants.DEFAULT_IMAGE_SIZE + " x " + Z4Constants.DEFAULT_IMAGE_SIZE);
    this.add(this.projectSize, new GBC(0, 1).a(GBC.WEST).i(0, 5, 0, 0));
    let zoomModelAndRenderer = new DefaultKeyValueComboBoxModelAndRenderer();
    Z4Constants.ZOOM_LEVEL.forEach(level => zoomModelAndRenderer.addElement(new KeyValue("" + level, parseInt(100 * level) + "%")));
    zoomModelAndRenderer.addElement(new KeyValue("FIT", Z4Translations.FIT));
    this.zoom.cssAddClass("z4statuspanel-zoom");
    this.zoom.setModelAndRenderer(zoomModelAndRenderer);
    this.zoom.setSelectedItem(new KeyValue("1", ""));
    this.zoom.addActionListener(event => this.onZoom());
    this.add(this.zoom, new GBC(1, 1).a(GBC.EAST));
    Z4UI.addVLine(this, new GBC(2, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.mousePosition.getStyle().fontFamily = "monospace";
    this.setMousePosition(0, 0);
    this.add(this.mousePosition, new GBC(3, 0).h(2).i(0, 0, 0, 5));
    this.projectColor.getStyle().fontFamily = "monospace";
    this.add(this.projectColor, new GBC(4, 0));
    this.layerColor.getStyle().fontFamily = "monospace";
    this.add(this.layerColor, new GBC(4, 1));
    this.projectColorPreview.getStyle().visibility = "hidden";
    this.add(this.projectColorPreview, new GBC(5, 0));
    this.layerColorPreview.getStyle().visibility = "hidden";
    this.add(this.layerColorPreview, new GBC(5, 1));
    this.pickProjectColor.cssAddClass("z4statuspanel-colorpicker");
    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setTooltip(Z4Translations.PICK_COLOR);
    this.pickProjectColor.setIcon(new Z4EmptyImageProducer(""));
    this.pickProjectColor.addActionListener(event => this.pickColor(this.pickProjectColor));
    this.add(this.pickProjectColor, new GBC(6, 0));
    this.pickLayerColor.cssAddClass("z4statuspanel-colorpicker");
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setTooltip(Z4Translations.PICK_COLOR);
    this.pickLayerColor.setIcon(new Z4EmptyImageProducer(""));
    this.pickLayerColor.addActionListener(event => this.pickColor(this.pickLayerColor));
    this.add(this.pickLayerColor, new GBC(6, 1));
    Z4UI.addVLine(this, new GBC(7, 0).h(2).f(GBC.VERTICAL).i(1, 5, 1, 5));
    this.drawingDirection.setContentAreaFilled(false);
    this.drawingDirection.setTooltip(Z4Translations.DRAWING_DIRECTION);
    this.drawingDirection.setIcon(new Z4EmptyImageProducer(""));
    this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection");
    this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
    this.drawingDirection.addActionListener(event => this.setDrawingDirection(null));
    this.add(this.drawingDirection, new GBC(8, 0).h(2));
    this.add(this.canvasGridPanel, new GBC(9, 0).h(2).f(GBC.VERTICAL).i(0, 5, 0, 0));
    this.add(new JSLabel(), new GBC(10, 0).wx(1));
  }

   pickColor(pickColor) {
    let selected = pickColor.isSelected();
    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setSelected(false);
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setSelected(false);
    pickColor.setContentAreaFilled(selected);
    pickColor.setSelected(selected);
    if (selected) {
      this.canvas.addCanvasOverlayMode(Z4CanvasOverlayMode.PICK_COLOR);
    } else {
      this.canvas.removeCanvasOverlayMode(Z4CanvasOverlayMode.PICK_COLOR);
    }
  }

  /**
   * A color has been picked
   *
   * @param projectColor The color picked from the project, it can be null
   * @param layerColor The color picked from the layer, it can be null
   */
   colorPicked(projectColor, layerColor) {
    if (this.pickProjectColor.isSelected() && projectColor) {
      Color.pushHistory(projectColor);
      this.colorPickedMessage();
    } else if (this.pickLayerColor.isSelected() && layerColor) {
      Color.pushHistory(layerColor);
      this.colorPickedMessage();
    }
    this.pickProjectColor.setContentAreaFilled(false);
    this.pickProjectColor.setSelected(false);
    this.pickLayerColor.setContentAreaFilled(false);
    this.pickLayerColor.setSelected(false);
    setTimeout(() => this.canvas.removeCanvasOverlayMode(Z4CanvasOverlayMode.PICK_COLOR), 0);
  }

   colorPickedMessage() {
    let panel = new JSPanel();
    JSOptionPane.showMessageDialog(panel, Z4Translations.PICK_COLOR, JSOptionPane.INFORMATION_MESSAGE, () => {
    });
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    this.canvas = canvas;
    this.canvasGridPanel.setCanvas(canvas);
  }

  /**
   * Sets the project name
   *
   * @param projectName The project name
   */
   setProjectName(projectName) {
    this.projectName.setText(Z4Translations.PROJECT_NAME + ": " + projectName);
    this.projectName.setAttribute("title", projectName);
  }

  /**
   * Sets the project size
   *
   * @param width The width
   * @param height The height
   */
   setProjectSize(width, height) {
    this.projectSize.setText(Z4Translations.DIMENSION + ": " + width + " x " + height);
  }

  /**
   * Sets the mouse position
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   */
   setMousePosition(x, y) {
    this.mousePosition.setText(new Number(x).toFixed(0).padStart(4, "\u00A0") + " x " + new Number(y).toFixed(0).padEnd(4, "\u00A0"));
    this.canvasGridPanel.setMousePosition(x, y);
    let diff = 0;
    eval("diff = Z4Translations.PROJECT.length - Z4Translations.LAYER.length;");
    let color = this.canvas ? this.canvas.getColorAt(x, y) : null;
    this.setColor(this.projectColor, this.projectColorPreview, color, Z4Translations.PROJECT, diff < 0 ? -diff : 0);
    color = this.canvas ? this.canvas.getSelectedLayerColorAt(x, y) : null;
    this.setColor(this.layerColor, this.layerColorPreview, color, Z4Translations.LAYER, diff > 0 ? diff : 0);
  }

   setColor(label, preview, color, string, pad) {
    label.setText(string + ": " + new String("").padStart(pad, "\u00A0") + "(" + (color ? new Number(color.red).toFixed(0).padStart(3, "\u00A0") : "---") + ", " + (color ? new Number(color.green).toFixed(0).padStart(3, "\u00A0") : "---") + ", " + (color ? new Number(color.blue).toFixed(0).padStart(3, "\u00A0") : "---") + ", " + (color ? new Number(color.alpha).toFixed(0).padStart(3, "\u00A0") : "---") + ")");
    preview.getStyle().visibility = color ? "visible" : "hidden";
    if (color) {
      preview.setColor(color);
    }
  }

  /**
   * Sets the zoom
   *
   * @param zoom The zoom
   */
   setZoom(zoom) {
    if (Z4Constants.ZOOM_LEVEL.indexOf(zoom) !== -1) {
      this.zoom.setSelectedItem(new KeyValue("" + zoom, ""));
    } else {
      this.zoom.setSelectedItem(new KeyValue("FIT", ""));
    }
  }

  /**
   * Sets the drawing direction
   *
   * @param drawingDirection The drawing direction
   */
   setDrawingDirection(drawingDirection) {
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-free");
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-horizontal");
    this.drawingDirection.cssRemoveClass("z4statuspanel-drawingdirection-vertical");
    if (drawingDirection === Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
    } else if (drawingDirection === Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-horizontal");
    } else if (drawingDirection === Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-vertical");
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.FREE) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-horizontal");
      this.canvas.setDrawingDirection(Z4DrawingDirection.HORIZONTAL);
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.HORIZONTAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-vertical");
      this.canvas.setDrawingDirection(Z4DrawingDirection.VERTICAL);
    } else if (this.canvas.getDrawingDirection() === Z4DrawingDirection.VERTICAL) {
      this.drawingDirection.cssAddClass("z4statuspanel-drawingdirection-free");
      this.canvas.setDrawingDirection(Z4DrawingDirection.FREE);
    }
  }

  /**
   * Resets the canvas grid panel
   *
   * @param width The canvas width
   * @param height The canvas height
   * @param resetOnlySize true to reset only the canvas size, false otherwise
   */
   resetCanvasGridPanel(width, height, resetOnlySize) {
    this.canvasGridPanel.reset(width, height, resetOnlySize);
  }

   onZoom() {
    let key = (this.zoom.getSelectedItem()).key;
    if (key === "FIT") {
      this.canvas.fitZoom();
    } else {
      this.canvas.setZoom(parseFloat(key));
    }
  }
}
/**
 * The main ribbon of the application
 *
 * @author gianpiero.diblasi
 */
class Z4Ribbon extends JSTabbedPane {

   projectPanel = new Z4RibbonProjectPanel();

   layerPanel = new Z4RibbonLayerPanel();

   drawingToolPanel = new Z4RibbonDrawingToolPanel();

   historyPanel = new Z4RibbonHistoryPanel();

   settingsPanel = new Z4RibbonSettingsPanel();

   helpPanel = new Z4RibbonHelpPanel();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.cssAddClass("z4ribbon");
    this.addTab(Z4Translations.PROJECT, this.projectPanel);
    this.addTab(Z4Translations.LAYER, this.layerPanel);
    this.addTab(Z4Translations.DRAWING_TOOL, this.drawingToolPanel);
    this.addTab(Z4Translations.HISTORY, this.historyPanel);
    this.addTab(Z4Translations.SETTINGS, this.settingsPanel);
    this.addTab(Z4Translations.HELP, this.helpPanel);
    this.settingsPanel.setHistoryPanel(this.historyPanel);
  }

  /**
   * Sets the canvas to manage
   *
   * @param canvas The canvas
   */
   setCanvas(canvas) {
    canvas.setRibbonPanels(this.projectPanel, this.layerPanel, this.drawingToolPanel, this.historyPanel);
  }

  /**
   * Sets the status panel
   *
   * @param statusPanel The status panel
   */
   setStatusPanel(statusPanel) {
    this.projectPanel.setStatusPanel(statusPanel);
    this.layerPanel.setStatusPanel(statusPanel);
    this.drawingToolPanel.setStatusPanel(statusPanel);
    this.historyPanel.setStatusPanel(statusPanel);
  }
}
/**
 * Constants of the applications
 *
 * @author gianpiero.diblasi
 */
class Z4Constants {

  /**
   * The ID of the image file folder
   */
  static  IMAGE_FILE_ID = "IMAGE_FILE_FOLDER_ID";

  /**
   * The ID of the tool file folder
   */
  static  TOOL_FILE_ID = "TOOL_FILE_FOLDER_ID";

  /**
   * The ID of the texture file folder
   */
  static  TEXTURE_FILE_ID = "TEXTURE_FILE_FOLDER_ID";

  /**
   * The array of accepted image file formats for open
   */
  static  ACCEPTED_OPEN_IMAGE_FILE_FORMAT = new Array(".gif", ".png", ".apng", ".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp", ".bmp", ".svg", ".webp", ".avif");

  /**
   * The array of accepted image file types for open
   */
  static  ACCEPTED_OPEN_IMAGE_FILE_TYPE = new Array();

  /**
   * The array of accepted image file types for save
   */
  static  ACCEPTED_SAVE_IMAGE_FILE_TYPE = new Array();

  /**
   * The array of the pizzApazzA project file type
   */
  static  PIZZAPAZZA_PROJECT_FILE_TYPE = new Array();

  /**
   * The array of the pizzApazzA tools file type for open
   */
  static  PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE = new Array();

  /**
   * The array of the pizzApazzA tool file type for save
   */
  static  PIZZAPAZZA_SAVE_TOOL_FILE_TYPE = new Array();

  /**
   * The array of the pizzApazzA tools file type for save
   */
  static  PIZZAPAZZA_SAVE_TOOLS_FILE_TYPE = new Array();

  /**
   * The zoom levels
   */
  static  ZOOM_LEVEL = new Array(0.25, 0.33, 0.5, 0.66, 1.0, 1.5, 2.0, 3.0, 4.0);

  /**
   * The magnetism percentage of the grid
   */
  static  MAGNETISM_PERCENTAGE = 0.25;

  /**
   * The available composite operations
   */

  static  COMPOSITE_OPERATION = new Array(new Array("source-over", "source-in", "source-out", "source-atop"), new Array("destination-over", "destination-in", "destination-out", "destination-atop"), new Array("lighter"), new Array("copy"), new Array("xor"), new Array("multiply", "screen", "overlay"), new Array("darken", "lighten"), new Array("color-dodge", "color-burn"), new Array("hard-light", "soft-light"), new Array("difference", "exclusion"), new Array("hue", "saturation", "color", "luminosity"));

  /**
   * The default image size
   */
  static  DEFAULT_IMAGE_SIZE = 500;

  /**
   * The maximum image size
   */
  static  MAX_IMAGE_SIZE = 2500;

  /**
   * The default DPI
   */
  static  DEFAULT_DPI = 150;

  /**
   * The max DPI
   */
  static  MAX_DPI = 1500;

  /**
   * The standard image sizes
   */
  static  STANDARD_IMAGE_SIZE = new Array(new Dimension(640, 480), new Dimension(800, 600), new Dimension(1024, 768), new Dimension(1080, 720), new Dimension(1080, 1080), new Dimension(1152, 864), new Dimension(1280, 720), new Dimension(1280, 1024), new Dimension(1800, 1200), new Dimension(1920, 1080), new Dimension(2100, 1500));

  constructor() {
  }

  /**
   * Configures the arrays of accepted file types
   */
  static  configureAcceptedFileTypeArrays() {
    let all = new FilePickerOptionsType();
    all.description = Z4Translations.IMAGE_FILE;
    all.pushAccept("image/z4i", Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_FORMAT);
    Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE.push(all);
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/gif", new Array(".gif"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/png", new Array(".png", ".apng"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/jpg", new Array(".jpeg", ".jpg", ".jfif", ".pjpeg", ".pjp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/bmp", new Array(".bmp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/svg+xml", new Array(".svg"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/webp", new Array(".webp"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_OPEN_IMAGE_FILE_TYPE, "image/avif", new Array(".avif"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE, "image/png", new Array(".png"));
    Z4Constants.pushACCEPTED_IMAGE_FILE_TYPE(Z4Constants.ACCEPTED_SAVE_IMAGE_FILE_TYPE, "image/jpg", new Array(".jpeg", ".jpg"));
    let z4i = new FilePickerOptionsType();
    z4i.description = Z4Translations.PIZZAPAZZA_PROJECT;
    z4i.pushAccept("application/z4i", new Array(".z4i"));
    Z4Constants.PIZZAPAZZA_PROJECT_FILE_TYPE.push(z4i);
    let z4t = new FilePickerOptionsType();
    z4t.description = Z4Translations.PIZZAPAZZA_DRAWING_TOOL;
    z4t.pushAccept("application/z4t", new Array(".z4t"));
    Z4Constants.PIZZAPAZZA_SAVE_TOOL_FILE_TYPE.push(z4t);
    let z4ts = new FilePickerOptionsType();
    z4ts.description = Z4Translations.PIZZAPAZZA_DRAWING_TOOLS;
    z4ts.pushAccept("application/z4ts", new Array(".z4ts"));
    Z4Constants.PIZZAPAZZA_SAVE_TOOLS_FILE_TYPE.push(z4ts);
    all = new FilePickerOptionsType();
    all.description = Z4Translations.PIZZAPAZZA_DRAWING_TOOLS;
    all.pushAccept("application/z4tx", new Array(".z4t", ".z4ts"));
    Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE.push(all);
    Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE.push(z4t);
    Z4Constants.PIZZAPAZZA_OPEN_TOOLS_FILE_TYPE.push(z4ts);
  }

  static  pushACCEPTED_IMAGE_FILE_TYPE(array, mime, extensions) {
    let filePickerOptionsType = new FilePickerOptionsType();
    let start = mime.indexOf('/') + 1;
    let end = mime.indexOf('+');
    filePickerOptionsType.description = end !== -1 ? mime.substring(start, end).toUpperCase() : mime.substring(start).toUpperCase();
    filePickerOptionsType.pushAccept(mime, extensions);
    array.push(filePickerOptionsType);
  }

  static  getStyle(style) {
    return style;
  }
  /**
   * Pushes an object in its object history (if the history exists and if not
   * already present)
   *
   * @param object The object
   */
  static  pushHistory(object) {
    if (object instanceof Z4AbstractFiller) {
      Z4Constants.pushHistory((object).getFillingColor());
    } else if (object instanceof Color) {
      Color.pushHistory(object);
    } else if (object instanceof Z4GradientColor) {
      Z4GradientColor.pushHistory(object);
    } else if (object instanceof Z4BiGradientColor) {
      Z4BiGradientColor.pushHistory(object);
    } else if (!(object instanceof Z4SpatioTemporalColor)) {
    } else if ((object).isColor()) {
      Color.pushHistory((object).getColor());
    } else if ((object).isGradientColor()) {
      Z4GradientColor.pushHistory((object).getGradientColor());
    } else if ((object).isBiGradientColor()) {
      Z4BiGradientColor.pushHistory((object).getBiGradientColor());
    }
  }
}
/**
 * An implementation of the AbstractHTMLImageProducer providing an empty image
 *
 * @author gianpiero.diblasi
 * @param <T> The value type
 */
class Z4EmptyImageProducer extends AbstractHTMLImageProducer {

  /**
   * Creates the object
   *
   * @param value The value
   */
  constructor(value) {
    super(value);
  }

   produce() {
    return document.createElement("img");
  }
}
/**
 * The common interface for objects able to be converted to a JSON object
 *
 * @author gianpiero.diblasi
 */
class Z4JSONable {

  /**
   * Returns this object as a JSON object
   *
   * @return This object as a JSON object
   */
   toJSON() {
  }
}
/**
 * The abstract gradient color
 *
 * @author gianpiero.diblasi
 * @param <T> The type of color
 */
class Z4AbstractGradientColor extends Z4JSONable {

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
   * Returns a color position in an index
   *
   * @param index The index
   * @return The color position
   */
   getColorPositionAtIndex(index) {
    return this.colorPositions[index];
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
   * Returns the number of managed colors
   *
   * @return The number of managed colors
   */
   getColorCount() {
    return this.colors.length;
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

   toJSON() {
    let json = new Object();
    json["ripple"] = this.ripple;
    json["colorsAndPositions"] = this.colors.map((color, index, array) => this.mapColor(color, index));
    return json;
  }

  /**
   * Maps a color to a JSON object
   *
   * @param color The color
   * @param index The color index
   * @return The color as a JSON object
   */
   mapColor(color, index) {
  }
}
/**
 * The bidimensional gradient color (a bidimensional gradient between four or
 * more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4BiGradientColor extends Z4AbstractGradientColor {

  static  history = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.addColor(new Z4GradientColor(), 0);
    this.addColor(new Z4GradientColor(), 1);
  }

   cloneColor(color) {
    return Z4GradientColor.fromJSON(color.toJSON());
  }

  /**
   * Mirrors each gradient color
   */
   gradientMirror() {
    this.colors.forEach(gradientColor => gradientColor.mirror());
  }

  /**
   * Reverses each gradient color
   */
   gradientReverse() {
    this.colors.forEach(gradientColor => gradientColor.reverse());
  }

  /**
   * Sets the ripple of each gradient color
   *
   * @param rippleGradient The ripple of each gradient color (in the range
   * [0,1])
   */
   setGradientRipple(rippleGradient) {
    this.colors.forEach(gradientColor => gradientColor.setRipple(rippleGradient));
  }

  /**
   * Returns the ripple of each gradient color
   *
   * @return The ripple of each gradient color (in the range [0,1])
   */
   getGradientRipple() {
    return this.colors[0].getRipple();
  }

   getColorAt(position, useRipple) {
    if (useRipple && this.getRipple()) {
      position = Z4Math.ripple(position, 0, 1, this.getRipple());
    }
    let finalPos = position;
    let index = this.colorPositions.findIndex(pos => pos >= finalPos, null);
    if (this.colorPositions[index] === position) {
      return this.colors[index];
    } else if (this.colorPositions[index - 1] === position) {
      return this.colors[index - 1];
    } else {
      let div = (position - this.colorPositions[index - 1]) / (this.colorPositions[index] - this.colorPositions[index - 1]);
      let before = this.colors[index - 1];
      let after = this.colors[index];
      let gradientColor = new Z4GradientColor();
      gradientColor.setRipple(this.getGradientRipple());
      before.colors.forEach((beforeColor, idx, array) => {
        let beforePosition = before.colorPositions[idx];
        let afterColor = after.getColorAt(beforePosition, false);
        this.addInGradientColor(gradientColor, beforeColor, afterColor, div, beforePosition);
      });
      after.colors.forEach((afterColor, idx, array) => {
        let afterPosition = after.colorPositions[idx];
        if (gradientColor.colorPositions.findIndex(pos => pos === afterPosition) === -1) {
          let beforeColor = before.getColorAt(afterPosition, false);
          this.addInGradientColor(gradientColor, beforeColor, afterColor, div, afterPosition);
        }
      });
      return gradientColor;
    }
  }

   addInGradientColor(gradientColor, beforeColor, afterColor, div, position) {
    gradientColor.addColor(new Color(parseInt((afterColor.red - beforeColor.red) * div + beforeColor.red), parseInt((afterColor.green - beforeColor.green) * div + beforeColor.green), parseInt((afterColor.blue - beforeColor.blue) * div + beforeColor.blue), parseInt((afterColor.alpha - beforeColor.alpha) * div + beforeColor.alpha)), position);
  }

   mapColor(color, index) {
    let jsonColor = new Object();
    jsonColor["gradientColor"] = color.toJSON();
    jsonColor["position"] = this.colorPositions[index];
    return jsonColor;
  }

  /**
   * Creates a Z4GradientColor from a JSON object
   *
   * @param json The JSON object
   * @return the color
   */
  static  fromJSON(json) {
    let gradientColor = new Z4BiGradientColor();
    gradientColor.setRipple(json["ripple"]);
    (json["colorsAndPositions"]).forEach(colorAndPosition => gradientColor.addColor(Z4GradientColor.fromJSON(colorAndPosition["gradientColor"]), colorAndPosition["position"]));
    return gradientColor;
  }

  /**
   * Pushes a bigradient color in the bigradient color history (if not already
   * present)
   *
   * @param color The bigradient color
   */
  static  pushHistory(color) {
    let index = Z4BiGradientColor.history.findIndex(element => JSON.stringify(element.toJSON()) === JSON.stringify(color.toJSON()));
    if (index !== -1) {
      Z4BiGradientColor.history.splice(index, 1);
    }
    Z4BiGradientColor.history.unshift(color);
    Z4BiGradientColor.history.splice(48);
  }

  /**
   * Returns the bigradient color history
   *
   * @return The bigradient color history
   */
  static  getHistory() {
    return Z4BiGradientColor.history.map(color => color);
  }

  /**
   * Resets the bigradient color history
   */
  static  resetHistory() {
    Z4BiGradientColor.history.length = 0;
  }
}
/**
 * The gradient color (a gradient between two or more colors)
 *
 * @author gianpiero.diblasi
 */
class Z4GradientColor extends Z4AbstractGradientColor {

  static  history = new Array();

  /**
   * Creates the object
   */
  constructor() {
    super();
    this.addColor(new Color(255, 255, 255, 255), 0);
    this.addColor(new Color(0, 0, 0, 255), 1);
  }

   cloneColor(color) {
    return new Color(color.red, color.green, color.blue, color.alpha);
  }

   getColorAt(position, useRipple) {
    if (useRipple && this.getRipple()) {
      position = Z4Math.ripple(position, 0, 1, this.getRipple());
    }
    let finalPos = position;
    let index = this.colorPositions.findIndex(pos => pos >= finalPos, null);
    if (this.colorPositions[index] === position) {
      return this.colors[index];
    } else if (this.colorPositions[index - 1] === position) {
      return this.colors[index - 1];
    } else {
      let div = (position - this.colorPositions[index - 1]) / (this.colorPositions[index] - this.colorPositions[index - 1]);
      return new Color(parseInt((this.colors[index].red - this.colors[index - 1].red) * div + this.colors[index - 1].red), parseInt((this.colors[index].green - this.colors[index - 1].green) * div + this.colors[index - 1].green), parseInt((this.colors[index].blue - this.colors[index - 1].blue) * div + this.colors[index - 1].blue), parseInt((this.colors[index].alpha - this.colors[index - 1].alpha) * div + this.colors[index - 1].alpha));
    }
  }

   mapColor(color, index) {
    let jsonColor = color.getJSON();
    jsonColor["position"] = this.colorPositions[index];
    return jsonColor;
  }

  /**
   * Merges overlapping colors based on a tolerance
   *
   * @param tolerance The accepted tolerance around the position (a very small
   * value, for example 0.01)
   */
   mergeOverlapping(tolerance) {
    for (let index = this.colorPositions.length - 1; index > 0; index--) {
      let beforePosition = this.colorPositions[index - 1];
      let afterPosition = this.colorPositions[index];
      if (Math.abs(afterPosition - beforePosition) <= tolerance) {
        let position = (beforePosition + afterPosition) / 2;
        let color = this.getColorAt(position, false);
        this.removeColor(beforePosition);
        this.removeColor(afterPosition);
        this.addColor(color, position);
      }
    }
  }

  /**
   * Creates a linear gradient
   *
   * @param context The context to use to create the linear gradient
   * @param x0 The x-axis coordinate of the start point
   * @param y0 The y-axis coordinate of the start point
   * @param x1 The x-axis coordinate of the end point
   * @param y1 The y-axis coordinate of the end point
   * @return The linear gradient
   */
   createLinearGradient(context, x0, y0, x1, y1) {
    let linearGradient = context.createLinearGradient(x0, y0, x1, y1);
    this.colors.forEach((color, index, array) => linearGradient.addColorStop(this.colorPositions[index], color.getRGBA_HEX()));
    return linearGradient;
  }

  /**
   * Lights up this Z4GradientColor, the transparency is not changed
   *
   * @param inOut true for an in-out lighting, false for an out-in lighting
   * @return This lighted Z4GradientColor
   */
   lighted(inOut) {
    let lighted = new Z4GradientColor();
    this.colors.forEach((color, index, array) => lighted.addColor(color.lighted(inOut ? this.colorPositions[index] : 1 - this.colorPositions[index]), this.colorPositions[index]));
    return lighted;
  }

  /**
   * Darkens this Z4GradientColor, the transparency is not changed
   *
   * @param inOut true for an in-out lighting, false for an out-in lighting
   * @return This darkened Z4GradientColor
   */
   darkened(inOut) {
    let darkened = new Z4GradientColor();
    this.colors.forEach((color, index, array) => darkened.addColor(color.darkened(inOut ? this.colorPositions[index] : 1 - this.colorPositions[index]), this.colorPositions[index]));
    return darkened;
  }

  /**
   * Creates a Z4GradientColor from a JSON object
   *
   * @param json The JSON object
   * @return the color
   */
  static  fromJSON(json) {
    let gradientColor = new Z4GradientColor();
    gradientColor.setRipple(json["ripple"]);
    (json["colorsAndPositions"]).forEach(colorAndPosition => gradientColor.addColor(Color.fromJSON(colorAndPosition), colorAndPosition["position"]));
    return gradientColor;
  }

  /**
   * Pushes a gradient color in the gradient color history (if not already
   * present)
   *
   * @param color The gradient color
   */
  static  pushHistory(color) {
    let index = Z4GradientColor.history.findIndex(element => JSON.stringify(element.toJSON()) === JSON.stringify(color.toJSON()));
    if (index !== -1) {
      Z4GradientColor.history.splice(index, 1);
    }
    Z4GradientColor.history.unshift(color);
    Z4GradientColor.history.splice(48);
  }

  /**
   * Returns the gradient color history
   *
   * @return The gradient color history
   */
  static  getHistory() {
    return Z4GradientColor.history.map(color => color);
  }

  /**
   * Resets the gradient color history
   */
  static  resetHistory() {
    Z4GradientColor.history.length = 0;
  }
}
/**
 * A spatio-temporal color
 *
 * @author gianpiero.diblasi
 */
class Z4SpatioTemporalColor extends Z4JSONable {

   color = null;

   gradientColor = null;

   biGradientColor = null;

  /**
   * Creates a Z4SpatioTemporalColor from a color
   *
   * @param color The color
   * @return the color aggregator
   */
  static  fromColor(color) {
    return new Z4SpatioTemporalColor(color, null, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a gradient color
   *
   * @param gradientColor The gradient color
   * @return the color aggregator
   */
  static  fromGradientColor(gradientColor) {
    return new Z4SpatioTemporalColor(null, gradientColor, null);
  }

  /**
   * Creates a Z4SpatioTemporalColor from a bigradient color
   *
   * @param biGradientColor The bigradient color
   * @return the color aggregator
   */
  static  fromBiGradientColor(biGradientColor) {
    return new Z4SpatioTemporalColor(null, null, biGradientColor);
  }

  constructor(color, gradientColor, biGradientColor) {
    super();
    this.color = color;
    this.gradientColor = gradientColor;
    this.biGradientColor = biGradientColor;
  }

  /**
   * Checks if this spatio-temporal color is a (flat) color
   *
   * @return true if this spatio-temporal color is a (flat) color, false
   * otherwise
   */
   isColor() {
    return !!(this.color);
  }

  /**
   * Checks if this spatio-temporal color is a gradient color
   *
   * @return true if this spatio-temporal color is a gradient color, false
   * otherwise
   */
   isGradientColor() {
    return !!(this.gradientColor);
  }

  /**
   * Checks if this spatio-temporal color is a bigradient color
   *
   * @return true if this spatio-temporal color is a bigradient color, false
   * otherwise
   */
   isBiGradientColor() {
    return !!(this.biGradientColor);
  }

  /**
   * Returns the color
   *
   * @return The color
   */
   getColor() {
    return this.color;
  }

  /**
   * Returns the gradient color
   *
   * @return The gradient color
   */
   getGradientColor() {
    return this.gradientColor;
  }

  /**
   * Returns the bigradient color
   *
   * @return The bigradient color
   */
   getBiGradientColor() {
    return this.biGradientColor;
  }

  /**
   * Returns a color in a time instant and in a space position
   *
   * @param time The time instant
   * @param space The space position
   * @return The color
   */
   getColorAt(time, space) {
    if (this.color) {
      return this.color;
    } else if (this.gradientColor) {
      return this.gradientColor.getColorAt(space, true);
    } else if (this.biGradientColor) {
      return this.biGradientColor.getColorAt(time, true).getColorAt(space, true);
    } else {
      return null;
    }
  }

  /**
   * Returns a gradient color in a time instant
   *
   * @param time The time instant
   * @return The gradient color
   */
   getGradientColorAt(time) {
    if (this.color) {
      return null;
    } else if (this.gradientColor) {
      return this.gradientColor;
    } else if (this.biGradientColor) {
      return this.biGradientColor.getColorAt(time, true);
    } else {
      return null;
    }
  }

   toJSON() {
    let json = new Object();
    if (this.color) {
      json["color"] = this.color.getJSON();
    } else if (this.gradientColor) {
      json["gradientColor"] = this.gradientColor.toJSON();
    } else if (this.biGradientColor) {
      json["biGradientColor"] = this.biGradientColor.toJSON();
    }
    return json;
  }

  /**
   * Creates a Z4SpatioTemporalColor from a JSON object
   *
   * @param json The JSON object
   * @return The color
   */
  static  fromJSON(json) {
    if (json["color"]) {
      return Z4SpatioTemporalColor.fromColor(Color.fromJSON(json["color"]));
    } else if (json["gradientColor"]) {
      return Z4SpatioTemporalColor.fromGradientColor(Z4GradientColor.fromJSON(json["gradientColor"]));
    } else if (json["biGradientColor"]) {
      return Z4SpatioTemporalColor.fromBiGradientColor(Z4BiGradientColor.fromJSON(json["biGradientColor"]));
    } else {
      return null;
    }
  }
}
/**
 * The common interface for objects able to provide a "next" value
 *
 * @author gianpiero.diblasi
 * @param <T> The next value type
 */
class Z4Nextable extends Z4JSONable {

  /**
   * Returns the next value
   *
   * @return The next value
   */
   next() {
  }
}
/**
 * The fanciful value
 *
 * @author gianpiero.diblasi
 */
class Z4FancifulValue extends Z4Nextable {

   constant = null;

   random = null;

   uniformSign = false;

  /**
   * Creates the object
   *
   * @param constant The constant component
   * @param random The random component
   * @param uniformSign true if the computed sign has to be equals for both
   * components, false otherwise; if true then the constant sign is used
   */
  constructor(constant, random, uniformSign) {
    super();
    this.constant = constant;
    this.random = random;
    this.uniformSign = uniformSign;
  }

  /**
   * Returns the the constant component
   *
   * @return The the constant component
   */
   getConstant() {
    return this.constant;
  }

  /**
   * Returns the random component
   *
   * @return The random component
   */
   getRandom() {
    return this.random;
  }

  /**
   * Checks if the computed sign has to be equals for both components; if true
   * then the constant sign is used
   *
   * @return true if the computed sign has to be equals for both components,
   * false otherwise
   */
   isUniformSign() {
    return this.uniformSign;
  }

   next() {
    if (this.uniformSign) {
      return this.constant.getSign().next() * (this.constant.getValue() + this.random.getValue().next());
    } else {
      return this.constant.next() + this.random.next();
    }
  }

   toJSON() {
    let json = new Object();
    json["constant"] = this.constant.toJSON();
    json["random"] = this.random.toJSON();
    json["uniform"] = this.uniformSign;
    return json;
  }

  /**
   * Creates a Z4FancifulValue from a JSON object
   *
   * @param json The JSON object
   * @return the fanciful value
   */
  static  fromJSON(json) {
    return new Z4FancifulValue(Z4SignedValue.fromJSON(json["constant"]), Z4SignedRandomValue.fromJSON(json["random"]), json["uniform"]);
  }
}
/**
 * A random value
 *
 * @author gianpiero.diblasi
 */
class Z4RandomValue extends Z4Nextable {

   value = 0.0;

   behavior = null;

   length = 0.0;

   step = 0;

   prevRandom = 0.0;

   controlRandom = 0.0;

   nextRandom = 0.0;

   bezierCurve = null;

  /**
   * Creates the object
   *
   * @param value The value
   * @param behavior The random value behavior
   * @param length The bezier/polyline/step length
   */
  constructor(value, behavior, length) {
    super();
    this.value = value;
    this.behavior = behavior;
    this.length = length;
    this.step = 1;
    this.prevRandom = Math.random();
    this.controlRandom = 1;
    this.nextRandom = Math.random();
    if (this.behavior === Z4RandomValueBehavior.BEZIER) {
      this.createBezierCurve();
    }
  }

   createBezierCurve() {
    this.bezierCurve = new Bezier(0, this.prevRandom, this.length / 2, this.controlRandom, 1, this.nextRandom);
  }

  /**
   * Returns the value
   *
   * @return The value
   */
   getValue() {
    return this.value;
  }

  /**
   * Returns the random value behavior
   *
   * @return The random value behavior
   */
   getRandomValueBehavior() {
    return this.behavior;
  }

  /**
   * Returns The bezier/polyline/step length
   *
   * @return The bezier/polyline/step length
   */
   getLength() {
    return this.length;
  }

   next() {
    if (this.behavior === Z4RandomValueBehavior.CLASSIC) {
      return this.value * Math.random();
    } else if (this.behavior === Z4RandomValueBehavior.BEZIER) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = this.nextRandom;
        this.controlRandom = this.controlRandom === 1 ? 0 : 1;
        this.nextRandom = Math.random();
        this.createBezierCurve();
      } else {
        this.step++;
      }
      return this.value * this.bezierCurve.get(this.step / this.length).y;
    } else if (this.behavior === Z4RandomValueBehavior.POLYLINE) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = this.nextRandom;
        this.nextRandom = Math.random();
      } else {
        this.step++;
      }
      return this.value * ((this.nextRandom - this.prevRandom) * this.step / this.length + this.prevRandom);
    } else if (this.behavior === Z4RandomValueBehavior.STEPPED) {
      if (this.step >= this.length) {
        this.step = 1;
        this.prevRandom = Math.random();
      } else {
        this.step++;
      }
      return this.value * this.prevRandom;
    } else {
      return 0.0;
    }
  }

   toJSON() {
    let json = new Object();
    json["value"] = this.value;
    json["behavior"] = this.behavior;
    json["length"] = this.length;
    return json;
  }

  /**
   * Creates a Z4RandomValue from a JSON object
   *
   * @param json The JSON object
   * @return the random value
   */
  static  fromJSON(json) {
    switch("" + json["behavior"]) {
      case "CLASSIC":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.CLASSIC, json["length"]);
      case "BEZIER":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.BEZIER, json["length"]);
      case "POLYLINE":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.POLYLINE, json["length"]);
      case "STEPPED":
        return new Z4RandomValue(json["value"], Z4RandomValueBehavior.STEPPED, json["length"]);
      default:
        return null;
    }
  }
}
/**
 * The signs of a value
 *
 * @author gianpiero.diblasi
 */
class Z4Sign extends Z4Nextable {

   behavior = null;

   sign = 0;

  /**
   * Creates the object
   *
   * @param behavior The sign behavior
   */
  constructor(behavior) {
    super();
    this.behavior = behavior;
    if (behavior === Z4SignBehavior.POSITIVE) {
      this.sign = 1;
    } else if (behavior === Z4SignBehavior.NEGATIVE) {
      this.sign = -1;
    } else if (behavior === Z4SignBehavior.RANDOM) {
      this.sign = 0;
    } else if (behavior === Z4SignBehavior.ALTERNATE) {
      this.sign = -2;
    }
  }

  /**
   * Returns the sign behavior
   *
   * @return The sign behavior
   */
   getSignBehavior() {
    return this.behavior;
  }

   next() {
    switch(this.sign) {
      case 1:
      case -1:
        return this.sign;
      case 0:
      default:
        return Math.random() > 0.5 ? 1 : -1;
      case 2:
      case -2:
        this.sign *= -1;
        return this.sign / 2;
    }
  }

   toJSON() {
    let json = new Object();
    json["behavior"] = this.behavior;
    return json;
  }

  /**
   * Creates a Z4Sign from a JSON object
   *
   * @param json The JSON object
   * @return the sign
   */
  static  fromJSON(json) {
    switch("" + json["behavior"]) {
      case "POSITIVE":
        return new Z4Sign(Z4SignBehavior.POSITIVE);
      case "NEGATIVE":
        return new Z4Sign(Z4SignBehavior.NEGATIVE);
      case "RANDOM":
        return new Z4Sign(Z4SignBehavior.RANDOM);
      case "ALTERNATE":
        return new Z4Sign(Z4SignBehavior.ALTERNATE);
      default:
        return null;
    }
  }
}
/**
 * A random value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedRandomValue extends Z4Nextable {

   sign = null;

   value = null;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The random value
   */
  constructor(sign, value) {
    super();
    this.sign = sign;
    this.value = value;
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    return this.sign;
  }

  /**
   * Returns the random value
   *
   * @return The random value
   */
   getValue() {
    return this.value;
  }

   next() {
    return this.sign.next() * this.value.next();
  }

   toJSON() {
    let json = new Object();
    json["sign"] = this.sign.toJSON();
    json["value"] = this.value.toJSON();
    return json;
  }

  /**
   * Creates a Z4SignedRandomValue from a JSON object
   *
   * @param json The JSON object
   * @return the signed random value
   */
  static  fromJSON(json) {
    return new Z4SignedRandomValue(Z4Sign.fromJSON(json["sign"]), Z4RandomValue.fromJSON(json["value"]));
  }
}
/**
 * A value with sign
 *
 * @author gianpiero.diblasi
 */
class Z4SignedValue extends Z4Nextable {

   sign = null;

   value = 0.0;

  /**
   * Creates the object
   *
   * @param sign The sign
   * @param value The value
   */
  constructor(sign, value) {
    super();
    this.sign = sign;
    this.value = value;
  }

  /**
   * Returns the sign
   *
   * @return The sign
   */
   getSign() {
    return this.sign;
  }

  /**
   * Returns the (positive) value
   *
   * @return The (positive) value
   */
   getValue() {
    return this.value;
  }

   next() {
    return this.sign.next() * this.value;
  }

   toJSON() {
    let json = new Object();
    json["sign"] = this.sign.toJSON();
    json["value"] = this.value;
    return json;
  }

  /**
   * Creates a Z4SignedValue from a JSON object
   *
   * @param json The JSON object
   * @return the signed value
   */
  static  fromJSON(json) {
    return new Z4SignedValue(Z4Sign.fromJSON(json["sign"]), json["value"]);
  }
}
/**
 * The tool to perform a drawing
 *
 * @author gianpiero.diblasi
 */
class Z4DrawingTool extends Z4Nextable {

   name = null;

   pointIterator = null;

   painter = null;

   spatioTemporalColor = null;

   progression = null;

  /**
   * Creates the object
   *
   * @param name The name
   * @param pointIterator The point iterator
   * @param painter The painter
   * @param spatioTemporalColor The spatio-temporal color
   * @param progression The color progression
   */
  constructor(name, pointIterator, painter, spatioTemporalColor, progression) {
    super();
    this.name = name;
    this.pointIterator = pointIterator;
    this.painter = painter;
    this.spatioTemporalColor = spatioTemporalColor;
    this.progression = progression;
  }

  /**
   * Returns the name
   *
   * @return The name
   */
   getName() {
    return this.name;
  }

  /**
   * Returns the point iterator
   *
   * @return the point iterator
   */
   getPointIterator() {
    return this.pointIterator;
  }

  /**
   * Returns the painter
   *
   * @return The painter
   */
   getPainter() {
    return this.painter;
  }

  /**
   * Returns the spatio-temporal color
   *
   * @return The spatio-temporal color
   */
   getSpatioTemporalColor() {
    return this.spatioTemporalColor;
  }

  /**
   * Returns the color progression
   *
   * @return The color progression
   */
   getProgression() {
    return this.progression;
  }

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   drawAction(action, x, y) {
    return this.pointIterator.drawAction(action, this.progression, x, y);
  }

   next() {
    return this.pointIterator.next(this.spatioTemporalColor, this.progression);
  }

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   */
   draw(context, drawingPoint) {
    this.painter.draw(context, drawingPoint, this.spatioTemporalColor, this.progression);
  }

  /**
   * Returns the count of next points to draw on STOP action
   *
   * @return The count of next points to draw on STOP action
   */
   getNextCountOnSTOP() {
    return this.pointIterator.getNextCountOnSTOP();
  }

  /**
   * Checks if the Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if the Z4PointIterator is an infinite point generator, false
   * otherwise
   */
   isInfinitePointGenerator() {
    return this.pointIterator.isInfinitePointGenerator();
  }

  /**
   * Returns the sleeping time between a point generation and the successive
   *
   * @return The sleeping time between a point generation and the successive (in
   * milliseconds)
   */
   getInfinitePointGeneratorSleep() {
    return this.pointIterator.getInfinitePointGeneratorSleep();
  }

   toJSON() {
    let json = new Object();
    json["name"] = this.name;
    json["pointIterator"] = this.pointIterator.toJSON();
    json["painter"] = this.painter.toJSON();
    json["spatioTemporalColor"] = this.spatioTemporalColor.toJSON();
    json["progression"] = this.progression.toJSON();
    return json;
  }

  /**
   * Creates a Z4DrawingTool from a JSON object
   *
   * @param json The JSON object
   * @return the drawing tool
   */
  static  fromJSON(json) {
    let pointIterator = null;
    let painter = null;
    let pointIteratorJSON = json["pointIterator"];
    switch("" + pointIteratorJSON["type"]) {
      case "STAMPER":
        pointIterator = Z4Stamper.fromJSON(pointIteratorJSON);
        break;
      case "TRACER":
        pointIterator = Z4Tracer.fromJSON(pointIteratorJSON);
        break;
      case "AIRBRUSH":
        pointIterator = Z4Airbrush.fromJSON(pointIteratorJSON);
        break;
      case "SPIROGRAPH":
        pointIterator = Z4Spirograph.fromJSON(pointIteratorJSON);
        break;
      case "SCATTERER":
        pointIterator = Z4Scatterer.fromJSON(pointIteratorJSON);
        break;
    }
    let painterJSON = json["painter"];
    switch("" + painterJSON["type"]) {
      case "ARROW":
        painter = new Z4ArrowPainter();
        break;
      case "SHAPE_2D":
        painter = Z4Shape2DPainter.fromJSON(painterJSON);
        break;
      case "DROP":
        painter = Z4DropPainter.fromJSON(painterJSON);
        break;
      case "BRUSH":
        painter = Z4BrushPainter.fromJSON(painterJSON);
        break;
      case "PATTERN":
        painter = Z4PatternPainter.fromJSON(painterJSON);
        break;
      case "CENTERED_FIGURE":
        painter = Z4CenteredFigurePainter.fromJSON(painterJSON);
        break;
      case "NATURAL_FIGURE":
        painter = Z4NaturalFigurePainter.fromJSON(painterJSON);
        break;
    }
    return new Z4DrawingTool(json["name"], pointIterator, painter, Z4SpatioTemporalColor.fromJSON(json["spatioTemporalColor"]), Z4ColorProgression.fromJSON(json["progression"]));
  }
}
/**
 * The common interface for objects able to provide a "next" value by means of a
 * parameter
 *
 * @author gianpiero.diblasi
 * @param <T> The next value type
 * @param <S> The parameter type
 */
class Z4NextableWithParam extends Z4JSONable {

  /**
   * Returns the next value
   *
   * @param param The parameter
   * @return The next value
   */
   next(param) {
  }
}
/**
 * The progression of a color
 *
 * @author gianpiero.diblasi
 */
class Z4ColorProgression extends Z4NextableWithParam {

   behavior = null;

   temporalStepProgression = 0.0;

   resetOnStartMoving = false;

   lighting = null;

  /**
   * Creates the object
   *
   * @param behavior The color progression behavior
   * @param temporalStepProgression The step for temporal progression (in the
   * range [0,1])
   * @param resetOnStartMoving true to reset the temporal position when the
   * moving starts, false otherwise
   * @param lighting The color lighting
   */
  constructor(behavior, temporalStepProgression, resetOnStartMoving, lighting) {
    super();
    this.behavior = behavior;
    this.temporalStepProgression = temporalStepProgression;
    this.resetOnStartMoving = resetOnStartMoving;
    this.lighting = lighting;
  }

  /**
   * Returns the color progression behavior
   *
   * @return The color progression behavior
   */
   getColorProgressionBehavior() {
    return this.behavior;
  }

  /**
   * Returns the step for temporal progression (in the range [0,1])
   *
   * @return The step for temporal progression (in the range [0,1])
   */
   getTemporalStepProgression() {
    return this.temporalStepProgression;
  }

  /**
   * Checks if the temporal position has to be reset on start moving
   *
   * @return true to reset the temporal position when the moving starts, false
   * otherwise
   */
   isResetOnStartMoving() {
    return this.resetOnStartMoving;
  }

  /**
   * Returns the color lighting
   *
   * @return The color lighting
   */
   getLighting() {
    return this.lighting;
  }

   next(position) {
    position = position === -1 ? 0 : position + this.temporalStepProgression;
    if (position > 1) {
      position -= 1;
    }
    return position;
  }

   toJSON() {
    let json = new Object();
    json["behavior"] = this.behavior;
    json["temporalStepProgression"] = this.temporalStepProgression;
    json["resetOnStartMoving"] = this.resetOnStartMoving;
    json["lighting"] = this.lighting;
    return json;
  }

  /**
   * Creates a Z4ColorProgression from a JSON object
   *
   * @param json The JSON object
   * @return the color progression
   */
  static  fromJSON(json) {
    let lighting = null;
    switch("" + json["lighting"]) {
      case "NONE":
        lighting = Z4Lighting.NONE;
        break;
      case "LIGHTED_IN_OUT":
        lighting = Z4Lighting.LIGHTED_IN_OUT;
        break;
      case "DARKENED_IN_OUT":
        lighting = Z4Lighting.DARKENED_IN_OUT;
        break;
      case "LIGHTED_OUT_IN":
        lighting = Z4Lighting.LIGHTED_OUT_IN;
        break;
      case "DARKENED_OUT_IN":
        lighting = Z4Lighting.DARKENED_OUT_IN;
        break;
      default:
        lighting = null;
        break;
    }
    switch("" + json["behavior"]) {
      case "SPATIAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      case "TEMPORAL":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.TEMPORAL, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      case "RELATIVE_TO_PATH":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RELATIVE_TO_PATH, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      case "RANDOM":
        return new Z4ColorProgression(Z4ColorProgressionBehavior.RANDOM, json["temporalStepProgression"], json["resetOnStartMoving"], lighting);
      default:
        return null;
    }
  }
}
/**
 * The rotation (angles parameters have to be provided in degrees, rotations are
 * computed in radians)
 *
 * @author gianpiero.diblasi
 */
class Z4Rotation extends Z4NextableWithParam {

   startAngle = 0.0;

   angle = null;

   behavior = null;

   delayed = false;

   rotationNext = 0.0;

  /**
   * Creates the object
   *
   * @param startAngle The initial angle of rotation (in degrees)
   * @param angle The angle (in degrees)
   * @param behavior The rotation behavior
   * @param delayed true if the returned rotation has to be delayed (rotated by
   * a PI angle), false otherwise
   */
  constructor(startAngle, angle, behavior, delayed) {
    super();
    this.startAngle = startAngle;
    this.delayed = delayed;
    this.behavior = behavior;
    this.angle = angle;
  }

  /**
   * Returns the initial angle of rotation (in degrees)
   *
   * @return The initial angle of rotation (in degrees)
   */
   getStartAngle() {
    return this.startAngle;
  }

  /**
   * Returns the angle (in degrees)
   *
   * @return The angle (in degrees)
   */
   getAngle() {
    return this.angle;
  }

  /**
   * Returns the rotation behavior
   *
   * @return The rotation behavior
   */
   getRotationBehavior() {
    return this.behavior;
  }

  /**
   * Returns if the rotation has to be delayed (rotated by a PI angle)
   *
   * @return true if the returned rotation has to be delayed (rotated by a PI
   * angle), false otherwise
   */
   isDelayed() {
    return this.delayed;
  }

   next(tangentAngle) {
    let nextAngle = Z4Math.deg2rad(this.startAngle + this.angle.next());
    if (this.behavior === Z4RotationBehavior.FIXED) {
      return nextAngle + (this.delayed ? Math.PI : 0);
    } else if (this.behavior === Z4RotationBehavior.CUMULATIVE) {
      this.rotationNext += nextAngle;
      return this.rotationNext + (this.delayed ? Math.PI : 0);
    } else if (this.behavior === Z4RotationBehavior.RELATIVE_TO_PATH) {
      return nextAngle + tangentAngle + (this.delayed ? Math.PI : 0);
    } else {
      return 0.0;
    }
  }

  /**
   * Computes the side to assign to a point
   *
   * @param currentVector The vector of the current point
   * @param vector The tangent vector (if available)
   * @return The side to assign to a point
   */
   computeSide(currentVector, vector) {
    if (this.behavior === Z4RotationBehavior.FIXED) {
      return new Z4Sign(Z4SignBehavior.POSITIVE);
    } else if (this.behavior === Z4RotationBehavior.CUMULATIVE) {
      return new Z4Sign(Z4SignBehavior.POSITIVE);
    } else if (this.behavior === Z4RotationBehavior.RELATIVE_TO_PATH) {
      return new Z4Sign(vector ? vector.direction(currentVector) : Z4SignBehavior.RANDOM);
    } else {
      return null;
    }
  }

   toJSON() {
    let json = new Object();
    json["startAngle"] = this.startAngle;
    json["angle"] = this.angle.toJSON();
    json["behavior"] = this.behavior;
    json["delayed"] = this.delayed;
    return json;
  }

  /**
   * Creates a Z4Rotation from a JSON object
   *
   * @param json The JSON object
   * @return the rotation
   */
  static  fromJSON(json) {
    switch("" + json["behavior"]) {
      case "FIXED":
        return new Z4Rotation(json["startAngle"], Z4FancifulValue.fromJSON(json["angle"]), Z4RotationBehavior.FIXED, json["delayed"]);
      case "CUMULATIVE":
        return new Z4Rotation(json["startAngle"], Z4FancifulValue.fromJSON(json["angle"]), Z4RotationBehavior.CUMULATIVE, json["delayed"]);
      case "RELATIVE_TO_PATH":
        return new Z4Rotation(json["startAngle"], Z4FancifulValue.fromJSON(json["angle"]), Z4RotationBehavior.RELATIVE_TO_PATH, json["delayed"]);
      default:
        return null;
    }
  }
}
/**
 * The common interface for objects able to provide a "next" value by means of
 * two parameters
 *
 * @author gianpiero.diblasi
 * @param <T> The next value type
 * @param <S> The first parameter type
 * @param <V> The second parameter type
 */
class Z4NextableWithTwoParams extends Z4JSONable {

  /**
   * Returns the next value
   *
   * @param param1 The first parameter
   * @param param2 The second parameter
   * @return The next value
   */
   next(param1, param2) {
  }
}
/**
 * The common parent of all point iterators
 *
 * @author gianpiero.diblasi
 */
class Z4PointIterator extends Z4NextableWithTwoParams {

  /**
   * The rotation
   */
   rotation = null;

  /**
   * The next drawing point
   */
   nextdDrawingPoint = null;

  /**
   * true if this Z4PointIterator has another point, false otherwise
   */
   hasNext = false;

  /**
   * The current "utility" point
   */
   currentPoint = null;

  /**
   * Creates the object
   *
   * @param rotation The rotation
   */
  constructor(rotation) {
    super();
    this.rotation = rotation;
  }

  /**
   * Returns the point iterator type
   *
   * @return The point iterator type
   */
   getType() {
  }

  /**
   * Returns the rotation
   *
   * @return The rotation
   */
   getRotation() {
    return this.rotation;
  }

  /**
   * Performs a drawing action
   *
   * @param action The action
   * @param progression The color progression
   * @param x The x-axis coordinate of the drawing action
   * @param y The y-axis coordinate of the drawing action
   * @return true if the painting is modified by the drawing action, false
   * otherwise
   */
   drawAction(action, progression, x, y) {
  }

   next(color, progression) {
  }

  /**
   * Returns the count of next points to draw on STOP action
   *
   * @return The count of next points to draw on STOP action
   */
   getNextCountOnSTOP() {
  }

  /**
   * Checks if this Z4PointIterator is an infinite point generator (for example
   * an airbrush)
   *
   * @return true if this Z4PointIterator is an infinite point generator, false
   * otherwise
   */
   isInfinitePointGenerator() {
  }

  /**
   * Returns the sleeping time between a point generation and the successive
   *
   * @return The sleeping time between a point generation and the successive (in
   * milliseconds)
   */
   getInfinitePointGeneratorSleep() {
  }

  /**
   * Draws a demo of this Z4PointIterator
   *
   * @param context The context where to draw the demo
   * @param painter The painter to use, it can be null
   * @param spatioTemporalColor The color to use, it can be null
   * @param progression The color progression to use, it can be null
   * @param width The width
   * @param height The height
   * @param valueIsAdjusting true if the demo is for an adjusting value, false
   * otherwise
   */
   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
  }

   toJSON() {
    let json = new Object();
    json["type"] = this.getType();
    json["rotation"] = this.rotation.toJSON();
    return json;
  }
}
/**
 * The airbrush
 *
 * @author gianpiero.diblasi
 */
class Z4Airbrush extends Z4PointIterator {

   multiplicity = null;

   radius = 0;

   speed = 0;

   gaussianCorrection = 0;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param radius The radius
   * @param speed The speed
   * @param gaussianCorrection The gaussian correction
   * @param rotation The rotation
   */
  constructor(multiplicity, radius, speed, gaussianCorrection, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.radius = radius;
    this.speed = speed;
    this.gaussianCorrection = gaussianCorrection;
  }

   getType() {
    return Z4PointIteratorType.AIRBRUSH;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the radius
   *
   * @return The radius
   */
   getRadius() {
    return this.radius;
  }

  /**
   * Returns the speed
   *
   * @return The speed
   */
   getSpeed() {
    return this.speed;
  }

  /**
   * Returns the gaussian correction
   *
   * @return The gaussian correction
   */
   getGaussianCorrection() {
    return this.gaussianCorrection;
  }

   drawAction(action, progression, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      if (progression.isResetOnStartMoving()) {
        this.nextdDrawingPoint = null;
      }
      return true;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return false;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      this.hasNext = false;
      return false;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.hasNext = true;
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let currentRadius = this.radius * Z4Math.randomCorrected(this.gaussianCorrection / 10.0);
      let currenAngle = Z4Math.TWO_PI * Math.random();
      let angle = this.rotation.next(currenAngle);
      let vector = Z4Vector.fromVector(this.currentPoint.x + currentRadius * Math.cos(currenAngle), currentRadius * Math.sin(currenAngle) + this.currentPoint.y, 1, angle);
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL && this.currentMultiplicityCounter === 1) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        temporalPosition = currentRadius / this.radius;
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, Z4DrawingPointIntent.DRAW_OBJECTS, this.rotation.computeSide(vector, null), false);
      return this.nextdDrawingPoint;
    }
  }

   getNextCountOnSTOP() {
    return 0;
  }

   isInfinitePointGenerator() {
    return true;
  }

   getInfinitePointGeneratorSleep() {
    return parseInt(250 / this.speed);
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    painter = painter ? painter : new Z4ArrowPainter();
    spatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    progression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    this.drawAction(Z4PointIteratorDrawingAction.START, progression, width / 2, height / 2);
    let next = null;
    while ((next = this.next(spatioTemporalColor, progression)) !== null) {
      if (valueIsAdjusting) {
        next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
      }
      context.save();
      context.translate(next.z4Vector.x0, next.z4Vector.y0);
      context.rotate(next.z4Vector.phase);
      painter.draw(context, next, spatioTemporalColor, progression);
      context.restore();
    }
    this.drawAction(Z4PointIteratorDrawingAction.STOP, progression, width / 2, height / 2);
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["radius"] = this.radius;
    json["speed"] = this.speed;
    json["gaussianCorrection"] = this.gaussianCorrection;
    return json;
  }

  /**
   * Creates a Z4Airbrush from a JSON object
   *
   * @param json The JSON object
   * @return the airbrush
   */
  static  fromJSON(json) {
    return new Z4Airbrush(Z4FancifulValue.fromJSON(json["multiplicity"]), json["radius"], json["speed"], json["gaussianCorrection"], Z4Rotation.fromJSON(json["rotation"]));
  }
}
/**
 * The scatterer
 *
 * @author gianpiero.diblasi
 */
class Z4Scatterer extends Z4PointIterator {

   multiplicity = null;

   scattering = null;

   before = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param scattering The scattering
   * @param rotation The rotation
   */
  constructor(multiplicity, scattering, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.scattering = scattering;
  }

   getType() {
    return Z4PointIteratorType.SCATTERER;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the scattering
   *
   * @return The scattering
   */
   getScattering() {
    return this.scattering;
  }

   drawAction(action, progression, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.before = this.currentPoint;
      this.hasNext = false;
      if (progression.isResetOnStartMoving()) {
        this.nextdDrawingPoint = null;
      }
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      return false;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let nextScattering = this.scattering.next() / 10;
      let currentVector = Z4Vector.fromPoints(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y);
      let angle = this.rotation.next(currentVector.phase);
      let vector = Z4Vector.fromVector(this.currentPoint.x + currentVector.module * nextScattering * Math.cos(angle), this.currentPoint.y + currentVector.module * nextScattering * Math.sin(angle), 1, angle);
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, Z4DrawingPointIntent.DRAW_OBJECTS, this.rotation.computeSide(vector, currentVector), false);
      return this.nextdDrawingPoint;
    }
  }

   getNextCountOnSTOP() {
    return 0;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    let finalPainter = painter ? painter : new Z4ArrowPainter();
    let finalSpatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    let finalColorProgression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    this.initDraw(width, height).forEach((point, index, array) => {
      this.drawAction(index ? Z4PointIteratorDrawingAction.CONTINUE : Z4PointIteratorDrawingAction.START, finalColorProgression, point.x, point.y);
      context.save();
      context.lineWidth = 1;
      context.fillStyle = Z4Constants.getStyle("black");
      context.beginPath();
      context.arc(this.currentPoint.x, this.currentPoint.y, 2, 0, Z4Math.TWO_PI);
      context.fill();
      context.restore();
      let next = null;
      while ((next = this.next(spatioTemporalColor, finalColorProgression)) !== null) {
        if (valueIsAdjusting) {
          next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
        }
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        finalPainter.draw(context, next, finalSpatioTemporalColor, finalColorProgression);
        context.restore();
      }
    });
  }

   initDraw(w, h) {
    let array = new Array();
    let coordinates = new Array(1, 49, 2, 48, 4, 47, 7, 42, 10, 40, 12, 38, 15, 42);
    for (let i = 0; i < coordinates.length; i += 2) {
      array.push(new Z4Point(w * coordinates[i] / 50, h * coordinates[i + 1] / 50));
    }
    return array;
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["scattering"] = this.scattering.toJSON();
    return json;
  }

  /**
   * Creates a Z4Scatterer from a JSON object
   *
   * @param json The JSON object
   * @return the scatterer
   */
  static  fromJSON(json) {
    return new Z4Scatterer(Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["scattering"]), Z4Rotation.fromJSON(json["rotation"]));
  }
}
/**
 * The spirograph
 *
 * @author gianpiero.diblasi
 */
class Z4Spirograph extends Z4PointIterator {

   drawWhileMoving = false;

   center = null;

   clones = new Array();

   clonePos = 0;

   fromClones = false;

  /**
   * Creates the object
   *
   * @param drawWhileMoving true to draw while moving, false otherwise
   * @param rotation The rotation
   */
  constructor(drawWhileMoving, rotation) {
    super(rotation);
    this.drawWhileMoving = drawWhileMoving;
  }

   getType() {
    return Z4PointIteratorType.SPIROGRAPH;
  }

  /**
   * Checks if this painter has to draw while moving
   *
   * @return true if this painter has to draw while moving, false otherwise
   */
   isDrawWhileMoving() {
    return this.drawWhileMoving;
  }

   drawAction(action, progression, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.center = new Z4Point(x, y);
      this.hasNext = false;
      this.clones = new Array();
      this.fromClones = false;
      if (progression.isResetOnStartMoving()) {
        this.nextdDrawingPoint = null;
      }
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      return true;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      this.fromClones = true;
      this.clonePos = this.clones.length - 1;
      this.hasNext = this.clonePos !== -1;
      return true;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      let clone = this.clones[this.clonePos];
      this.nextdDrawingPoint = new Z4DrawingPoint(clone.z4Vector, clone.intensity, this.clonePos / this.clones.length, Z4DrawingPointIntent.DRAW_OBJECTS, clone.side, clone.useVectorModuleAsSize);
      this.clonePos--;
      this.hasNext = this.clonePos !== -1;
      return this.nextdDrawingPoint;
    } else {
      let currentVector = Z4Vector.fromPoints(this.center.x, this.center.y, this.currentPoint.x, this.currentPoint.y);
      let angle = this.rotation.next(currentVector.phase);
      let vector = Z4Vector.fromVector(this.center.x, this.center.y, currentVector.module, angle);
      let intent = this.drawWhileMoving ? Z4DrawingPointIntent.DRAW_OBJECTS : Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS;
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (this.drawWhileMoving && progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        intent = Z4DrawingPointIntent.DRAW_BOUNDS;
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.hasNext = false;
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, intent, this.rotation.computeSide(vector, currentVector), true);
      if (this.nextdDrawingPoint.intent === Z4DrawingPointIntent.REPLACE_PREVIOUS_BOUNDS) {
        this.clones = new Array(this.nextdDrawingPoint);
      } else if (this.nextdDrawingPoint.intent === Z4DrawingPointIntent.DRAW_BOUNDS) {
        this.clones.push(this.nextdDrawingPoint);
      }
      return this.nextdDrawingPoint;
    }
  }

   getNextCountOnSTOP() {
    return this.clones.length;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    let finalPainter = painter ? painter : new Z4ArrowPainter();
    let finalSpatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    let finalColorProgression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    let points = this.initDraw(width, height);
    let start = points[0];
    this.drawAction(Z4PointIteratorDrawingAction.START, finalColorProgression, start.x, start.y);
    points.slice(1).forEach(point => {
      this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, finalColorProgression, point.x, point.y);
      this.drawDemoPoint(context, finalPainter, finalSpatioTemporalColor, finalColorProgression, valueIsAdjusting);
    });
    let stop = points[points.length - 1];
    this.drawAction(Z4PointIteratorDrawingAction.STOP, finalColorProgression, stop.x, stop.y);
    this.drawDemoPoint(context, finalPainter, finalSpatioTemporalColor, finalColorProgression, valueIsAdjusting);
  }

   initDraw(w, h) {
    let w2 = w / 2;
    let h2 = h / 2;
    let wh8 = Math.min(w, h) / 16;
    let size = parseInt(w * h / (100 * 100));
    let array = new Array();
    for (let i = 0; i < size; i++) {
      let theta = Z4Math.TWO_PI * i / size;
      array.push(new Z4Point(w2 + wh8 * theta * Math.cos(theta), h2 + wh8 * theta * Math.sin(theta)));
    }
    return array;
  }

   drawDemoPoint(context, arrowPainter, spatioTemporalColor, progression, valueIsAdjusting) {
    let next = null;
    while ((next = this.next(spatioTemporalColor, progression)) !== null) {
      if (valueIsAdjusting) {
        next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
      }
      if (next.intent === Z4DrawingPointIntent.DRAW_OBJECTS || valueIsAdjusting) {
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        arrowPainter.draw(context, next, spatioTemporalColor, progression);
        context.restore();
      }
    }
  }

   toJSON() {
    let json = super.toJSON();
    json["drawWhileMoving"] = this.drawWhileMoving;
    return json;
  }

  /**
   * Creates a Z4Spirograph from a JSON object
   *
   * @param json The JSON object
   * @return the spirograph
   */
  static  fromJSON(json) {
    return new Z4Spirograph(json["drawWhileMoving"], Z4Rotation.fromJSON(json["rotation"]));
  }
}
/**
 * The stamper
 *
 * @author gianpiero.diblasi
 */
class Z4Stamper extends Z4PointIterator {

   multiplicity = null;

   push = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param push The push
   * @param rotation The rotation
   */
  constructor(multiplicity, push, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.push = push;
  }

   getType() {
    return Z4PointIteratorType.STAMPER;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the push
   *
   * @return The push
   */
   getPush() {
    return this.push;
  }

   drawAction(action, progression, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = true;
      if (progression.isResetOnStartMoving()) {
        this.nextdDrawingPoint = null;
      }
      return true;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else {
      this.currentMultiplicityCounter++;
      this.hasNext = this.currentMultiplicityCounter < this.currentMultiplicityTotal;
      let vector = null;
      let angle = this.rotation.next(0.0);
      let currentPush = this.push.next();
      if (currentPush) {
        let pushed = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, currentPush, angle);
        vector = Z4Vector.fromVector(pushed.x, pushed.y, 1, angle);
      } else {
        vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 1, angle);
      }
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, 1, temporalPosition, Z4DrawingPointIntent.DRAW_OBJECTS, this.rotation.computeSide(vector, null), false);
      return this.nextdDrawingPoint;
    }
  }

   getNextCountOnSTOP() {
    return 0;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    let finalPainter = painter ? painter : new Z4ArrowPainter();
    let finalSpatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    let finalColorProgression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    this.initDraw(width, height).forEach(point => {
      this.drawAction(Z4PointIteratorDrawingAction.START, finalColorProgression, point.x, point.y);
      context.save();
      context.lineWidth = 1;
      context.fillStyle = Z4Constants.getStyle("black");
      context.beginPath();
      context.arc(this.currentPoint.x, this.currentPoint.y, 2, 0, Z4Math.TWO_PI);
      context.fill();
      context.restore();
      let next = null;
      while ((next = this.next(spatioTemporalColor, finalColorProgression)) !== null) {
        if (valueIsAdjusting) {
          next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
        }
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        finalPainter.draw(context, next, finalSpatioTemporalColor, finalColorProgression);
        context.restore();
      }
    });
  }

   initDraw(w, h) {
    let array = new Array();
    for (let x = 50; x <= w; x += 100) {
      for (let y = 50; y <= h; y += 100) {
        array.push(new Z4Point(x, y));
      }
    }
    return array;
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["push"] = this.push.toJSON();
    return json;
  }

  /**
   * Creates a Z4Stamper from a JSON object
   *
   * @param json The JSON object
   * @return the stamper
   */
  static  fromJSON(json) {
    return new Z4Stamper(Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["push"]), Z4Rotation.fromJSON(json["rotation"]));
  }
}
/**
 * The tracer
 *
 * @author gianpiero.diblasi
 */
class Z4Tracer extends Z4PointIterator {

   multiplicity = null;

   push = null;

   attack = null;

   sustain = null;

   release = null;

   endlessSustain = false;

   step = null;

   assistedDrawing = false;

   path = null;

   before = null;

   envelopeA = 0.0;

   envelopeS = 0.0;

   envelopeR = 0.0;

   envelopeAS = 0.0;

   envelopeASR = 0.0;

   envelopePosition = 0.0;

   envelopeStep = 0.0;

   clones = new Array();

   clonePos = 0;

   fromClones = false;

   surplus = 0.0;

   connect = false;

   currentVector = null;

   currentMultiplicityCounter = 0;

   currentMultiplicityTotal = 0;

  /**
   * Creates the object
   *
   * @param multiplicity The multiplicity
   * @param push The push
   * @param attack The attack
   * @param sustain The sustain
   * @param release The release
   * @param endlessSustain true for an endless sustain, false otherwise
   * @param step The step
   * @param assistedDrawing true to use the assisted drawing, false otherwise
   * @param rotation The rotation
   */
  constructor(multiplicity, push, attack, sustain, release, endlessSustain, step, assistedDrawing, rotation) {
    super(rotation);
    this.multiplicity = multiplicity;
    this.push = push;
    this.attack = attack;
    this.sustain = sustain;
    this.release = release;
    this.endlessSustain = endlessSustain;
    this.step = step;
    this.assistedDrawing = assistedDrawing;
  }

   getType() {
    return Z4PointIteratorType.TRACER;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the push
   *
   * @return The push
   */
   getPush() {
    return this.push;
  }

  /**
   * Returns the attack
   *
   * @return The attack
   */
   getAttack() {
    return this.attack;
  }

  /**
   * Returns the release
   *
   * @return The release
   */
   getRelease() {
    return this.release;
  }

  /**
   * Returns the sustain
   *
   * @return The sustain
   */
   getSustain() {
    return this.sustain;
  }

  /**
   * Checks if the sustain is endless
   *
   * @return true for an endless sustain, false otherwise
   */
   isEndlessSustain() {
    return this.endlessSustain;
  }

  /**
   * Returns the step
   *
   * @return The step
   */
   getStep() {
    return this.step;
  }

  /**
   * Checks if the assisted drawing is active
   *
   * @return true if the assisted drawing is active, false otherwise
   */
   isAssistedDrawing() {
    return this.assistedDrawing;
  }

   drawAction(action, progression, x, y) {
    if (action === Z4PointIteratorDrawingAction.START) {
      this.currentPoint = new Z4Point(x, y);
      this.hasNext = false;
      this.path = null;
      this.envelopeA = this.attack.next();
      this.envelopeS = this.sustain.next();
      this.envelopeR = this.release.next();
      this.envelopeAS = this.envelopeA + this.envelopeS;
      this.envelopeASR = this.envelopeA + this.envelopeS + this.envelopeR;
      this.envelopePosition = 0;
      this.envelopeStep = this.step.next();
      this.clones = new Array();
      this.fromClones = false;
      this.surplus = 0;
      this.connect = false;
      if (progression.isResetOnStartMoving()) {
        this.nextdDrawingPoint = null;
      }
      return false;
    } else if (action === Z4PointIteratorDrawingAction.CONTINUE) {
      this.currentMultiplicityCounter = 0;
      this.currentMultiplicityTotal = parseInt(this.multiplicity.next());
      let distance = Z4Math.distance(this.currentPoint.x, this.currentPoint.y, x, y);
      if (!this.assistedDrawing) {
        this.path = Z4TracerPath.fromLine(this.currentPoint.x, this.currentPoint.y, x, y, this.surplus, this.envelopeStep);
        this.connect = true;
        this.currentPoint = new Z4Point(x, y);
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      } else if (distance >= 10) {
        let angle = Z4Math.atan(this.currentPoint.x, this.currentPoint.y, x, y);
        let vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, 2 * distance / 3, angle);
        let end = new Z4Point(vector.x, vector.y);
        if (this.connect) {
          vector = Z4Vector.fromVector(this.currentPoint.x, this.currentPoint.y, distance / 3, angle);
          this.path = Z4TracerPath.fromQuadAndLine(this.before.x, this.before.y, this.currentPoint.x, this.currentPoint.y, vector.x, vector.y, end.x, end.y, this.surplus, this.envelopeStep);
        } else {
          this.path = Z4TracerPath.fromLine(this.currentPoint.x, this.currentPoint.y, vector.x, vector.y, this.surplus, this.envelopeStep);
        }
        this.connect = true;
        this.before = end;
        this.currentPoint = new Z4Point(x, y);
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      } else {
        this.hasNext = false;
      }
      return true;
    } else if (action === Z4PointIteratorDrawingAction.STOP) {
      this.fromClones = true;
      this.clonePos = 0;
      this.hasNext = this.clonePos < this.clones.length;
      return true;
    } else {
      return false;
    }
  }

   next(color, progression) {
    if (!this.hasNext) {
      return null;
    } else if (this.fromClones) {
      let clone = this.clones[this.clonePos];
      this.clonePos++;
      this.hasNext = this.clonePos < this.clones.length;
      return new Z4DrawingPoint(clone.z4Vector, clone.intensity, this.clonePos / this.clones.length, Z4DrawingPointIntent.DRAW_OBJECTS, clone.side, clone.useVectorModuleAsSize);
    } else {
      if (!this.currentMultiplicityCounter) {
        this.currentVector = this.path.next();
      }
      let vector = null;
      let angle = this.rotation.next(this.currentVector.phase);
      let currentPush = this.push.next();
      if (currentPush) {
        let pushed = Z4Vector.fromVector(this.currentVector.x0, this.currentVector.y0, currentPush, angle);
        vector = Z4Vector.fromVector(pushed.x, pushed.y, 1, angle);
      } else {
        vector = Z4Vector.fromVector(this.currentVector.x0, this.currentVector.y0, 1, angle);
      }
      let intent = Z4DrawingPointIntent.DRAW_OBJECTS;
      let temporalPosition = this.nextdDrawingPoint ? this.nextdDrawingPoint.temporalPosition : -1;
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.TEMPORAL) {
        temporalPosition = progression.next(temporalPosition);
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RELATIVE_TO_PATH) {
        intent = Z4DrawingPointIntent.DRAW_BOUNDS;
      } else if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM) {
        temporalPosition = Math.random();
      }
      this.currentMultiplicityCounter++;
      if (this.currentMultiplicityCounter >= this.currentMultiplicityTotal) {
        this.currentMultiplicityCounter = 0;
        this.hasNext = this.path.hasNext();
        if (!this.hasNext) {
          this.surplus = this.path.getNewSurplus();
        }
      }
      this.nextdDrawingPoint = new Z4DrawingPoint(vector, this.nextEnvelope(), temporalPosition, intent, this.rotation.computeSide(vector, this.currentVector), false);
      if (this.nextdDrawingPoint.intent === Z4DrawingPointIntent.DRAW_BOUNDS && this.nextdDrawingPoint.intensity > 0) {
        this.clones.push(this.nextdDrawingPoint);
      }
      return this.nextdDrawingPoint;
    }
  }

   nextEnvelope() {
    if (this.envelopePosition < this.envelopeA) {
      this.envelopePosition++;
      return this.envelopePosition / this.envelopeA;
    } else if (this.envelopePosition < this.envelopeAS || this.endlessSustain) {
      this.envelopePosition++;
      return 1;
    } else if (this.envelopePosition < this.envelopeASR) {
      this.envelopePosition++;
      return 1 - (this.envelopePosition - this.envelopeAS) / this.envelopeR;
    } else {
      return 0;
    }
  }

   getNextCountOnSTOP() {
    return this.clones.length;
  }

   isInfinitePointGenerator() {
    return false;
  }

   getInfinitePointGeneratorSleep() {
    return 0;
  }

   drawDemo(context, painter, spatioTemporalColor, progression, width, height, valueIsAdjusting) {
    painter = painter ? painter : new Z4ArrowPainter();
    spatioTemporalColor = spatioTemporalColor ? spatioTemporalColor : Z4SpatioTemporalColor.fromColor(new Color(0, 0, 0, 255));
    progression = progression ? progression : new Z4ColorProgression(Z4ColorProgressionBehavior.SPATIAL, 0, false, Z4Lighting.NONE);
    let bezier = width > height ? new Bezier(width / 10, height / 3, width / 2, 3 * height / 2, width / 2, -height / 2, 9 * width / 10, height / 2) : new Bezier(width / 3, 9 * height / 10, 3 * width / 2, height / 2, -width / 2, height / 2, width / 2, height / 10);
    let p = bezier.get(0);
    this.drawAction(Z4PointIteratorDrawingAction.START, progression, p.x, p.y);
    for (let s = 0.1; s < 1; s += 0.1) {
      p = bezier.get(s);
      this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, progression, p.x, p.y);
      this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting);
    }
    p = bezier.get(1);
    this.drawAction(Z4PointIteratorDrawingAction.CONTINUE, progression, p.x, p.y);
    this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting);
    this.drawAction(Z4PointIteratorDrawingAction.STOP, progression, p.x, p.y);
    this.drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting);
  }

   drawDemoPoint(context, p, painter, spatioTemporalColor, progression, valueIsAdjusting) {
    context.save();
    context.lineWidth = 1;
    context.fillStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.arc(p.x, p.y, 2, 0, Z4Math.TWO_PI);
    context.fill();
    context.restore();
    let next = null;
    while ((next = this.next(spatioTemporalColor, progression)) !== null) {
      if (valueIsAdjusting) {
        next = new Z4DrawingPoint(next.z4Vector, next.intensity, next.temporalPosition, Z4DrawingPointIntent.DRAW_BOUNDS, next.side, next.useVectorModuleAsSize);
      }
      if (next.intent === Z4DrawingPointIntent.DRAW_OBJECTS || valueIsAdjusting) {
        context.save();
        context.translate(next.z4Vector.x0, next.z4Vector.y0);
        context.rotate(next.z4Vector.phase);
        painter.draw(context, next, spatioTemporalColor, progression);
        context.restore();
      }
    }
  }

   toJSON() {
    let json = super.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["push"] = this.push.toJSON();
    json["attack"] = this.attack.toJSON();
    json["sustain"] = this.sustain.toJSON();
    json["release"] = this.release.toJSON();
    json["endlessSustain"] = this.endlessSustain;
    json["step"] = this.step.toJSON();
    json["assistedDrawing"] = this.assistedDrawing;
    return json;
  }

  /**
   * Creates a Z4Tracer from a JSON object
   *
   * @param json The JSON object
   * @return the tracer
   */
  static  fromJSON(json) {
    return new Z4Tracer(Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["push"]), Z4FancifulValue.fromJSON(json["attack"]), Z4FancifulValue.fromJSON(json["sustain"]), Z4FancifulValue.fromJSON(json["release"]), json["endlessSustain"], Z4FancifulValue.fromJSON(json["step"]), json["assistedDrawing"], Z4Rotation.fromJSON(json["rotation"]));
  }
}
/**
 * The whirlpool
 *
 * @author gianpiero.diblasi
 */
class Z4Whirlpool extends Z4JSONable {

   behavior = null;

   angle = null;

  /**
   * Creates the object
   *
   * @param behavior The behavior
   * @param angle The angle
   */
  constructor(behavior, angle) {
    super();
    this.behavior = behavior;
    this.angle = angle;
  }

  /**
   * Returns the behavior
   *
   * @return The behavior
   */
   getWhirlpoolBehavior() {
    return this.behavior;
  }

  /**
   * Returns the angle
   *
   * @return The angle
   */
   getAngle() {
    return this.angle;
  }

   toJSON() {
    let json = new Object();
    json["behavior"] = this.behavior;
    json["angle"] = this.angle.toJSON();
    return json;
  }

  /**
   * Creates a Z4Whirlpool from a JSON object
   *
   * @param json The JSON object
   * @return the whirlpool
   */
  static  fromJSON(json) {
    return new Z4Whirlpool(json["behavior"], Z4FancifulValue.fromJSON(json["angle"]));
  }
}
/**
 * The common parent of all painters
 *
 * @author gianpiero.diblasi
 */
class Z4Painter extends Z4JSONable {

  /**
   * Returns the painter type
   *
   * @return The painter type
   */
   getType() {
  }

  /**
   * Performs a drawing
   *
   * @param context The context to use to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   * @param spatioTemporalColor The color to use to perform the drawing
   * @param progression The color progression to use to perform the drawing
   */
   draw(context, drawingPoint, spatioTemporalColor, progression) {
  }

   toJSON() {
    let json = new Object();
    json["type"] = this.getType();
    return json;
  }
}
/**
 * @author gianpiero.diblasi
 */
class Z4ArrowPainter extends Z4Painter {

   module = 30;

   bool = false;

   getType() {
    return Z4PainterType.ARROW;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    this.bool = !this.bool;
    let x = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.module);
    context.save();
    context.lineWidth = 2;
    context.strokeStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.arc(0, 0, 2, 0, Z4Math.TWO_PI);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle(this.bool ? "blue" : "red");
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(x, 0);
    context.lineTo(x - 10, -5);
    context.lineTo(x - 10, +5);
    context.lineTo(x, 0);
    context.stroke();
    context.restore();
  }
}
/**
 * The painter representing a brush
 *
 * @author gianpiero.diblasi
 */
class Z4BrushPainter extends Z4Painter {

   width = null;

   thickness = null;

   pattern = null;

  /**
   * Creates the object
   *
   * @param width The width of the brush
   * @param thickness The thickness of the brush
   * @param pattern The pattern, it can be null
   */
  constructor(width, thickness, pattern) {
    super();
    this.width = width;
    this.thickness = thickness;
    this.pattern = pattern;
  }

   getType() {
    return Z4PainterType.BRUSH;
  }

  /**
   * Returns the width of the brush
   *
   * @return The width of the brush
   */
   getWidth() {
    return this.width;
  }

  /**
   * Returns the thickness of the brush
   *
   * @return The thickness of the brush
   */
   getThickness() {
    return this.thickness;
  }

  /**
   * Returns the pattern
   *
   * @return The pattern
   */
   getPattern() {
    return this.pattern;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      let currentThickness = drawingPoint.intensity * this.thickness.getConstant().getValue();
      this.drawBounds(context, currentWidth, currentThickness);
    } else {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.next());
      let currentThickness = drawingPoint.intensity * this.thickness.next();
      if (currentWidth > 0 && currentThickness > 0) {
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, spatioTemporalColor.getGradientColorAt(-1), null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, drawingPoint, currentWidth, currentThickness, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawWithColors(context, drawingPoint, currentWidth, currentThickness, gradientColor, color, lighting) {
    if (color) {
      if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, color.getRGBA_HEX());
      } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#FFFFFFFF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, color.getRGBA_HEX());
        linearGradient.addColorStop(1, "#000000FF");
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, "#FFFFFFFF");
        linearGradient.addColorStop(1, color.getRGBA_HEX());
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
        let linearGradient = context.createLinearGradient(-currentWidth / 2, 0, currentWidth / 2, 0);
        linearGradient.addColorStop(0, "#000000FF");
        linearGradient.addColorStop(1, color.getRGBA_HEX());
        this.drawPath(context, currentWidth, currentThickness, linearGradient);
      }
    } else if (gradientColor) {
      if (lighting === Z4Lighting.NONE) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.lighted(true).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.darkened(true).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.lighted(false).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
        this.drawPath(context, currentWidth, currentThickness, gradientColor.darkened(false).createLinearGradient(context, -currentWidth / 2, 0, currentWidth / 2, 0));
      }
    }
    if (this.pattern) {
      this.drawPattern(context, drawingPoint, currentWidth, currentThickness, context.createPattern(this.pattern, "repeat"));
    }
  }

   drawPath(context, currentWidth, currentThickness, color) {
    context.save();
    context.rotate(Z4Math.HALF_PI);
    context.lineCap = "round";
    context.lineWidth = currentThickness;
    context.strokeStyle = Z4Constants.getStyle(color);
    context.beginPath();
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();
    context.restore();
  }

   drawPattern(context, drawingPoint, currentWidth, currentThickness, color) {
    context.save();
    context.rotate(-drawingPoint.z4Vector.phase);
    context.translate(-drawingPoint.z4Vector.x0, -drawingPoint.z4Vector.y0);
    context.lineCap = "round";
    context.lineWidth = currentThickness + 2;
    context.strokeStyle = Z4Constants.getStyle(color);
    context.beginPath();
    let point = Z4Math.rotoTranslate(-currentWidth / 2, 0, Z4Math.HALF_PI + drawingPoint.z4Vector.phase, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    context.moveTo(point.x, point.y);
    point = Z4Math.rotoTranslate(currentWidth / 2, 0, Z4Math.HALF_PI + drawingPoint.z4Vector.phase, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    context.lineTo(point.x, point.y);
    context.stroke();
    context.restore();
  }

   drawBounds(context, currentWidth, currentThickness) {
    context.save();
    context.rotate(Z4Math.HALF_PI);
    context.lineCap = "round";
    context.lineWidth = currentThickness;
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.beginPath();
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.translate(1, 1);
    context.moveTo(-currentWidth / 2, 0);
    context.lineTo(+currentWidth / 2, 0);
    context.stroke();
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["width"] = this.width.toJSON();
    json["thickness"] = this.thickness.toJSON();
    if (this.pattern) {
      let canvas = document.createElement("canvas");
      canvas.width = this.pattern.width;
      canvas.height = this.pattern.height;
      let context = canvas.getContext("2d");
      context.drawImage(this.pattern, 0, 0);
      json["pattern"] = canvas.toDataURL("image/png", 1);
    }
    return json;
  }

  /**
   * Creates a Z4BrushPainter from a JSON object
   *
   * @param json The JSON object
   * @return the brush painter
   */
  static  fromJSON(json) {
    let pattern = null;
    if (json["pattern"]) {
      pattern = new Image();
      pattern.src = json["pattern"];
    }
    return new Z4BrushPainter(Z4FancifulValue.fromJSON(json["width"]), Z4FancifulValue.fromJSON(json["thickness"]), pattern);
  }
}
/**
 * The painter of centered figures
 *
 * @author gianpiero.diblasi
 */
class Z4CenteredFigurePainter extends Z4Painter {

   centeredFigurePainterType = null;

   size = null;

   angle1 = null;

   angle2 = null;

   tension = null;

   multiplicity = null;

   hole = null;

   whirlpool = null;

   cover = 0;

   shadowShiftX = null;

   shadowShiftY = null;

   shadowColor = null;

   borderSize = null;

   borderColor = null;

   path1e = null;

   path1i = null;

   path2e = null;

   path2i = null;

   c1e = null;

   c1i = null;

   c2e = null;

   c2i = null;

   pF = null;

   pathForShadowBorderE = null;

   pathForShadowBorderI = null;

  /**
   * Creates the object
   *
   * @param centeredFigurePainterType The type of Z4CenteredFigurePainter
   * @param size The size
   * @param angle1 The first angle
   * @param angle2 The second angle
   * @param tension The tension
   * @param multiplicity The multiplicity
   * @param hole The hole
   * @param whirlpool The whirlpool
   * @param cover The cover (in the range [1,100])
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderSize The border size
   * @param borderColor The border color
   */
  constructor(centeredFigurePainterType, size, angle1, angle2, tension, multiplicity, hole, whirlpool, cover, shadowShiftX, shadowShiftY, shadowColor, borderSize, borderColor) {
    super();
    this.centeredFigurePainterType = centeredFigurePainterType;
    this.size = size;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.tension = tension;
    this.multiplicity = multiplicity;
    this.hole = hole;
    this.whirlpool = whirlpool;
    this.cover = cover;
    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;
    this.borderSize = borderSize;
    this.borderColor = borderColor;
  }

   getType() {
    return Z4PainterType.CENTERED_FIGURE;
  }

  /**
   * Returns the type of Z4CenteredFigurePainter
   *
   * @return The type of Z4CenteredFigurePainter
   */
   getCenteredFigurePainterType() {
    return this.centeredFigurePainterType;
  }

  /**
   * Returns the size
   *
   * @return The size
   */
   getSize() {
    return this.size;
  }

  /**
   * Returns the first angle
   *
   * @return The first angle
   */
   getAngle1() {
    return this.angle1;
  }

  /**
   * Returns the second angle
   *
   * @return The second angle
   */
   getAngle2() {
    return this.angle2;
  }

  /**
   * Returns the tension
   *
   * @return The tension
   */
   getTension() {
    return this.tension;
  }

  /**
   * Returns the multiplicity
   *
   * @return The multiplicity
   */
   getMultiplicity() {
    return this.multiplicity;
  }

  /**
   * Returns the hole
   *
   * @return The hole
   */
   getHole() {
    return this.hole;
  }

  /**
   * Returns the whirlpool
   *
   * @return The whirlpool
   */
   getWhirlpool() {
    return this.whirlpool;
  }

  /**
   * Returns the cover (in the range [1,100])
   *
   * @return The cover (in the range [1,100])
   */
   getCover() {
    return this.cover;
  }

  /**
   * Returns the X shadow shift
   *
   * @return The X shadow shift
   */
   getShadowShiftX() {
    return this.shadowShiftX;
  }

  /**
   * Returns the Y shadow shift
   *
   * @return The Y shadow shift
   */
   getShadowShiftY() {
    return this.shadowShiftY;
  }

  /**
   * Returns the shadow color
   *
   * @return The shadow color
   */
   getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border size
   *
   * @return The border size
   */
   getBorderSize() {
    return this.borderSize;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
   getBorderColor() {
    return this.borderColor;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.getConstant().getValue());
      let currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().getConstant().getValue());
      let currentHole = this.hole.getConstant().getValue();
      let point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
      drawingPoint = new Z4DrawingPoint(Z4Vector.fromPoints(currentHole, 0, point.x, point.y), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
      if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
        this.type0_1_2(drawingPoint, 1, false);
      } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
        this.type3_4_5(drawingPoint, currentAngle, currentHole, 1, false);
      }
      this.drawBounds(context, drawingPoint);
    } else {
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.next());
      if (currentSize > 0) {
        let currentAngle = Z4Math.deg2rad(this.whirlpool.getAngle().next());
        let currentHole = this.hole.next();
        let currentCover = this.cover / 100;
        let currentMultiplicity = this.multiplicity.next();
        let point = this.checkWhirlpool1(currentAngle, currentHole, currentSize);
        drawingPoint = new Z4DrawingPoint(Z4Vector.fromPoints(currentHole, 0, point.x, point.y), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
        let currentShadowShiftX = this.shadowShiftX.next();
        let currentShadowShiftY = this.shadowShiftY.next();
        let currentBorderSize = this.borderSize.next();
        let shadowOrBorder = currentShadowShiftX || currentShadowShiftY || currentBorderSize > 0;
        if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
          this.type0_1_2(drawingPoint, currentCover, shadowOrBorder);
        } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
          this.type3_4_5(drawingPoint, currentAngle, currentHole, currentCover, shadowOrBorder);
        }
        this.drawFigures(context, drawingPoint, currentMultiplicity, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
      }
    }
  }

   drawBounds(context, drawingPoint) {
    for (let i = 0; i < this.multiplicity.getConstant().getValue(); i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / this.multiplicity.getConstant().getValue());
      if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
        this.drawBezier(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, 0, 1, new Color(128, 128, 128, 255));
      } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
        this.drawBezier(context, drawingPoint, this.c1i, this.c2i, this.path1i, this.path2i, 0, 1, new Color(128, 128, 128, 255));
        this.drawBezier(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, 0, 1, new Color(128, 128, 128, 255));
      }
      context.translate(1, 1);
      if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
        this.drawBezier(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, 0, 1, new Color(0, 0, 0, 255));
      } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
        this.drawBezier(context, drawingPoint, this.c1i, this.c2i, this.path1i, this.path2i, 0, 1, new Color(0, 0, 0, 255));
        this.drawBezier(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, 0, 1, new Color(0, 0, 0, 255));
      }
      context.restore();
    }
  }

  // One Bezier curve. Start and end point coincide in the fulcrum
   type0_1_2(drawingPoint, currentCover, shadowOrBorder) {
    this.pF = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    let ce = Z4Math.butterfly(drawingPoint.z4Vector, Z4Math.deg2rad(this.angle1.next()));
    this.c1e = ce[0];
    this.c2e = ce[1];
    if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0) {
      // The control points collapse towards the fulcrum
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1) {
      // The control points collapse towards newPoint
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
      // The control points collapse towards their midpoint
      let mx = (this.c1e.x + this.c2e.x) / 2;
      let my = (this.c1e.y + this.c2e.y) / 2;
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, mx, my, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, mx, my, currentCover);
    }
    if (shadowOrBorder) {
      this.pathForShadowBorderE = new Path2D();
      this.pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorderE.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }
  }

  // Two Bezier curves. Start point lies on the fulcrum, end point lies on newPoint
   type3_4_5(drawingPoint, currentAngle, currentHole, currentCover, shadowOrBorder) {
    this.pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3) {
      // One control point collapses towards the fulcrum, the other one collapses towards newPoint
      this.c1e = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), 1, this.tension.next());
      this.c1i = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), -1, this.tension.next());
      this.c2e = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), -1, this.tension.next());
      this.c2i = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), 1, this.tension.next());
      this.c2e = new Z4Point(drawingPoint.z4Vector.module + this.c2e.x, this.c2e.y);
      this.c2i = new Z4Point(drawingPoint.z4Vector.module + this.c2i.x, this.c2i.y);
      this.c1e = this.checkWhirlpool2(drawingPoint, this.c1e, currentAngle, currentHole);
      this.c1i = this.checkWhirlpool2(drawingPoint, this.c1i, currentAngle, currentHole);
      this.c2e = this.checkWhirlpool2(drawingPoint, this.c2e, currentAngle, currentHole);
      this.c2i = this.checkWhirlpool2(drawingPoint, this.c2i, currentAngle, currentHole);
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2i = this.findControlPointPath(this.c2i.x, this.c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4) {
      // The second control point is fixed on the fulcrum, the first control point collapses towards the fulcrum
      this.c1e = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), 1, this.tension.next());
      this.c1i = this.setControlPoint(drawingPoint, currentHole, 0, Z4Math.deg2rad(this.angle1.next()), -1, this.tension.next());
      this.c2e = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.c2i = new Z4Point(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.c1e = this.checkWhirlpool2(drawingPoint, this.c1e, currentAngle, currentHole);
      this.c1i = this.checkWhirlpool2(drawingPoint, this.c1i, currentAngle, currentHole);
      this.path1e = this.findControlPointPath(this.c1e.x, this.c1e.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path1i = this.findControlPointPath(this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0, currentCover);
      this.path2e = new Z4Point(0, 0);
      this.path2i = new Z4Point(0, 0);
    } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
      // The first control point is fixed on newPoint, the second control point collapses towards newPoint
      this.c1e = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      this.c1i = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      this.c2e = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), -1, this.tension.next());
      this.c2i = this.setControlPoint(drawingPoint, currentHole, -Math.PI, Z4Math.deg2rad(this.angle2.next()), 1, this.tension.next());
      this.c2e = new Z4Point(drawingPoint.z4Vector.module + this.c2e.x, this.c2e.y);
      this.c2i = new Z4Point(drawingPoint.z4Vector.module + this.c2i.x, this.c2i.y);
      this.c2e = this.checkWhirlpool2(drawingPoint, this.c2e, currentAngle, currentHole);
      this.c2i = this.checkWhirlpool2(drawingPoint, this.c2i, currentAngle, currentHole);
      this.path1e = new Z4Point(0, 0);
      this.path1i = new Z4Point(0, 0);
      this.path2e = this.findControlPointPath(this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
      this.path2i = this.findControlPointPath(this.c2i.x, this.c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y, currentCover);
    }
    if (shadowOrBorder) {
      this.pathForShadowBorderE = new Path2D();
      this.pathForShadowBorderE.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorderE.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
      this.pathForShadowBorderI = new Path2D();
      this.pathForShadowBorderI.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorderI.bezierCurveTo(this.c1i.x, this.c1i.y, this.c2i.x, this.c2i.y, drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    }
  }

   findControlPointPath(p1x, p1y, p2x, p2y, currentCover) {
    let module = Z4Math.distance(p1x, p1y, p2x, p2y);
    let phase = Z4Math.atan(p1x, p1y, p2x, p2y);
    return new Z4Point(module * currentCover * Math.cos(phase), module * currentCover * Math.sin(phase));
  }

   setControlPoint(drawingPoint, currentHole, phase, currentAngle, angleSign, currentTension) {
    return Z4Math.rotoTranslate(currentTension / 100 * drawingPoint.intensity * drawingPoint.z4Vector.module, 0, phase + angleSign * currentAngle, currentHole, 0);
  }

   checkWhirlpool1(currentAngle, currentHole, currentSize) {
    if (currentHole === 0 || currentAngle === 0 || this.whirlpool.getWhirlpoolBehavior() === Z4WhirlpoolBehavior.NONE) {
      return new Z4Point(currentSize + currentHole, 0);
    } else if (this.whirlpool.getWhirlpoolBehavior() === Z4WhirlpoolBehavior.FORWARD) {
      return Z4Math.rotoTranslate(currentSize, 0, currentAngle, currentHole, 0);
    } else if (this.whirlpool.getWhirlpoolBehavior() === Z4WhirlpoolBehavior.BACKWARD) {
      return Z4Math.rotoTranslate(currentSize, 0, -currentAngle, currentHole, 0);
    } else {
      return null;
    }
  }

   checkWhirlpool2(point, p, currentAngle, currentHole) {
    if (currentHole === 0 || currentAngle === 0 || this.whirlpool.getWhirlpoolBehavior() === Z4WhirlpoolBehavior.NONE) {
      return new Z4Point(p.x + point.z4Vector.x0, p.y + point.z4Vector.y0);
    } else if (this.whirlpool.getWhirlpoolBehavior() === Z4WhirlpoolBehavior.FORWARD) {
      return Z4Math.rotoTranslate(p.x, p.y, currentAngle, point.z4Vector.x0, point.z4Vector.y0);
    } else if (this.whirlpool.getWhirlpoolBehavior() === Z4WhirlpoolBehavior.BACKWARD) {
      return Z4Math.rotoTranslate(p.x, p.y, -currentAngle, point.z4Vector.x0, point.z4Vector.y0);
    } else {
      return null;
    }
  }

   drawFigures(context, drawingPoint, currentMultiplicity, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    for (let i = 0; i < currentMultiplicity; i++) {
      context.save();
      context.rotate(Z4Math.TWO_PI * i / currentMultiplicity);
      if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_0 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_1 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_2) {
        this.drawFigure(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, spatioTemporalColor, progression, this.pathForShadowBorderE, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
      } else if (this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_3 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_4 || this.centeredFigurePainterType === Z4CenteredFigurePainterType.TYPE_5) {
        this.drawFigure(context, drawingPoint, this.c1i, this.c2i, this.path1i, this.path2i, spatioTemporalColor, progression, this.pathForShadowBorderI, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
        this.drawFigure(context, drawingPoint, this.c1e, this.c2e, this.path1e, this.path2e, spatioTemporalColor, progression, this.pathForShadowBorderE, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
      }
      context.restore();
    }
  }

   drawFigure(context, drawingPoint, c1, c2, path1, path2, spatioTemporalColor, progression, pathForShadowBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    if (currentShadowShiftX || currentShadowShiftY) {
      this.drawShadow(context, pathForShadowBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
    }
    if (currentBorderSize > 0) {
      this.drawBorder(context, pathForShadowBorder, currentBorderSize);
    }
    if (spatioTemporalColor.isColor()) {
      let color = spatioTemporalColor.getColorAt(-1, -1);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, null, color, progression.getLighting());
    } else if (spatioTemporalColor.isGradientColor()) {
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
        this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, spatioTemporalColor, null, null, progression.getLighting());
      } else {
        let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
        this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, null, color, progression.getLighting());
      }
    } else if (spatioTemporalColor.isBiGradientColor()) {
      let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, null, gradientColor, null, progression.getLighting());
    }
  }

   drawFigureWithColors(context, drawingPoint, c1, c2, path1, path2, spatioTemporalColor, gradientColor, color, lighting) {
    let length = Math.max(Z4Math.distance(path1.x, path1.y, 0, 0), Z4Math.distance(path2.x, path2.y, 0, 0));
    for (let i = 0; i < length; i += 3) {
      let val = i / length;
      if (color && lighting === Z4Lighting.NONE) {
        this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, 3, color);
      } else {
        let c = color;
        if (spatioTemporalColor) {
          c = spatioTemporalColor.getColorAt(-1, val);
        } else if (gradientColor) {
          c = gradientColor.getColorAt(val, true);
        }
        if (lighting === Z4Lighting.NONE) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, 3, c);
        } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, 3, c.lighted(1 - val));
        } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, 3, c.darkened(1 - val));
        } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, 3, c.lighted(val));
        } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
          this.drawBezier(context, drawingPoint, c1, c2, path1, path2, val, 3, c.darkened(val));
        }
      }
    }
  }

   drawBezier(context, drawingPoint, c1, c2, path1, path2, val, lineWidth, color) {
    context.save();
    context.lineWidth = lineWidth;
    context.strokeStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    context.beginPath();
    context.moveTo(drawingPoint.z4Vector.x0, 0);
    context.bezierCurveTo(c1.x + path1.x * val, c1.y + path1.y * val, c2.x + path2.x * val, c2.y + path2.y * val, this.pF.x, this.pF.y);
    context.stroke();
    context.restore();
  }

   drawShadow(context, pathForShadowBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    context.save();
    context.translate(currentShadowShiftX, currentShadowShiftY);
    if (currentBorderSize > 0) {
      context.lineWidth = currentBorderSize;
      context.strokeStyle = Z4Constants.getStyle(this.shadowColor.getRGBA_HEX());
      context.stroke(pathForShadowBorder);
    }
    context.fillStyle = Z4Constants.getStyle(this.shadowColor.getRGBA_HEX());
    context.fill(pathForShadowBorder);
    context.restore();
  }

   drawBorder(context, pathForShadowBorder, currentBorderSize) {
    context.save();
    context.lineWidth = currentBorderSize;
    context.strokeStyle = Z4Constants.getStyle(this.borderColor.getRGBA_HEX());
    context.stroke(pathForShadowBorder);
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["centeredFigurePainterType"] = this.centeredFigurePainterType;
    json["size"] = this.size.toJSON();
    json["angle1"] = this.angle1.toJSON();
    json["angle2"] = this.angle2.toJSON();
    json["tension"] = this.tension.toJSON();
    json["multiplicity"] = this.multiplicity.toJSON();
    json["hole"] = this.hole.toJSON();
    json["whirlpool"] = this.whirlpool.toJSON();
    json["cover"] = this.cover;
    json["shadowShiftX"] = this.shadowShiftX.toJSON();
    json["shadowShiftY"] = this.shadowShiftY.toJSON();
    json["shadowColor"] = this.shadowColor.getJSON();
    json["borderSize"] = this.borderSize.toJSON();
    json["borderColor"] = this.borderColor.getJSON();
    return json;
  }

  /**
   * Creates a Z4CenteredFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the centered figure painter
   */
  static  fromJSON(json) {
    return new Z4CenteredFigurePainter(json["centeredFigurePainterType"], Z4FancifulValue.fromJSON(json["size"]), Z4FancifulValue.fromJSON(json["angle1"]), Z4FancifulValue.fromJSON(json["angle2"]), Z4FancifulValue.fromJSON(json["tension"]), Z4FancifulValue.fromJSON(json["multiplicity"]), Z4FancifulValue.fromJSON(json["hole"]), Z4Whirlpool.fromJSON(json["whirlpool"]), json["cover"], Z4FancifulValue.fromJSON(json["shadowShiftX"]), Z4FancifulValue.fromJSON(json["shadowShiftY"]), Color.fromJSON(json["shadowColor"]), Z4FancifulValue.fromJSON(json["borderSize"]), Color.fromJSON(json["borderColor"]));
  }
}
/**
 * The painter of drops
 *
 * @author gianpiero.diblasi
 */
class Z4DropPainter extends Z4Painter {

   dropPainterType = null;

   radius = null;

   intensity = 0;

   gaussianCorrection = 0;

  /**
   * Creates the object
   *
   * @param dropPainterType The type of Z4DropPainter
   * @param radius The radius
   * @param intensity The intensity
   * @param gaussianCorrection The gaussian correction
   */
  constructor(dropPainterType, radius, intensity, gaussianCorrection) {
    super();
    this.dropPainterType = dropPainterType;
    this.radius = radius;
    this.intensity = intensity;
    this.gaussianCorrection = gaussianCorrection;
  }

   getType() {
    return Z4PainterType.DROP;
  }

  /**
   * Returns the type of Z4DropPainter
   *
   * @return The type of Z4DropPainter
   */
   getDropPainterType() {
    return this.dropPainterType;
  }

  /**
   * Returns the radius
   *
   * @return The radius
   */
   getRadius() {
    return this.radius;
  }

  /**
   * Returns the intensity
   *
   * @return The intensity
   */
   getIntensity() {
    return this.intensity;
  }

  /**
   * Returns the gaussian correction
   *
   * @return The gaussian correction
   */
   getGaussianCorrection() {
    return this.gaussianCorrection;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentRadius = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.radius.getConstant().getValue());
      this.drawBounds(context, currentRadius);
    } else {
      let currentRadius = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.radius.next());
      if (currentRadius > 0) {
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawWithColors(context, currentRadius, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawWithColors(context, currentRadius, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawWithColors(context, currentRadius, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawWithColors(context, currentRadius, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawWithColors(context, currentRadius, spatioTemporalColor, gradientColor, color, lighting) {
    let val = currentRadius * this.intensity / 2;
    for (let t = 0; t < val; t++) {
      let r = currentRadius * Z4Math.randomCorrected(this.gaussianCorrection / 10.0);
      if (color && lighting === Z4Lighting.NONE) {
        this.drawPath(context, r, color);
      } else {
        let c = color;
        if (spatioTemporalColor) {
          c = spatioTemporalColor.getColorAt(-1, r / currentRadius);
        } else if (gradientColor) {
          c = gradientColor.getColorAt(r / currentRadius, true);
        }
        if (lighting === Z4Lighting.NONE) {
          this.drawPath(context, r, c);
        } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
          this.drawPath(context, r, c.lighted(r / currentRadius));
        } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
          this.drawPath(context, r, c.darkened(r / currentRadius));
        } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
          this.drawPath(context, r, c.lighted(1 - r / currentRadius));
        } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
          this.drawPath(context, r, c.darkened(1 - r / currentRadius));
        }
      }
    }
  }

   drawPath(context, radius, color) {
    context.save();
    context.fillStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    context.strokeStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    let alfa = Math.random() * Z4Math.TWO_PI;
    let rX = radius * Math.cos(alfa);
    let rY = radius * Math.sin(alfa);
    context.beginPath();
    if (this.dropPainterType === Z4DropPainterType.THOUSAND_POINTS) {
      context.arc(rX, rY, 1, 0, Z4Math.TWO_PI);
      context.fill();
    } else if (this.dropPainterType === Z4DropPainterType.THOUSAND_LINES) {
      context.moveTo(rX + Z4Math.SQRT_OF_2, rY);
      context.lineTo(rX - Z4Math.SQRT_OF_2, rY);
      context.stroke();
    } else if (this.dropPainterType === Z4DropPainterType.THOUSAND_AREAS) {
      context.arc(rX, rY, 2, 0, Z4Math.TWO_PI);
      context.fill();
    }
    context.restore();
  }

   drawBounds(context, currentRadius) {
    context.save();
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.beginPath();
    context.arc(0, 0, currentRadius, 0, Z4Math.TWO_PI);
    context.stroke();
    context.strokeStyle = Z4Constants.getStyle("black");
    context.beginPath();
    context.arc(1, 1, currentRadius, 0, Z4Math.TWO_PI);
    context.stroke();
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["dropPainterType"] = this.dropPainterType;
    json["radius"] = this.radius.toJSON();
    json["intensity"] = this.intensity;
    json["gaussianCorrection"] = this.gaussianCorrection;
    return json;
  }

  /**
   * Creates a Z4DropPainter from a JSON object
   *
   * @param json The JSON object
   * @return the drop painter
   */
  static  fromJSON(json) {
    return new Z4DropPainter(json["dropPainterType"], Z4FancifulValue.fromJSON(json["radius"]), json["intensity"], json["gaussianCorrection"]);
  }
}
/**
 * The painter of natural figures
 *
 * @author gianpiero.diblasi
 */
class Z4NaturalFigurePainter extends Z4Painter {

   naturalFigurePainterType = null;

   controlPointClosure = null;

   size = null;

   internalAngle1 = null;

   externalAngle1 = null;

   internalAngle2 = null;

   externalAngle2 = null;

   internalTension1 = null;

   externalTension1 = null;

   internalTension2 = null;

   externalTension2 = null;

  // Frastagliatura
   indentation = 0;

   externalForceAngle = null;

   externalForceTension = null;

   shadowShiftX = null;

   shadowShiftY = null;

   shadowColor = null;

   borderSize = null;

   borderColor = null;

   path1 = null;

   path2 = null;

   c1e = null;

   c1i = null;

   c2e = null;

   c2i = null;

   pF = null;

   pathForShadowBorder = null;

  /**
   * Creates the object
   *
   * @param naturalFigurePainterType The type of Z4NaturalFigurePainter
   * @param controlPointClosure The control point closure of
   * Z4NaturalFigurePainter
   * @param size The size
   * @param internalAngle1 The angle of the first internal control point
   * @param externalAngle1 The angle of the first external control point
   * @param internalAngle2 The angle of the second internal control point
   * @param externalAngle2 The angle of the second external control point
   * @param internalTension1 The tension of the first internal control point
   * @param externalTension1 The tension of the first external control point
   * @param internalTension2 The tension of the second internal control point
   * @param externalTension2 The tension of the second external control point
   * @param indentation The indentation
   * @param externalForceAngle The angle of the external force
   * @param externalForceTension The tension of the external force
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderSize The border size
   * @param borderColor The border color
   */
  constructor(naturalFigurePainterType, controlPointClosure, size, internalAngle1, externalAngle1, internalAngle2, externalAngle2, internalTension1, externalTension1, internalTension2, externalTension2, indentation, externalForceAngle, externalForceTension, shadowShiftX, shadowShiftY, shadowColor, borderSize, borderColor) {
    super();
    this.naturalFigurePainterType = naturalFigurePainterType;
    this.controlPointClosure = controlPointClosure;
    this.size = size;
    this.internalAngle1 = internalAngle1;
    this.externalAngle1 = externalAngle1;
    this.internalAngle2 = internalAngle2;
    this.externalAngle2 = externalAngle2;
    this.internalTension1 = internalTension1;
    this.externalTension1 = externalTension1;
    this.internalTension2 = internalTension2;
    this.externalTension2 = externalTension2;
    this.indentation = indentation;
    this.externalForceAngle = externalForceAngle;
    this.externalForceTension = externalForceTension;
    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;
    this.borderSize = borderSize;
    this.borderColor = borderColor;
  }

   getType() {
    return Z4PainterType.NATURAL_FIGURE;
  }

  /**
   * Returns the type of Z4NaturalFigurePainter
   *
   * @return The type of Z4NaturalFigurePainter
   */
   getNaturalFigurePainterType() {
    return this.naturalFigurePainterType;
  }

  /**
   * Returns the control point closure of Z4NaturalFigurePainter
   *
   * @return The control point closure of Z4NaturalFigurePainter
   */
   getControlPointClosure() {
    return this.controlPointClosure;
  }

  /**
   * Returns the size
   *
   * @return The size
   */
   getSize() {
    return this.size;
  }

  /**
   * Returns the angle of the first internal control point
   *
   * @return The angle of the first internal control point
   */
   getInternalAngle1() {
    return this.internalAngle1;
  }

  /**
   * Returns the angle of the first external control point
   *
   * @return The angle of the first external control point
   */
   getExternalAngle1() {
    return this.externalAngle1;
  }

  /**
   * Returns the angle of the second internal control point
   *
   * @return The angle of the second internal control point
   */
   getInternalAngle2() {
    return this.internalAngle2;
  }

  /**
   * Returns the angle of the second external control point
   *
   * @return The angle of the second external control point
   */
   getExternalAngle2() {
    return this.externalAngle2;
  }

  /**
   * Returns the tension of the first internal control point
   *
   * @return The tension of the first internal control point
   */
   getInternalTension1() {
    return this.internalTension1;
  }

  /**
   * Returns the tension of the first external control point
   *
   * @return The tension of the first external control point
   */
   getExternalTension1() {
    return this.externalTension1;
  }

  /**
   * Returns the tension of the second internal control point
   *
   * @return The tension of the second internal control point
   */
   getInternalTension2() {
    return this.internalTension2;
  }

  /**
   * Returns the tension of the second external control point
   *
   * @return The tension of the second external control point
   */
   getExternalTension2() {
    return this.externalTension2;
  }

  /**
   * Returns the indentation
   *
   * @return The indentation
   */
   getIndentation() {
    return this.indentation;
  }

  /**
   * Returns the angle of the external force
   *
   * @return The angle of the external force
   */
   getExternalForceAngle() {
    return this.externalForceAngle;
  }

  /**
   * Returns the tension of the external force
   *
   * @return The tension of the external force
   */
   getExternalForceTension() {
    return this.externalForceTension;
  }

  /**
   * Returns the X shadow shift
   *
   * @return The X shadow shift
   */
   getShadowShiftX() {
    return this.shadowShiftX;
  }

  /**
   * Returns the Y shadow shift
   *
   * @return The Y shadow shift
   */
   getShadowShiftY() {
    return this.shadowShiftY;
  }

  /**
   * Returns the shadow color
   *
   * @return The shadow color
   */
   getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border size
   *
   * @return The border size
   */
   getBorderSize() {
    return this.borderSize;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
   getBorderColor() {
    return this.borderColor;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.getConstant().getValue());
      let originalAngle = drawingPoint.z4Vector.phase;
      let currentExternalForceAngle = this.externalForceAngle.getConstant().getValue();
      let currentExternalForceTension = this.externalForceTension.getConstant().getValue();
      drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
      this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);
      this.c1e = this.setControlPoint(0, Z4Math.deg2rad(this.externalAngle1.getConstant().getValue()), 1, this.externalTension1.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.c1i = this.setControlPoint(0, Z4Math.deg2rad(this.internalAngle1.getConstant().getValue()), -1, this.internalTension1.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.c2e = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.externalAngle2.getConstant().getValue()), -1, this.externalTension2.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.c2i = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.internalAngle2.getConstant().getValue()), 1, this.internalTension2.getConstant().getValue(), drawingPoint.intensity, drawingPoint.side.next());
      this.evalPointClosure(drawingPoint);
      if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_0) {
        this.type0(context, drawingPoint, null, null, false, 0, 0, 0, true);
      } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_1) {
        this.type1(context, drawingPoint, null, null, false, 0, 0, 0, true);
      } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_2) {
        this.type2(context, drawingPoint, null, null, false, 0, 0, 0, true);
      } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_3) {
        this.type3(context, drawingPoint, null, null, false, 0, 0, 0, true);
      }
    } else {
      let currentSize = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.size.next());
      if (currentSize > 0) {
        let originalAngle = drawingPoint.z4Vector.phase;
        let currentExternalForceAngle = this.externalForceAngle.next();
        let currentExternalForceTension = this.externalForceTension.next();
        drawingPoint = new Z4DrawingPoint(Z4Vector.fromVector(0, 0, currentSize, 0), drawingPoint.intensity, drawingPoint.temporalPosition, drawingPoint.intent, drawingPoint.side, drawingPoint.useVectorModuleAsSize);
        this.evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension);
        this.c1e = this.setControlPoint(0, Z4Math.deg2rad(this.externalAngle1.next()), 1, this.externalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c1i = this.setControlPoint(0, Z4Math.deg2rad(this.internalAngle1.next()), -1, this.internalTension1.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2e = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.externalAngle2.next()), -1, this.externalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.c2i = this.setControlPoint(-Math.PI, Z4Math.deg2rad(this.internalAngle2.next()), 1, this.internalTension2.next(), drawingPoint.intensity, drawingPoint.side.next());
        this.evalPointClosure(drawingPoint);
        let currentShadowShiftX = this.shadowShiftX.next();
        let currentShadowShiftY = this.shadowShiftY.next();
        let currentBorderSize = this.borderSize.next();
        let shadowOrBorder = currentShadowShiftX || currentShadowShiftY || currentBorderSize > 0;
        if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_0) {
          this.type0(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_1) {
          this.type1(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_2) {
          this.type2(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        } else if (this.naturalFigurePainterType === Z4NaturalFigurePainterType.TYPE_3) {
          this.type3(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, false);
        }
      }
    }
  }

   evalForce(drawingPoint, originalAngle, currentExternalForceAngle, currentExternalForceTension) {
    if (currentExternalForceTension > 0) {
      let angle = Z4Math.deg2rad(currentExternalForceAngle) - originalAngle;
      let tension = drawingPoint.intensity * currentExternalForceTension;
      this.pF = new Z4Point(drawingPoint.z4Vector.x + tension * Math.cos(angle), drawingPoint.z4Vector.y + tension * Math.sin(angle));
    } else {
      this.pF = new Z4Point(drawingPoint.z4Vector.x, drawingPoint.z4Vector.y);
    }
  }

   setControlPoint(phase, angle, angleSign, tension, intensity, side) {
    return Z4Math.rotate(intensity * tension, 0, phase + angleSign * side * angle);
  }

   evalPointClosure(drawingPoint) {
    if (this.controlPointClosure === Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_0) {
      this.c1e = new Z4Point(this.c1e.x + drawingPoint.z4Vector.x, this.c1e.y + drawingPoint.z4Vector.y);
      this.c1i = new Z4Point(this.c1i.x + drawingPoint.z4Vector.x, this.c1i.y + drawingPoint.z4Vector.y);
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure === Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_1) {
      this.c2e = new Z4Point(this.c2e.x + drawingPoint.z4Vector.x, this.c2e.y + drawingPoint.z4Vector.y);
      this.c2i = new Z4Point(this.c2i.x + drawingPoint.z4Vector.x, this.c2i.y + drawingPoint.z4Vector.y);
    } else if (this.controlPointClosure === Z4NaturalFigurePainterControlPointClosure.CONTROL_POINT_CLOSURE_2) {
    }
  }

   type0(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.c2i.x, this.c2i.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
      this.pathForShadowBorder.bezierCurveTo(this.c2i.x, this.c2i.y, this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }
    this.drawFigure(context, drawingPoint, this.c1e, this.c2e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

   type1(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds) {
    this.path1 = this.findControlPointPath(this.c1i.x, this.c1i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c1i.x, this.c1i.y, this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, this.c1i, this.c2i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2e.x, this.c2e.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, this.c1e, this.c2e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

   type2(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds) {
    this.path1 = this.findControlPointPath(this.c2i.x, this.c2i.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c2i.x, this.c2i.y, this.c1i.x, this.c1i.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, this.c2i, this.c1i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
    this.path1 = this.findControlPointPath(this.c2e.x, this.c2e.y, 0, 0);
    this.path2 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      pathForShadowBorder.bezierCurveTo(this.c2e.x, this.c2e.y, this.c1e.x, this.c1e.y, this.pF.x, this.pF.y);
    }
    this.drawFigure(context, drawingPoint, this.c2e, this.c1e, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

   type3(context, drawingPoint, spatioTemporalColor, progression, shadowOrBorder, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds) {
    this.path1 = this.findControlPointPath(this.c1e.x, this.c1e.y, this.c1i.x, this.c1i.y);
    this.path2 = this.findControlPointPath(this.c2i.x, this.c2i.y, this.c2e.x, this.c2e.y);
    if (shadowOrBorder) {
      this.pathForShadowBorder = new Path2D();
      this.pathForShadowBorder.moveTo(drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
      this.pathForShadowBorder.bezierCurveTo(this.c1e.x, this.c1e.y, this.c2i.x, this.c2i.y, this.pF.x, this.pF.y);
      this.pathForShadowBorder.bezierCurveTo(this.c2e.x, this.c2e.y, this.c1i.x, this.c1i.y, drawingPoint.z4Vector.x0, drawingPoint.z4Vector.y0);
    }
    this.drawFigure(context, drawingPoint, this.c1e, this.c2i, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds);
  }

   findControlPointPath(p1x, p1y, p2x, p2y) {
    let helpVector = Z4Vector.fromPoints(p1x, p1y, p2x, p2y);
    return Z4Math.rotate(helpVector.module, 0, helpVector.phase);
  }

   drawFigure(context, drawingPoint, c1, c2, spatioTemporalColor, progression, currentShadowShiftX, currentShadowShiftY, currentBorderSize, drawBounds) {
    if (currentShadowShiftX || currentShadowShiftY) {
      this.drawShadow(context, currentShadowShiftX, currentShadowShiftY, currentBorderSize);
    }
    if (currentBorderSize > 0) {
      this.drawBorder(context, currentBorderSize);
    }
    if (drawBounds) {
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, null, null, drawBounds);
    } else if (spatioTemporalColor.isColor()) {
      let color = spatioTemporalColor.getColorAt(-1, -1);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting(), drawBounds);
    } else if (spatioTemporalColor.isGradientColor()) {
      if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
        this.drawFigureWithColors(context, drawingPoint, c1, c2, spatioTemporalColor, null, null, progression.getLighting(), drawBounds);
      } else {
        let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
        this.drawFigureWithColors(context, drawingPoint, c1, c2, null, null, color, progression.getLighting(), drawBounds);
      }
    } else if (spatioTemporalColor.isBiGradientColor()) {
      let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
      this.drawFigureWithColors(context, drawingPoint, c1, c2, null, gradientColor, null, progression.getLighting(), drawBounds);
    }
  }

   drawFigureWithColors(context, drawingPoint, c1, c2, spatioTemporalColor, gradientColor, color, lighting, drawBounds) {
    let length = Math.max(Z4Math.distance(this.path1.x, this.path1.y, 0, 0), Z4Math.distance(this.path2.x, this.path2.y, 0, 0));
    if (drawBounds) {
      let indentationValue = this.indentation * Math.random();
      let indentationAngle = Z4Math.TWO_PI * Math.random();
      context.save();
      this.drawBezier(context, drawingPoint, c1, c2, 0, indentationValue, indentationAngle, 1, new Color(128, 128, 128, 255));
      this.drawBezier(context, drawingPoint, c1, c2, 1, indentationValue, indentationAngle, 1, new Color(128, 128, 128, 255));
      context.translate(1, 1);
      this.drawBezier(context, drawingPoint, c1, c2, 0, indentationValue, indentationAngle, 1, new Color(0, 0, 0, 255));
      this.drawBezier(context, drawingPoint, c1, c2, 1, indentationValue, indentationAngle, 1, new Color(0, 0, 0, 255));
      context.restore();
    } else {
      for (let i = 0; i < length; i += 3) {
        let val = i / length;
        let c = color;
        if (color && lighting === Z4Lighting.NONE) {
        } else {
          if (spatioTemporalColor) {
            c = spatioTemporalColor.getColorAt(-1, val);
          } else if (gradientColor) {
            c = gradientColor.getColorAt(val, true);
          }
        }
        if (lighting === Z4Lighting.NONE) {
        } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
          c = c.lighted(1 - val);
        } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
          c = c.darkened(1 - val);
        } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
          c = c.lighted(val);
        } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
          c = c.darkened(val);
        }
        this.drawBezier(context, drawingPoint, c1, c2, val, this.indentation * Math.random(), Z4Math.TWO_PI * Math.random(), 3, c);
      }
    }
  }

   drawBezier(context, drawingPoint, c1, c2, val, indentationValue, indentationAngle, lineWidth, c) {
    let indentX = indentationValue > 0 ? indentationValue * Math.cos(indentationAngle) : 0;
    let indentY = indentationValue > 0 ? indentationValue * Math.sin(indentationAngle) : 0;
    context.save();
    context.lineWidth = lineWidth;
    context.strokeStyle = Z4Constants.getStyle(c.getRGBA_HEX());
    context.beginPath();
    context.moveTo(drawingPoint.z4Vector.x0, 0);
    context.bezierCurveTo(c1.x + this.path1.x * val, c1.y + this.path1.y * val, c2.x + this.path2.x * val, c2.y + this.path2.y * val, this.pF.x + indentX, this.pF.y + indentY);
    context.stroke();
    context.restore();
  }

   drawShadow(context, currentShadowShiftX, currentShadowShiftY, currentBorderSize) {
    context.save();
    context.translate(currentShadowShiftX, currentShadowShiftY);
    if (currentBorderSize > 0) {
      context.lineWidth = currentBorderSize;
      context.strokeStyle = Z4Constants.getStyle(this.shadowColor.getRGBA_HEX());
      context.stroke(this.pathForShadowBorder);
    }
    context.fillStyle = Z4Constants.getStyle(this.shadowColor.getRGBA_HEX());
    context.fill(this.pathForShadowBorder);
    context.restore();
  }

   drawBorder(context, currentBorderSize) {
    context.save();
    context.lineWidth = currentBorderSize;
    context.strokeStyle = Z4Constants.getStyle(this.borderColor.getRGBA_HEX());
    context.stroke(this.pathForShadowBorder);
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["naturalFigurePainterType"] = this.naturalFigurePainterType;
    json["controlPointClosure"] = this.controlPointClosure;
    json["size"] = this.size.toJSON();
    json["internalAngle1"] = this.internalAngle1.toJSON();
    json["externalAngle1"] = this.externalAngle1.toJSON();
    json["internalAngle2"] = this.internalAngle2.toJSON();
    json["externalAngle2"] = this.externalAngle2.toJSON();
    json["internalTension1"] = this.internalTension1.toJSON();
    json["externalTension1"] = this.externalTension1.toJSON();
    json["internalTension2"] = this.internalTension2.toJSON();
    json["externalTension2"] = this.externalTension2.toJSON();
    json["indentation"] = this.indentation;
    json["externalForceAngle"] = this.externalForceAngle.toJSON();
    json["externalForceTension"] = this.externalForceTension.toJSON();
    json["shadowShiftX"] = this.shadowShiftX.toJSON();
    json["shadowShiftY"] = this.shadowShiftY.toJSON();
    json["shadowColor"] = this.shadowColor.getJSON();
    json["borderSize"] = this.borderSize.toJSON();
    json["borderColor"] = this.borderColor.getJSON();
    return json;
  }

  /**
   * Creates a Z4NaturalFigurePainter from a JSON object
   *
   * @param json The JSON object
   * @return the natural figure painter
   */
  static  fromJSON(json) {
    return new Z4NaturalFigurePainter(json["naturalFigurePainterType"], json["controlPointClosure"], Z4FancifulValue.fromJSON(json["size"]), Z4FancifulValue.fromJSON(json["internalAngle1"]), Z4FancifulValue.fromJSON(json["externalAngle1"]), Z4FancifulValue.fromJSON(json["internalAngle2"]), Z4FancifulValue.fromJSON(json["externalAngle2"]), Z4FancifulValue.fromJSON(json["internalTension1"]), Z4FancifulValue.fromJSON(json["externalTension1"]), Z4FancifulValue.fromJSON(json["internalTension2"]), Z4FancifulValue.fromJSON(json["externalTension2"]), json["indentation"], Z4FancifulValue.fromJSON(json["externalForceAngle"]), Z4FancifulValue.fromJSON(json["externalForceTension"]), Z4FancifulValue.fromJSON(json["shadowShiftX"]), Z4FancifulValue.fromJSON(json["shadowShiftY"]), Color.fromJSON(json["shadowColor"]), Z4FancifulValue.fromJSON(json["borderSize"]), Color.fromJSON(json["borderColor"]));
  }
}
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
/**
 * The painter of 2D shapes
 *
 * @author gianpiero.diblasi
 */
class Z4Shape2DPainter extends Z4Painter {

   width = null;

   height = null;

   regular = false;

   star = false;

   vertices = 0;

   shadowShiftX = null;

   shadowShiftY = null;

   shadowColor = null;

   borderWidth = null;

   borderHeight = null;

   borderColor = null;

   path = new Path2D();

  /**
   * Creates the object
   *
   * @param width The width
   * @param height The height
   * @param regular true if the shape is regular (width = height), false
   * otherwise
   * @param star true if the shape is a star, false otherwise
   * @param vertices The number of vertices, -1 for an ellipse
   * @param shadowShiftX The X shadow shift
   * @param shadowShiftY The Y shadow shift
   * @param shadowColor The shadow color
   * @param borderWidth The border width
   * @param borderHeight The border height
   * @param borderColor The border color
   */
  constructor(width, height, regular, star, vertices, shadowShiftX, shadowShiftY, shadowColor, borderWidth, borderHeight, borderColor) {
    super();
    this.width = width;
    this.height = height;
    this.regular = regular;
    this.star = star;
    this.vertices = vertices;
    this.shadowShiftX = shadowShiftX;
    this.shadowShiftY = shadowShiftY;
    this.shadowColor = shadowColor;
    this.borderWidth = borderWidth;
    this.borderHeight = borderHeight;
    this.borderColor = borderColor;
    if (vertices === -1) {
      this.path.arc(0, 0, 1, 0, Z4Math.TWO_PI);
    } else if (star) {
      Z4Math.getStarVertices(vertices).forEach((point, index, array) => {
        if (index) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    } else {
      Z4Math.getPolygonVertices(vertices).forEach((point, index, array) => {
        if (index) {
          this.path.lineTo(point.x, point.y);
        } else {
          this.path.moveTo(point.x, point.y);
        }
      });
    }
    this.path.closePath();
  }

   getType() {
    return Z4PainterType.SHAPE_2D;
  }

  /**
   * Returns the width
   *
   * @return The width
   */
   getWidth() {
    return this.width;
  }

  /**
   * Returns the height
   *
   * @return The height
   */
   getHeight() {
    return this.height;
  }

  /**
   * Checks if the shape is regular (width = height)
   *
   * @return true if the shape is regular (width = height), false otherwise
   */
   isRegular() {
    return this.regular;
  }

  /**
   * Checks if the shape is a star
   *
   * @return true if the shape is a star, false otherwise
   */
   isStar() {
    return this.star;
  }

  /**
   * Returns the number of vertices, -1 for an ellipse
   *
   * @return The number of vertices, -1 for an ellipse
   */
   getVertices() {
    return this.vertices;
  }

  /**
   * Returns the X shadow shift
   *
   * @return The X shadow shift
   */
   getShadowShiftX() {
    return this.shadowShiftX;
  }

  /**
   * Returns the Y shadow shift
   *
   * @return The Y shadow shift
   */
   getShadowShiftY() {
    return this.shadowShiftY;
  }

  /**
   * Returns the shadow color
   *
   * @return The shadow color
   */
   getShadowColor() {
    return this.shadowColor;
  }

  /**
   * Returns the border width
   *
   * @return The border width
   */
   getBorderWidth() {
    return this.borderWidth;
  }

  /**
   * Returns the border height
   *
   * @return The border height
   */
   getBorderHeight() {
    return this.borderHeight;
  }

  /**
   * Returns the border color
   *
   * @return The border color
   */
   getBorderColor() {
    return this.borderColor;
  }

   draw(context, drawingPoint, spatioTemporalColor, progression) {
    if (drawingPoint.intent !== Z4DrawingPointIntent.DRAW_OBJECTS) {
      let scaleW = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.getConstant().getValue());
      let scaleH = this.regular ? scaleW : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.height.getConstant().getValue());
      this.drawBounds(context, scaleW, scaleH);
    } else {
      let currentWidth = drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.width.next());
      let currentHeight = this.regular ? currentWidth : drawingPoint.intensity * (drawingPoint.useVectorModuleAsSize ? drawingPoint.z4Vector.module : this.height.next());
      if (currentWidth > 0 && currentHeight > 0) {
        let currentShadowShiftX = this.shadowShiftX.next();
        let currentShadowShiftY = this.shadowShiftY.next();
        let currentBorderWidth = this.borderWidth.next();
        let currentBorderHeight = this.borderHeight.next();
        if (currentShadowShiftX || currentShadowShiftY) {
          context.save();
          context.translate(currentShadowShiftX, currentShadowShiftY);
          this.drawPath(context, currentWidth + (currentBorderWidth > 0 ? currentBorderWidth : 0), currentHeight + (currentBorderHeight > 0 ? currentBorderHeight : 0), this.shadowColor);
          context.restore();
        }
        if (currentBorderWidth > 0 || currentBorderHeight > 0) {
          context.save();
          this.drawPath(context, currentWidth + currentBorderWidth, currentHeight + currentBorderHeight, this.borderColor);
          context.restore();
        }
        if (spatioTemporalColor.isColor()) {
          let color = spatioTemporalColor.getColorAt(-1, -1);
          this.drawPathWithColors(context, currentWidth, currentHeight, null, null, color, progression.getLighting());
        } else if (spatioTemporalColor.isGradientColor()) {
          if (progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.SPATIAL) {
            this.drawPathWithColors(context, currentWidth, currentHeight, spatioTemporalColor, null, null, progression.getLighting());
          } else {
            let color = spatioTemporalColor.getGradientColorAt(-1).getColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition, true);
            this.drawPathWithColors(context, currentWidth, currentHeight, null, null, color, progression.getLighting());
          }
        } else if (spatioTemporalColor.isBiGradientColor()) {
          let gradientColor = spatioTemporalColor.getGradientColorAt(progression.getColorProgressionBehavior() === Z4ColorProgressionBehavior.RANDOM ? Math.random() : drawingPoint.temporalPosition);
          this.drawPathWithColors(context, currentWidth, currentHeight, null, gradientColor, null, progression.getLighting());
        }
      }
    }
  }

   drawPathWithColors(context, currentWidth, currentHeight, spatioTemporalColor, gradientColor, color, lighting) {
    if (color && lighting === Z4Lighting.NONE) {
      this.drawPath(context, currentWidth, currentHeight, color);
    } else {
      let currentSize = Math.max(currentWidth, currentHeight);
      for (let scale = currentSize; scale > 0; scale--) {
        if (spatioTemporalColor) {
          color = spatioTemporalColor.getColorAt(-1, scale / currentSize);
        } else if (gradientColor) {
          color = gradientColor.getColorAt(scale / currentSize, true);
        }
        if (lighting === Z4Lighting.NONE) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color);
        } else if (lighting === Z4Lighting.LIGHTED_IN_OUT) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.lighted(scale / currentSize));
        } else if (lighting === Z4Lighting.DARKENED_IN_OUT) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.darkened(scale / currentSize));
        } else if (lighting === Z4Lighting.LIGHTED_OUT_IN) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.lighted(1 - scale / currentSize));
        } else if (lighting === Z4Lighting.DARKENED_OUT_IN) {
          this.drawPath(context, currentWidth * scale / currentSize, currentHeight * scale / currentSize, color.darkened(1 - scale / currentSize));
        }
      }
    }
  }

   drawPath(context, scaleW, scaleH, color) {
    context.save();
    context.scale(scaleW, scaleH);
    context.fillStyle = Z4Constants.getStyle(color.getRGBA_HEX());
    context.fill(this.path);
    context.restore();
  }

   drawBounds(context, scaleW, scaleH) {
    context.save();
    context.scale(scaleW, scaleH);
    context.lineWidth = 1 / Math.min(scaleW, scaleH);
    context.strokeStyle = Z4Constants.getStyle("gray");
    context.stroke(this.path);
    context.strokeStyle = Z4Constants.getStyle("black");
    context.translate(1 / scaleW, 1 / scaleH);
    context.stroke(this.path);
    context.restore();
  }

   toJSON() {
    let json = super.toJSON();
    json["width"] = this.width.toJSON();
    json["height"] = this.height.toJSON();
    json["regular"] = this.regular;
    json["star"] = this.star;
    json["vertices"] = this.vertices;
    json["shadowShiftX"] = this.shadowShiftX.toJSON();
    json["shadowShiftY"] = this.shadowShiftY.toJSON();
    json["shadowColor"] = this.shadowColor.getJSON();
    json["borderWidth"] = this.borderWidth.toJSON();
    json["borderHeight"] = this.borderHeight.toJSON();
    json["borderColor"] = this.borderColor.getJSON();
    return json;
  }

  /**
   * Creates a Z4Shape2DPainter from a JSON object
   *
   * @param json The JSON object
   * @return the shape 2D painter
   */
  static  fromJSON(json) {
    return new Z4Shape2DPainter(Z4FancifulValue.fromJSON(json["width"]), Z4FancifulValue.fromJSON(json["height"]), json["regular"], json["star"], json["vertices"], Z4FancifulValue.fromJSON(json["shadowShiftX"]), Z4FancifulValue.fromJSON(json["shadowShiftY"]), Color.fromJSON(json["shadowColor"]), Z4FancifulValue.fromJSON(json["borderWidth"]), Z4FancifulValue.fromJSON(json["borderHeight"]), Color.fromJSON(json["borderColor"]));
  }
}
/**
 * The object representing a layer
 *
 * @author gianpiero.diblasi
 */
class Z4Layer {

   offscreen = null;

   offscreenCtx = null;

   layerPreview = null;

   blob = null;

   name = null;

   offsetX = 0;

   offsetY = 0;

   opacity = 1;

   compositeOperation = "source-over";

   width = 0;

   height = 0;

   hidden = false;

   showBounds = false;

  /**
   * Creates the object
   *
   * @param name The layer name
   * @param width The layer width
   * @param height The layer height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
  constructor(name, width, height, filling, containerWidth, containerHeight) {
    this.name = name;
    this.offscreen = new OffscreenCanvas(width, height);
    this.offscreenCtx = this.offscreen.getContext("2d");
    if (filling instanceof Color) {
      this.offscreenCtx.fillStyle = Z4Constants.getStyle((filling).getRGBA_HEX());
      this.offscreenCtx.fillRect(0, 0, width, height);
    } else if (filling instanceof Z4AbstractFiller) {
      let imageData = this.offscreenCtx.createImageData(width, height);
      (filling).fill(imageData);
      this.offscreenCtx.putImageData(imageData, 0, 0);
    } else if (filling instanceof Z4BiGradientColor) {
      let imageData = this.offscreenCtx.createImageData(width, height);
      let data = imageData.data;
      for (let y = 0; y < height; y++) {
        let gradientColor = (filling).getColorAt(y / height, true);
        for (let x = 0; x < width; x++) {
          let color = gradientColor.getColorAt(x / width, true);
          let index = (y * width + x) * 4;
          data[index] = color.red;
          data[index + 1] = color.green;
          data[index + 2] = color.blue;
          data[index + 3] = color.alpha;
        }
      }
      this.offscreenCtx.putImageData(imageData, 0, 0);
    }
    this.offsetX = (containerWidth - width) / 2;
    this.offsetY = (containerHeight - height) / 2;
    this.width = width;
    this.height = height;
  }

  /**
   * Creates a Z4Layer from an image
   *
   * @param name The layer name
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   * @return The layer
   */
  static  fromImage(name, image, containerWidth, containerHeight) {
    let layer = new Z4Layer(name, image.width, image.height, new Color(0, 0, 0, 0), containerWidth, containerHeight);
    layer.offscreenCtx.drawImage(image, 0, 0);
    return layer;
  }

  /**
   * Sets the layer preview
   *
   * @param layerPreview The layer preview
   */
   setLayerPreview(layerPreview) {
    this.layerPreview = layerPreview;
  }

  /**
   * Returns the layer preview
   *
   * @return The layer preview
   */
   getLayerPreview() {
    return this.layerPreview;
  }

  /**
   * Converts this layer to a blob
   *
   * @param apply The function to call on conversion
   */
   convertToBlob(apply) {
    if (this.blob) {
      apply(this.blob);
    } else {
      let options = new Object();
      options["type"] = "image/png";
      this.offscreen.convertToBlob(options).then(converted => {
        this.blob = converted;
        apply(this.blob);
      });
    }
  }

  /**
   * Shifts the layer
   *
   * @param shiftX The X shift
   * @param shiftY The Y shift
   */
   shift(shiftX, shiftY) {
    this.offsetX += shiftX;
    this.offsetY += shiftY;
  }

  /**
   * Sets the opacity
   *
   * @param opacity The opacity
   */
   setOpacity(opacity) {
    this.opacity = opacity;
  }

  /**
   * Returns the opacity
   *
   * @return The opacity
   */
   getOpacity() {
    return this.opacity;
  }

  /**
   * Sets the composite operation
   *
   * @param compositeOperation The composite operation
   */
   setCompositeOperation(compositeOperation) {
    this.compositeOperation = compositeOperation;
  }

  /**
   * Returns the composite operation
   *
   * @return The composite operation
   */
   getCompositeOperation() {
    return this.compositeOperation;
  }

  /**
   * Sets the hidden property
   *
   * @param hidden true to hide the layer, false otherwise
   */
   setHidden(hidden) {
    this.hidden = hidden;
  }

  /**
   * Checks if the hidden property is set
   *
   * @return true if the hidden property is set, false otherwise
   */
   isHidden() {
    return this.hidden;
  }

  /**
   * Sets the visualization of the bounds
   *
   * @param showBounds true to show the bounds, false otherwise
   */
   setShowBounds(showBounds) {
    this.showBounds = showBounds;
  }

  /**
   * Checks if the bounds have to be shown
   *
   * @return true if the bounds have to be shown, false otherwise
   */
   isShowBounds() {
    return this.showBounds;
  }

  /**
   * Moves a layer
   *
   * @param offsetX The X offset
   * @param offsetY The Y offset
   */
   move(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  /**
   * Sets the layer name
   *
   * @param name The layer name
   */
   setName(name) {
    this.name = name;
  }

  /**
   * Returns the layer name
   *
   * @return The layer name
   */
   getName() {
    return this.name;
  }

  /**
   * Returns the layer offset
   *
   * @return The layer offset
   */
   getOffset() {
    return new Point(this.offsetX, this.offsetY);
  }

  /**
   * Returns the layer size
   *
   * @return The layer size
   */
   getSize() {
    return new Dimension(this.width, this.height);
  }

  /**
   * Returns a pixel color
   *
   * @param x The x-axis coordinate of the pixel
   * @param y The y-axis coordinate of the pixel
   * @return The pixel color
   */
   getColorAt(x, y) {
    x -= this.offsetX;
    y -= this.offsetY;
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      let data = this.offscreenCtx.getImageData(x, y, 1, 1).data;
      return new Color(parseInt(data[0]), parseInt(data[1]), parseInt(data[2]), parseInt(data[3]));
    } else {
      return null;
    }
  }

  /**
   * Draws this layer
   *
   * @param ctx The context used to draw the layer
   * @param doNotUseProperties true to not use the offset, the hidden, the alpha
   * and the composite operation properties, false otherwise
   */
   draw(ctx, doNotUseProperties) {
    if (doNotUseProperties || !this.hidden) {
      ctx.save();
      if (!doNotUseProperties) {
        ctx.globalAlpha = this.opacity;
        ctx.globalCompositeOperation = this.compositeOperation;
      }
      ctx.drawImage(this.offscreen, doNotUseProperties ? 0 : this.offsetX, doNotUseProperties ? 0 : this.offsetY);
      ctx.restore();
    }
  }

  /**
   * Performs a drawing
   *
   * @param drawingTool The tool to perform the drawing
   * @param drawingPoint The point where to perform the drawing
   */
   drawTool(drawingTool, drawingPoint) {
    this.offscreenCtx.save();
    this.offscreenCtx.translate(drawingPoint.z4Vector.x0 - this.offsetX, drawingPoint.z4Vector.y0 - this.offsetY);
    this.offscreenCtx.rotate(drawingPoint.z4Vector.phase);
    drawingTool.draw(this.offscreenCtx, drawingPoint);
    this.offscreenCtx.restore();
    this.blob = null;
  }

  /**
   * Horizontally flips the layer
   */
   flipHorizonal() {
    let imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width / 2; x++) {
        let indexFrom = (y * this.width + x) * 4;
        let indexTo = (y * this.width + this.width - 1 - x) * 4;
        this.flipValue(data, indexFrom, indexTo);
      }
    }
    this.offscreenCtx.putImageData(imageData, 0, 0);
    this.blob = null;
  }

  /**
   * Vertically flips the layer
   */
   flipVertical() {
    let imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    for (let y = 0; y < this.height / 2; y++) {
      for (let x = 0; x < this.width; x++) {
        let indexFrom = (y * this.width + x) * 4;
        let indexTo = ((this.height - 1 - y) * this.width + x) * 4;
        this.flipValue(data, indexFrom, indexTo);
      }
    }
    this.offscreenCtx.putImageData(imageData, 0, 0);
    this.blob = null;
  }

   flipValue(data, indexFrom, indexTo) {
    let r = data[indexFrom];
    let g = data[indexFrom + 1];
    let b = data[indexFrom + 2];
    let a = data[indexFrom + 3];
    data[indexFrom] = data[indexTo];
    data[indexFrom + 1] = data[indexTo + 1];
    data[indexFrom + 2] = data[indexTo + 2];
    data[indexFrom + 3] = data[indexTo + 3];
    data[indexTo] = r;
    data[indexTo + 1] = g;
    data[indexTo + 2] = b;
    data[indexTo + 3] = a;
  }

  /**
   * Rotates the layer in clockwise
   */
   rotatePlus90() {
    let rotatedOffscreen = new OffscreenCanvas(this.height, this.width);
    let rotatedOffscreenCtx = rotatedOffscreen.getContext("2d");
    let imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    let data = imageData.data;
    let rotatedImageData = rotatedOffscreenCtx.createImageData(this.height, this.width);
    let rotatedData = rotatedImageData.data;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = (y * this.width + x) * 4;
        let rotatedIndex = (x * this.height + this.height - 1 - y) * 4;
        rotatedData[rotatedIndex] = data[index];
        rotatedData[rotatedIndex + 1] = data[index + 1];
        rotatedData[rotatedIndex + 2] = data[index + 2];
        rotatedData[rotatedIndex + 3] = data[index + 3];
      }
    }
    rotatedOffscreenCtx.putImageData(rotatedImageData, 0, 0);
    this.offscreen = rotatedOffscreen;
    this.offscreenCtx = rotatedOffscreenCtx;
    this.offsetX += parseInt(this.width / 2 - this.height / 2);
    this.offsetY += parseInt(this.height / 2 - this.width / 2);
    let temp = this.width;
    this.width = this.height;
    this.height = temp;
    this.blob = null;
  }

  /**
   * Resizes the layer
   *
   * @param resizeOptions The resize options
   */
   resize(resizeOptions) {
    let resizedOffscreen = new OffscreenCanvas(resizeOptions.containerWidth, resizeOptions.containerHeight);
    let resizedOffscreenCtx = resizedOffscreen.getContext("2d");
    resizedOffscreenCtx.drawImage(this.offscreen, resizeOptions.contentOffsetX, resizeOptions.contentOffsetY, resizeOptions.contentWidth, resizeOptions.contentHeight);
    this.offscreen = resizedOffscreen;
    this.offscreenCtx = resizedOffscreenCtx;
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = resizeOptions.containerWidth;
    this.height = resizeOptions.containerHeight;
    this.blob = null;
  }
}
/**
 * The object representing a paper
 *
 * @author gianpiero.diblasi
 */
class Z4Paper {

   layers = new Array();

  /**
   * Returns the layers count
   *
   * @return The layers count
   */
   getLayersCount() {
    return this.layers.length;
  }

  /**
   * Returns a layer
   *
   * @param index The index layer
   * @return The layer
   */
   getLayerAt(index) {
    return this.layers[index];
  }

  /**
   * Adds a layer
   *
   * @param name The layer name
   * @param width The layer width
   * @param height The layer height
   * @param filling The filling (an instance of Color, Z4AbstractFiller or
   * Z4BiGradientColor)
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
   addLayer(name, width, height, filling, containerWidth, containerHeight) {
    this.layers.push(new Z4Layer(name, width, height, filling, containerWidth, containerHeight));
  }

  /**
   * Adds a layer from an image
   *
   * @param name The layer name
   * @param image The image
   * @param containerWidth The container width
   * @param containerHeight The container height
   */
   addLayerFromImage(name, image, containerWidth, containerHeight) {
    this.layers.push(Z4Layer.fromImage(name, image, containerWidth, containerHeight));
  }

  /**
   * Deletes a layer
   *
   * @param layer The layer
   * @return The layer index
   */
   deleteLayer(layer) {
    let index = this.layers.indexOf(layer);
    this.layers.splice(index, 1);
    return index;
  }

  /**
   * Moves a layer to a position
   *
   * @param layer The layer
   * @param position The new position
   * @return true if the move has been performed, false otherwise
   */
   moveLayer(layer, position) {
    let newPosition = Math.min(this.layers.length, position);
    let currentPosition = this.layers.indexOf(layer);
    if (newPosition < currentPosition) {
      this.layers.splice(newPosition, 0, this.layers.splice(currentPosition, 1)[0]);
      return true;
    } else if (newPosition > currentPosition) {
      this.layers.splice(newPosition, 0, this.layers[currentPosition]);
      this.layers.splice(currentPosition, 1);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Resets the paper
   */
   reset() {
    this.layers.length = 0;
  }

  /**
   * Draws this paper
   *
   * @param ctx The context used to draw the paper
   * @param doNotUseProperties true to not use the offset, the hidden, the alpha
   * and the composite operation properties, false otherwise
   */
   draw(ctx, doNotUseProperties) {
    this.layers.forEach(layer => layer.draw(ctx, doNotUseProperties));
  }
}
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
/**
 * The object managing the translations, currently only the English and Italian
 * languages are managed
 *
 * @author gianpiero.diblasi
 */
class Z4Translations {

  static  CURRENT_LANGUAGE = null;

  static  DEPENDENCIES = "<a href='https://repository.jsweet.org/artifactory/libs-release-local/org/jsweet/jsweet-core' target='_blank'>jsweet-core</a>, " + "<a href='https://github.com/gianpierodiblasi/swing.js' target='_blank'>swing.js</a>, " + "<a href='https://pomax.github.io/bezierjs' target='_blank'>Bezier.js</a>, " + "<a href='https://stuk.github.io/jszip' target='_blank'>JSZip</a>, " + "<a href='https://github.com/eligrey/FileSaver.js' target='_blank'>FileSaver.js</a>.";

  // Ribbon Project
  static  PROJECT = "";

  static  NEW_PROJECT = "";

  static  CREATE = "";

  static  FROM_CLIPBOARD = "";

  static  FROM_FILE = "";

  static  OPEN = "";

  static  OPEN_PROJECT = "";

  static  SAVE = "";

  static  SAVE_PROJECT = "";

  static  SAVE_PROJECT_AS = "";

  static  EXPORT = "";

  static  PROJECT_NOT_SAVED_MESSAGE = "";

  static  IMAGE_FILE = "";

  static  PIZZAPAZZA_PROJECT = "";

  // Ribbon Layer
  static  LAYER = "";

  static  LAYER_NAME = "";

  static  NEW_LAYER = "";

  static  BACKGROUND_LAYER = "";

  static  DELETE_LAYER_MESSAGE = "";

  static  MERGE_VISIBLE_LAYERS = "";

  static  MERGE_ALL_LAYERS = "";

  static  SHOW_LAYER_BOUNDS = "";

  // Ribbon Drawing Tool
  static  NEW_DRAWING_TOOL = "";

  static  DRAWING_TOOL = "";

  static  DRAWING_TOOL_NAME = "";

  static  SAVE_DRAWING_TOOL_AS = "";

  static  SAVE_DRAWING_TOOLS_AS = "";

  static  PIZZAPAZZA_DRAWING_TOOL = "";

  static  PIZZAPAZZA_DRAWING_TOOLS = "";

  static  DELETE_DRAWING_TOOL_MESSAGE = "";

  static  FROM_LIBRARY = "";

  // Ribbon History
  static  HISTORY = "";

  static  UNDO = "";

  static  REDO = "";

  static  CONSOLIDATE = "";

  static  CONSOLIDATE_MESSAGE = "";

  // Ribbon Settings
  static  SETTINGS = "";

  static  LANGUAGE = "";

  static  LANGUAGE_ENGLISH_NATIVE = "";

  static  LANGUAGE_ITALIAN_NATIVE = "";

  static  THEME = "";

  static  THEME_AUTO = "";

  static  THEME_LIGHT = "";

  static  THEME_DARK = "";

  static  THEME_COLOR = "";

  static  HISTORY_MANAGEMENT = "";

  static  STANDARD_POLICY = "";

  static  STANDARD_POLICY_DESCRIPTION = "";

  static  TIMER_POLICY = "";

  static  TIMER_POLICY_DESCRIPTION = "";

  static  MANUAL_POLICY = "";

  static  MANUAL_POLICY_DESCRIPTION = "";

  static  TOOL_POLICY = "";

  static  TOOL_POLICY_DESCRIPTION = "";

  static  SAVING_INTERVAL = "";

  static  SAVING_DELAY = "";

  static  REFRESH_PAGE_MESSAGE = "";

  // Ribbon Help
  static  HELP = "";

  static  ABOUT = "";

  static  BASED_ON = "";

  static  INSTALL = "";

  static  CHECK_UPDATE = "";

  // Other
  static  PROJECT_NAME = "";

  static  FILENAME = "";

  static  QUALITY = "";

  static  RESET = "";

  static  WIDTH = "";

  static  HEIGHT = "";

  static  RESOLUTION = "";

  static  PATTERN = "";

  static  PATTERNS = "";

  static  EDIT = "";

  static  FIT = "";

  static  OFFSET_X = "";

  static  OFFSET_Y = "";

  static  BASIC = "";

  static  ADVANCED = "";

  static  STAR = "";

  static  VERTICES = "";

  static  REGULAR = "";

  static  DIMENSION = "";

  static  FREE = "";

  static  LOCK_ASPECT_RATIO = "";

  static  LOCK = "";

  static  RIPPLE = "";

  static  DELETE = "";

  static  DUPLICATE = "";

  static  TRANSFORM = "";

  static  FLIP_HORIZONTAL = "";

  static  FLIP_VERTICAL = "";

  static  ROTATE_PLUS_90 = "";

  static  ROTATE_MINUS_90 = "";

  static  ROTATE_180 = "";

  static  SPACE = "";

  static  TIME = "";

  static  FILLING = "";

  static  MERGE = "";

  static  NONE_HIM = "";

  static  NONE_HER = "";

  static  BORDER = "";

  static  SHADOW = "";

  static  DELTA_X = "";

  static  DELTA_Y = "";

  static  VISIBLE = "";

  static  SELECTED = "";

  static  MOVE_UP = "";

  static  MOVE_DOWN = "";

  static  MOVE_BOTTOM = "";

  static  MOVE_TOP = "";

  static  TRY_ME = "";

  static  ACTIONS = "";

  static  DRAWING_DIRECTION = "";

  static  SHOW_GRID = "";

  static  MAGNETIC_GRID = "";

  static  DOTTED_GRID = "";

  static  PLOT_WIDTH = "";

  static  RESET_ON_START_MOVING = "";

  static  RESIZE = "";

  static  CONTAINER = "";

  static  CONTENT = "";

  static  RESIZE_CONTAINER_AND_CONTENT = "";

  static  RESIZE_CONTAINER_AND_ADAPT_CONTENT = "";

  static  RESIZE_CONTAINER = "";

  static  RESIZE_CONTENT = "";

  static  IMAGE_TOO_BIG_MESSAGE = "";

  static  IMAGE_OPEN_ERROR_MESSAGE = "";

  static  DRAWING_TOOL_OPEN_ERROR_MESSAGE = "";

  static  DO_NOT_SHOW_AGAIN_MESSAGE = "";

  // Color
  static  COLOR = "";

  static  FILLING_COLOR = "";

  static  BACKGROUND_COLOR = "";

  static  MIRRORED = "";

  static  INVERTED = "";

  static  DELETE_COLOR_MESSAGE = "";

  static  LIGHTED = "";

  static  DARKENED = "";

  static  SPATIAL = "";

  static  TEMPORAL = "";

  static  LIGHTING = "";

  static  PICK_COLOR = "";

  static  COLOR_STORED_IN_HISTORY = "";

  // Point Iterator
  static  MULTIPLICITY = "";

  static  PUSH = "";

  static  ROTATION = "";

  static  ATTACK = "";

  static  SUSTAIN = "";

  static  RELEASE = "";

  static  ENDLESS = "";

  static  RADIUS = "";

  static  SPEED = "";

  static  DRAW_WHILE_MOVING = "";

  static  SCATTERING = "";

  static  ASSISTED_DRAWING = "";

  // Painter
  static  TENSION = "";

  static  HOLE = "";

  static  COVER = "";

  static  WHIRLPOOL = "";

  static  POINTS = "";

  static  INTERNAL_BASE_POINT = "";

  static  EXTERNAL_BASE_POINT = "";

  static  INTERNAL_TERMINAL_POINT = "";

  static  EXTERNAL_TERMINAL_POINT = "";

  static  INDENTATION = "";

  static  EXTERNAL_FORCE = "";

  static  INTENSITY = "";

  static  GAUSSIAN_CORRECTION = "";

  static  THICKNESS = "";

  static  DELETE_PATTERN_MESSAGE = "";

  static  DELETE_PATTERNS_MESSAGE = "";

  static  RANDOM_SEQUENCE = "";

  static  MULTI_DIMENSION = "";

  // Math
  static  POSITIVE = "";

  static  NEGATIVE = "";

  static  ALTERNATE = "";

  static  CONSTANT = "";

  static  RANDOM = "";

  static  CLASSIC = "";

  static  STEPPED = "";

  static  POLYLINE = "";

  static  BEZIER = "";

  static  LENGTH = "";

  static  UNIFORM_SIGN = "";

  static  FIXED = "";

  static  VARIABLE = "";

  static  CUMULATIVE = "";

  static  RELATIVE_TO_PATH = "";

  static  DELAYED = "";

  static  STEP = "";

  static  SHAPE = "";

  static  ANGLE = "";

  static  FORWARD = "";

  static  BACKWARD = "";

  static  DISTANCE = "";

  static  CENTER_VERB = "";

  // Composite Operation
  static  COMPOSITE_OPERATION = "";

  static  COMPOSITE_OPERATION_SOURCE_OVER = "";

  static  COMPOSITE_OPERATION_SOURCE_IN = "";

  static  COMPOSITE_OPERATION_SOURCE_OUT = "";

  static  COMPOSITE_OPERATION_SOURCE_ATOP = "";

  static  COMPOSITE_OPERATION_DESTINATION_OVER = "";

  static  COMPOSITE_OPERATION_DESTINATION_IN = "";

  static  COMPOSITE_OPERATION_DESTINATION_OUT = "";

  static  COMPOSITE_OPERATION_DESTINATION_ATOP = "";

  static  COMPOSITE_OPERATION_LIGHTER = "";

  static  COMPOSITE_OPERATION_COPY = "";

  static  COMPOSITE_OPERATION_XOR = "";

  static  COMPOSITE_OPERATION_MULTIPLY = "";

  static  COMPOSITE_OPERATION_SCREEN = "";

  static  COMPOSITE_OPERATION_OVERLAY = "";

  static  COMPOSITE_OPERATION_DARKEN = "";

  static  COMPOSITE_OPERATION_LIGHTEN = "";

  static  COMPOSITE_OPERATION_COLOR_DODGE = "";

  static  COMPOSITE_OPERATION_COLOR_BURN = "";

  static  COMPOSITE_OPERATION_HARD_LIGHT = "";

  static  COMPOSITE_OPERATION_SOFT_LIGHT = "";

  static  COMPOSITE_OPERATION_DIFFERENCE = "";

  static  COMPOSITE_OPERATION_EXCLUSION = "";

  static  COMPOSITE_OPERATION_HUE = "";

  static  COMPOSITE_OPERATION_SATURATION = "";

  static  COMPOSITE_OPERATION_COLOR = "";

  static  COMPOSITE_OPERATION_LUMINOSITY = "";

  static {
    switch(navigator.language.substring(0, 2)) {
      case "en":
      default:
        Z4Translations.setEnglish();
        break;
      case "it":
        Z4Translations.setItalian();
        break;
    }
  }

  constructor() {
  }
  /**
   * Sets the English language
   */
  static  setEnglish() {
    // Ribbon Project
    Z4Translations.PROJECT = "Project";
    Z4Translations.NEW_PROJECT = "New Project";
    Z4Translations.CREATE = "Create";
    Z4Translations.FROM_CLIPBOARD = "From Clipboard";
    Z4Translations.FROM_FILE = "From File";
    Z4Translations.OPEN = "Open";
    Z4Translations.OPEN_PROJECT = "Open Project";
    Z4Translations.SAVE = "Save";
    Z4Translations.SAVE_PROJECT = "Save Project";
    Z4Translations.SAVE_PROJECT_AS = "Save Project As";
    Z4Translations.EXPORT = "Export";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Project not saved, do you want to save your changes?";
    Z4Translations.IMAGE_FILE = "Image File";
    Z4Translations.PIZZAPAZZA_PROJECT = "pizzApazzA Project";
    // Ribbon Layer
    Z4Translations.LAYER = "Layer";
    Z4Translations.LAYER_NAME = "Layer Name";
    Z4Translations.NEW_LAYER = "New Layer";
    Z4Translations.BACKGROUND_LAYER = "Bkgrd";
    Z4Translations.DELETE_LAYER_MESSAGE = "Do you really want to delete the layer?";
    Z4Translations.MERGE_VISIBLE_LAYERS = "Merge Visible Layers";
    Z4Translations.MERGE_ALL_LAYERS = "Merge All Layers";
    Z4Translations.SHOW_LAYER_BOUNDS = "Show Layer Bounds";
    // Ribbon Drawing Tool
    Z4Translations.NEW_DRAWING_TOOL = "New Drawing Tool";
    Z4Translations.DRAWING_TOOL = "Drawing Tool";
    Z4Translations.DRAWING_TOOL_NAME = "Drawing Tool Name";
    Z4Translations.SAVE_DRAWING_TOOL_AS = "Save As";
    Z4Translations.SAVE_DRAWING_TOOLS_AS = "Save All As";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOL = "pizzApazzA Drawing Tool";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOLS = "pizzApazzA Drawing Tools";
    Z4Translations.DELETE_DRAWING_TOOL_MESSAGE = "Do you really want to delete the drawing tool?";
    Z4Translations.FROM_LIBRARY = "From Library";
    // Ribbon History
    Z4Translations.HISTORY = "History";
    Z4Translations.UNDO = "Undo";
    Z4Translations.REDO = "Redo";
    Z4Translations.CONSOLIDATE = "Consolidate";
    Z4Translations.CONSOLIDATE_MESSAGE = "Consolidation will remove all history, do you want to proceed?";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Settings";
    Z4Translations.LANGUAGE = "Language";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Theme";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Light";
    Z4Translations.THEME_DARK = "Dark";
    Z4Translations.THEME_COLOR = "Color";
    Z4Translations.HISTORY_MANAGEMENT = "History Management";
    Z4Translations.STANDARD_POLICY = "Standard";
    Z4Translations.STANDARD_POLICY_DESCRIPTION = "The history is updated at each conclusion of a drawing operation and at each \"global\" operation on the drawing";
    Z4Translations.TIMER_POLICY = "Time Based";
    Z4Translations.TIMER_POLICY_DESCRIPTION = "The history is updated at regular intervals (only if the drawing has been modified)";
    Z4Translations.MANUAL_POLICY = "Manual";
    Z4Translations.MANUAL_POLICY_DESCRIPTION = "The history is manually updated (only if the drawing has been modified)";
    Z4Translations.TOOL_POLICY = "On Drawing Tool Change";
    Z4Translations.TOOL_POLICY_DESCRIPTION = "The history is updated when the drawing tool is changed (only if the drawing has been modified) and at each \"global\" operation on the drawing";
    Z4Translations.SAVING_INTERVAL = "Saving Interval";
    Z4Translations.SAVING_DELAY = "Saving Delay";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Refresh the page to make the changes";
    // Ribbon Help
    Z4Translations.HELP = "Help";
    Z4Translations.ABOUT = "About";
    Z4Translations.BASED_ON = "<p>pizzApazzA<sup>&#8734;</sup> Version $version$ is based on pizzApazzA VB6 by Ettore Luzio and is licensed under <a href='https://unlicense.org/'>Unlicense license</a>.</p>" + "<p>Developed in Java by Gianpiero Di Blasi, transpilled in JavaScript by means of <a href='https://github.com/gianpierodiblasi/josetta' target='_blank'>josetta</a> (<a href='https://github.com/gianpierodiblasi/pizzApazzAinfinity' target='_blank'>github repository</a>).</p>" + "<p>Ettore Luzio and Gianpiero Di Blasi are the founders of <a href='https://sites.google.com/view/gruppoz4/home'>GruppoZ4</a>.</p>" + "<p>Dependencies: " + Z4Translations.DEPENDENCIES + "</p>";
    Z4Translations.INSTALL = "<span>Install pizzApazzA<sup>&#8734;</sup></span>";
    Z4Translations.CHECK_UPDATE = "Check for Updates";
    // Other
    Z4Translations.PROJECT_NAME = "Project Name";
    Z4Translations.FILENAME = "File Name";
    Z4Translations.QUALITY = "Quality";
    Z4Translations.RESET = "Reset";
    Z4Translations.WIDTH = "Width";
    Z4Translations.HEIGHT = "Height";
    Z4Translations.RESOLUTION = "Resolution";
    Z4Translations.PATTERN = "Pattern";
    Z4Translations.PATTERNS = "Patterns";
    Z4Translations.EDIT = "Edit";
    Z4Translations.FIT = "Fit";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Basic";
    Z4Translations.ADVANCED = "Advanced";
    Z4Translations.STAR = "Star";
    Z4Translations.VERTICES = "Vertices";
    Z4Translations.REGULAR = "Regular";
    Z4Translations.DIMENSION = "Dimension";
    Z4Translations.FREE = "Free";
    Z4Translations.LOCK_ASPECT_RATIO = "Lock Aspect Ratio";
    Z4Translations.LOCK = "Lock";
    Z4Translations.RIPPLE = "Ripple";
    Z4Translations.DELETE = "Delete";
    Z4Translations.DUPLICATE = "Duplicate";
    Z4Translations.TRANSFORM = "Transform";
    Z4Translations.FLIP_HORIZONTAL = "Flip Horizontal";
    Z4Translations.FLIP_VERTICAL = "Flip Vertical";
    Z4Translations.ROTATE_PLUS_90 = "Rotate +90\u00B0";
    Z4Translations.ROTATE_MINUS_90 = "Rotate -90\u00B0";
    Z4Translations.ROTATE_180 = "Rotate 180\u00B0";
    Z4Translations.SPACE = "Space \u2192";
    Z4Translations.TIME = "\u2190 Time";
    Z4Translations.FILLING = "Filling";
    Z4Translations.MERGE = "Merge";
    Z4Translations.NONE_HIM = "None";
    Z4Translations.NONE_HER = "None";
    Z4Translations.BORDER = "Border";
    Z4Translations.SHADOW = "Shadow";
    Z4Translations.DELTA_X = "Delta X";
    Z4Translations.DELTA_Y = "Delta Y";
    Z4Translations.VISIBLE = "Visible";
    Z4Translations.SELECTED = "Selected";
    Z4Translations.MOVE_UP = "Move Up";
    Z4Translations.MOVE_DOWN = "Move Down";
    Z4Translations.MOVE_BOTTOM = "Move to Bottom";
    Z4Translations.MOVE_TOP = "Move to Top";
    Z4Translations.TRY_ME = "Try Me";
    Z4Translations.ACTIONS = "Actions";
    Z4Translations.DRAWING_DIRECTION = "Drawing Direction";
    Z4Translations.SHOW_GRID = "Show Grid";
    Z4Translations.MAGNETIC_GRID = "Magnetic Grid";
    Z4Translations.DOTTED_GRID = "Dotted Grid";
    Z4Translations.PLOT_WIDTH = "Plot Width";
    Z4Translations.RESET_ON_START_MOVING = "Reset on Start Moving";
    Z4Translations.RESIZE = "Resize";
    Z4Translations.CONTAINER = "Container";
    Z4Translations.CONTENT = "Content";
    Z4Translations.RESIZE_CONTAINER_AND_CONTENT = "Resize Container and Content";
    Z4Translations.RESIZE_CONTAINER_AND_ADAPT_CONTENT = "Resize Container and Adapt Content";
    Z4Translations.RESIZE_CONTAINER = "Resize Container";
    Z4Translations.RESIZE_CONTENT = "Resize Content";
    Z4Translations.IMAGE_TOO_BIG_MESSAGE = "The image is too big to be loaded; image size = $image_size$, max image size = $max_image_size$";
    Z4Translations.IMAGE_OPEN_ERROR_MESSAGE = "It is not possible to open the image";
    Z4Translations.DRAWING_TOOL_OPEN_ERROR_MESSAGE = "It is not possible to open the drawing tool";
    Z4Translations.DO_NOT_SHOW_AGAIN_MESSAGE = "Do not show this message again";
    Z4Translations.COLOR_STORED_IN_HISTORY = "The color has been stored in the color history";
    // Color
    Z4Translations.COLOR = "Color";
    Z4Translations.FILLING_COLOR = "Filling Color";
    Z4Translations.BACKGROUND_COLOR = "Background Color";
    Z4Translations.MIRRORED = "Mirrored";
    Z4Translations.INVERTED = "Inverted";
    Z4Translations.DELETE_COLOR_MESSAGE = "Do you really want to delete the color?";
    Z4Translations.LIGHTED = "Lighted";
    Z4Translations.DARKENED = "Darkened";
    Z4Translations.SPATIAL = "Spatial";
    Z4Translations.TEMPORAL = "Temporal";
    Z4Translations.LIGHTING = "Lighting";
    Z4Translations.PICK_COLOR = "Pick Color";
    // Point Iterator
    Z4Translations.MULTIPLICITY = "Multiplicity";
    Z4Translations.PUSH = "Push";
    Z4Translations.ROTATION = "Rotation";
    Z4Translations.ATTACK = "Attack";
    Z4Translations.SUSTAIN = "Sustain";
    Z4Translations.RELEASE = "Release";
    Z4Translations.ENDLESS = "Endless";
    Z4Translations.RADIUS = "Radius";
    Z4Translations.SPEED = "Speed";
    Z4Translations.DRAW_WHILE_MOVING = "Draw While Moving";
    Z4Translations.SCATTERING = "Scattering";
    Z4Translations.ASSISTED_DRAWING = "Assisted Drawing";
    // Painter
    Z4Translations.TENSION = "Tension";
    Z4Translations.HOLE = "Hole";
    Z4Translations.COVER = "Cover";
    Z4Translations.WHIRLPOOL = "Whirlpool";
    Z4Translations.POINTS = "Points";
    Z4Translations.INTERNAL_BASE_POINT = "Internal Base Point";
    Z4Translations.EXTERNAL_BASE_POINT = "External Base Point";
    Z4Translations.INTERNAL_TERMINAL_POINT = "Internal Terminal Point";
    Z4Translations.EXTERNAL_TERMINAL_POINT = "External Terminal Point";
    Z4Translations.INDENTATION = "Indentation";
    Z4Translations.EXTERNAL_FORCE = "External Force";
    Z4Translations.INTENSITY = "Intensity";
    Z4Translations.GAUSSIAN_CORRECTION = "Gaussian Correction";
    Z4Translations.THICKNESS = "Thickness";
    Z4Translations.DELETE_PATTERN_MESSAGE = "Do you really want to delete the pattern?";
    Z4Translations.DELETE_PATTERNS_MESSAGE = "Do you really want to delete the selected patterns?";
    Z4Translations.RANDOM_SEQUENCE = "Random Sequence";
    Z4Translations.MULTI_DIMENSION = "Multi Dimension";
    // Math
    Z4Translations.POSITIVE = "Positive";
    Z4Translations.NEGATIVE = "Negative";
    Z4Translations.ALTERNATE = "Alternate";
    Z4Translations.CONSTANT = "Constant";
    Z4Translations.RANDOM = "Random";
    Z4Translations.CLASSIC = "Classic";
    Z4Translations.STEPPED = "Stepped";
    Z4Translations.POLYLINE = "Polyline";
    Z4Translations.BEZIER = "Bezier";
    Z4Translations.LENGTH = "Length";
    Z4Translations.UNIFORM_SIGN = "Uniform Sign";
    Z4Translations.FIXED = "Fixed";
    Z4Translations.VARIABLE = "Variable";
    Z4Translations.CUMULATIVE = "Cumulative";
    Z4Translations.RELATIVE_TO_PATH = "Relative to Path";
    Z4Translations.DELAYED = "Delayed";
    Z4Translations.STEP = "Step";
    Z4Translations.SHAPE = "Shape";
    Z4Translations.ANGLE = "Angle";
    Z4Translations.FORWARD = "Forward";
    Z4Translations.BACKWARD = "Backward";
    Z4Translations.DISTANCE = "Distance";
    Z4Translations.CENTER_VERB = "Center";
    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Composite Operation";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "This is the default setting and draws the layer on top of the existing content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "The layer is drawn only where both the layer and the destination content overlap; everything else is made transparent";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "The layer is drawn where it doesn't overlap the existing content";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "The layer is only drawn where it overlaps the existing content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "The layer is drawn behind the existing content";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "The existing content is kept where both the layer and existing content overlap; everything else is made transparent";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "The existing content is kept where it doesn't overlap the layer";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "The existing content is only kept where it overlaps the layer; the layer is drawn behind the content";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "Where both layer and existing content overlap the color is determined by adding color values";
    Z4Translations.COMPOSITE_OPERATION_COPY = "Only the layer is shown";
    Z4Translations.COMPOSITE_OPERATION_XOR = "Layer and existing content are made transparent where both overlap and drawn normal everywhere else";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "The pixels of the layer are multiplied with the corresponding pixel of the existing content; a darker picture is the result";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "The pixels are inverted, multiplied, and inverted again; a lighter picture is the result (opposite of 'multiply')";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "A combination of 'multiply' and 'screen'; dark parts on the existing content become darker, and light parts become lighter";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "Retains the darkest pixels of both layer and existing content";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "Retains the lightest pixels of both layer and existing content";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "Divides the existing content by the inverted layer";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "Divides the inverted existing content by the layer, and then inverts the result";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "A combination of 'multiply' and 'screen' like 'overlay', but with layer and existing content swapped";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "A softer version of 'hard-light'; pure black or white does not result in pure black or white";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "Subtracts the existing content from the layer or the other way round to always get a positive value";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "Like 'difference', but with lower contrast";
    Z4Translations.COMPOSITE_OPERATION_HUE = "Preserves the luma and chroma of the existing content, while adopting the hue of the layer";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "Preserves the luma and hue of the existing content, while adopting the chroma of the layer";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "Preserves the luma of the existing content, while adopting the hue and chroma of the layer";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "Preserves the hue and chroma of the existing content, while adopting the luma of the layer";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("en", Z4Translations.LANGUAGE_ENGLISH_NATIVE);
  }

  /**
   * Sets the Italian language
   */
  static  setItalian() {
    // Ribbon Project
    Z4Translations.PROJECT = "Progetto";
    Z4Translations.NEW_PROJECT = "Nuovo Progetto";
    Z4Translations.CREATE = "Crea";
    Z4Translations.FROM_CLIPBOARD = "Dagli Appunti";
    Z4Translations.FROM_FILE = "Da File";
    Z4Translations.OPEN = "Apri";
    Z4Translations.OPEN_PROJECT = "Apri Progetto";
    Z4Translations.SAVE = "Salva";
    Z4Translations.SAVE_PROJECT = "Salva Progetto";
    Z4Translations.SAVE_PROJECT_AS = "Salva Progetto con Nome";
    Z4Translations.EXPORT = "Esporta";
    Z4Translations.PROJECT_NOT_SAVED_MESSAGE = "Progetto non salvato, vuoi salvare le modifiche?";
    Z4Translations.IMAGE_FILE = "File Immagine";
    Z4Translations.PIZZAPAZZA_PROJECT = "Progetto pizzApazzA";
    // Ribbon Layer
    Z4Translations.LAYER = "Livello";
    Z4Translations.LAYER_NAME = "Nome Livello";
    Z4Translations.NEW_LAYER = "Nuovo Livello";
    Z4Translations.BACKGROUND_LAYER = "Sfondo";
    Z4Translations.DELETE_LAYER_MESSAGE = "Vuoi davvero eliminare il livello?";
    Z4Translations.MERGE_VISIBLE_LAYERS = "Fondi Livelli Visibili";
    Z4Translations.MERGE_ALL_LAYERS = "Fondi Tutti i Livelli";
    Z4Translations.SHOW_LAYER_BOUNDS = "Mostra Bordi Livello";
    // Ribbon Drawing Tool
    Z4Translations.NEW_DRAWING_TOOL = "Nuovo Strumento di Disegno";
    Z4Translations.DRAWING_TOOL = "Strumento di Disegno";
    Z4Translations.DRAWING_TOOL_NAME = "Nome Strumento di Disegno";
    Z4Translations.SAVE_DRAWING_TOOL_AS = "Salva con Nome";
    Z4Translations.SAVE_DRAWING_TOOLS_AS = "Salva Tutti con Nome";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOL = "Strumento di Disegno pizzApazzA";
    Z4Translations.PIZZAPAZZA_DRAWING_TOOLS = "Strumenti di Disegno pizzApazzA";
    Z4Translations.DELETE_DRAWING_TOOL_MESSAGE = "Vuoi davvero eliminare lo strumento di disegno?";
    Z4Translations.FROM_LIBRARY = "Da Libreria";
    // Ribbon History
    Z4Translations.HISTORY = "Cronologia";
    Z4Translations.UNDO = "Annulla";
    Z4Translations.REDO = "Ripeti";
    Z4Translations.CONSOLIDATE = "Consolida";
    Z4Translations.CONSOLIDATE_MESSAGE = "La consolidazione rimuover\u00E0 tutta la cronologia, vuoi proseguire?";
    // Ribbon Settings
    Z4Translations.SETTINGS = "Impostazioni";
    Z4Translations.LANGUAGE = "Lingua";
    Z4Translations.LANGUAGE_ENGLISH_NATIVE = "English";
    Z4Translations.LANGUAGE_ITALIAN_NATIVE = "Italiano";
    Z4Translations.THEME = "Tema";
    Z4Translations.THEME_AUTO = "Auto";
    Z4Translations.THEME_LIGHT = "Chiaro";
    Z4Translations.THEME_DARK = "Scuro";
    Z4Translations.THEME_COLOR = "Colore";
    Z4Translations.HISTORY_MANAGEMENT = "Gestione Cronologia";
    Z4Translations.STANDARD_POLICY = "Standard";
    Z4Translations.STANDARD_POLICY_DESCRIPTION = "La cronologia viene aggiornata ad ogni conclusione di un'operazione di disegno ed ad ogni operazione \"globale\" sul disegno";
    Z4Translations.TIMER_POLICY = "A Tempo";
    Z4Translations.TIMER_POLICY_DESCRIPTION = "La cronologia viene aggiornata ad intervalli regolari (solo se il disegno \u00E8 stato modificato)";
    Z4Translations.MANUAL_POLICY = "Manuale";
    Z4Translations.MANUAL_POLICY_DESCRIPTION = "La cronologia viene aggiornata manualmente (solo se il disegno \u00E8 stato modificato)";
    Z4Translations.TOOL_POLICY = "Su Cambio Strumento di Disegno";
    Z4Translations.TOOL_POLICY_DESCRIPTION = "La cronologia viene aggiornata quando viene cambiato lo strumento di disegno (solo se il disegno \u00E8 stato modificato) ed ad ogni operazione \"globale\" sul disegno";
    Z4Translations.SAVING_INTERVAL = "Intervallo di Salvataggio";
    Z4Translations.SAVING_DELAY = "Ritardo di Salvataggio";
    Z4Translations.REFRESH_PAGE_MESSAGE = "Aggiorna la pagina per eseguire le modifiche";
    // Ribbon Help
    Z4Translations.HELP = "Aiuto";
    Z4Translations.ABOUT = "Informazioni su";
    Z4Translations.BASED_ON = "<p>pizzApazzA<sup>&#8734;</sup> Versione $version$ \u00E8 basato su pizzApazzA VB6 di Ettore Luzio ed \u00E8 distribuito con <a href='https://unlicense.org/' target='_blank'>licenza Unlicense</a>.</p>" + "<p>Sviluppato in Java da Gianpiero Di Blasi, tradotto in JavaScript tramite <a href='https://github.com/gianpierodiblasi/josetta' target='_blank'>josetta</a> (<a href='https://github.com/gianpierodiblasi/pizzApazzAinfinity' target='_blank'>repository github</a>).</p>" + "<p>Ettore Luzio e Gianpiero Di Blasi sono i fondatori del <a href='https://sites.google.com/view/gruppoz4/home'>GruppoZ4</a>.</p>" + "<p>Dipendenze: " + Z4Translations.DEPENDENCIES + "</p>";
    Z4Translations.INSTALL = "<span>Installa pizzApazzA<sup>&#8734;</sup></span>";
    Z4Translations.CHECK_UPDATE = "Controlla gli Aggiornamenti";
    // Other
    Z4Translations.PROJECT_NAME = "Nome Progetto";
    Z4Translations.FILENAME = "Nome File";
    Z4Translations.QUALITY = "Qualit\u00E0";
    Z4Translations.RESET = "Ripristina";
    Z4Translations.WIDTH = "Larghezza";
    Z4Translations.HEIGHT = "Altezza";
    Z4Translations.RESOLUTION = "Risoluzione";
    Z4Translations.PATTERN = "Trama";
    Z4Translations.PATTERNS = "Trame";
    Z4Translations.EDIT = "Modifica";
    Z4Translations.FIT = "Adatta";
    Z4Translations.OFFSET_X = "Offset X";
    Z4Translations.OFFSET_Y = "Offset Y";
    Z4Translations.BASIC = "Base";
    Z4Translations.ADVANCED = "Avanzato";
    Z4Translations.STAR = "Stella";
    Z4Translations.VERTICES = "Vertici";
    Z4Translations.REGULAR = "Regolare";
    Z4Translations.DIMENSION = "Dimensione";
    Z4Translations.FREE = "Libero";
    Z4Translations.LOCK_ASPECT_RATIO = "Blocca Proporzioni";
    Z4Translations.LOCK = "Blocca";
    Z4Translations.RIPPLE = "Caoticit\u00E0";
    Z4Translations.DELETE = "Elimina";
    Z4Translations.DUPLICATE = "Duplica";
    Z4Translations.TRANSFORM = "Trasforma";
    Z4Translations.FLIP_HORIZONTAL = "Rifletti Orizzontale";
    Z4Translations.FLIP_VERTICAL = "Rifletti Verticale";
    Z4Translations.ROTATE_PLUS_90 = "Ruota +90\u00B0";
    Z4Translations.ROTATE_MINUS_90 = "Ruota -90\u00B0";
    Z4Translations.ROTATE_180 = "Ruota 180\u00B0";
    Z4Translations.SPACE = "Spazio \u2192";
    Z4Translations.TIME = "\u2190 Tempo";
    Z4Translations.FILLING = "Riempimento";
    Z4Translations.MERGE = "Fondi";
    Z4Translations.NONE_HIM = "Nessuno";
    Z4Translations.NONE_HER = "Nessuna";
    Z4Translations.BORDER = "Bordo";
    Z4Translations.SHADOW = "Ombra";
    Z4Translations.DELTA_X = "Delta X";
    Z4Translations.DELTA_Y = "Delta Y";
    Z4Translations.VISIBLE = "Visibile";
    Z4Translations.SELECTED = "Selezionato";
    Z4Translations.MOVE_UP = "Muovi Su";
    Z4Translations.MOVE_DOWN = "Muovi Gi\u00F9";
    Z4Translations.MOVE_BOTTOM = "Muovi in Fondo";
    Z4Translations.MOVE_TOP = "Muovi in Cima";
    Z4Translations.TRY_ME = "Provami";
    Z4Translations.ACTIONS = "Azioni";
    Z4Translations.DRAWING_DIRECTION = "Direzione di Disegno";
    Z4Translations.SHOW_GRID = "Mostra Griglia";
    Z4Translations.MAGNETIC_GRID = "Griglia Magnetica";
    Z4Translations.DOTTED_GRID = "Griglia Punteggiata";
    Z4Translations.PLOT_WIDTH = "Larghezza Trama";
    Z4Translations.RESET_ON_START_MOVING = "Riavvia su Inizio del Movimento";
    Z4Translations.RESIZE = "Ridimensiona";
    Z4Translations.CONTAINER = "Contenitore";
    Z4Translations.CONTENT = "Contenuto";
    Z4Translations.RESIZE_CONTAINER_AND_CONTENT = "Ridimensiona Contenitore e Contenuto";
    Z4Translations.RESIZE_CONTAINER_AND_ADAPT_CONTENT = "Ridimensiona Contenitore ed Adatta Contenuto";
    Z4Translations.RESIZE_CONTAINER = "Ridimensiona Contenitore";
    Z4Translations.RESIZE_CONTENT = "Ridimensiona Contenuto";
    Z4Translations.IMAGE_TOO_BIG_MESSAGE = "L'immagine \u00E8 troppo grande per essere caricata; dimensione immagine = $image_size$, dimensione massima immagine = $max_image_size$";
    Z4Translations.IMAGE_OPEN_ERROR_MESSAGE = "Non \u00E8 possibile aprire l'immagine";
    Z4Translations.DRAWING_TOOL_OPEN_ERROR_MESSAGE = "Non \u00E8 possibile aprire lo strumento di disegno";
    Z4Translations.DO_NOT_SHOW_AGAIN_MESSAGE = "Non mostrare pi\u00F9 questo messaggio";
    // Color
    Z4Translations.COLOR = "Colore";
    Z4Translations.FILLING_COLOR = "Colore di Riempimento";
    Z4Translations.BACKGROUND_COLOR = "Colore di Sfondo";
    Z4Translations.MIRRORED = "Riflesso";
    Z4Translations.INVERTED = "Invertito";
    Z4Translations.DELETE_COLOR_MESSAGE = "Vuoi davvero eliminare il colore?";
    Z4Translations.LIGHTED = "Illuminato";
    Z4Translations.DARKENED = "Incupito";
    Z4Translations.SPATIAL = "Spaziale";
    Z4Translations.TEMPORAL = "Temporale";
    Z4Translations.LIGHTING = "Illuminazione";
    Z4Translations.PICK_COLOR = "Preleva Colore";
    Z4Translations.COLOR_STORED_IN_HISTORY = "Il colore \u00E8 stato conservato nella cronologia dei colori";
    // Point Iterator
    Z4Translations.MULTIPLICITY = "Molteplicit\u00E0";
    Z4Translations.PUSH = "Spinta";
    Z4Translations.ROTATION = "Rotazione";
    Z4Translations.ATTACK = "Attacco";
    Z4Translations.SUSTAIN = "Sostegno";
    Z4Translations.RELEASE = "Rilascio";
    Z4Translations.ENDLESS = "Infinito";
    Z4Translations.RADIUS = "Raggio";
    Z4Translations.SPEED = "Velocit\u00E0";
    Z4Translations.DRAW_WHILE_MOVING = "Disegna Durante il Movimento";
    Z4Translations.SCATTERING = "Dispersione";
    Z4Translations.ASSISTED_DRAWING = "Disegno Assistito";
    // Painter
    Z4Translations.TENSION = "Tensione";
    Z4Translations.HOLE = "Buco";
    Z4Translations.COVER = "Copertura";
    Z4Translations.WHIRLPOOL = "Vortice";
    Z4Translations.POINTS = "Punti";
    Z4Translations.INTERNAL_BASE_POINT = "Punto Base Interno";
    Z4Translations.EXTERNAL_BASE_POINT = "Punto Base Esterno";
    Z4Translations.INTERNAL_TERMINAL_POINT = "Punto Terminale Interno";
    Z4Translations.EXTERNAL_TERMINAL_POINT = "Punto Terminale Esterno";
    Z4Translations.INDENTATION = "Frastagliatura";
    Z4Translations.EXTERNAL_FORCE = "Forza Esterna";
    Z4Translations.INTENSITY = "Intensit\u00E0";
    Z4Translations.GAUSSIAN_CORRECTION = "Correzione Gaussiana";
    Z4Translations.THICKNESS = "Spessore";
    Z4Translations.DELETE_PATTERN_MESSAGE = "Vuoi davvero eliminare la trama?";
    Z4Translations.DELETE_PATTERNS_MESSAGE = "Vuoi davvero eliminare le trame selezionate?";
    Z4Translations.RANDOM_SEQUENCE = "Sequenza Casuale";
    Z4Translations.MULTI_DIMENSION = "Multi Dimensione";
    // Math
    Z4Translations.POSITIVE = "Positivo";
    Z4Translations.NEGATIVE = "Negativo";
    Z4Translations.ALTERNATE = "Alternato";
    Z4Translations.CONSTANT = "Costante";
    Z4Translations.RANDOM = "Random";
    Z4Translations.CLASSIC = "Classico";
    Z4Translations.STEPPED = "A Gradino";
    Z4Translations.POLYLINE = "Polilinea";
    Z4Translations.BEZIER = "Bezier";
    Z4Translations.LENGTH = "Lunghezza";
    Z4Translations.UNIFORM_SIGN = "Segno Uniforme";
    Z4Translations.FIXED = "Fisso";
    Z4Translations.VARIABLE = "Variabile";
    Z4Translations.CUMULATIVE = "Cumulativo";
    Z4Translations.RELATIVE_TO_PATH = "Relativo al Percorso";
    Z4Translations.DELAYED = "Ritardato";
    Z4Translations.STEP = "Passo";
    Z4Translations.SHAPE = "Forma";
    Z4Translations.ANGLE = "Angolo";
    Z4Translations.FORWARD = "In Avanti";
    Z4Translations.BACKWARD = "Indietro";
    Z4Translations.DISTANCE = "Distanza";
    Z4Translations.CENTER_VERB = "Centra";
    // Composite Operation
    Z4Translations.COMPOSITE_OPERATION = "Operazione Composita";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OVER = "Questa \u00E8 l'impostazione predefinita e disegna il livello sopra il contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_IN = "Il livello viene disegnato solo dove si sovrappongono sia il livello che il contenuto di destinazione; tutto il resto \u00E8 reso trasparente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_OUT = "Il livello viene disegnato dove non si sovrappone al contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_SOURCE_ATOP = "Il livello viene disegnato solo dove si sovrappone al contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OVER = "Il livello viene disegnato dietro il contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_IN = "Il contenuto esistente viene mantenuto dove sia il livello che il contenuto esistente si sovrappongono; tutto il resto \u00E8 reso trasparente";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_OUT = "Il contenuto esistente viene mantenuto dove non si sovrappone al livello";
    Z4Translations.COMPOSITE_OPERATION_DESTINATION_ATOP = "Il contenuto esistente viene mantenuto solo dove si sovrappone al livello; il livello viene disegnato dietro il contenuto";
    Z4Translations.COMPOSITE_OPERATION_LIGHTER = "Laddove sia il livello che il contenuto esistente si sovrappongono, il colore viene determinato sommando i colori";
    Z4Translations.COMPOSITE_OPERATION_COPY = "Viene mostrato solo il livello";
    Z4Translations.COMPOSITE_OPERATION_XOR = "Il livello e il contenuto esistente vengono resi trasparenti laddove entrambi si sovrappongono e vengono disegnati normali altrove";
    Z4Translations.COMPOSITE_OPERATION_MULTIPLY = "I pixel del layer vengono moltiplicati per il pixel corrispondente del contenuto esistente; il risultato \u00E8 un'immagine pi\u00F9 scura";
    Z4Translations.COMPOSITE_OPERATION_SCREEN = "I pixel vengono invertiti, moltiplicati e nuovamente invertiti; il risultato \u00E8 un'immagine pi\u00F9 chiara (opposto di 'multiply')";
    Z4Translations.COMPOSITE_OPERATION_OVERLAY = "Una combinazione di 'multiply' e 'screen'; le parti scure del contenuto esistente diventano pi\u00F9 scure e le parti chiare diventano pi\u00F9 chiare";
    Z4Translations.COMPOSITE_OPERATION_DARKEN = "Mantiene i pixel pi\u00F9 scuri sia del livello che del contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_LIGHTEN = "Mantiene i pixel pi\u00F9 chiari sia del livello che del contenuto esistente";
    Z4Translations.COMPOSITE_OPERATION_COLOR_DODGE = "Divide il contenuto esistente per il livello invertito";
    Z4Translations.COMPOSITE_OPERATION_COLOR_BURN = "Divide il contenuto esistente invertito per il livello, quindi inverte il risultato";
    Z4Translations.COMPOSITE_OPERATION_HARD_LIGHT = "Una combinazione di 'multiply' e 'screen' come 'overlay', ma con il livello e il contenuto esistente scambiati";
    Z4Translations.COMPOSITE_OPERATION_SOFT_LIGHT = "Una versione pi\u00F9 morbida della 'hard-light'; il nero o il bianco puro non risultano in bianco o nero puro";
    Z4Translations.COMPOSITE_OPERATION_DIFFERENCE = "Sottrae il contenuto esistente dal livello o viceversa per ottenere sempre un valore positivo";
    Z4Translations.COMPOSITE_OPERATION_EXCLUSION = "Come 'difference', ma con contrasto inferiore";
    Z4Translations.COMPOSITE_OPERATION_HUE = "Preserva la luminanza e la crominanza del contenuto esistente, adottando la tonalit\u00E0 del livello";
    Z4Translations.COMPOSITE_OPERATION_SATURATION = "Preserva la luminanza e la tonalit\u00E0 del contenuto esistente, adottando la crominanza del livello";
    Z4Translations.COMPOSITE_OPERATION_COLOR = "Preserva la luminanza del contenuto esistente, adottando la tonalit\u00E0 e la saturazione del livello";
    Z4Translations.COMPOSITE_OPERATION_LUMINOSITY = "Preserva la tonalit\u00E0 e il croma del contenuto esistente, adottando la luminanza del livello";
    Z4Translations.CURRENT_LANGUAGE = new KeyValue("it", Z4Translations.LANGUAGE_ITALIAN_NATIVE);
  }
}
/**
 * UI utilities
 *
 * @author gianpiero.diblasi
 */
class Z4UI {

  static  PLEASE_WAIT = new JSPanel();

  static  PROGRESS_BAR = new JSProgressBar();

  static {
    Z4UI.PLEASE_WAIT.cssAddClass("please-wait");
    Z4UI.PLEASE_WAIT.setLayout(new GridBagLayout());
    Z4UI.PLEASE_WAIT.add(Z4UI.PROGRESS_BAR, new GBC(0, 0).wx(1).f(GBC.HORIZONTAL).i(0, 25, 0, 25));
    Z4UI.PROGRESS_BAR.getStyle().display = "none";
  }

  /**
   * Waits for a process to complete
   *
   * @param component The component requiring the process
   * @param async true if the process is async, false otherwise; an async
   * process needs to manually call the <i>pleaseWaitCompleted</i> method; a
   * "virtually" async process can "advance" the progress bar by calling the
   * <i>pleaseWaitAdvanced</i>
   * method
   * @param showProgressBar true to show the progress bar
   * @param progressBarIndeterminate true to sets the progress bar as
   * indeterminate, false otherwise
   * @param progressBarStringPainted true to sets the string painted in progress
   * bar, false otherwise
   * @param progressBarString The string to paint in the progress bar
   * @param process The process
   */
  static  pleaseWait(component, async, showProgressBar, progressBarIndeterminate, progressBarStringPainted, progressBarString, process) {
    Z4UI.PROGRESS_BAR.getStyle().display = showProgressBar ? "grid" : "none";
    if (showProgressBar) {
      Z4UI.PROGRESS_BAR.setIndeterminate(progressBarIndeterminate);
      Z4UI.PROGRESS_BAR.setStringPainted(progressBarStringPainted);
      Z4UI.PROGRESS_BAR.setValue(0);
      Z4UI.PROGRESS_BAR.setString(progressBarString);
    } else {
      Z4UI.PROGRESS_BAR.setIndeterminate(false);
      Z4UI.PROGRESS_BAR.setStringPainted(false);
      Z4UI.PROGRESS_BAR.setValue(0);
      Z4UI.PROGRESS_BAR.setString("");
    }
    let color = Color.fromRGB_HEX(window.getComputedStyle(document.body).getPropertyValue("--main-action-bgcolor"));
    Z4UI.PLEASE_WAIT.getStyle().background = new Color(color.red, color.green, color.blue, 64).getRGBA_HEX();
    Z4UI.PLEASE_WAIT.appendInBody();
    Z4UI.PLEASE_WAIT.cssAddClass("please-wait-visible");
    component.cssAddClass("please-wait-request");
    let parentRequest = document.querySelector(".jsdialog:has(.please-wait-request)");
    if (!parentRequest) {
      parentRequest = document.querySelector(".jsframe:has(.please-wait-request)");
    }
    parentRequest.appendChild(document.querySelector(".please-wait"));
    component.cssRemoveClass("please-wait-request");
    setTimeout(() => {
      process();
      if (!async) {
        Z4UI.pleaseWaitCompleted();
      }
    }, 0);
  }

  /**
   * Advances the please wait
   *
   * @param process The next process
   */
  static  pleaseWaitAdvanced(process) {
    setTimeout(() => process(), 0);
  }

  /**
   * Completes the please wait
   */
  static  pleaseWaitCompleted() {
    Z4UI.PLEASE_WAIT.cssRemoveClass("please-wait-visible");
  }

  /**
   * Sets the progress bar value in the please wait
   *
   * @param value The progress bar value in the please wait
   */
  static  setPleaseWaitProgressBarValue(value) {
    Z4UI.PROGRESS_BAR.setValue(value);
  }

  /**
   * Sets the progress bar string in the please wait
   *
   * @param string The string in the please wait
   */
  static  setPleaseWaitProgressBarString(string) {
    Z4UI.PROGRESS_BAR.setString(string);
  }

  /**
   * Adds a label in a panel with a GridBagLayout manager
   *
   * @param panel The panel
   * @param text The text
   * @param gbc The constraints
   * @return The added label
   */
  static  addLabel(panel, text, gbc) {
    let label = new JSLabel();
    label.setText(text);
    panel.add(label, gbc);
    return label;
  }

  /**
   * Adds a vertical line in a panel with a GridBagLayout manager
   *
   * @param panel The panel
   * @param gbc The constraints
   * @return The added line
   */
  static  addVLine(panel, gbc) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().width = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    panel.add(div, gbc);
    return div;
  }

  /**
   * Adds a horizontal line in a panel with a GridBagLayout manager
   *
   * @param panel The panel
   * @param gbc The constraints
   * @return The added line
   */
  static  addHLine(panel, gbc) {
    let div = new JSComponent(document.createElement("div"));
    div.getStyle().height = "1px";
    div.getStyle().background = "var(--main-action-bgcolor)";
    panel.add(div, gbc);
    return div;
  }

  constructor() {
  }
}
