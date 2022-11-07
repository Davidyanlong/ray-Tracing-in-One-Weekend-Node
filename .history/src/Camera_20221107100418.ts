import Point3 from "./utils/Point3";
import Vector3 from "./utils/Vector3";
import { degrees_to_radians, tan, random_double } from "./utils/Constant";
import Ray from "./utils/Ray";

/**
 * 相机类
 */
export default class Camera {
  private origin: Point3 = new Point3(0, 0, -1); 
  private lower_left_corner: Point3 = new Point3();
  private horizontal: Vector3 = new Vector3();
  private vertical: Vector3 = new Vector3();
  private u: Vector3 = new Vector3();
  private v: Vector3 = new Vector3();
  private w: Vector3 = new Vector3();
  private lens_radius: number = 0;
  private time0: number = 0;
  private time1: number = 0;
  /**
   * 
   * @param lookfrom 相机位置
   * @param lookat 相机看向的点
   * @param vup 相机向上的方向
   * @param vfov 相机视口大小
   * @param aspect_ratio 屏幕宽高比
   * @param aperture // 光圈
   * @param focus_dist // 焦距
   * @param _time0 // 预留
   * @param _time1  // 预留
   */
  constructor(
    lookfrom: Point3,
    lookat: Point3,
    vup: Vector3,
    vfov: number, // vertical field-of-view in degrees
    aspect_ratio: number,
    aperture: number,
    focus_dist: number,
    _time0 = 0,
    _time1 = 0
  ) {
    if (arguments.length === 0) {
      this.set(
        new Point3(0, 0, -1),
        new Point3(0, 0, 0),
        new Vector3(0, 1, 0),
        40,
        1,
        0,
        10
      );
    }
    this.set(
      lookfrom,
      lookat,
      vup,
      vfov,
      aspect_ratio,
      aperture,
      focus_dist,
      _time0,
      _time1
    );
  }
  private set(
    lookfrom: Point3,
    lookat: Point3,
    vup: Vector3,
    vfov: number, // vertical field-of-view in degrees
    aspect_ratio: number,
    aperture: number,
    focus_dist: number,
    _time0 = 0,
    _time1 = 0
  ) {
    let theta = degrees_to_radians(vfov);
    let h = tan(theta / 2);
    let viewport_height = 2.0 * h;
    let viewport_width = aspect_ratio * viewport_height;

    this.w = Vector3.sub(lookfrom, lookat);
    this.u = Vector3.normalize(Vector3.cross(vup, this.w));
    this.v = Vector3.cross(this.w, this.u);

    this.origin = lookfrom;
    this.horizontal = this.u.clone().multiply(focus_dist * viewport_width);
    this.vertical = this.v.clone().multiply(focus_dist * viewport_height);
    let h2 = this.horizontal.clone().multiply(0.5);
    let v2 = this.vertical.clone().multiply(0.5);
    let ww = this.w.clone();
    this.lower_left_corner = Vector3.sub(this.origin, h2);
    this.lower_left_corner = Vector3.sub(this.lower_left_corner, v2);
    this.lower_left_corner = Vector3.sub(
      this.lower_left_corner,
      ww.multiply(focus_dist)
    );

    this.lens_radius = aperture / 2;
    this.time0 = _time0;
    this.time1 = _time1;
  }
  /**
   * 相机可以获得的采样光线
   * @param s y方向的偏移
   * @param t z方向的偏移
   * @returns 
   */
  get_ray(s: number, t: number) {
    let rd = Vector3.random_in_unit_disk().multiply(this.lens_radius);
    let ux = this.u.clone().multiply(rd.x);
    let vy = this.v.clone().multiply(rd.y);

    let offset = Vector3.add(ux, vy);
    let hs = this.horizontal.clone().multiply(s);
    let vt = this.vertical.clone().multiply(t);
    let dir = Vector3.add(this.lower_left_corner, hs);
    dir = Vector3.add(dir, vt);
    dir = Vector3.sub(dir, this.origin);
    dir = Vector3.sub(dir, offset);

    return new Ray(
      Vector3.add(this.origin, offset),
      dir,
      random_double(this.time0, this.time1)
    );
  }
}
