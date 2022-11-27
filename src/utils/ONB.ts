import { fabs } from "./Constant";
import Vector3 from "./Vector3";

export default class ONB {
  axis: Vector3[] = [];
  get u() {
    return this.axis[0];
  }
  get v() {
    return this.axis[1];
  }
  get w() {
    return this.axis[2];
  }
  getByIndex(index: number) {
    return this.axis[index];
  }
  local(a: number | Vector3, b?: number, c?: number) {
    if (a instanceof Vector3) {
      b = a.y;
      c = a.z;
      a = a.x;
    }
    let va = Vector3.multiply(this.u, a);
    let vb = Vector3.multiply(this.v, b as number);
    let vc = Vector3.multiply(this.w, c as number);
    return Vector3.add(va, Vector3.add(vb, vc));
  }
  build_from_w(n: Vector3) {
    this.axis[2] = Vector3.normalize(n);
    let a = fabs(this.w.x) > 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
    this.axis[1] = Vector3.normalize(Vector3.cross(this.w, a));
    this.axis[0] = Vector3.cross(this.w, this.v);
  }
}
