import { CollisionBox } from "../components/collision.js";
import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { Path } from "../components/path.js";
import { Projectile } from "./projectile.js";
import { Velocity } from "../components/velocity.js";
import { Vector2 } from "../vector.js";
import { SoundFXManager } from "../SoundFXManager.js";
import { ParticleSystem } from "../particleSystem.js";
import { Assets } from "../assets.js";

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
   * @param {string} type
   * @param {Vector2} formationPosition
   * @param {Path} [path]
   */
  constructor(type, formationPosition, path = null) {
    super();
    this.transform.position = !path ? formationPosition : path.getCurrentPoint();
    /** 
     * This determines the enemy's position in the formation and is set by the enemy manager.
     * @type {Vector2}
     */
    this.formationPosition = formationPosition;
    /** @type {string} */
    this.type = type;
    this.path = path;
    this.velocity = new Velocity(ENEMY_SPEED * GameManager.canvas.height);
    this.animTimer = 0;
    this.previousPosition = this.transform.position;
  }
  
  get inFormation() {
    return !this.path;
  }
  
  launchAttackRun() {
    const gameManager = GameManager.getInstance();
    const player = gameManager.entities.get(gameManager.shipId);
    if (!player) return; // Nothing to attack

    // TODO: Implement actual attack run - This is just test code
    this.path = new Path(this, [
      new Vector2(this.transform.position.x, 512),
    ], [0]);
    this.path.on('trigger', this.fire.bind(this));
    this.path.on('end', this.determineNextAttackPoint.bind(this));
  }
  
  fire() {
    const gameManager = GameManager.getInstance();
    const player = gameManager.entities.get(gameManager.shipId);
    if (!player) return; // Nothing to fire at
    
    const projectileSpawnPoint = new Vector2(this.collisionBox.center.x, this.collisionBox.bottom + 16);
    const projectileDirection = player.collisionBox.center.subtract(projectileSpawnPoint).normalize();
    SoundFXManager.playLaserSFX();
    const projectile = new Projectile(projectileSpawnPoint.x, projectileSpawnPoint.y, projectileDirection.x, projectileDirection.y, false);
    projectile.addCollisionBox(16, 16, 16, 16, false);
    gameManager.entities.add(projectile);
  }
  
  determineNextAttackPoint() {
    const gameManager = GameManager.getInstance();
    const player = gameManager.entities.get(gameManager.shipId);
    if (!player) {
      const lastTwoPathPoints = this.path.getPreviousTwoValidPoints();
      if (!lastTwoPathPoints) {
        // We haven't gotten very far, so just return to formation
        this.returnToFormation();
      } else {
        // Continue down trajectory of last two points
        const [prevPoint, endpoint] = lastTwoPathPoints;
        const trajectory = endpoint.subtract(prevPoint).normalize();
        this.path.addPoint(trajectory.multiply(GameManager.canvas.height), false);
      }
    } else {
      const horizontalOffsetFromPlayer = player.transform.position.x - this.transform.position.x;
      const nextAttackPoint = this.transform.position.add(new Vector2(horizontalOffsetFromPlayer * Math.random(), 300));
      // Randomly flip the x coordinate of the next attack point
      if (Math.random() > 0.5) {
        nextAttackPoint.x = -nextAttackPoint.x * 0.3; // Reducing the inverted direction to avoid running away from player
      }
      this.path.addPoint(nextAttackPoint, Math.random() > 0.5);
    }
  }
  
  returnToFormation() {
    this.path = new Path(this, [this.transform.position, this.formationPosition]);
    this.#returningToFormation = true;
    this.path.once('end', () => {
      this.path = null;
      this.#returningToFormation = false;
    });
  }
  
  /** @param {number} elapsedTime */
  update(elapsedTime) {
    this.previousPosition = this.transform.position;

    super.update(elapsedTime);

    // If enemy doesn't have a path to follow, it is in formation and should move with the formation.
    if (!this.path) {
      this.transform.position = this.formationPosition;
    } else {
      // Check if we moved out of the screen. If so, wrap back up to the top of the screen and create a new path back to the formation
      if (
        this.transform.position.y > GameManager.canvas.height ||
        this.transform.position.x < -this.collisionBox.width ||
        this.transform.position.x > GameManager.canvas.width + this.collisionBox.width
      ) {
        this.transform.position.y = -this.collisionBox.width;
        this.returnToFormation();
      }
      
      // Keep the path destination in sync with the formation position
      if (this.#returningToFormation) {
        this.path.setDestination(this.formationPosition);
      }
    }
  }

  /** @type {Entity['render']} */
  render(ctx, elapsedTime) {
    if(Assets.assetsFinishedLoading && this.type){
      const num = this.animTimer <= 500 ? 1 : 2;
      const image = Assets.images[`${this.type}Cat${num}`].getImage();
      if(this.animTimer > 1000) this.animTimer = 0;
      this.animTimer += elapsedTime;

      let dirLeft = this.transform.position.x - this.previousPosition.x < 0;

      if(dirLeft){
        ctx.save();
        ctx.scale(-1, 1);
      }
      ctx.drawImage(image, dirLeft ? (this.transform.position.x * - 1) - 64 : this.transform.position.x, this.transform.position.y, 64, 64);
      if(dirLeft){
        ctx.restore();
      }
    }
    else{
        ctx.fillStyle = "magenta";
        ctx.fillRect(this.transform.position.x, this.transform.position.y, 64, 64);
    }
  }

  /** @type {Entity['onCollision']} */
  onCollision(collisionType) {
    if (collisionType === "enemyDeath") {
        GameManager.getInstance().entities.remove(this);
        ParticleSystem.enemyDeath(this);
        SoundFXManager.playExplosionSFX();
    }
  }

  addCollisionBox(graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly) {
    this.collisionBox = new CollisionBox(this, graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly);
  }
}