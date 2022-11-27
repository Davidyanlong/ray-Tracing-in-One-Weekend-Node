import AABB from "./AABB";
import Hitable, { HitRecord } from "./Hitable";
import HitTableList from "./HitTableList";
import Material from "./Material";
import Point3 from "./Point3";
import Ray from "./Ray";
import XyRect from "./XyRect";
import XzRect from "./XzRect";
import YzRect from "./YzRect";

export default class Box extends Hitable {
  box_min: Point3 = new Point3();
  box_max: Point3 = new Point3();
  sides: HitTableList = new HitTableList();
  constructor(p0?: Point3, p1?: Point3, ptr?: Material) {
    super();
    if (p0 === undefined || p1 === undefined || ptr === undefined) return this;

    this.box_min.set(p0);
    this.box_max.set(p1);

    this.sides.add(new XyRect(p0.x, p1.x, p0.y, p1.y, p1.z, ptr));
    this.sides.add(new XyRect(p0.x, p1.x, p0.y, p1.y, p0.z, ptr));

    this.sides.add(new XzRect(p0.x, p1.x, p0.z, p1.z, p1.y, ptr));
    this.sides.add(new XzRect(p0.x, p1.x, p0.z, p1.z, p0.y, ptr));

    this.sides.add(new YzRect(p0.y, p1.y, p0.z, p1.z, p1.x, ptr));
    this.sides.add(new YzRect(p0.y, p1.y, p0.z, p1.z, p0.x, ptr));
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord) {
    return this.sides.hit(r, t_min, t_max, rec);
  }
  bounding_box(time0: number, time1: number, output_box: AABB) {
    output_box.set(this.box_min, this.box_max);
    return true;
  }
}
