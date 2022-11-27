import AABB from "./AABB";
import { sqrt } from "./Constant";
import Hitable, { HitRecord } from "./Hitable";
import Material from "./Material";
import Point3 from "./Point3";
import Ray from "./Ray";
import Vector3 from "./Vector3";

export default class MoveSphere extends Hitable {
  center0: Point3;
  center1: Point3;
  time0: number;
  time1: number;
  radius: number;
  mat_ptr: Material;
  /**
   * 初始化
   * @param cen0 运动球的初始化中心点位置
   * @param cen1 运动球经过时间后的变化的中心点
   * @param _time0 // 运动开始时间
   * @param _time1 // 运动结束时间
   * @param r // 球的半径
   * @param m // 球的材质
   */
  constructor(
    cen0: Point3,
    cen1: Point3,
    _time0: number,
    _time1: number,
    r: number,
    m: Material
  ) {
    super();
    this.center0 = cen0;
    this.center1 = cen1;
    this.time0 = _time0;
    this.time1 = _time1;
    this.radius = r;
    this.mat_ptr = m;
  }
  /**
   * 某个时间球心的位置
   * @param time 时间
   * @returns
   */
  center(time: number) {
    let dir = Vector3.sub(this.center1, this.center0);
    dir.multiply((time - this.time0) / (this.time1 - this.time0));
    return Vector3.add(this.center0, dir);
  }
  /**
   * 返回是否打中，并记录打中的信息
   * @param r 射线
   * @param t_min 射线时间t的最小值
   * @param t_max 射线时间t的最大值
   * @param rec //记录射线打到的信息
   */
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean {
    let oc = Vector3.sub(r.origin, this.center(r.time));
    let a = r.direction.length_squared();
    let half_b = Vector3.dot(oc, r.direction);
    let c = oc.length_squared() - this.radius * this.radius;
    let discriminant = half_b * half_b - a * c;

    if (discriminant < 0) return false;

    let sqrtd = sqrt(discriminant);
    // 击中球的第一个点时间
    let root = (-half_b - sqrtd) / a;
    if (root < t_min || t_max < root) {
      // 击中球的第二点时间
      root = (-half_b + sqrtd) / a;
      if (root < t_min || t_max < root) {
        return false;
      }
    }
    rec.t = root;
    rec.p = r.at(rec.t);
    let outward_normal = Vector3.sub(rec.p, this.center(r.time)).multiply(
      1 / this.radius
    );
    rec.set_face_normal(r, outward_normal);
    rec.mat_ptr = this.mat_ptr;
    return true;
  }
  bounding_box(_time0: number, _time1: number, output_box: AABB) {
    let radius = this.radius;
    let box0 = new AABB(
      Vector3.sub(this.center(_time0), new Point3(radius, radius, radius)),
      Vector3.add(this.center(_time0), new Point3(radius, radius, radius))
    );
    let box1 = new AABB(
      Vector3.sub(this.center(_time1), new Vector3(radius, radius, radius)),
      Vector3.add(this.center(_time1), new Vector3(radius, radius, radius))
    );
    output_box = AABB.surrounding_box(box0, box1);
    return true;
  }
}
