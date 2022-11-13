import AABB from "./AABB";
import Hitable, { HitRecord } from "./Hitable";
import Material from "./Material";
import Point3 from "./Point3";
import Ray from "./Ray";
import Vector3 from "./Vector3";

export default class XyRect extends Hitable {
  mp: Material | null = null;
  x0: number = 0;
  x1: number = 0;
  y0: number = 0;
  y1: number = 0;
  k: number = 0;
  constructor(
    _x0?: number,
    _x1?: number,
    _y0?: number,
    _y1?: number,
    _k?: number,
    mat?: Material
  ) {
    super();
    if (_x0 !== undefined) {
      this.x0 = _x0;
    }
    if (_x1 !== undefined) {
      this.x1 = _x1;
    }
    if (_y0 !== undefined) {
      this.y0 = _y0;
    }
    if (_y1 !== undefined) {
      this.y1 = _y1;
    }
    if (_k !== undefined) {
      this.k = _k;
    }
    if (mat !== undefined) {
      this.mp = mat;
    }
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    let t = (this.k - r.origin.z) / r.direction.z;
    if (t < t_min || t > t_max) return false;
    let x = r.origin.x + t * r.direction.x;
    let y = r.origin.y + t * r.direction.y;
    if (x < this.x0 || x > this.x1 || y < this.y0 || y > this.y1) return false;
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (y - this.y0) / (this.y1 - this.y0);
    rec.t = t;
    let outward_normal = new Vector3(0, 0, 1);
    rec.set_face_normal(r, outward_normal);
    rec.mat_ptr = this.mp;
    rec.p = r.at(t);
    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB): boolean {
    output_box.set(
      new Point3(this.x0, this.y0, this.k - 0.0001),
      new Point3(this.x1, this.y1, this.k + 0.0001)
    );
    return true;
  }
}
