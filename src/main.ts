import Vector3 from "./utils/Vector3";
import Color from "./utils/Color";
import Point3 from "./utils/Point3";
import Ray from "./utils/Ray";
import Sphere from "./utils/Sphere";

import { writePPM, write_color } from "./utils/ppm";
import Hitable, { HitRecord } from "./utils/Hitable";
import { infinity, random_double, PI, cos } from "./utils/Constant";
import HittableList from "./utils/HitTableList";
import Camera from "./Camera";
import Lambertian from "./Lambertian";
import Metal from "./Metal";
import Dielectric from "./Dielectric";
import Material from "./utils/Material";
import MoveSphere from "./utils/MovingSphere";
import CheckerTexture from "./CheckerTexture";
import NoiseTexture from "./NoiseTexture";
import path from "path";
import ImageTexture from "./ImageTexture";
import DiffuseLight from "./DiffuseLight";
import XyRect from "./utils/XyRect";
import YzRect from "./utils/YzRect";
import XzRect from "./utils/XzRect";
import Box from "./utils/Box";
import RotateY from "./utils/RotateY";
import Translate from "./utils/Translate";
import ConstantMedium from "./utils/ConstantMedium";
import BvhNode from "./utils/BvhNode";

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
  depth: number
): Color {
  let rec: HitRecord = new HitRecord();

  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) return new Color(0, 0, 0);

  // 如果光线没有击中任何物体，则返回背景颜色。
  if (!world.hit(r, 0.001, infinity, rec)) return background;

  let scattered = new Ray();
  let attenuation = new Color();
  // @ts-ignore
  let emitted = rec.mat_ptr.emitted(rec.u, rec.v, rec.p);

  if (!rec.mat_ptr?.scatter(r, rec, attenuation, scattered)) return emitted;

  return Vector3.add(
    emitted,
    attenuation
      .clone()
      .multiplyVector3(ray_color(scattered, background, world, depth - 1))
  );

  // if (world.hit(r, 0.001, infinity, rec)) {
  //   // console.log('====',rec.u,rec.v);
  //   let scattered = new Ray();
  //   let attenuation = new Color();
  //   if (rec.mat_ptr?.scatter(r, rec, attenuation, scattered))
  //     return attenuation
  //       .clone()
  //       .multiplyVector3(ray_color(scattered, world, depth - 1));
  //   return new Color(0, 0, 0);
  // }

  // let unit_direction = Vector3.normalize(r.direction);
  // let t = 0.5 * (unit_direction.y + 1.0);

  // return Vector3.add(
  //   new Color(1.0, 1.0, 1.0).multiply(1 - t),
  //   new Color(0.5, 0.7, 1.0).multiply(t)
  // );
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

  let sceneIdx = 8;
  let background = new Color(0.7, 0.8, 1.0);
  let lookfrom = new Point3(13, 2, 3);
  let lookat = new Point3(0, 0, 0);
  switch (sceneIdx) {
    case 1:
      world = random_scene();
      aperture = 0.1;
      break;
    case 2:
      world = two_spheres();
      break;
    case 3:
      world = two_perlin_spheres();
      break;
    case 4:
      world = earth();
      break;

    case 5:
      world = simple_light();
      samples_per_pixel = 400;
      background = new Color(0, 0, 0);
      lookfrom = new Point3(26, 3, 6);
      lookat = new Point3(0, 2, 0);
      vfov = 20.0;
      break;
    case 6:
      world = cornell_box();
      aspect_ratio = 1.0;
      image_width = 600;
      samples_per_pixel = 200;
      background = new Color(0, 0, 0);
      lookfrom = new Point3(278, 278, -800);
      lookat = new Point3(278, 278, 0);
      vfov = 40.0;
      break;

    case 7:
      world = cornell_smoke();
      aspect_ratio = 1.0;
      image_width = 600;
      samples_per_pixel = 200;
      lookfrom = new Point3(278, 278, -800);
      lookat = new Point3(278, 278, 0);
      vfov = 40.0;
      break;
    default:
    case 8:
      world = final_scene();
      aspect_ratio = 1.0;
      image_width = 800;
      samples_per_pixel = 1000;
      background = new Color(0, 0, 0);
      lookfrom = new Point3(478, 278, -600);
      lookat = new Point3(278, 278, 0);
      vfov = 40.0;
      break;
  }

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
    0,
    1
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
        pixel_color.add(ray_color(r, background, world, max_depth));
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
function random_scene() {
  let world = new HittableList();
  let checker = new CheckerTexture(
    new Color(0.2, 0.3, 0.1),
    new Color(0.9, 0.9, 0.9)
  );
  let material_ground = new Lambertian(checker);
  world.add(new Sphere(new Point3(0.0, -1000, -1.0), 1000.0, material_ground));
  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      let choose_mat = random_double();
      let center = new Point3(
        a + 0.9 * random_double(),
        0.2,
        b + 0.9 * random_double()
      );
      if (Vector3.sub(center, new Vector3(4, 0.2, 0)).length() > 0.9) {
        let sphere_material;
        if (choose_mat < 0.8) {
          // diffuse
          let albedo = new Color(
            Color.multiplyVector3(Color.random(), Color.random())
          );
          sphere_material = new Lambertian(albedo);
          let center2 = Vector3.add(
            center,
            new Point3(0, random_double(0, 0.5), 0)
          );
          world.add(
            new MoveSphere(center, center2, 0.0, 1.0, 0.2, sphere_material)
          );
        } else if (choose_mat < 0.95) {
          // metal
          let albedo = Color.random(0.5, 1);
          let fuzz = random_double(0, 0.5);
          sphere_material = new Metal(albedo, fuzz);
        } else {
          sphere_material = new Dielectric(1.5);
        }
        world.add(new Sphere(center, 0.2, sphere_material as Material));
      }
    }
  }

  let material1 = new Dielectric(1.5);
  world.add(new Sphere(new Point3(0, 1, 0), 1.0, material1));

  let material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
  world.add(new Sphere(new Point3(-4, 1, 0), 1.0, material2));

  let material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
  world.add(new Sphere(new Point3(4, 1, 1), 1.0, material3));
  return world;
}

