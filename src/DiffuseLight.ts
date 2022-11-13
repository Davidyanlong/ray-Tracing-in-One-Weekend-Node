import SolidColor from "./SolidColor";
import Color from "./utils/Color";
import { HitRecord } from "./utils/Hitable";
import Material from "./utils/Material";
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
  scatter(
    r_in: Ray,
    rec: HitRecord,
    attenuation: Color,
    scattered: Ray
  ): boolean {
    return false; // 光源并不散射光线
  }
  emitted(u: number, v: number, p: Point3): Color {
    return this.emit.value(u, v, p);
  }
}
