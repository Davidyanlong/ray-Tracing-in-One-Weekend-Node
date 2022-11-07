import Color from "./Color";
import { HitRecord } from "./Hitable";
import Ray from "./Ray";

export default abstract class Material {
  abstract scatter(
    r_in: Ray,
    rec: HitRecord,
    attenuation: Color,
    scattered: Ray
  ): boolean;
}
