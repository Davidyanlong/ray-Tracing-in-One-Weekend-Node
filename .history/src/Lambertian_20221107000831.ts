import Color from "./utils/Color";
import { HitRecord } from "./utils/Hitable";
import Material from "./utils/Material";
import Ray from "./utils/Ray";
import Vector3 from "./utils/Vector3";
export default class Lambertian extends Material {
  albedo: Color = new Color();
  constructor(a: Color) {
    super();
    this.albedo = a;
  }
  scatter(r_in: Ray, rec: HitRecord, attenuation: Color, scattered: Ray) {
    let scatter_direction = Vector3.add(
      rec.normal,
      Vector3.random_unit_vector()
    );

    // Catch degenerate scatter direction
    if (scatter_direction.near_zero()) scatter_direction = rec.normal.clone();

    scattered.set(rec.p, scatter_direction);
    attenuation.set(this.albedo);
    return true;
  }
  copy(m:Lambertian){
    this.albedo = m.albedo;
  }
}
