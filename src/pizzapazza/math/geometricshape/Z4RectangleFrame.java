package pizzapazza.math.geometricshape;

/**
 * A rectangular curve
 *
 * @author gianpiero.diblasi
 */
public class Z4RectangleFrame extends Z4GeometricFrame {

  /**
   * Creates the object
   *
   * @param x The x location of the rectangle (not rotated)
   * @param y The y location of the rectangle (not rotated)
   * @param w The width of the rectangle (not sheared)
   * @param h The height of the rectangle (not sheared)
   * @param angle The rotation angle of the rectangle
   * @param sx The x shear of the rectangle
   * @param sy The y shear of the rectangle
   */
  public Z4RectangleFrame(double x, double y, double w, double h, double angle, double sx, double sy) {
    super(x, y, w, h, angle, sx, sy);
    
//    tx=AffineTransform.getRotateInstance(angle);
//    tx.concatenate(AffineTransform.getShearInstance(sx,sy));
//
//    Point2D pp=tx.deltaTransform(new Point2D.Double(0,0),null);
//    Point2D.Double p=new Point2D.Double(pp.getX()+x,pp.getY()+y);
//
//    pp=tx.deltaTransform(new Point2D.Double(w-1,0),null);
//    Point2D.Double ip1=new Point2D.Double(pp.getX()+x,pp.getY()+y);
//
//    pp=tx.deltaTransform(new Point2D.Double(w-1,h-1),null);
//    Point2D.Double ip2=new Point2D.Double(pp.getX()+x,pp.getY()+y);
//
//    pp=tx.deltaTransform(new Point2D.Double(0,h-1),null);
//    Point2D.Double ip3=new Point2D.Double(pp.getX()+x,pp.getY()+y);
//
//    polyline=new Polyline(p,new Point2D.Double[] {ip1,ip2,ip3},p);
//
//    tx.concatenate(AffineTransform.getScaleInstance(w,h));
  }

}
