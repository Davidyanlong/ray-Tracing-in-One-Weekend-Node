import Vector3 from "./Vector3";
import Point3 from "./Point3";

/**
 * 射线类
 */
export default class Ray {
  private orig: Point3 = new Point3(); // 射线起点
  private dir: Vector3 = new Vector3(); // 射线方向
  private tm: number = 0; // 射线存在的时间
  /**
   * 初始化射线类
   * @param origin 起点
   * @param direction 方向
   * @param time 射线存在的时间
   */
  constructor(origin?: Point3, direction?: Vector3, time?: number) {
    if (origin instanceof Point3) {
      this.orig = origin;
    }
    if (direction instanceof Vector3) {
      this.dir = direction;
    }
    if (time !== undefined) {
      this.tm = time;
    }
  }
  // 射线启动
  get origin() {
    return this.orig;
  }
  // 射线方向
  get direction() {
    return this.dir;
  }
  // 射线经过的时间
  get time() {
    return this.tm;
  }
  /**
   * 返回射线t时间后的终点位置点
   * @param t 时间t
   * @returns
   */
  at(t: number) {
    let dir = this.dir.clone();
    dir.multiply(t);
    return this.orig.clone().add(dir);
  }
  /**
   * 为射线设置值
   * @param origin 起点
   * @param direction 方向
   * @param time 时间
   */
  set(origin: Point3, direction: Vector3, time?: number) {
    this.orig = origin.clone();
    this.dir = direction.clone();
    if (time) {
      this.tm = time;
    }
  }
}
