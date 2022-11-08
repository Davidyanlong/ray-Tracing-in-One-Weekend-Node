import Vector3 from "./Vector3";
import Hitable, { HitRecord } from "./Hitable";
import { acos, atan2, PI, sqrt } from "./Constant";
import Point3 from "./Point3";
import Material from "./Material";
import Ray from "./Ray";
import type AABB from "./AABB";

/**
 * 球体类，继承自Hitable
 */
export default class Sphere extends Hitable {
  center: Point3; // 球心
  radius: number; // 半径
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
    let [u, v] = Sphere.get_sphere_uv(outward_normal);
    rec.v = v;
    rec.u = u;
    rec.mat_ptr = this.mat_ptr;
    return true;
  }
  bounding_box(time0: number, time1: number, output_box: AABB) {
    output_box.set(
      Vector3.sub(
        this.center,
        new Point3(this.radius, this.radius, this.radius)
      ),
      Vector3.add(
        this.center,
        new Point3(this.radius, this.radius, this.radius)
      )
    );
    return true;
  }
  static get_sphere_uv(p: Point3, u?: number, v?: number) {
    // p: a given point on the sphere of radius one, centered at the origin.
    // u: returned value [0,1] of angle around the Y axis from X=-1.
    // v: returned value [0,1] of angle from Y=-1 to Y=+1.
    //     <1 0 0> yields <0.50 0.50>       <-1  0  0> yields <0.00 0.50>
    //     <0 1 0> yields <0.50 1.00>       < 0 -1  0> yields <0.50 0.00>
    //     <0 0 1> yields <0.25 0.50>       < 0  0 -1> yields <0.75 0.50>

    let theta = acos(-p.y);
    let phi = atan2(-p.z, p.x) + PI;

    u = phi / (2 * PI);
    v = theta / PI;
    return [u, v];
  }
}
