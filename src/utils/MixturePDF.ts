import { random_double } from "./Constant";
import PDF from "./PDF";
import Vector3 from "./Vector3";

export default class MixturePDF extends PDF {
  p: (PDF | null)[] = new Array<PDF | null>(2);
  constructor(p0: PDF, p1: PDF | null) {
    super();
    this.p[0] = p0;
    this.p[1] = p1;
  }
  value(direction: Vector3) {
    let p0 = this.p[0] === null ? 0.0000000001 : this.p[0].value(direction);
    let p1 = this.p[1] === null ? 0.0000000001 : this.p[1].value(direction);
    return 0.5 * p0 + 0.5 * p1;
  }

  generate() {
    if (random_double() < 0.5) {
      return this.p[0] === null ? new Vector3() : this.p[0].generate();
    } else {
      return this.p[1] === null ? new Vector3() : this.p[1].generate();
    }
  }
}
