import Color from "./utils/Color";
import { HitRecord } from "./utils/Hitable";
import Material from "./utils/Material";
import Ray from "./utils/Ray";
import Vector3 from "./utils/Vector3";

/**
 * 兰伯特材质
 */
export default class Lambertian extends Material {
  albedo: Color = new Color();
  /**
   * 初始化
   * @param a 基础颜色
   */
  constructor(a: Color) {
    super();
    this.albedo = a;
  }
    /**
   * 计算击中后关系的散射
   * @param r_in 入射光线
   * @param rec 光线击中的记录
   * @param attenuation 如果发生了散射，应该将射线衰减多少
   * @param scattered 散射的光线
   */
  scatter(r_in: Ray, rec: HitRecord, attenuation: Color, scattered: Ray) {
    let scatter_direction = Vector3.add(
      rec.normal,
      Vector3.random_unit_vector()
    );

    // Catch degenerate scatter direction
    if (scatter_direction.near_zero()) scatter_direction = rec.normal.clone();

    scattered.set(rec.p, scatter_direction);
    attenuation.set(this.albedo);
    return true;
  }
  /**
   * 数据拷贝
   * @param m Lambertian材质
   */
  copy(m:Lambertian){
    this.albedo = m.albedo;
  }
}
