import AABB from "./AABB";
import Hitable, { HitRecord } from "./Hitable";
import Ray from "./Ray";
import Vector3 from "./Vector3";

export default class Translate<T extends Hitable> extends Hitable {
  ptr: Hitable;
  offset: Vector3 = new Vector3();
  constructor(p: T, displacement: Vector3) {
    super();
    this.ptr = p;
    this.offset.set(displacement);
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    let moved_r = new Ray(
      r.origin.clone().sub(this.offset),
      r.direction,
      r.time
    );
    if (!this.ptr.hit(moved_r, t_min, t_max, rec)) {
      return false;
    }
    rec.p.add(this.offset);
    rec.set_face_normal(moved_r, rec.normal);

    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB): boolean {
    if (!this.ptr.bounding_box(time0, time1, output_box)) {
      return false;
    }
    output_box = new AABB(
      output_box.min.clone().add(this.offset),
      output_box.max.clone().add(this.offset)
    );

    return true;
  }
}

// class translate : public hittable
// {
//     public:
//         translate(shared_ptr<hittable> p, const vec3& displacement)
//             : ptr(p), offset(displacement) {}

//         virtual bool hit(
//             const ray& r, double t_min, double t_max, hit_record& rec) const override;

//         virtual bool bounding_box(double time0, double time1, aabb& output_box) const override;

//     public:
//         shared_ptr<hittable> ptr;
//         vec3 offset;
// };
