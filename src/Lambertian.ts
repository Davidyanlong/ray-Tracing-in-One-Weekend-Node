import SolidColor from "./SolidColor";
import Color from "./utils/Color";
import { PI, random_cosine_direction } from "./utils/Constant";
import { HitRecord } from "./utils/Hitable";
import Material from "./utils/Material";
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
  /**
   * 计算击中后关系的散射
   * @param r_in 入射光线
   * @param rec 光线击中的记录
   * @param attenuation 如果发生了散射，应该将射线衰减多少
   * @param scattered 散射的光线
   */
  scatter(
    r_in: Ray,
    rec: HitRecord,
    alb: Color,
    scattered: Ray,
    pdf: { pdf: number }
  ) {
    let uvw = new ONB();
    uvw.build_from_w(rec.normal);
    let direction = uvw.local(random_cosine_direction());
    scattered.set(rec.p, Vector3.normalize(direction), r_in.time);
    alb.set(this.albedo.value(rec.u, rec.v, rec.p));
    pdf.pdf = Vector3.dot(uvw.w, scattered.direction) / PI;

    // let direction = Vector3.random_in_hemisphere(rec.normal);
    // scattered.set(rec.p, Vector3.normalize(direction), r_in.time);
    // alb.set(this.albedo.value(rec.u, rec.v, rec.p));
    // pdf.pdf = 0.5 / PI;

    // let scatter_direction = Vector3.add(
    //   rec.normal,
    //   Vector3.random_unit_vector()
    // );

    // // Catch degenerate scatter direction
    // if (scatter_direction.near_zero()) scatter_direction = rec.normal.clone();

    // scattered.set(rec.p, Vector3.normalize(scatter_direction), r_in.time);
    // alb.set(this.albedo.value(rec.u, rec.v, rec.p));
    // pdf.pdf = Vector3.dot(rec.normal, scattered.direction) / PI;

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
