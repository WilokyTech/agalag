import { Vector2 } from "../vector.js";

export class CollisionBox {
    constructor(entity, graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly) {
        this.entity = entity;
        this.width = collisionWidth;
        this.height = collisionHeight;
        this.isFriendly = isFriendly;
        let centerx = entity.transform.position.x + (graphicsWidth / 2);
        let centery = entity.transform.position.y + (graphicsHeight / 2);
        this.offset = new Vector2(centerx, centery);
    }

    /**
     * 
     * @param {CollisionBox} other 
     * @returns Boolean (if the 2 collisionBoxes are colliding)
     */

    detectCollision(other){
        if (this.isFriendly == other.isFriendly) {
            return false;
        }
        // calculate the sides of the rectangles
        const left1 = this.entity.transform.position.x + this.offset.x - (this.width / 2);
        const top1 = this.entity.transform.position.y + this.offset.y - (this.height / 2);
        const right1 = this.entity.transform.position.x + this.offset.x + (this.width / 2);
        const bottom1 = this.entity.transform.position.y + this.offset.y + (this.height / 2);
        
        const left2 = other.entity.transform.position.x + other.offset.x - (other.width / 2);
        const top2 = other.entity.transform.position.y + other.offset.y - (other.height / 2);
        const right2 = other.entity.transform.position.x + other.offset.x + (other.width / 2);
        const bottom2 = other.entity.transform.position.y + other.offset.y + (other.height / 2);
      
        // check for intersection
        if (left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2) {
          // collision detected
          return true;
        }
      
        return false;
      }
}

export class Collision {
    constructor(entity1, entity2) {
        this.entity1 = entity1;
        this.entity2 = entity2;
    }
}