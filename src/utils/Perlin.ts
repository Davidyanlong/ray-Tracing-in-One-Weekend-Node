import { fabs, floor, random_double, random_int } from "./Constant";
import Point3 from "./Point3";
import Vector3 from "./Vector3";

export default class Perlin {
  private point_count = 256;
  private ranvec: Vector3[] = [];
  // private ranfloat: number[];
  private perm_x: number[];
  private perm_y: number[];
  private perm_z: number[];
  constructor() {
    this.ranvec = [];
    // this.ranfloat = new Array<number>(this.point_count);
    for (let i = 0; i < this.point_count; ++i) {
      // this.ranfloat[i] = random_double();
      this.ranvec[i] = Vector3.normalize(Vector3.random(-1, 1));
    }

    this.perm_x = this.perlin_generate_perm();
    this.perm_y = this.perlin_generate_perm();
    this.perm_z = this.perlin_generate_perm();
  }
  noise(p: Point3) {
    let u = p.x - floor(p.x);
    let v = p.y - floor(p.y);
    let w = p.z - floor(p.z);

    let i = floor(p.x);
    let j = floor(p.y);
    let k = floor(p.z);

    u = u * u * (3 - 2 * u);
    v = v * v * (3 - 2 * v);
    w = w * w * (3 - 2 * w);

    let c: Vector3[][][] = [
      [
        [new Vector3(), new Vector3()],
        [new Vector3(), new Vector3()],
      ],
      [
        [new Vector3(), new Vector3()],
        [new Vector3(), new Vector3()],
      ],
    ]; // [2][2][2]

    for (let di = 0; di < 2; di++)
      for (let dj = 0; dj < 2; dj++)
        for (let dk = 0; dk < 2; dk++)
          c[di][dj][dk] =
            this.ranvec[
              this.perm_x[(i + di) & 255] ^
                this.perm_y[(j + dj) & 255] ^
                this.perm_z[(k + dk) & 255]
            ];

    return this.trilinear_interp(c, u, v, w);

    // let i = Math.floor(4 * p.x) & 255;
    // let j = Math.floor(4 * p.y) & 255;
    // let k = Math.floor(4 * p.z) & 255;

    // return this.ranfloat[this.perm_x[i] ^ this.perm_y[j] ^ this.perm_z[k]];
  }
  // 使用三线性插值的 Perlin
  trilinear_interp(c: Vector3[][][], u: number, v: number, w: number) {
    let uu = u * u * (3 - 2 * u);
    let vv = v * v * (3 - 2 * v);
    let ww = w * w * (3 - 2 * w);
    let accum = 0.0;

    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++)
        for (let k = 0; k < 2; k++) {
          let weight_v = new Vector3(u - i, v - j, w - k);
          accum +=
            (i * uu + (1 - i) * (1 - uu)) *
            (j * vv + (1 - j) * (1 - vv)) *
            (k * ww + (1 - k) * (1 - ww)) *
            Vector3.dot(c[i][j][k], weight_v);
        }

    return accum;
    // let accum = 0.0;
    // for (let i = 0; i < 2; i++)
    //   for (let j = 0; j < 2; j++)
    //     for (let k = 0; k < 2; k++)
    //       accum +=
    //         (i * u + (1 - i) * (1 - u)) *
    //         (j * v + (1 - j) * (1 - v)) *
    //         (k * w + (1 - k) * (1 - w)) *
    //         c[i][j][k];

    // return accum;
  }
  // 湍流
  turb(p: Point3, depth = 7) {
    let accum = 0.0;
    let temp_p = p.clone();
    let weight = 1.0;

    for (let i = 0; i < depth; i++) {
      accum += weight * this.noise(temp_p);
      weight *= 0.5;
      temp_p.multiply(2);
    }

    return fabs(accum);
  }

  private perlin_generate_perm() {
    let p = new Array<number>(this.point_count);

    for (let i = 0; i < this.point_count; i++) p[i] = i;

    this.permute(p, this.point_count);

    return p;
  }
  private permute(p: number[], n: number) {
    for (let i = n - 1; i > 0; i--) {
      let target = random_int(0, i);
      let tmp = p[i];
      p[i] = p[target];
      p[target] = tmp;
    }
  }
}
