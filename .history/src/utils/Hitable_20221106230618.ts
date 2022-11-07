import Ray from "./Ray";
import Point3 from "./Point3";
import Vector3 from "./Vector3";
import Material from "./Material";

export class HitRecord {
  p: Point3 = new Point3();
  normal: Vector3 = new Vector3();
  mat_ptr: Material | null = null;
  t: number = 0;
  front_face: boolean = false;
  set_face_normal(r: Ray, outward_normal: Vector3) {
    this.front_face = Vector3.dot(r.direction, outward_normal) < 0;
    this.normal = this.front_face
      ? outward_normal.clone()
      : outward_normal.clone().multiply(-1);
  }
  copy(h: HitRecord) {
    this.p.set(h.p);
    this.normal.set(h.normal);
    this.mat_ptr = h.mat_ptr;
    this.t = h.t;
    this.front_face = h.front_face;
  }
}

export default abstract class Hitable {
  abstract hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
}
