import { clamp, sqrt } from "./Constant";
import Vector3 from "./Vector3";

export default class Color extends Vector3 {}

export function write_color(pixel_color: Color, samples_per_pixel: number) {
  let r = pixel_color.x;
  let g = pixel_color.y;
  let b = pixel_color.z;

  //根据样本数对颜色取平均值
  // Divide the color by the number of samples and gamma-correct for gamma=2.0.
  let scale = 1.0 / samples_per_pixel;
  r = sqrt(r * scale);
  g = sqrt(g * scale);
  b = sqrt(b * scale);

  r = Math.floor(256 * clamp(r, 0.0, 0.999));
  g = Math.floor(256 * clamp(g, 0.0, 0.999));
  b = Math.floor(256 * clamp(b, 0.0, 0.999));
  return `${r} ${g}  ${b}\n`;
}
