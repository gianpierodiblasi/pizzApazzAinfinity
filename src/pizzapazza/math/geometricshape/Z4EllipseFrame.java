package pizzapazza.math.geometricshape;

/**
 * An elliptic curve
 *
 * @author gianpiero.diblasi
 */
public class Z4EllipseFrame extends Z4GeometricFrame {

  private final double startAngle;
  private final double extentAngle;

  /**
   * Creates the oject
   *
   * @param x The x location of the ellipse (not rotated)
   * @param y The y location of the ellipse (not rotated)
   * @param w The width of the ellipse (not sheared)
   * @param h The height of the ellipse (not sheared)
   * @param angle The rotation angle
   * @param sx The x shear of the ellipse
   * @param sy The y shear of the ellipse
   * @param startAngle The start angle
   * @param extentAngle The extent angle
   */
  public Z4EllipseFrame(double x, double y, double w, double h, double angle, double sx, double sy, double startAngle, double extentAngle) {
    super(x, y, w, h, angle, sx, sy);

    this.startAngle = startAngle;
    this.extentAngle = extentAngle;
    
//    tx=AffineTransform.getRotateInstance(angle);
//    tx.concatenate(AffineTransform.getShearInstance(sx,sy));
//
//    double w2=(w-1)/2;
//    double h2=(h-1)/2;
//
//    double xx=w2*Math.cos(startAngle)+w2;
//    double yy=h2*Math.sin(startAngle)+h2;
//    Point2D pp=tx.deltaTransform(new Point2D.Double(xx,yy),null);
//    Point2D.Double p=new Point2D.Double(pp.getX()+x,pp.getY()+y);
//    double v=extentAngle/this.APPROX_SEGMENTS;
//
//    Point2D.Double[] ip=new Point2D.Double[APPROX_SEGMENTS-1];
//    for (int i=0;i<ip.length;i++)
//    {
//      double angolo=startAngle+v*(i+1);
//      xx=w2*Math.cos(angolo)+w2;
//      yy=h2*Math.sin(angolo)+h2;
//      pp=tx.deltaTransform(new Point2D.Double(xx,yy),null);
//      ip[i]=new Point2D.Double(pp.getX()+x,pp.getY()+y);
//    }
//
//    polyline=new Polyline(p,ip,extentAngle==GZ4Math.TWO_PI?p:ip[ip.length-1]);
//
//    tx.concatenate(AffineTransform.getScaleInstance(w,h));
  }
}
