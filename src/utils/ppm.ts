import Color from "./Color";
import { abs, clamp, infinity, sqrt } from "./Constant";

import fs from "fs";
import path from "path";

/**
 * 将颜色值转化为字符串
 * @param pixel_color 像素颜色值
 * @param samples_per_pixel // 采样次数
 * @returns
 */
export function write_color(pixel_color: Color, samples_per_pixel: number) {
  let r = pixel_color.x;
  let g = pixel_color.y;
  let b = pixel_color.z;

  if (r !== r || abs(r)===infinity) r = 0.0;
  if (g !== g || abs(g)===infinity) g = 0.0;
  if (b !== b || abs(b)===infinity) b = 0.0;

  //根据样本数对颜色取平均值
  // Divide the color by the number of samples and gamma-correct for gamma=2.0.
  let scale = 1.0 / samples_per_pixel;
  r = sqrt(r * scale);
  g = sqrt(g * scale);
  b = sqrt(b * scale);

  r = Math.floor(256 * clamp(r, 0.0, 0.999));
  g = Math.floor(256 * clamp(g, 0.0, 0.999));
  b = Math.floor(256 * clamp(b, 0.0, 0.999));
  return `${r} ${g}  ${b}\n`;
}

/**
 * 判断文件路径是否存在，不存在就创建
 * @param filepath 文件路径
 * @returns
 */
function mkdirp(filepath: string) {
  var dirname = path.dirname(filepath);

  if (!fs.existsSync(dirname)) {
    mkdirp(dirname);
  } else {
    return;
  }

  fs.mkdirSync(filepath);
}

/**
 * 将PPM格式的数据写入文件
 * @param str PPM格式的数据
 * @param fileName 文件名
 * @returns
 */
export function writePPM(
  str: string,
  fileName: string = `${new Date().getTime()}.ppm`
) {
  return new Promise((resolve, reject) => {
    mkdirp("./ppm/");
    fs.writeFile(`./ppm/${fileName}`, str, (err) => {
      if (err) {
        reject(new Error(err.message));
      }
      console.log("ok");
      resolve(null);
    });
  });
}
