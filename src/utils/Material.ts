import Color from "./Color";
import { HitRecord } from "./Hitable";
import PDF from "./PDF";
import Point3 from "./Point3";
import Ray from "./Ray";

/**
 * 抽象类，定义材质
 */
export default class Material {
  emitted(r_in: Ray, rec: HitRecord, u: number, v: number, p: Point3) {
    return new Color(0, 0, 0);
  }
  /**
   * 抽象方法 计算击中后关系的散射
   * @param r_in 入射光线
   * @param rec 光线击中的记录
   * @param attenuation 如果发生了散射，应该将射线衰减多少
   * @param scattered 散射的光线
   */
  scatter(r_in: Ray, rec: HitRecord, srec: ScatterRecord): boolean {
    return false;
  }
  scattering_pdf(r_in: Ray, rec: HitRecord, scattered: Ray) {
    return 0;
  }
}

export class ScatterRecord {
  specular_ray: Ray = new Ray();
  is_specular: boolean = false;
  attenuation: Color = new Color();
  pdf_ptr: PDF | null = null;
}