function two_spheres() {
  let objects = new HittableList();

  let checker = new CheckerTexture(
    new Color(0.2, 0.3, 0.1),
    new Color(0.9, 0.9, 0.9)
  );

  objects.add(new Sphere(new Point3(0, -10, 0), 10, new Lambertian(checker)));
  objects.add(new Sphere(new Point3(0, 10, 0), 10, new Lambertian(checker)));

  return objects;
}

function two_perlin_spheres() {
  let objects = new HittableList();

  let pertext = new NoiseTexture(4);
  objects.add(
    new Sphere(new Point3(0, -1000, 0), 1000, new Lambertian(pertext))
  );
  objects.add(new Sphere(new Point3(0, 2, 0), 2, new Lambertian(pertext)));

  return objects;
}

function earth() {
  let objects = new HittableList();
  let earth_texture = new ImageTexture(path.resolve("./assets/earthmap.jpeg"));
  let earth_surface = new Lambertian(earth_texture);
  objects.add(new Sphere(new Point3(0, 0, 0), 2, earth_surface));

  return objects;
}

function simple_light() {
  let objects = new HittableList();

  let pertext = new NoiseTexture(4);
  objects.add(
    new Sphere(new Point3(0, -1000, 0), 1000, new Lambertian(pertext))
  );
  objects.add(new Sphere(new Point3(0, 2, 0), 2, new Lambertian(pertext)));

  let difflight = new DiffuseLight(new Color(4, 4, 4));
  objects.add(new Sphere(new Point3(0, 7, 0), 2, difflight));
  objects.add(new XyRect(3, 5, 1, 3, -2, difflight));

  return objects;
}

