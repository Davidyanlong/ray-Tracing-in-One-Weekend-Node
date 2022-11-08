import AABB from "./AABB";
import Hitable, { HitRecord } from "./Hitable";
import Ray from "./Ray";
/**
 * 容器类，保存场景中的物体
 */
export default class HitTableList extends Hitable {
  objects: Hitable[] = []; // 物体对象容器
  /**
   *
   * @param object 可被光线打中的物体
   */
  constructor(object?: Hitable) {
    super();
    if (object !== undefined) {
      this.add(object);
    }
  }
  /**
   * 情况容器
   */
  clear() {
    this.objects = [];
  }
  /**
   * 添加可被光线打中的对象
   * @param object 可被打中的对象
   */
  add(object: Hitable) {
    this.objects.push(object);
  }
  /**
   *  容器对象，分布调用容器中的各个对象，进行光线的hit
   * @param r 射线
   * @param t_min 射线时间t的最小值
   * @param t_max 射线时间t的最大值
   * @param rec //记录射线打到的信息
   */
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord) {
    let temp_rec: HitRecord = new HitRecord();
    let hit_anything = false;
    let closest_so_far = t_max;

    for (let i = 0, l = this.objects.length; i < l; i++) {
      let object = this.objects[i];
      if (object.hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        rec.copy(temp_rec);
      }
    }

    return hit_anything;
  }
  bounding_box(time0: number, time1: number, output_box: AABB) {
    if (this.objects.length === 0) return false;

    let temp_box = new AABB();
    let first_box = true;

    for (let i = 0, l = this.objects.length; i < l; i++) {
      let object = this.objects[i];
      if (!object.bounding_box(time0, time1, temp_box)) return false;
      output_box.copy(
        first_box ? temp_box : AABB.surrounding_box(output_box, temp_box)
      );
      first_box = false;
    }

    return true;
  }
}
