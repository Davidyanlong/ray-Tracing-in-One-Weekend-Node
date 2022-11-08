import Texture from "./utils/Texture";
import Color from "./utils/Color";
import Vector3 from "./utils/Vector3";
// import Path from "path";
// import { writePPM ,write_color} from "./utils/ppm";

import * as Image from "node-images";
import { clamp, floor } from "./utils/Constant";

export default class ImageTexture extends Texture {
  bytes_per_pixel: number = 4;
  private data: any | null = null;
  private width: number = 0;
  private height: number = 0;
  private bytes_per_scanline: number = 0;
  constructor(filename?: string) {
    super();
    if (filename !== undefined) {
      let components_per_pixel = this.bytes_per_pixel;

      const img = Image.loadFromFile(filename);
      this.width = img.width();
      this.height = img.height();
      this.data = img.toBuffer("raw");
      //   console.log(this.data)
      //   let str = `P3\n ${this.width} ${this.height} \n255\n`;
      //   for (let j = 0; j <this.height; ++j) {
      //     for (let i = 0; i < this.width; ++i) {
      //       let r = this.data[j*this.width * 4 + i*4]
      //       let g = this.data[j*this.width * 4 + i*4+1]
      //       let b = this.data[j*this.width * 4 + i*4+2]
      //       let pixel_color = new Color(r/255,g/255,b/255);
      //       str += write_color(pixel_color, 1);
      //     }
      //   }
      //   writePPM(str);
      // this.data = stbi_load(
      //     filename, &width, &height, &components_per_pixel, components_per_pixel);

      if (!this.data) {
        console.log(`ERROR: Could not load texture image file ${filename}`);
        this.width = this.height = 0;
      }

      this.bytes_per_scanline = this.bytes_per_pixel * this.width;
    }
  }
  value(u: number, v: number, p: Vector3): Color {
    // If we have no texture data, then return solid cyan as a debugging aid.
    if (this.data === null) return new Color(0, 1, 1);

    // Clamp input texture coordinates to [0,1] x [1,0]
    u = clamp(u, 0.0, 1.0);
    v = 1.0 - clamp(v, 0.0, 1.0); // Flip V to image coordinates

    let i = floor(u * this.width);
    let j = floor(v * this.height);

    // Clamp integer mapping, since actual coordinates should be less than 1.0
    if (i >= this.width) i = this.width - 1;
    if (j >= this.height) j = this.height - 1;

    const color_scale = 1.0 / 255.0;
    let r = this.data[j * this.bytes_per_scanline + i * this.bytes_per_pixel];
    let g =
      this.data[j * this.bytes_per_scanline + i * this.bytes_per_pixel + 1];
    let b =
      this.data[j * this.bytes_per_scanline + i * this.bytes_per_pixel + 2];
    // console.log(i,j,r,g,b);
    return new Color(color_scale * r, color_scale * g, color_scale * b);
  }
}

// let test = new ImageTexture(Path.resolve("./assets/earthmap.jpeg"));
