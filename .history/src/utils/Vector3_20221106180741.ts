import { random_double, PI, sqrt, cos, sin } from "./Constant";
export default class Vector3 {
  element = [0, 0, 0];
  constructor(x?:number, y?:number, z?:number) {
    if (arguments.length > 0) {
      this.set(x, y, z);
    }
  }
  set(x:Vector3|number, y:number, z:number) {
    if (x instanceof Vector3) {
      let vec3 = x;
      this.element = [vec3.x, vec3.y, vec3.z];
    } else {
      this.element = [x, y, z];
    }

    return this;
  }
  get x() {
    return this.element[0];
  }
  set x(v) {
    this.element[0] = v;
  }
  get y() {
    return this.element[1];
  }
  set y(v) {
    this.element[1] = v;
  }
  get z() {
    return this.element[2];
  }
  set z(v) {
    this.element[2] = v;
  }
  normalize() {
    let len = this.length();
    this.x /= len;
    this.y /= len;
    this.z /= len;
    return this;
  }
  length() {
    return Math.sqrt(this.length_squared());
  }
  length_squared() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return x * x + y * y + z * z;
  }
  add(vec3) {
    this.x += vec3.x;
    this.y += vec3.y;
    this.z += vec3.z;
    return this;
  }
  multiply(t) {
    this.x *= t;
    this.y *= t;
    this.z *= t;
    return this;
  }
  multiplyVector3(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }
  near_zero() {
    // Return true if the vector is close to zero in all dimensions.
    const s = 1e-8;
    const fabs = Math.abs;
    return fabs(this.x) < s && fabs(this.y) < s && fabs(this.z) < s;
  }
  static dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }
  static cross(u, v) {
    let result = new Vector3();
    result.x = u.y * v.z - u.z * v.y;
    result.y = u.z * v.x - u.x * v.z;
    result.z = u.x * v.y - u.y * v.x;
    return result;
  }
  clone() {
    return new this.constructor().set(this);
  }
  static sub(v1, v2) {
    let result = v1.clone();
    let _v2 = v2.clone();
    _v2.multiply(-1);
    return result.add(_v2);
  }
  static add(v1, v2) {
    let result = v1.clone();
    result.add(v2);
    return result;
  }
  static random(min, max) {
    if (Array.from(arguments).length === 0) {
      return new Vector3(random_double(), random_double(), random_double());
    }
    return new Vector3(
      random_double(min, max),
      random_double(min, max),
      random_double(min, max)
    );
  }
  static random_in_unit_sphere() {
    while (true) {
      let p = Vector3.random(-1, 1);
      if (p.length_squared() >= 1) continue;
      return p;
    }
  }
  static random_unit_vector() {
    let a = random_double(0, 2 * pi);
    let z = random_double(-1, 1);
    let r = sqrt(1 - z * z);
    return new Vector3(r * cos(a), r * sin(a), z);
  }
  static random_in_hemisphere(normal) {
    let in_unit_sphere = Vector3.random_in_unit_sphere();
    if (Vector3.dot(in_unit_sphere, normal) > 0.0)
      // In the same hemisphere as the normal
      return in_unit_sphere;
    else return in_unit_sphere.multiply(-1);
  }
  static reflect(v, n) {
    let dot = Vector3.dot(v, n);
    let nn = n.clone().multiply(dot * 2);
    return Vector3.sub(v, nn);
  }
  static normalize(v) {
    let result = v.clone();
    return result.normalize();
  }
  static multiplyVector3(v1, v2) {
    const result = v1.clone();
    result.multiplyVector3(v2);
    return result;
  }
  /**
   *
   * @param {*} uv  入射光线
   * @param {*} n  发现
   * @param {*} etai_over_etat 反射系数
   * @returns
   */
  static refract(uv, n, etai_over_etat) {
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
  static random_in_unit_disk() {
    while (true) {
      const p = new Vector3(random_double(-1, 1), random_double(-1, 1), 0);
      if (p.length_squared() >= 1) continue;
      return p;
    }
  }
}