function cornell_box() {
  let objects = new HittableList();

  const red = new Lambertian(new Color(0.65, 0.05, 0.05));
  const white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const green = new Lambertian(new Color(0.12, 0.45, 0.15));
  const light = new DiffuseLight(new Color(15, 15, 15));

  objects.add(new YzRect(0, 555, 0, 555, 555, green));
  objects.add(new YzRect(0, 555, 0, 555, 0, red));
  objects.add(new XzRect(213, 343, 227, 332, 554, light));
  objects.add(new XzRect(0, 555, 0, 555, 0, white));
  objects.add(new XzRect(0, 555, 0, 555, 555, white));
  objects.add(new XyRect(0, 555, 0, 555, 555, white));

  // objects.add(
  //   new Box(new Point3(130, 0, 65), new Point3(295, 165, 230), white)
  // );
  // objects.add(
  //   new Box(new Point3(265, 0, 295), new Point3(430, 330, 460), white)
  // );

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

function cornell_smoke() {
  let objects = new HittableList();

  const red = new Lambertian(new Color(0.65, 0.05, 0.05));
  const white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const green = new Lambertian(new Color(0.12, 0.45, 0.15));
  const light = new DiffuseLight(new Color(7, 7, 7));

  objects.add(new YzRect(0, 555, 0, 555, 555, green));
  objects.add(new YzRect(0, 555, 0, 555, 0, red));
  objects.add(new XzRect(113, 443, 127, 432, 554, light));
  objects.add(new XzRect(0, 555, 0, 555, 555, white));
  objects.add(new XzRect(0, 555, 0, 555, 0, white));
  objects.add(new XyRect(0, 555, 0, 555, 555, white));

  let box1 = new Box(new Point3(0, 0, 0), new Point3(165, 330, 165), white);
  let rbox1 = new RotateY(box1, 30);
  let tbox1 = new Translate(rbox1, new Vector3(265, 0, 295));
  // objects.add(tbox1);

  let box2 = new Box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
  let rbox2 = new RotateY(box2, -38);
  let tbox2 = new Translate(rbox2, new Vector3(130, 0, 65));
  // objects.add(tbox2);

  objects.add(new ConstantMedium(tbox1, 0.01, new Color(0, 0, 0)));
  objects.add(new ConstantMedium(tbox2, 0.01, new Color(1, 1, 1)));

  return objects;
}

function final_scene() {
  const boxes1 = new HittableList();
  const ground = new Lambertian(new Color(0.48, 0.83, 0.53));

  const boxes_per_side = 20;
  for (let i = 0; i < boxes_per_side; i++) {
    for (let j = 0; j < boxes_per_side; j++) {
      let w = 100.0;
      let x0 = -1000.0 + i * w;
      let z0 = -1000.0 + j * w;
      let y0 = 0.0;
      let x1 = x0 + w;
      let y1 = random_double(1, 101);
      let z1 = z0 + w;

      boxes1.add(
        new Box(new Point3(x0, y0, z0), new Point3(x1, y1, z1), ground)
      );
    }
  }

  const objects = new HittableList();

  objects.add(new BvhNode(boxes1, 0, 1));

  let light = new DiffuseLight(new Color(7, 7, 7));
  objects.add(new XzRect(123, 423, 147, 412, 554, light));

  let center1 = new Point3(400, 400, 200);
  let center2 = center1.clone().add(new Vector3(30, 0, 0));
  let moving_sphere_material = new Lambertian(new Color(0.7, 0.3, 0.1));
  objects.add(
    new MoveSphere(center1, center2, 0, 1, 50, moving_sphere_material)
  );

  objects.add(new Sphere(new Point3(260, 150, 45), 50, new Dielectric(1.5)));
  objects.add(
    new Sphere(
      new Point3(0, 150, 145),
      50,
      new Metal(new Color(0.8, 0.8, 0.9), 1.0)
    )
  );

  let boundary = new Sphere(new Point3(360, 150, 145), 70, new Dielectric(1.5));
  objects.add(boundary);
  objects.add(new ConstantMedium(boundary, 0.2, new Color(0.2, 0.4, 0.9)));
  boundary = new Sphere(new Point3(0, 0, 0), 5000, new Dielectric(1.5));
  objects.add(new ConstantMedium(boundary, 0.0001, new Color(1, 1, 1)));

  let emat = new Lambertian(
    new ImageTexture(path.resolve("./assets/earthmap.jpeg"))
  );
  objects.add(new Sphere(new Point3(400, 200, 400), 100, emat));
  let pertext = new NoiseTexture(0.1);
  objects.add(
    new Sphere(new Point3(220, 280, 300), 80, new Lambertian(pertext))
  );

  const boxes2 = new HittableList();
  let white = new Lambertian(new Color(0.73, 0.73, 0.73));
  const ns = 1000;
  for (let j = 0; j < ns; j++) {
    boxes2.add(new Sphere(Point3.random(0, 165), 10, white));
  }

  objects.add(
    new Translate(
      new RotateY(new BvhNode(boxes2, 0.0, 1.0), 15),
      new Vector3(-100, 270, 395)
    )
  );

  return objects;
}
