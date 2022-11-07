import Ray from "./Ray";
import Point3 from "./Point3";
import Vector3 from "./Vector3";
import Material from "./Material";

/**
 * 记录射线碰撞点的信息
 */
export class HitRecord {
  p: Point3 = new Point3();      // 射线碰撞的点
  normal: Vector3 = new Vector3(); // 碰撞面的法线
  mat_ptr: Material | null = null;  // 碰撞面的材质
  t: number = 0;                    // 射线碰撞的时间
  front_face: boolean = true;      // 射线碰撞的是正面还是反面
  /**
   * 计算射线打到的是正面还是反面，并记录法线
   * @param r 射线
   * @param outward_normal 面的法线
   */
  set_face_normal(r: Ray, outward_normal: Vector3) {
    this.front_face = Vector3.dot(r.direction, outward_normal) < 0;
    this.normal = this.front_face
      ? outward_normal.clone()
      : outward_normal.clone().multiply(-1);
  }
  /**
   * 复制记录信息
   * @param h 记录复制
   */
  copy(h: HitRecord) {
    this.p.set(h.p);
    this.normal.set(h.normal);
    this.mat_ptr = h.mat_ptr;
    this.t = h.t;
    this.front_face = h.front_face;
  }
}

export default abstract class Hitable {
  abstract hit(r: Ray, t_min: number, t_max: number, rec: HitRecord): boolean;
}
