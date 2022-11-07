import Material from "./utils/Material";
import Vector3 from "./utils/Vector3";
import { sqrt, random_double } from "./utils/Constant";
import Ray from "./utils/Ray";
import { HitRecord } from "./utils/Hitable";
import Color from "./utils/Color";
/**
 * 绝缘体材质 继承自 Material
 */
export default class Dielectric extends Material {
  ir: number;
  /**
   * 初始化
   * @param ri 折射系数
   */
  constructor(ri: number) {
    super();
    this.ir = ri;
  }
  /**
   * 计算击中后关系的散射
   * @param r_in 入射光线
   * @param rec 光线击中的记录
   * @param attenuation 如果发生了散射，应该将射线衰减多少
   * @param scattered 散射的光线
   */
  scatter(r_in: Ray, rec: HitRecord, attenuation: Color, scattered: Ray) {
    attenuation.set(1.0, 1.0, 1.0);
    //判断交点是在外部还是内部 front_face为true时-->外部
    let refraction_ratio = rec.front_face ? 1.0 / this.ir : this.ir;
    let unit_direction = Vector3.normalize(r_in.direction);

    let cos_theta = Math.min(
      Vector3.dot(unit_direction.clone().multiply(-1), rec.normal),
      1.0
    );
    let sin_theta = sqrt(1.0 - cos_theta * cos_theta);

    let cannot_refract = refraction_ratio * sin_theta > 1.0;
    let direction;

    if (
      cannot_refract ||
      this.reflectance(cos_theta, refraction_ratio) > random_double()
    )
      direction = Vector3.reflect(unit_direction, rec.normal);
    else
      direction = Vector3.refract(unit_direction, rec.normal, refraction_ratio);

    scattered.set(rec.p, direction);
    return true;
  }
  /**
   * Schlick 计算菲涅尔值
   * @param cosine 余弦
   * @param ref_idx 反射系数
   * @returns
   */
  reflectance(cosine: number, ref_idx: number) {
    // Use Schlick's approximation for reflectance.
    let r0 = (1 - ref_idx) / (1 + ref_idx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
  /**
   * 数据拷贝
   * @param m Dielectric材质
   */
  copy(m: Dielectric) {
    this.ir = m.ir;
  }
}
