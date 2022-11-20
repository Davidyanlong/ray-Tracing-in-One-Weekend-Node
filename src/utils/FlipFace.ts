import AABB from "./AABB";
import Hitable, { HitRecord } from "./Hitable";
import Ray from "./Ray";

export default class FlipFace extends Hitable {
  ptr: Hitable;
  constructor(p: Hitable) {
    super();
    this.ptr = p;
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord) {
    if (!this.ptr.hit(r, t_min, t_max, rec)) return false;

    rec.front_face = !rec.front_face;
    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB) {
    return this.ptr.bounding_box(time0, time1, output_box);
  }
}
