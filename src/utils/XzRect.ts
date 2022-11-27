import AABB from "./AABB";
import { fabs, infinity, random_double } from "./Constant";
import Hitable, { HitRecord } from "./Hitable";
import Material from "./Material";
import Point3 from "./Point3";
import Ray from "./Ray";
import Vector3 from "./Vector3";

export default class XzRect extends Hitable {
  mp: Material | null = null;
  x0: number = 0;
  x1: number = 0;
  z0: number = 0;
  z1: number = 0;
  k: number = 0;
  constructor(
    _x0?: number,
    _x1?: number,
    _z0?: number,
    _z1?: number,
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
    let t = (this.k - r.origin.y) / r.direction.y;
    if (t < t_min || t > t_max) return false;
    let x = r.origin.x + t * r.direction.x;
    let z = r.origin.z + t * r.direction.z;
    if (x < this.x0 || x > this.x1 || z < this.z0 || z > this.z1) return false;
    rec.u = (x - this.x0) / (this.x1 - this.x0);
    rec.v = (z - this.z0) / (this.z1 - this.z0);
    rec.t = t;
    let outward_normal = new Vector3(0, 1, 0);
    rec.set_face_normal(r, outward_normal);
    rec.mat_ptr = this.mp;
    rec.p = r.at(t);
    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB): boolean {
    output_box.set(
      new Point3(this.x0, this.k - 0.0001, this.z0),
      new Point3(this.x1, this.k + 0.0001, this.z1)
    );
    return true;
  }
  pdf_value(origin: Point3, v: Vector3) {
    let rec = new HitRecord();
    if (!this.hit(new Ray(origin, v), 0.001, infinity, rec)) return 0;

    let area = (this.x1 - this.x0) * (this.z1 - this.z0);
    let distance_squared = rec.t * rec.t * v.length_squared();
    let cosine = fabs(Vector3.dot(v, rec.normal) / v.length());

    return distance_squared / (cosine * area);
  }

  random(origin: Vector3) {
    let random_point = new Point3(
      random_double(this.x0, this.x1),
      this.k,
      random_double(this.z0, this.z1)
    );
    return Vector3.sub(random_point, origin);
  }
}
