import Isotropic from "../Isotropic";
import AABB from "./AABB";
import Color from "./Color";
import { infinity, random_double, log } from "./Constant";
import Hitable, { HitRecord } from "./Hitable";
import Material from "./Material";
import Ray from "./Ray";
import Texture from "./Texture";
import Vector3 from "./Vector3";

export default class ConstantMedium extends Hitable {
  boundary: Hitable;
  phase_function: Material;
  neg_inv_density: number;
  constructor(b: Hitable, d: number, a: Texture | Color) {
    super();
    this.boundary = b;
    this.neg_inv_density = -1 / d;
    this.phase_function = new Isotropic(a);
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    let enableDebug = false;
    let debugging = enableDebug && random_double() < 0.00001;

    const rec1 = new HitRecord();
    const rec2 = new HitRecord();

    if (!this.boundary.hit(r, -infinity, infinity, rec1)) return false;

    if (!this.boundary.hit(r, rec1.t + 0.0001, infinity, rec2)) return false;

    if (debugging) console.log(`t_min=${rec1.t}, t_max=${rec2.t}`);

    if (rec1.t < t_min) rec1.t = t_min;
    if (rec2.t > t_max) rec2.t = t_max;

    if (rec1.t >= rec2.t) return false;

    if (rec1.t < 0) rec1.t = 0;

    let ray_length = r.direction.length();
    let distance_inside_boundary = (rec2.t - rec1.t) * ray_length;
    let hit_distance = this.neg_inv_density * log(random_double());

    if (hit_distance > distance_inside_boundary) return false;

    rec.t = rec1.t + hit_distance / ray_length;
    rec.p = r.at(rec.t);

    if (debugging) {
      console.log(`hit_distance = " ${hit_distance}\n
                    rec.t = ${rec.t} \n
                    rec.p = ${rec.p} \n`);
    }

    rec.normal = new Vector3(1, 0, 0); // arbitrary
    rec.front_face = true; // also arbitrary
    rec.mat_ptr = this.phase_function;

    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB): boolean {
    return this.boundary.bounding_box(time0, time1, output_box);
  }
}
