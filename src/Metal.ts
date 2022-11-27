import Color from "./utils/Color";
import { HitRecord } from "./utils/Hitable";
import Material, { ScatterRecord } from "./utils/Material";
import Ray from "./utils/Ray";
import Vector3 from "./utils/Vector3";

/**
 * 金属材质
 */
export default class Metal extends Material {
  albedo: Color = new Color();
  fuzz: number = 0;
  /**
   * 初始化
   * @param a 基础色
   * @param f 模糊度
   */
  constructor(a: Color, f: number) {
    super();
    this.albedo.set(a);
    this.fuzz = f < 1 ? f : 1;
  }
  scatter(r_in: Ray, rec: HitRecord, srec: ScatterRecord) {
    let reflected = Vector3.reflect(
      Vector3.normalize(r_in.direction),
      rec.normal
    );
    srec.specular_ray = new Ray(
      rec.p,
      Vector3.add(
        reflected,
        Vector3.multiply(Vector3.random_in_unit_sphere(), this.fuzz)
      )
    );
    srec.attenuation.set(this.albedo);
    srec.is_specular = true;
    srec.pdf_ptr = null;
    return true;
  }
  /**
   * 数据拷贝
   * @param m Metal材质
   */
  copy(m: Metal) {
    this.albedo = m.albedo;
    this.fuzz = m.fuzz;
  }
}
