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
import Material from "./utils/Material";

// import Metal from "./Metal.js";
// import Dielectric from "./Dielectric.js";

function ray_color(r: Ray, world: Hitable, depth: number): Color {
  let rec: HitRecord = new HitRecord();

  // If we've exceeded the ray bounce limit, no more light is gathered.
  if (depth <= 0) return new Color(0, 0, 0);

  if (world.hit(r, 0.001, infinity, rec)) {
    let scattered = new Ray();
    let attenuation = new Color();
    if (rec.mat_ptr?.scatter(r, rec, attenuation, scattered))
      return attenuation
        .clone()
        .multiplyVector3(ray_color(scattered, world, depth - 1));
    return new Color(0, 0, 0);
  }

  let unit_direction = Vector3.normalize(r.direction);
  let t = 0.5 * (unit_direction.y + 1.0);

  return Vector3.add(
    new Color(1.0, 1.0, 1.0).multiply(1 - t),
    new Color(0.5, 0.7, 1.0).multiply(t)
  );
}

function random_scene() {
  let world = new HittableList();
  let material_ground = new Lambertian(new Color(0.8, 0.8, 0.0));
  world.add(new Sphere(new Point3(0.0, -100.5, -1.0), 100.0, material_ground));
//   for (let a = -11; a < 11; a++) {
//     for (let b = -11; b < 11; b++) {
//       let choose_mat = random_double();
//       let center = new Point3(
//         a + 0.9 * random_double(),
//         0.2,
//         b + 0.9 * random_double()
//       );
//       if (Vector3.sub(center, new Vector3(4, 0.2, 0)).length() > 0.9) {
//         let sphere_material;
//         if (choose_mat < 0.8) {
//           // diffuse
//           let albedo = Vector3.multiplyVector3(Color.random(), Color.random());
//           sphere_material = new Lambertian(albedo);
//         }
//         //   else if (choose_mat < 0.95) {
//         //           // metal
//         //           let albedo = Color.random(0.5, 1);
//         //           let fuzz = random_double(0, 0.5);
//         //           sphere_material = MakeShared(new Metal(albedo, fuzz));
//         //         } else {
//         //           sphere_material = MakeShared(new Dielectric(1.5));
//         //   }
//         world.add(new Sphere(center, 0.2, sphere_material as Material));
//       }
//     }
//   }

  //   let material1 = MakeShared(new Dielectric(1.5));
  //   world.add(MakeShared(new Sphere(new Point3(0.0, 1, 0), 1.0, material1)));
  let material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
  world.add(new Sphere(new Point3(0, 0, -1), 0.5, material2));

  //   let material3 = MakeShared(new Metal(new Color(0.7, 0.6, 0.5), 0.0));
  //   world.add(MakeShared(new Sphere(new Point3(4, 1, 0), 1.0, material3)));
  return world;
}

function main() {
  // Images
  const aspect_ratio = 16.0 / 9.0;
  const image_width = 400;
  const image_height = image_width / aspect_ratio;
  const samples_per_pixel = 100;
  const max_depth = 50;

  // World
  let world = random_scene();

  // Camera
  const lookfrom = new Point3(0, 0, 0);
  const lookat = new Point3(0, 0, -1);
  const vup = new Vector3(0, 1, 0);
  const dist_to_focus = 1;
  const aperture = 0;
  const cam = new Camera(
    lookfrom,
    lookat,
    vup,
    75,
    aspect_ratio,
    aperture,
    dist_to_focus
  );

  // Render
  let str = `P3\n ${image_width} ${image_height} \n255\n`;
  // std::cout << "P3\n" << image_width << ' ' << image_height << "\n255\n";

  for (let j = image_height - 1; j >= 0; --j) {
    for (let i = 0; i < image_width; ++i) {
      let pixel_color = new Color(0, 0, 0);
      for (let s = 0; s < samples_per_pixel; ++s) {
        let u = (i + random_double()) / (image_width - 1);
        let v = (j + random_double()) / (image_height - 1);
        let r = cam.get_ray(u, v);
        pixel_color.add(ray_color(r, world, max_depth));
      }
      str += write_color(pixel_color, samples_per_pixel); //取平均值
    }
  }
  writePPM(str);
}
console.time("耗时");
main();
console.timeEnd("耗时");
