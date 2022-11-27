import Vector3 from "./Vector3";

export default abstract class PDF {
  abstract value(direction: Vector3): number;
  abstract generate(): Vector3;
}
