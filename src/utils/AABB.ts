import Point3 from "./Point3";
import Ray from "./Ray";
import { fmin, fmax } from "./Constant";
import Vector3 from "./Vector3";

export default class AABB {
  private minimum: Point3 = new Point3();
  private maximum: Point3 = new Point3();
  constructor(a?: Point3, b?: Point3) {
    if (a !== undefined && b !== undefined) {
      this.set(a, b);
    }
  }

  set(a: Point3, b: Point3) {
    this.minimum = a;
    this.maximum = b;
  }

  get min() {
    return this.minimum;
  }
  get max() {
    return this.maximum;
  }
  /**
   * 一种优化的碰撞算法
   * @param r 射线
   * @param t_min 最小时间
   * @param t_max 结束时间
   * @returns
   */
  hit(r: Ray, t_min: number, t_max: number) {
    for (let a = 0; a < 3; a++) {
      let invD = 1.0 / r.direction.getByIndex(a);
      let t0 = (this.min.getByIndex(a) - r.origin.getByIndex(a)) * invD;
      let t1 = (this.max.getByIndex(a) - r.origin.getByIndex(a)) * invD;
      if (invD < 0.0) {
        let temp = t0;
        t0 = t1;
        t1 = temp;
      }
      t_min = t0 > t_min ? t0 : t_min;
      t_max = t1 < t_max ? t1 : t_max;
      if (t_max <= t_min) return false;
    }
    return true;
  }

  //   hit(r: Ray, t_min: number, t_max: number) {
  //     for (let a = 0; a < 3; a++) {
  //       let t0 = fmin(
  //         (this.minimum.get(a) - r.origin.get(a)) / r.direction.get(a),
  //         (this.maximum.get(a) - r.origin.get(a)) / r.direction.get(a)
  //       );
  //       let t1 = fmax(
  //         (this.minimum.get(a) - r.origin.get(a)) / r.direction.get(a),
  //         (this.maximum.get(a) - r.origin.get(a)) / r.direction.get(a)
  //       );
  //       t_min = fmax(t0, t_min);
  //       t_max = fmin(t1, t_max);
  //       if (t_max <= t_min) return false;
  //     }
  //     return true;
  //   }

  copy(ab: AABB) {
    this.minimum = ab.min;
    this.maximum = ab.max;
  }
  static surrounding_box(box0: AABB, box1: AABB) {
    let small = new Vector3(
      fmin(box0.min.x, box1.min.x),
      fmin(box0.min.y, box1.min.y),
      fmin(box0.min.z, box1.min.z)
    );

    let big = new Vector3(
      fmax(box0.max.x, box1.max.x),
      fmax(box0.max.y, box1.max.y),
      fmax(box0.max.z, box1.max.z)
    );

    return new AABB(small, big);
  }
}
