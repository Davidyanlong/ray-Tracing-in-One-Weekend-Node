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
import Material from "./utils/Material";
import CosinePDF from "./utils/CosinePDF";
import HittablePDF from "./utils/HittablePDF";
import MixturePDF from "./utils/MixturePDF";

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

  let scattered = new Ray();
  let attenuation = new Color();

  let emitted = (rec.mat_ptr as Material).emitted(r, rec, rec.u, rec.v, rec.p);

  let pdf = { pdf: 0 };
  let albedo = new Color();

  if (!rec.mat_ptr?.scatter(r, rec, albedo, scattered, pdf)) return emitted;

  let p0 = new HittablePDF(lights, rec.p);
  let p1 = new CosinePDF(rec.normal);
  let mixed_pdf = new MixturePDF(p0, p1);

  scattered.set(rec.p, mixed_pdf.generate(), r.time);
  pdf.pdf = mixed_pdf.value(scattered.direction);

  // let light_pdf = new HittablePDF(lights, rec.p);
  // scattered.set(rec.p, light_pdf.generate(), r.time);
  // pdf.pdf = light_pdf.value(scattered.direction);

  // let p1 = new CosinePDF(rec.normal);
  // scattered.set(rec.p, p1.generate(), r.time);
  // pdf.pdf = p1.value(scattered.direction);

  // let on_light = new Point3(random_double(213,343), 554, random_double(227,332));
  // let to_light = Vector3.sub(on_light, rec.p);
  // let distance_squared = to_light.length_squared();
  // to_light.normalize();

  // if (Vector3.dot(to_light, rec.normal) < 0)
  //     return emitted;

  // let light_area = (343-213)*(332-227);
  // let light_cosine = fabs(to_light.y);
  // if (light_cosine < 0.000001)
  //     return emitted;

  // pdf.pdf = distance_squared / (light_cosine * light_area);
  // scattered.set(rec.p, to_light, r.time);

  let p = rec.mat_ptr.scattering_pdf(r, rec, scattered);
  let albedo2 = albedo.multiply(p);
  let Raycolor = ray_color(scattered, background, world, lights, depth - 1);
  let color2 = Vector3.multiplyVector3(albedo2, Raycolor);
  let color3 = color2.multiply(1 / pdf.pdf);
  return Vector3.add(emitted, color3);
}

/**
 * 主函数
 */
function main() {
  // Images
  let aspect_ratio = 16.0 / 9.0;
  let image_width = 400;
  // 采样次数
  let samples_per_pixel = 50;
  // 光线弹射次数
  const max_depth = 50; // 50

  // World
  let world;

  let vfov = 20.0;
  let aperture = 0.0;

  let background = new Color(0.7, 0.8, 1.0);
  let lookfrom = new Point3(13, 2, 3);
  let lookat = new Point3(0, 0, 0);

  world = cornell_box();
  const light = new DiffuseLight(new Color(15, 15, 15));
  let lights = new XzRect(213, 343, 227, 332, 554, light);
  aspect_ratio = 1.0;
  image_width = 400;
  samples_per_pixel = 1000;
  background = new Color(0, 0, 0);
  lookfrom = new Point3(278, 278, -800);
  lookat = new Point3(278, 278, 0);
  vfov = 40.0;
  let time0 = 0.0;
  let time1 = 1.0;

  // Camera
  const vup = new Vector3(0, 1, 0);
  const dist_to_focus = 10; // 10

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
  const image_height = Math.floor(image_width / aspect_ratio);

  // Render
  let str = `P3\n ${image_width} ${image_height} \n255\n`;
  // std::cout << "P3\n" << image_width << ' ' << image_height << "\n255\n";
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
  // objects.add(new XzRect(213, 343, 227, 332, 554, light));
  objects.add(new FlipFace(new XzRect(213, 343, 227, 332, 554, light)));
  objects.add(new XzRect(0, 555, 0, 555, 555, white));
  objects.add(new XzRect(0, 555, 0, 555, 0, white));
  objects.add(new XyRect(0, 555, 0, 555, 555, white));

  let box1 = new Box(new Point3(0, 0, 0), new Point3(165, 330, 165), white);
  let rbox1 = new RotateY(box1, 15);
  let tbox1 = new Translate(rbox1, new Vector3(265, 0, 295));
  objects.add(tbox1);

  let box2 = new Box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
  let rbox2 = new RotateY(box2, -18);
  let tbox2 = new Translate(rbox2, new Vector3(130, 0, 65));
  objects.add(tbox2);

  return objects;
}
