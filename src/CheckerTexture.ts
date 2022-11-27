import SolidColor from "./SolidColor";
import Color from "./utils/Color";
import { sin } from "./utils/Constant";
import Point3 from "./utils/Point3";
import Texture from "./utils/Texture";
/**
 * 格子纹理
 */
export default class CheckerTexture extends Texture {
  even: Texture | null = null;
  odd: Texture | null = null;
  constructor(a?: Texture | Color, b?: Texture | Color) {
    super();
    if (a instanceof Texture && b instanceof Texture) {
      this.even = a;
      this.odd = b;
    }
    if (a instanceof Color && b instanceof Color) {
      this.even = new SolidColor(a);
      this.odd = new SolidColor(b);
    }
  }
  value(u: number, v: number, p: Point3) {
    let sines = sin(10 * p.x) * sin(10 * p.y) * sin(10 * p.z);
    if (this.even === null || this.odd === null) {
      throw new Error("even = null or odd = null");
    }
    if (sines < 0) return this.odd.value(u, v, p);
    else return this.even.value(u, v, p);
  }
}
