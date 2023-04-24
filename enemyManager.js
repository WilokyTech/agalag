import { Enemy } from './entities/enemy.js';
import { GameManager } from './gameManager.js';
import { Vector2 } from './vector.js';

const enemyLayout = [
  'oooxxxxooo',
  'oxxxxxxxxo',
  'oxxxxxxxxo',
  'xxxxxxxxxx',
  'xxxxxxxxxx'
]; // Describes the enemy formation layout where 'x' represents an enemy and 'o' represents an empty space

const enemyType = [
  // TODO: Fill this in later
] // Describes the enemy type for each row of the formation

export class EnemyManager {
  constructor() {
    /** @type {Array<number>} */
    this.enemies = [];
  }
  
  spawnEnemies() {
    const spriteSize = 64;
    const positions = [];
    for (let y = 0; y < enemyLayout.length; y++) {
      for (let x = 0; x < enemyLayout[y].length; x++) {
        if (enemyLayout[y][x] === 'x') {
          const spriteX = x * spriteSize;
          const spriteY = y * spriteSize;
          positions.push(new Vector2(spriteX, spriteY));
        }
      }
    }
    
    const gameManager = GameManager.getInstance();
    for (let i = 0; i < positions.length; i++) {
      const enemy = new Enemy(positions[i]);
      this.enemies.push(enemy.id);
      gameManager.entities.addInitial(enemy);
    }
  }

  /** @type {number} */
  update(elapsedTime) {

  }
}