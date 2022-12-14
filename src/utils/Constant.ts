// Constants

import Vector3 from "./Vector3";

// 无群大
export const infinity = Number.MAX_VALUE;
// π
export const PI = 3.1415926535897932385;

// Utility Functions
// 度数到弧度
export function degrees_to_radians(degrees: number) {
  return (degrees * PI) / 180.0;
}

/**
 * 返回一个随机数
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function random_double(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return Math.random();
  }
  //[min,max)
  return min + (max - min) * Math.random();
}
export function random_int(min: number, max: number) {
  return Math.floor(random_double(min, max + 1));
}

export function random_cosine_direction() {
  let r1 = random_double();
  let r2 = random_double();
  let z = sqrt(1 - r2);

  let phi = 2 * PI * r1;
  let x = cos(phi) * sqrt(r2);
  let y = sin(phi) * sqrt(r2);

  return new Vector3(x, y, z);
}

/**
 * 返回一个在最小值与最大值范围内的值
 * @param x 输入的值
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function clamp(x: number, min: number, max: number) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

 export function random_to_sphere( radius:number,distance_squared:number) {
  let r1 = random_double();
  let r2 = random_double();
  let z = 1 + r2*(sqrt(1-radius*radius/distance_squared) - 1);

  let phi = 2*PI*r1;
  let x = cos(phi)*sqrt(1-z*z);
  let y = sin(phi)*sqrt(1-z*z);

  return new Vector3(x, y, z);

}

// 求平方根，这里是为了和C++代码对齐
export const sqrt = Math.sqrt;

// 求余弦
export const cos = Math.cos;

// 求正弦
export const sin = Math.sin;

// 求正切
export const tan = Math.tan;

// 求绝对值，与C++对齐
export const fabs = Math.abs;

// 求绝对值
export const abs = Math.abs;

// 求最小值
export const fmin = Math.min;

// 求最大值
export const fmax = Math.max;

// 求反余弦
export const acos = Math.acos

// 求反正切
export const atan2 = Math.atan2

// 向下取整
export const floor = Math.floor

// log
export const log = Math.log
