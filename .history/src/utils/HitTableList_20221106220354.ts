import Hitable, { HitRecord } from "./Hitable";
import Ray from "./Ray";

export default class HitTableList extends Hitable {
  objects: Hitable[] = [];
  constructor(object: Hitable) {
    super();
    if (object !== undefined) {
      this.add(object);
    }
  }
  clear() {
    this.objects = [];
  }
  add(object: Hitable) {
    this.objects.push(object);
  }
  hit(r: Ray, t_min: number, t_max: number, rec: HitRecord) {
    let temp_rec: HitRecord = new HitRecord();
    let hit_anything = false;
    let closest_so_far = t_max;

    for (let i = 0, l = this.objects.length; i < l; i++) {
      let object = this.objects[i];
      if (object.hit(r, t_min, closest_so_far, temp_rec)) {
        hit_anything = true;
        closest_so_far = temp_rec.t;
        rec = temp_rec;
      }
    }

    return hit_anything;
  }
}
