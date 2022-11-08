import Color from "./utils/Color";
import Texture from "./utils/Texture";
import Vector3 from "./utils/Vector3";

export default class SolidColor extends Texture {
  private color_value = new Color();
  constructor(r?: Color, g?: number, b?: number) {
    super();
    this.color_value.set(r as Vector3, g, b);
  }
  value(u: number, v: number, p: Vector3) {
    return this.color_value;
  }
}
