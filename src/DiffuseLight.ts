import SolidColor from "./SolidColor";
import Color from "./utils/Color";
import { HitRecord } from "./utils/Hitable";
import Material, { ScatterRecord } from "./utils/Material";
import Point3 from "./utils/Point3";
import Ray from "./utils/Ray";
import Texture from "./utils/Texture";

export default class DiffuseLight extends Material {
  emit: Texture;
  constructor(a: Color | Texture) {
    super();
    if (a instanceof Texture) {
      this.emit = a;
      return;
    }
    this.emit = new SolidColor(a);
  }
  emitted(r_in: Ray, rec: HitRecord, u: number, v: number, p: Point3) {
    if (rec.front_face) return this.emit.value(u, v, p);
    else return new Color(1, 0, 0);
  }
}
