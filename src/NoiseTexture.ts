import Color from "./utils/Color";
import { sin } from "./utils/Constant";
import Perlin from "./utils/Perlin";
import Point3 from "./utils/Point3";
import Texture from "./utils/Texture";
import Vector3 from "./utils/Vector3";

export default class NoiseTexture extends Texture {
  noise: Perlin = new Perlin();
  scale: number = 1;
  constructor(sc?: number) {
    super();
    if (sc !== undefined) {
      this.scale = sc;
    }
  }
  value(u: number, v: number, p: Point3) {
    if (this.noise === null) {
      throw new Error("noise = null in NoiseTexture");
    }
    // 带有大理石纹理的噪声纹理
    return new Color(1, 1, 1).multiply(
      0.5 * (1 + sin(this.scale * p.z + 10 * this.noise.turb(p)))
    );

    // 湍流
    // return new Color(1, 1, 1).multiply(
    //   this.noise.turb(Vector3.multiply(p, this.scale))
    // );
    // 普通噪声
    // return new Color(1, 1, 1).multiply(
    //   (1.0 + this.noise.noise(Vector3.multiply(p, this.scale))) * 0.5
    // );
  }
}
