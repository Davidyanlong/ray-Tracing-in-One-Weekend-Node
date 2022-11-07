import Vector3 from "./Vector3";
import Point3 from "./Point3";

export default class Ray {
  private orig: Point3 = new Point3();
  private dir: Vector3 = new Vector3();
  private tm: number = 0;
  constructor(origin?: Point3, direction?: Vector3, time?: number) {
    if (origin instanceof Point3) {
      this.orig = origin;
    }
    if (direction instanceof Vector3) {
      this.dir = direction;
    }
    if (time !== undefined) {
      this.tm = time;
    }
  }
  get origin() {
    return this.orig;
  }
  get direction() {
    return this.dir;
  }
  get time() {
    return this.tm;
  }
  at(t: number) {
    let dir = this.dir.clone();
    dir.multiply(t);
    return this.orig.clone().add(dir);
  }
  set(origin: Point3, direction: Vector3, time?: number) {
    this.orig = origin.clone();
    this.dir = direction.clone();
    if (time) {
      this.tm = time;
    }
  }
}
