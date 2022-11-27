import SolidColor from "./SolidColor";
import AABB from "./utils/AABB";
import Color from "./utils/Color";
import { HitRecord } from "./utils/Hitable";
import Material from "./utils/Material";
import Ray from "./utils/Ray";
import Texture from "./utils/Texture";
import Vector3 from "./utils/Vector3";

export default class Isotropic extends Material {
  albedo: Texture;
  constructor(c: Color | Texture) {
    super();
    if (c instanceof Color) {
      this.albedo = new SolidColor(c);
    } else {
      this.albedo = c;
    }
  }
  scatter(
    r_in: Ray,
    rec: HitRecord,
    attenuation: Color,
    scattered: Ray
  ): boolean {
    scattered.set(rec.p, Vector3.random_in_unit_sphere(), r_in.time);
    attenuation.set(this.albedo.value(rec.u, rec.v, rec.p));
    return true;
  }
}
