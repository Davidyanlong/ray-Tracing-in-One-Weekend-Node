// Constants
export const infinity = Number.MAX_VALUE;
export const PI = 3.1415926535897932385;

// Utility Functions
// 度数到弧度
export function degrees_to_radians(degrees: number) {
  return (degrees * PI) / 180.0;
}

export function random_double(min?: number, max?: number) {
  if (min === undefined || max === undefined) {
    return Math.random();
  }
  //[min,max)
  return min + (max - min) * Math.random();
}

export function clamp(x: number, min: number, max: number) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

export const sqrt = Math.sqrt;

export const cos = Math.cos;

export const sin = Math.sin;

export const tan = Math.tan;

export const fabs = Math.abs;

export const abs = Math.abs;
