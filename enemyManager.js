import { Enemy } from './entities/enemy.js';
import { GameManager } from './gameManager.js';
import { lerp } from './mathFuncs.js';
import { Vector2 } from './vector.js';

const enemyLayout = [
  '...xxxx...', 
  '.xxxxxxxx.',
  '.xxxxxxxx.',
  'xxxxxxxxxx',
  'xxxxxxxxxx'
]; // Describes the enemy formation layout where 'x' represents an enemy and '.' represents an empty space

// Formation location numbering scheme.
/*
    .  .  .  0  1  2  3  .  .  .
    .  4  5  6  7  8  9  10 11 .
    .  12 13 14 15 16 17 18 19 . 
    20 21 22 23 24 25 26 27 28 29
    30 31 32 33 34 35 36 37 38 39
 */

const FORMATION_MOVEMENT_TIME = 3000; // How long it takes for the formation to move between two positions
const ENEMY_SPRITE_SIZE = 64; // TODO: Get this from whatever constant defines the sprite size
const FORMATION_HORIZONTAL_MOVEMENT = ENEMY_SPRITE_SIZE * 4;

export class EnemyManager {
  constructor() {
    /** @type {Set<number>} */
    this.enemies = new Set();
    /** @type {Map<number, Vector2>} */
    this.baseFormationPositions = new Map();
    /** @type {Map<number, Vector2>} */
    this.destFormationPositions = new Map();
    /**_@type {Map<number, Vector2>} */
    this.spreadFormationPositions = new Map();
    
    this.elapsedMovementTime = 0;
    this.formationMovementTime = FORMATION_MOVEMENT_TIME; // How long it takes for the formation to move between two positions
    this.cyclesUntilFormationSwitch = Infinity;
  }
  
  spawnEnemies() {
    const positions = [];
    const spreadPositions = [];
    
    const gameWidthInSprites = Math.floor(GameManager.canvas.width / ENEMY_SPRITE_SIZE);
    const gapCount = enemyLayout[0].length - 1;
    const openSpace = (gameWidthInSprites - enemyLayout[0].length) * ENEMY_SPRITE_SIZE;
    const gapSize = Math.floor(openSpace / gapCount);
    const spreadPositionsStartX = (openSpace - gapSize * gapCount) / 2;
    
    const startYPosition = ENEMY_SPRITE_SIZE;

    for (let y = 0; y < enemyLayout.length; y++) {
      for (let x = 0; x < enemyLayout[y].length; x++) {
        if (enemyLayout[y][x] === 'x') {
          const spriteX = x * ENEMY_SPRITE_SIZE;
          const spriteY = y * ENEMY_SPRITE_SIZE;
          const spreadX = x * (ENEMY_SPRITE_SIZE + gapSize)
          const spreadY = y * (ENEMY_SPRITE_SIZE + gapSize);

          positions.push(new Vector2(spriteX, spriteY + startYPosition));
          spreadPositions.push(new Vector2(
            spreadPositionsStartX + spreadX,
            startYPosition + spreadY
          ));
        }
      }
    }
    
    const deregisterEnemy = (entityId) => {
      this.enemies.delete(entityId);
      this.baseFormationPositions.delete(entityId);
      this.destFormationPositions.delete(entityId);
      this.spreadFormationPositions.delete(entityId);
    };
    
    const gameManager = GameManager.getInstance();
    for (let i = 0; i < positions.length; i++) {
      const enemy = new Enemy(positions[i]);
      this.enemies.add(enemy.id);
      this.baseFormationPositions.set(enemy.id, positions[i]);
      this.destFormationPositions.set(enemy.id, positions[i].add(new Vector2(FORMATION_HORIZONTAL_MOVEMENT, 0)));
      this.spreadFormationPositions.set(enemy.id, spreadPositions[i]);
      enemy.once('destroyed', deregisterEnemy);
      gameManager.entities.addInitial(enemy);
      enemy.addCollisionBox(ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, false);
      // TODO: When this is not called on init, change this to a regular add
    }
  }
  
  /** 
   * When called, this will set the new destination formation positions to be the spread
   * formation and the current formation at the time of the call will be set to the base formation
   * position.
   */
  #switchToSpreadFormation() {
    const gameManager = GameManager.getInstance();
    for (let entityId of this.enemies) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(entityId);
      if (!enemy) {
        continue;
      }
      const newBasePosition = enemy.formationPosition;
      this.baseFormationPositions.set(entityId, newBasePosition);
    }
    
    this.destFormationPositions = this.spreadFormationPositions;
    this.elapsedMovementTime = 0;
    this.formationMovementTime = FORMATION_MOVEMENT_TIME;
  }
  
  /**
   * Initiates the transition to the center formation.
   */
  transitionToCenterFormation() {
    const movementCyclePercentage = this.elapsedMovementTime / this.formationMovementTime;
    this.formationMovementTime /= 2;
    const gameManager = GameManager.getInstance();
    
    /** @type {Map<number, Vector2>} */
    const centerPositions = new Map();
    for (let entityId of this.enemies) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(entityId);
      if (!enemy) {
        continue;
      }
      const centerPosition = lerp(this.baseFormationPositions.get(entityId), this.destFormationPositions.get(entityId), 0.5);
      if (movementCyclePercentage === 0.5) {
        // Snap to center position since we are there (give or take a little floating point error)
        enemy.formationPosition = centerPosition;
      } else {
        centerPositions.set(entityId, centerPosition);
      }
    }

    if (movementCyclePercentage > 0.5) {
      this.elapsedMovementTime -= this.formationMovementTime;
      this.baseFormationPositions = centerPositions;
      this.cyclesUntilFormationSwitch = 1;
    } else if (movementCyclePercentage < 0.5) {
      this.destFormationPositions = centerPositions;
      this.cyclesUntilFormationSwitch = 0;
    } else {
      // Activate next formation layout since we don't need
      // to wait for the enemies to move into the proper position.
      // They are alraedy there due to snapping done above.
      this.#switchToSpreadFormation();  
    }
  }

  /** @type {number} */
  update(elapsedTime) {
    const gameManager = GameManager.getInstance();
    
    // Reverse the direction of the formation every FORMATION_MOVEMENT_TIME
    this.elapsedMovementTime += elapsedTime;
    if (this.elapsedMovementTime >= this.formationMovementTime) {
      if (this.cyclesUntilFormationSwitch === 0) {
        this.#switchToSpreadFormation();
        this.cyclesUntilFormationSwitch = Infinity;
      } else {
        this.elapsedMovementTime -= this.formationMovementTime;
        const temp = this.baseFormationPositions;
        this.baseFormationPositions = this.destFormationPositions;
        this.destFormationPositions = temp;
        this.cyclesUntilFormationSwitch--;
      }
    }

    for (let entityId of this.enemies) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(entityId);
      if (!enemy) {
        continue;
      }
      
      const basePosition = this.baseFormationPositions.get(enemy.id);
      const destPosition = this.destFormationPositions.get(enemy.id);
      enemy.formationPosition = lerp(basePosition, destPosition, this.elapsedMovementTime / this.formationMovementTime);
    }
  }
}