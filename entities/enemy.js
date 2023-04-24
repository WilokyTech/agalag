import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { Velocity } from "../components/velocity.js";
import { Path } from "../components/path.js";
import { Vector2 } from "../vector.js";

const ENEMY_SPEED = 0.00033;

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
    this.path = path;
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
        this.gameManager.entities.remove(this);
    }
}
}