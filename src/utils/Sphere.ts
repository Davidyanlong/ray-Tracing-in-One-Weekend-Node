import Vector3 from "./Vector3";
import Hitable, { HitRecord } from "./Hitable";
import { sqrt } from "./Constant";
import Point3 from "./Point3";
import Material from "./Material";
import Ray from "./Ray";

/**
 * 球体类，继承自Hitable
 */
export default class Sphere extends Hitable {
  center: Point3;  // 球心
  radius: number;  // 半径
  mat_ptr: Material | null = null; // 球体的材质，这里是一个引用 
  /**
   * 初始化一个球对象
   * @param {*} cer 球点
   * @param {*} r 半径
   * @param {*} m 材质指针
   */
  constructor(cer: Point3, r: number, m: Material) {
    super();
    this.center = cer ? cer.clone() : new Vector3(0, 0, 0);
    this.radius = r || 1;
    this.mat_ptr = m;
  }
  /**
   * 返回是否打中，并记录打中的信息
   * @param r 射线
   * @param t_min 射线时间t的最小值
   * @param t_max 射线时间t的最大值
   * @param rec //记录射线打到的信息
   */
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord) {
    let oc = Vector3.sub(r.origin, this.center);
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
    let outward_normal = Vector3.sub(rec.p, this.center).multiply(
      1 / this.radius
    );
    rec.set_face_normal(r, outward_normal);
    rec.mat_ptr = this.mat_ptr;
    return true;
  }
}
