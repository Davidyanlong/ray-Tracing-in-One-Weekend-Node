import Material from "./Material.js";
import Vector3 from "./Vector3.js";
import { sqrt } from "./Const.js";
import { random_double } from "./Const.js";

export default class Dielectric extends Material {
  constructor(ri) {
    super();
    this.ir = ri;
  }
  scatter(r_in, rec, attenuation, scattered) {
    attenuation.set(1.0, 1.0, 1.0);
    //判断交点是在外部还是内部 front_face为true时-->外部
    let refraction_ratio = rec.front_face ? 1.0 / this.ir : this.ir;
    let unit_direction = Vector3.normalize(r_in.direction);

    let cos_theta = Math.min(
      Vector3.dot(unit_direction.clone().multiply(-1), rec.normal),
      1.0
    );
    let sin_theta = sqrt(1.0 - cos_theta * cos_theta);

    let cannot_refract = refraction_ratio * sin_theta > 1.0;
    let direction;

    if (
      cannot_refract ||
      this.reflectance(cos_theta, refraction_ratio) > random_double()
    )
      direction = Vector3.reflect(unit_direction, rec.normal);
    else
      direction = Vector3.refract(unit_direction, rec.normal, refraction_ratio);

    scattered.set(rec.p, direction);

    // attenuation.set(1.0, 1.0, 1.0);

    // const refraction_ratio = rec.front_face ? 1.0 / this.ir : this.ir;

    // const unit_direction = Vector3.normalize(r_in.direction);
    // let refracted = Vector3.refract(
    //   unit_direction.clone(),
    //   rec.normal.clone(),
    //   refraction_ratio
    // );

    // scattered.set(rec.p, refracted);
    return true;
  }
  reflectance(cosine, ref_idx) {
    // Use Schlick's approximation for reflectance.
    let r0 = (1 - ref_idx) / (1 + ref_idx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
  copy(m) {
    this.ir = m.ir;
  }
}
