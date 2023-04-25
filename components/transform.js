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
    if (!this.entity.velocity) {
      return;
    }

    let distanceMoved = this.entity.velocity.speed * elapsedTime;

    if (this.entity.path) {
      let destinationPoint = this.entity.path.getCurrentPoint();
      if (destinationPoint) {
        const distanceToNextPoint = destinationPoint.subtract(this.position).magnitude();
        
        if (distanceMoved > distanceToNextPoint) {
          distanceMoved -= distanceToNextPoint;
          this.position = destinationPoint;
          this.entity.path.advance();
          destinationPoint = this.entity.path.getCurrentPoint();
        }
        
        if (destinationPoint) {
          const direction = destinationPoint.subtract(this.position).normalize();
          const displacement = direction.multiply(distanceMoved);
          this.position = this.position.add(displacement);
          
          // TODO: Handle orientation once we have sprites rendering
        }
      }
    } else if (this.entity.velocity.direction) {
      this.position = this.position.add(this.entity.velocity.direction.multiply(distanceMoved));
    }
  }
}