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
  #returningToFormation = false;

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
  
  launchAttackRun() {
    const gameManager = GameManager.getInstance();
    const player = gameManager.entities.get(gameManager.shipId);
    if (!player) return; // Nothing to attack

    // TODO: Implement actual attack run - This is just test code
    this.path = new Path(this, [
      this.transform.position.add(new Vector2(0, 100)),
      this.transform.position.add(new Vector2(-64, 200)),
      player.transform.position.add(new Vector2(0, 100)),
    ]);
  }
  
  /** @param {number} elapsedTime */
  update(elapsedTime) {
    super.update(elapsedTime);

    // If enemy doesn't have a path to follow, it is in formation and should move with the formation.
    if (!this.path) {
      this.transform.position = this.formationPosition;
    } else {
      // Check if we moved out of bottom of the screen. If so, wrap back up to the top of the screen and create a new path back to the formation
      if (this.transform.position.y > GameManager.canvas.height) {
        this.transform.position.y = -this.collisionBox.width;
        this.path = new Path(this, [this.transform.position, this.formationPosition]);
        this.#returningToFormation = true;
        this.path.once('pathEnd', () => {
          this.path = null;
          this.#returningToFormation = false;
        });
      }
      
      // Keep the path destination in sync with the formation position
      if (this.#returningToFormation) {
        this.path.setDestination(this.formationPosition);
      }
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