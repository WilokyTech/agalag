import { Vector2 } from '../vector.js';

/**
 * Component that stores the position and orientation of an entity.
 */
export class Transform {
  constructor() {
    this.position = new Vector2(0, 0);
    this.flipped = false;
  }
}