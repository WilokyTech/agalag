import { Vector2 } from "../vector.js";

export class Velocity {
  /**
   * Construct a component that stores the speed and travel direction of an entity.
   * If an entity has a path, the direction component will be ignored when position
   * is updated as the path will dictate the direction. 
   * 
   * @param {number} speed 
   * @param {Vector2} [direction]
   */
  constructor(speed, direction = Vector2.zero) {
    this.direction = direction.normalize();
    this.speed = speed;
  }
}