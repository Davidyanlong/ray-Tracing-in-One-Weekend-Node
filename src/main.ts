import Vector3 from "./utils/Vector3";
import Color from "./utils/Color";
import Point3 from "./utils/Point3";
import Ray from "./utils/Ray";

import { writePPM, write_color } from "./utils/ppm";
import Hitable, { HitRecord } from "./utils/Hitable";
import { infinity, random_double, PI, cos, fabs } from "./utils/Constant";
import HittableList from "./utils/HitTableList";
import Camera from "./Camera";
import Lambertian from "./Lambertian";
import DiffuseLight from "./DiffuseLight";
import XyRect from "./utils/XyRect";
import YzRect from "./utils/YzRect";
import XzRect from "./utils/XzRect";
import Box from "./utils/Box";
import RotateY from "./utils/RotateY";
import Translate from "./utils/Translate";
import FlipFace from "./utils/FlipFace";
import Material, { ScatterRecord } from "./utils/Material";
import CosinePDF from "./utils/CosinePDF";
import HittablePDF from "./utils/HittablePDF";
import MixturePDF from "./utils/MixturePDF";
import Sphere from "./utils/Sphere";
import Metal from "./Metal";
import Dielectric from "./Dielectric";

/**
 * 获取光线最终击中的颜色
 * @param r 屏幕空间摄入的光线
 * @param world 可被击中的对象容器
 * @param depth 光线弹射的次数
 * @returns
 */
function ray_color(
  r: Ray,
  background: Color,
  world: Hitable,
  lights: Hitable,
  depth: number
): Color {
  let rec: HitRecord = new HitRecord();

  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) return new Color(0, 0, 0);

  // 如果光线没有击中任何物体，则返回背景颜色。
  if (!world.hit(r, 0.001, infinity, rec)) return background;

  let srec = new ScatterRecord();
  let emitted = (rec.mat_ptr as Material).emitted(r, rec, rec.u, rec.v, rec.p);

  if (!(rec.mat_ptr as Material).scatter(r, rec, srec)) return emitted;

  if (srec.is_specular) {
    return Vector3.multiplyVector3(
      srec.attenuation,
      ray_color(srec.specular_ray, background, world, lights, depth - 1)
    );
  }
  
  let light_ptr = new HittablePDF(lights, rec.p);
  let p = new MixturePDF(light_ptr, srec.pdf_ptr);
  // console.log('p',p);
  let scattered = new Ray(rec.p, p.generate(), r.time);
  let pdf_val = p.value(scattered.direction);
  // console.log("pdf_val", pdf_val);
  let x = (rec.mat_ptr as Material).scattering_pdf(r, rec, scattered);
  // console.log("x", x);
  let attenuation = srec.attenuation.multiply(x);
  // console.log("attenuation", attenuation.x, attenuation.y, attenuation.z);
  let nextColor = ray_color(scattered, background, world, lights, depth - 1);
  // console.log("nextColor", nextColor.x, nextColor.y, nextColor.z);
  let color2 = Vector3.multiplyVector3(attenuation, nextColor);
  // console.log("color2", color2.x, color2.y, color2.z);
  let color3 = color2.multiply(1 / pdf_val);
  // console.log("color3", color3.x, color3.y, color3.z);
  // console.log("emitted", emitted.x, emitted.y, emitted.z);
  return Vector3.add(emitted, color3);
}

/**
 * 主函数
 */
function main() {
  // Images
  let aspect_ratio = 1.0 / 1.0;
  let image_width = 600;
  let image_height = image_width / aspect_ratio;
  // 采样次数
  let samples_per_pixel = 1000;
  // 光线弹射次数
  const max_depth = 50 ; // 50

  let lights = new HittableList();
  let color = new Color(150, 150, 150);
  lights.add(new XzRect(213, 343, 227, 332, 554, new DiffuseLight(color)));
  lights.add(new Sphere(new Point3(190, 90, 190), 90, new DiffuseLight(color)));

  // World
  let world = cornell_box();
  let background = new Color(0, 0, 0);

  let lookfrom = new Point3(278, 278, -800);
  let lookat = new Point3(278, 278, 0);
  let vup = new Vector3(0, 1, 0);
  let dist_to_focus = 10.0;
  let aperture = 0.0;
  let vfov = 40.0;
  let time0 = 0.0;
  let time1 = 1.0;

  const cam = new Camera(
    lookfrom,
    lookat,
    vup,
    vfov,
    aspect_ratio,
    aperture,
    dist_to_focus,
    time0,
    time1
  );

  // Render
  let str = `P3\n ${image_width} ${image_height} \n255\n`;
  let i, j;
  for (j = image_height - 1; j >= 0; --j) {
    for (i = 0; i < image_width; ++i) {
      let pixel_color = new Color(0, 0, 0);
      for (let s = 0; s < samples_per_pixel; ++s) {
        let u = (i + random_double()) / (image_width - 1);
        let v = (j + random_double()) / (image_height - 1);
        let r = cam.get_ray(u, v);
        pixel_color.add(ray_color(r, background, world, lights, max_depth));
      }
      str += write_color(pixel_color, samples_per_pixel); //取平均值
    }
    console.log(
      `完成了${
        Math.round(((image_height - 1 - j) * 10000) / image_height) / 100
      }%`
    );
  }
  console.log(`完成了100%`);
  writePPM(str);
}
console.time("耗时");
main();
console.timeEnd("耗时");

// ********************* 以下为构建的场景数据 *************************
function cornell_box() {
  let objects = new HittableList();

  const red = new Lambertian(new Color(0.65, 0.05, 0.05));
  const white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const green = new Lambertian(new Color(0.12, 0.45, 0.15));
  const light = new DiffuseLight(new Color(15, 15, 15));

  objects.add(new YzRect(0, 555, 0, 555, 555, green));
  objects.add(new YzRect(0, 555, 0, 555, 0, red));
  objects.add(new FlipFace(new XzRect(213, 343, 227, 332, 554, light)));
  objects.add(new XzRect(0, 555, 0, 555, 555, white));
  objects.add(new XzRect(0, 555, 0, 555, 0, white));
  objects.add(new XyRect(0, 555, 0, 555, 555, white));

  let aluminum = new Metal(new Color(0.8, 0.85, 0.88), 0.0);

  let box1 = new Box(new Point3(0, 0, 0), new Point3(165, 330, 165), aluminum);
  let rbox1 = new RotateY(box1, 15);
  let tbox1 = new Translate(rbox1, new Vector3(265, 0, 295));
  objects.add(tbox1);

  // // let box2 = new Box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
  // // let rbox2 = new RotateY(box2, -18);
  // // let tbox2 = new Translate(rbox2, new Vector3(130, 0, 65));
  // // objects.add(tbox2);

  let glass = new Dielectric(1.5);
  objects.add(new Sphere(new Point3(190, 90, 190), 90, glass));

  return objects;
}
