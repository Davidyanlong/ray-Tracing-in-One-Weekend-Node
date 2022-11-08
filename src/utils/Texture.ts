import Color from "./Color";
import Vector3 from "./Vector3";

export default abstract class Texture {
  abstract value(u: number, v: number, p: Vector3): Color;
}
