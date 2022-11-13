import AABB from "./AABB";
import Hitable, { HitRecord } from "./Hitable";
import Material from "./Material";
import Point3 from "./Point3";
import Ray from "./Ray";
import Vector3 from "./Vector3";

export default class YzRect extends Hitable {
  mp: Material | null = null;
  y0: number = 0;
  y1: number = 0;
  z0: number = 0;
  z1: number = 0;
  k: number = 0;
  constructor(
    _y0?: number,
    _y1?: number,
    _z0?: number,
    _z1?: number,
    _k?: number,
    mat?: Material
  ) {
    super();
    if (_y0 !== undefined) {
      this.y0 = _y0;
    }
    if (_y1 !== undefined) {
      this.y1 = _y1;
    }
    if (_z0 !== undefined) {
      this.z0 = _z0;
    }
    if (_z1 !== undefined) {
      this.z1 = _z1;
    }
    if (_k !== undefined) {
      this.k = _k;
    }
    if (mat !== undefined) {
      this.mp = mat;
    }
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    let t = (this.k - r.origin.x) / r.direction.x;
    if (t < t_min || t > t_max) return false;
    let y = r.origin.y + t * r.direction.y;
    let z = r.origin.z + t * r.direction.z;
    if (y < this.y0 || y > this.y1 || z < this.z0 || z > this.z1) return false;
    rec.u = (y - this.y0) / (this.y1 - this.y0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    let outward_normal = new Vector3(1, 0, 0);
    rec.set_face_normal(r, outward_normal);
    rec.mat_ptr = this.mp;
    rec.p = r.at(t);
    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB): boolean {
    output_box.set(
      new Point3(this.k-0.0001, this.y0, this.z0),
      new Point3(this.k+0.0001, this.y1, this.z1)
    );
    return true;
  }
}
