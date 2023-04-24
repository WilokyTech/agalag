import { Entity } from "../entity.js";
import { Vector2 } from "../vector.js";

export class CollisionBox {
    #centerOffset;

    constructor(entity, graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly) {
        /** @type {Entity} */
        this.entity = entity;
        this.width = collisionWidth;
        this.height = collisionHeight;
        this.isFriendly = isFriendly;
        let centerx = entity.transform.position.x + (graphicsWidth / 2);
        let centery = entity.transform.position.y + (graphicsHeight / 2);
        this.#centerOffset = new Vector2(centerx, centery).subtract(this.entity.transform.position);
    }

    get left() {
        return this.entity.transform.position.x + this.#centerOffset.x - (this.width / 2);
    }
    
    get top() {
        return this.entity.transform.position.y + this.#centerOffset.y - (this.height / 2);
    }

    get right() {
        return this.entity.transform.position.x + this.#centerOffset.x + (this.width / 2);
    }

    get bottom() {
        return this.entity.transform.position.y + this.#centerOffset.y + (this.height / 2);
    }
    
    /** @type {Vector2} */
    get center() {
        return this.entity.transform.position.add(this.#centerOffset);
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
        // TODO: Code de-duping: Use the getters for left, top, right, bottom
        const left1 = this.entity.transform.position.x + this.#centerOffset.x - (this.width / 2);
        const top1 = this.entity.transform.position.y + this.#centerOffset.y - (this.height / 2);
        const right1 = this.entity.transform.position.x + this.#centerOffset.x + (this.width / 2);
        const bottom1 = this.entity.transform.position.y + this.#centerOffset.y + (this.height / 2);
        
        const left2 = other.entity.transform.position.x + other.#centerOffset.x - (other.width / 2);
        const top2 = other.entity.transform.position.y + other.#centerOffset.y - (other.height / 2);
        const right2 = other.entity.transform.position.x + other.#centerOffset.x + (other.width / 2);
        const bottom2 = other.entity.transform.position.y + other.#centerOffset.y + (other.height / 2);
      
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