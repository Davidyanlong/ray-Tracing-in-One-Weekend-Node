import SolidColor from "./SolidColor";
import Color from "./utils/Color";
import { PI, random_cosine_direction } from "./utils/Constant";
import CosinePDF from "./utils/CosinePDF";
import { HitRecord } from "./utils/Hitable";
import Material, { ScatterRecord } from "./utils/Material";
import ONB from "./utils/onb";
import Ray from "./utils/Ray";
import Texture from "./utils/Texture";
import Vector3 from "./utils/Vector3";

/**
 * 兰伯特材质
 */
export default class Lambertian extends Material {
  albedo: Texture;
  /**
   * 初始化
   * @param a 基础颜色
   */
  constructor(a: Texture | Color) {
    super();
    if (a instanceof Color) {
      this.albedo = new SolidColor(a);
    } else {
      this.albedo = a;
    }
  }
  scatter(r_in: Ray, rec: HitRecord, srec: ScatterRecord) {
    srec.is_specular = false;
    srec.attenuation.set(this.albedo.value(rec.u, rec.v, rec.p));
    srec.pdf_ptr = new CosinePDF(rec.normal);
    return true;
  }
  scattering_pdf(r_in: Ray, rec: HitRecord, scattered: Ray) {
    let cosine = Vector3.dot(
      rec.normal,
      Vector3.normalize(scattered.direction)
    );
    return cosine < 0 ? 0 : cosine / PI;
  }
  /**
   * 数据拷贝
   * @param m Lambertian材质
   */
  copy(m: Lambertian) {
    this.albedo = m.albedo;
  }
}
