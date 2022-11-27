import { cos, PI, random_double, sqrt, sin } from "./Constant";
import ONB from "./onb";
import PDF from "./PDF";
import Vector3 from "./Vector3";

export function random_cosine_direction() {
  let r1 = random_double();
  let r2 = random_double();
  let z = sqrt(1 - r2);

  let phi = 2 * PI * r1;
  let x = cos(phi) * sqrt(r2);
  let y = sin(phi) * sqrt(r2);

  return new Vector3(x, y, z);
}

export default class CosinePDF extends PDF {
  uvw: ONB = new ONB();
  constructor(w: Vector3) {
    super();
    this.uvw.build_from_w(w);
  }
  value(direction: Vector3) {
    let cosine = Vector3.dot(Vector3.normalize(direction), this.uvw.w);
    return cosine <= 0 ? 0 : cosine / PI;
  }

  generate() {
    return this.uvw.local(random_cosine_direction());
  }
}
