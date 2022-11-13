import AABB from "./AABB";
import { degrees_to_radians, sin, cos, infinity, fmin, fmax } from "./Constant";
import Hitable, { HitRecord } from "./Hitable";
import Point3 from "./Point3";
import Ray from "./Ray";
import Vector3 from "./Vector3";

export default class RotateY<T extends Hitable> extends Hitable {
  ptr: Hitable;
  sin_theta: number;
  cos_theta: number;
  hasbox: boolean;
  bbox: AABB = new AABB();
  constructor(p: T, angle: number) {
    super();

    this.ptr = p;
    let radians = degrees_to_radians(angle);
    this.sin_theta = sin(radians);
    this.cos_theta = cos(radians);
    this.hasbox = this.ptr.bounding_box(0, 1, this.bbox);

    let min = new Point3(infinity, infinity, infinity);
    let max = new Point3(-infinity, -infinity, -infinity);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {

          let x = i * this.bbox.max.x + (1 - i) * this.bbox.min.x;
          let y = j * this.bbox.max.y + (1 - j) * this.bbox.min.y;
          let z = k * this.bbox.max.z + (1 - k) * this.bbox.min.z;

          let newx = this.cos_theta * x + this.sin_theta * z;
          let newz = -this.sin_theta * x + this.cos_theta * z;

          let tester = new Vector3(newx, y, newz);
          for (let c = 0; c < 3; c++) {
            min.setByIndex(c, fmin(min.getByIndex(c), tester.getByIndex(c)));
            max.setByIndex(c, fmax(max.getByIndex(c), tester.getByIndex(c)));
          }
        }
      }
    }

    this.bbox = new AABB(min, max);
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    let origin = r.origin.clone();
    let direction = r.direction.clone();

    origin.x = this.cos_theta * r.origin.x - this.sin_theta * r.origin.z;
    origin.z = this.sin_theta * r.origin.x + this.cos_theta * r.origin.z;

    direction.x =
      this.cos_theta * r.direction.x - this.sin_theta * r.direction.z;
    direction.z =
      this.sin_theta * r.direction.x + this.cos_theta * r.direction.z;


    let rotated_r = new Ray(origin, direction, r.time);

    if (!this.ptr.hit(rotated_r, t_min, t_max, rec)) return false;

    let p = rec.p.clone();
    let normal = rec.normal.clone();

    p.x = this.cos_theta * rec.p.x + this.sin_theta * rec.p.z;
    p.z = -this.sin_theta * rec.p.x + this.cos_theta * rec.p.z;

    normal.x = this.cos_theta * rec.normal.x + this.sin_theta * rec.normal.z;
    normal.z = -this.sin_theta * rec.normal.x + this.cos_theta * rec.normal.z;

    rec.p = p;
    rec.set_face_normal(rotated_r, normal);

    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB): boolean {
    output_box.copy(this.bbox);
    return this.hasbox;
  }
}
