import AABB from "./AABB";
import Hitable, { HitRecord } from "./Hitable";
import HitTableList from "./HitTableList";
import Ray from "./Ray";
import { floor, random_int } from "./Constant";

export default class BvhNode extends Hitable {
  left: Hitable | null = null;
  right: Hitable | null = null;
  box: AABB = new AABB();
  constructor(
    list: HitTableList | Hitable[],
    start: number = 0,
    end: number = 0,
    time0: number = 0,
    time1: number = 0
  ) {
    super();
    if (list instanceof HitTableList) {
      this.set(list.objects, 0, list.objects.length, start, end);
    } else {
      this.set(list, start, end, time0, time1);
    }
  }
  set(
    src_objects: Hitable[],
    start: number,
    end: number,
    time0: number,
    time1: number
  ) {
    let objects = src_objects; //创建源场景对象的可修改数组

    let axis = random_int(0, 2);
    let comparator =
      axis === 0
        ? this.box_x_compare
        : axis === 1
        ? this.box_y_compare
        : this.box_z_compare; // 这里相当于一个if else语句，判定随机值bvh_node

    let object_span = floor(end - start);

    if (object_span == 1) {
      this.left = this.right = objects[start];
    } else if (object_span == 2) {
      if (comparator(objects[start], objects[start + 1])) {
        this.left = objects[start];
        this.right = objects[start + 1];
      } else {
        this.left = objects[start + 1];
        this.right = objects[start];
      }
    } else {

      objects = sort(objects,start,end,(a, b) => (comparator(a, b) ? -1 : 1))
      // std::sort(objects.begin() + start, objects.begin() + end, comparator);

      let mid = floor(start + object_span / 2);
      this.left = new BvhNode(objects, start, mid, time0, time1);
      this.right = new BvhNode(objects, mid, end, time0, time1);
    }

    let box_left = new AABB(),
      box_right = new AABB();

    if (
      !this.left?.bounding_box(time0, time1, box_left) ||
      !this.right?.bounding_box(time0, time1, box_right)
    )
      console.error("No bounding box in bvh_node constructor.\n");

    this.box = AABB.surrounding_box(box_left, box_right);
  }
  bounding_box(time0: number, time1: number, output_box: AABB) {
    output_box.copy(this.box);
    return true;
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord) {
    if (!this.box.hit(r, t_min, t_max)) return false;

    let hit_left = this.left!.hit(r, t_min, t_max, rec);
    let hit_right = this.right!.hit(r, t_min, hit_left ? rec.t : t_max, rec);

    return hit_left || hit_right;
  }
  static box_compare(a: Hitable, b: Hitable, axis: number) {
    let box_a = new AABB();
    let box_b = new AABB();

    if (!a.bounding_box(0, 0, box_a) || !b.bounding_box(0, 0, box_b)) {
      console.error("No bounding box in bvh_node constructor.\n");
    }

    return box_a.min.getByIndex(axis) < box_b.min.getByIndex(axis);
  }

  box_x_compare(a: Hitable, b: Hitable) {
    return BvhNode.box_compare(a, b, 0);
  }
  box_y_compare(a: Hitable, b: Hitable) {
    return BvhNode.box_compare(a, b, 1);
  }
  box_z_compare(a: Hitable, b: Hitable) {
    return BvhNode.box_compare(a, b, 2);
  }
}

function sort<T>(
  arr: T[],
  begin: number,
  end: number,
  sortFn: (a: T, b: T) => number
) {
  let startArr = arr.filter((v, index) => index < begin);
  let sortArr = arr.filter((v, index) => index >= begin && index < end);
  let endArr = arr.filter((v, index) => index >= end);
  sortArr = sortArr.sort(sortFn);
  return [...startArr, ...sortArr, ...endArr];
}
