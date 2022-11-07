import Color from "./utils/Color";
import { HitRecord } from "./utils/Hitable";
import Material from "./utils/Material";
import Ray from "./utils/Ray";
import Vector3 from "./utils/Vector3";

export default class Metal extends Material {
  constructor(a, f) {
    albedo: Color;
    fuzz: number;
    super();
    this.albedo = a.clone();
    this.fuzz = f < 1 ? f : 1;
  }
  scatter(r_in: Ray, rec: HitRecord, attenuation: Color, scattered: Ray) {
    let reflected = Vector3.reflect(
      Vector3.normalize(r_in.direction),
      rec.normal
    );
    scattered.set(
      rec.p,
      Vector3.add(
        reflected,
        Vector3.random_in_unit_sphere().multiply(this.fuzz)
      )
    );
    attenuation.set(this.albedo);
    return Vector3.dot(scattered.direction, rec.normal) > 0;
  }
  copy(m) {
    this.albedo = m.albedo;
    this.fuzz = m.fuzz;
  }
}
