import { Vector2 } from "../vector.js";

export class Velocity {
  /**
   * @param {Vector2} direction 
   * @param {number} speed 
   */
  constructor(direction, speed) {
    this.direction = direction.normalize();
    this.speed = speed;
  }
}