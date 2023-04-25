import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { Velocity } from "../components/velocity.js";
import { Path } from "../components/path.js";
import { Vector2 } from "../vector.js";
import { CollisionBox } from "../components/collision.js";

/**
 * Enemy speed is defined as the percentage of the total vertical height of the game area.
 * It's defined as a percentage of the game height since I found that easier to time.
 */
const ENEMY_SPEED = 0.00033;

export const EnemyType = {
  BEE: 'bee',
  BUTTERFLY: 'butterfly',
  WING: 'wing',
};

export class Enemy extends Entity {
  /**
   * @param {Vector2} formationPosition 
   * @param {Path} path 
   */
  constructor(formationPosition, path) {
    super();
    this.transform.position = !path ? formationPosition : path.getNextPoint();
    /** 
     * This determines the enemy's position in the formation and is set by the enemy manager.
     * @type {Vector2}
     */
    this.formationPosition = formationPosition;
    /** @type {string} */
    this.type = undefined;
    this.path = path;
    this.velocity = new Velocity(ENEMY_SPEED * GameManager.canvas.height);
  }
  
  /** @param {number} elapsedTime */
  update(elapsedTime) {
    super.update(elapsedTime);

    // If enemy doesn't have a path to follow, it is in formation and should move with the formation.
    if (!this.path) {
      this.transform.position = this.formationPosition;
    }
  }

  /** @type {Entity['onCollision']} */
  onCollision(collisionType) {
    if (collisionType === "enemyDeath") {
        GameManager.getInstance().entities.remove(this);
    }
  }

  addCollisionBox(graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly) {
    this.collisionBox = new CollisionBox(this, graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly);
  }
}