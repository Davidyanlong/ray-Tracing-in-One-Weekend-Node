import { random_double } from "./Constant";
import PDF from "./PDF";
import Vector3 from "./Vector3";

export default class MixturePDF extends PDF {
  p: PDF[] = new Array<PDF>(2);
  constructor(p0: PDF, p1: PDF) {
    super();
    this.p[0] = p0;
    this.p[1] = p1;
  }
  value(direction: Vector3) {
    return 0.5 * this.p[0].value(direction) + 0.5 * this.p[1].value(direction);
  }

  generate() {
    if (random_double() < 0.5) return this.p[0].generate();
    else return this.p[1].generate();
  }
}
