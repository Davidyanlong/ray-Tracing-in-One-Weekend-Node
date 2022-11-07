import Color from "./Color";
import { HitRecord } from "./Hitable";
import Ray from "./Ray";

/**
 * 抽象类，定义材质
 */
export default abstract class Material {
  /**
   * 抽象方法 计算击中后关系的散射
   * @param r_in 入射光线 
   * @param rec 光线击中的记录
   * @param attenuation 如果发生了散射，应该将射线衰减多少
   * @param scattered 散射的光线
   */  
  abstract scatter(
    r_in: Ray,
    rec: HitRecord,
    attenuation: Color,
    scattered: Ray
  ): boolean;
}
