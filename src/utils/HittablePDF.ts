import Hitable from "./Hitable";
import PDF from "./PDF";
import Point3 from "./Point3";
import Vector3 from "./Vector3";

export default class HittablePDF extends PDF {
  o: Point3;
  ptr: Hitable;
  constructor(p: Hitable, origin: Point3) {
    super();
    this.ptr = p;
    this.o = origin;
  }
  value(direction: Vector3) {
    return this.ptr.pdf_value(this.o, direction);
  }

  generate() {
    return this.ptr.random(this.o);
  }
}
