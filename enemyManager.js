import { Enemy } from './entities/enemy.js';
import { GameManager } from './gameManager.js';
import { lerp } from './mathFuncs.js';
import { Vector2 } from './vector.js';
import { CollisionBox } from './components.collision.js';

const enemyLayout = [
  '...xxxx...', 
  '.xxxxxxxx.',
  '.xxxxxxxx.',
  'xxxxxxxxxx',
  'xxxxxxxxxx'
]; // Describes the enemy formation layout where 'x' represents an enemy and '.' represents an empty space

const enemyType = [
  // TODO: Fill this in later
] // Describes the enemy type for each row of the formation

const FORMATION_MOVEMENT_TIME = 3000; // How long it takes for the formation to move between two positions
const ENEMY_SPRITE_SIZE = 64; // TODO: Get this from whatever constant defines the sprite size
const FORMATION_HORIZONTAL_MOVEMENT = ENEMY_SPRITE_SIZE * 4;

export class EnemyManager {
  constructor() {
    /** @type {Array<number>} */
    this.enemies = [];
    /** @type {Map<number, Vector2>} */
    this.baseFormationPositions = new Map();
    /** @type {Map<number, Vector2>} */
    this.destFormationPositions = new Map();

    this.elapsedMovementTime = 0;
    this.formationMovementTime = FORMATION_MOVEMENT_TIME; // How long it takes for the formation to move between two positions
  }
  
  initialize() {
    this.spawnEnemies();
  }
  
  spawnEnemies() {
    const positions = [];
    for (let y = 0; y < enemyLayout.length; y++) {
      for (let x = 0; x < enemyLayout[y].length; x++) {
        if (enemyLayout[y][x] === 'x') {
          const spriteX = x * ENEMY_SPRITE_SIZE;
          const spriteY = y * ENEMY_SPRITE_SIZE + ENEMY_SPRITE_SIZE;
          positions.push(new Vector2(spriteX, spriteY));
        }
      }
    }
    
    const deregisterEnemy = (entityId) => {
      const index = this.enemies.indexOf(entityId);
      if (index !== -1) {
        this.enemies.splice(index, 1);
        this.baseFormationPositions.delete(entityId);
        this.destFormationPositions.delete(entityId);
      }
    };
    
    const gameManager = GameManager.getInstance();
    for (let i = 0; i < positions.length; i++) {
      const enemy = new Enemy(positions[i]);
      this.enemies.push(enemy.id);
      this.baseFormationPositions.set(enemy.id, positions[i]);
      this.destFormationPositions.set(enemy.id, positions[i].add(new Vector2(FORMATION_HORIZONTAL_MOVEMENT, 0)));
      enemy.once('destroyed', deregisterEnemy);
      gameManager.entities.add(enemy);
      enemy.collisionBox = new CollisionBox(enemy, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, false);
    }
  }
  
  transitionToCenter() {

  }

  /** @type {number} */
  update(elapsedTime) {
    const gameManager = GameManager.getInstance();
    
    // Reverse the direction of the formation every FORMATION_MOVEMENT_TIME
    this.elapsedMovementTime += elapsedTime;
    if (this.elapsedMovementTime >= this.formationMovementTime) {
      this.elapsedMovementTime -= this.formationMovementTime;
      const temp = this.baseFormationPositions;
      this.baseFormationPositions = this.destFormationPositions;
      this.destFormationPositions = temp;
    }

    for (let i = 0; i < this.enemies.length; i++) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(this.enemies[i]);
      if (!enemy) {
        continue;
      }
      
      const basePosition = this.baseFormationPositions.get(enemy.id);
      const destPosition = this.destFormationPositions.get(enemy.id);
      enemy.formationPosition = lerp(basePosition, destPosition, this.elapsedMovementTime / this.formationMovementTime);
    }
  }
}