import { Entity } from '../entity.js';
import { Vector2 } from '../vector.js';

/**
 * Component that stores the position and orientation of an entity.
 */
export class Transform {
  /** @param {Entity} entity */
  constructor(entity) {
    this.entity = entity;
    this.position = new Vector2(0, 0);
    this.flipped = false;
  }
  
  /** @param {number} elapsedTime */
  update(elapsedTime) {
    if (this.entity.velocity) {
      this.position = this.position.add(this.entity.velocity.direction.multiply(this.entity.velocity.speed * elapsedTime));
    }
  }
}