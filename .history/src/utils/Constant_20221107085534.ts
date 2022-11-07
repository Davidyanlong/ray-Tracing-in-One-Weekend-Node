// Constants
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
