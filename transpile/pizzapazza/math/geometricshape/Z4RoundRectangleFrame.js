/**
 * A rectangular curve with rounded vertices
 *
 * @author gianpiero.diblasi
 */
class Z4RoundRectangleFrame extends Z4GeometricFrame {

  // private final static double ADVANCE=0.15;
  // private final static int APPROX_SEGMENTS=16;
  // 
  /**
   * Creates the object
   *
   * @param x The x location of the rounded rectangle (not rotated)
   * @param y The y location of the rounded rectangle (not rotated)
   * @param w The width of the rounded rectangle (not sheared)
   * @param h The height of the rounded rectangle (not sheared)
   * @param angle The rotation angle of the rounded rectangle
   * @param sx The x shear of the rounded rectangle
   * @param sy The y shear of the rounded rectangle
   */
  constructor(x, y, w, h, angle, sx, sy) {
    super(x, y, w, h, angle, sx, sy);
    // AffineTransform tx=AffineTransform.getRotateInstance(angle);
    // tx.concatenate(AffineTransform.getShearInstance(sx,sy));
    // double min=Math.min(w,h);
    // double minADV=min*this.ADVANCE;
    // ArrayList points=new ArrayList();
    // 
    // //First point NW
    // Point2D pp=tx.deltaTransform(new Point2D.Double(minADV,0),null);
    // Point2D.Double p=new Point2D.Double(pp.getX()+x,pp.getY()+y);
    // 
    // //Second point NE
    // pp=tx.deltaTransform(new Point2D.Double(w-1-minADV,0),null);
    // points.add(new Point2D.Double(pp.getX()+x,pp.getY()+y));
    // 
    // //Arc NE
    // this.createArc(tx,points,minADV,GZ4Math.HALF_THREE_PI,this.APPROX_SEGMENTS,w-1-minADV,minADV);
    // 
    // //Third point SE
    // pp=tx.deltaTransform(new Point2D.Double(w-1,h-1-minADV),null);
    // points.add(new Point2D.Double(pp.getX()+x,pp.getY()+y));
    // 
    // //Arc SE
    // this.createArc(tx,points,minADV,0,this.APPROX_SEGMENTS,w-1-minADV,h-1-minADV);
    // 
    // //fourth point SW
    // pp=tx.deltaTransform(new Point2D.Double(minADV,h-1),null);
    // points.add(new Point2D.Double(pp.getX()+x,pp.getY()+y));
    // 
    // //Arc SW
    // this.createArc(tx,points,minADV,GZ4Math.HALF_PI,this.APPROX_SEGMENTS,minADV,h-1-minADV);
    // 
    // //fifth point NE
    // pp=tx.deltaTransform(new Point2D.Double(0,minADV),null);
    // points.add(new Point2D.Double(pp.getX()+x,pp.getY()+y));
    // 
    // //Arc NE
    // this.createArc(tx,points,minADV,Math.PI,this.APPROX_SEGMENTS-1,minADV,minADV); //Il -1 serve per non prendere il punto iniziale p
    // 
    // Point2D.Double[] ppp=new Point2D.Double[points.size()];
    // points.toArray(ppp);
    // polyline=new Polyline(p,ppp,p);
  }
  // private void createArc(AffineTransform tx, ArrayList points, double min, double startAngle, int count, double dx, double dy)
  // {
  // for (int i=0;i<count;i++)
  // {
  // double angle=startAngle+GZ4Math.HALF_PI*(i+1)/this.APPROX_SEGMENTS;
  // double xx=min*Math.cos(angle);
  // double yy=min*Math.sin(angle);
  // 
  // Point2D pp=tx.deltaTransform(new Point2D.Double(xx+dx,yy+dy),null);
  // points.add(new Point2D.Double(pp.getX()+x,pp.getY()+y));
  // }
  // }
}
