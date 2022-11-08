import { random_double, PI, sqrt, cos, sin, fabs } from "./Constant";
/**
 * 三维矢量类
 */
export default class Vector3 {
  private element = new Float32Array([0, 0, 0]);
  /**
   * 初始化 x y z
   * @param x x x可以是一个三维向量，也可以是一个值
   * @param y y
   * @param z z
   */
  constructor(x?: Vector3 | number, y?: number, z?: number) {
    if (x !== undefined) {
      this.set(x, y, z);
    }
  }
  /**
   *  给向量设置值
   * @param x x可以是一个三维向量，也可以是一个值
   * @param y
   * @param z
   * @returns
   */
  set(x: Vector3 | number, y?: number, z?: number) {
    if (x instanceof Vector3) {
      let vec3 = x;
      this.element = new Float32Array([vec3.x, vec3.y, vec3.z]);
    } else if (y !== undefined && z !== undefined) {
      this.element = new Float32Array([x, y, z]);
    } else {
      console.error(`vector3.set() param is error, x:${x} y:${y} z:${z}`);
    }

    return this;
  }
  /**
   * 根据所有返回值
   * @param idx 索引
   * @returns
   */
  get(idx: number) {
    return this.element[idx];
  }
  // 返回向量x值
  get x() {
    return this.element[0];
  }
  // 设置向量x值
  set x(v) {
    this.element[0] = v;
  }
  // 返回向量y值
  get y() {
    return this.element[1];
  }
  // 设置向量y值
  set y(v) {
    this.element[1] = v;
  }
  // 返回向量z值
  get z() {
    return this.element[2];
  }
  // 设置向量z值
  set z(v) {
    this.element[2] = v;
  }
  // 向量归一化
  normalize() {
    let len = this.length();
    this.x /= len;
    this.y /= len;
    this.z /= len;
    return this;
  }
  // 计算向量的长度
  length() {
    return Math.sqrt(this.length_squared());
  }
  // 计算向量平方和
  length_squared() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return x * x + y * y + z * z;
  }
  // 向量加
  add(vec3: Vector3) {
    this.x += vec3.x;
    this.y += vec3.y;
    this.z += vec3.z;
    return this;
  }
  // 向量减
  sub(vec3: Vector3) {
    this.x -= vec3.x;
    this.y -= vec3.y;
    this.z -= vec3.z;
    return this;
  }
  // 向量乘
  multiply(t: number) {
    this.x *= t;
    this.y *= t;
    this.z *= t;
    return this;
  }
  // 向量乘以向量
  multiplyVector3(vec3: Vector3) {
    this.x *= vec3.x;
    this.y *= vec3.y;
    this.z *= vec3.z;
    return this;
  }
  // 是否为零向量
  near_zero() {
    // Return true if the vector is close to zero in all dimensions.
    const s = 1e-8;
    const fabs = Math.abs;
    return fabs(this.x) < s && fabs(this.y) < s && fabs(this.z) < s;
  }
  // 向量点积
  dot(v: Vector3) {
    return Vector3.dot(this, v);
  }
  // 向量叉积
  cross(v: Vector3) {
    return Vector3.cross(this, v);
  }
  // 静态方法，向量点积
  static dot(u: Vector3, v: Vector3) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }
  // 静态方法向量叉积
  static cross(u: Vector3, v: Vector3) {
    let result = new Vector3();
    result.x = u.y * v.z - u.z * v.y;
    result.y = u.z * v.x - u.x * v.z;
    result.z = u.x * v.y - u.y * v.x;
    return result;
  }
  // 向量克隆
  clone() {
    let fn = this.constructor as typeof Vector3;
    return new fn().set(this);
  }
  // 静态方法，向量减法
  static sub(v1: Vector3, v2: Vector3) {
    let result = v1.clone();
    let _v2 = v2.clone();
    _v2.multiply(-1);
    return result.add(_v2);
  }
  // 静态方法，向量求和
  static add(v1: Vector3, v2: Vector3) {
    let result = v1.clone();
    result.add(v2);
    return result;
  }
  // 静态方法，生产一个随机向量
  static random(min?: number, max?: number) {
    if (arguments.length === 0) {
      return new Vector3(random_double(), random_double(), random_double());
    }
    return new Vector3(
      random_double(min, max),
      random_double(min, max),
      random_double(min, max)
    );
  }
  // 静态方法， 在单位球的范围内，生产随机向量
  static random_in_unit_sphere() {
    while (true) {
      let p = Vector3.random(-1, 1);
      if (p.length_squared() >= 1) continue;
      return p;
    }
  }
  // 静态方法，单位球随机
  static random_unit_vector() {
    let a = random_double(0, 2 * PI);
    let z = random_double(-1, 1);
    let r = sqrt(1 - z * z);
    return new Vector3(r * cos(a), r * sin(a), z);
  }
  // 静态方法， 半球随机
  static random_in_hemisphere(normal: Vector3) {
    let in_unit_sphere = Vector3.random_in_unit_sphere();
    if (Vector3.dot(in_unit_sphere, normal) > 0.0)
      // In the same hemisphere as the normal
      return in_unit_sphere;
    else return in_unit_sphere.multiply(-1);
  }
  // 静态方法，反射
  static reflect(v: Vector3, n: Vector3) {
    let dot = Vector3.dot(v, n);
    let nn = n.clone().multiply(dot * 2);
    return Vector3.sub(v, nn);
  }
  // 静态方法 单位化
  static normalize(v: Vector3) {
    let result = v.clone();
    return result.normalize();
  }
  static multiply(v1: Vector3, n: number) {
    let result = v1.clone();
    result.multiply(n);
    return result;
  }
  // 静态方法，向量乘以向量
  static multiplyVector3(v1: Vector3, v2: Vector3) {
    const result = v1.clone();
    result.multiplyVector3(v2);
    return result;
  }
  /**
   * 静态方法 光线的折射
   * @param {*} uv  入射光线
   * @param {*} n  发现
   * @param {*} etai_over_etat 反射系数
   * @returns
   */
  static refract(uv: Vector3, n: Vector3, etai_over_etat: number) {
    // auto cos_theta = dot(-uv, n);
    let _uv = uv.clone();
    _uv.multiply(-1);
    let cos_theta = Vector3.dot(_uv, n);
    // vec3 r_out_perp = etai_over_etat * (uv + cos_theta * n);
    let _n = n.clone();
    _n.multiply(cos_theta);
    let sum = Vector3.add(uv, _n);
    const r_out_perp = sum.multiply(etai_over_etat);
    // vec3 r_out_parallel = -sqrt(fabs(1.0 - r_out_perp.length_squared())) * n;
    let _squard = r_out_perp.length_squared();
    let fab = Math.abs(1 - _squard);
    let sq = sqrt(fab) * -1;
    _n = n.clone();
    const r_out_parallel = _n.multiply(sq);
    // return r_out_perp + r_out_parallel;

    return Vector3.add(r_out_perp, r_out_parallel);
  }
  // 静态方法 生成[-1,1]的向量
  static random_in_unit_disk() {
    while (true) {
      const p = new Vector3(random_double(-1, 1), random_double(-1, 1), 0);
      if (p.length_squared() >= 1) continue;
      return p;
    }
  }
}
