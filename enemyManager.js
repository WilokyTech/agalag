import { Assets } from './assets.js';
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

const ATTACK_RUN_INTERVAL = 5000;
const ATTACK_GAP = 1000;
const ATTACK_RUN_ENEMY_CT = 3;

// Controls how spaced apart enemies are when they spawn
const SPAWN_INTERVAL = 200;
// Controls how long to wait between spawning squads of enemies
const SPAWN_GAP = 1000;

class EnemyFormation {
  constructor() {
    /** @type {Array<Vector2>} */
    this.currentPositions = [];
    /** @type {Array<Vector2>} */
    this.baseFormationPositions = [];
    /** @type {Array<Vector2>} */
    this.destFormationPositions = [];
    /** @type {Array<Vector2>} */
    this.spreadFormationPositions = [];
    
    this.elapsedMovementTime = 0;
    this.formationMovementTime = FORMATION_MOVEMENT_TIME;
    this.cyclesUntilFormationSwitch = Infinity;
    
    this.#computeLocations();
  }
  
  get size() {
    return this.currentPositions.length;
  }
  
  /**
   * @param {number} locationNumber 
   */
  getPosition(locationNumber) {
    return this.currentPositions[locationNumber];    
  }
  
  #computeLocations() {
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
          
          const basePosition = new Vector2(spriteX, spriteY + startYPosition)
          this.baseFormationPositions.push(basePosition);
          this.currentPositions.push(basePosition);
          this.destFormationPositions.push(basePosition.add(new Vector2(FORMATION_HORIZONTAL_MOVEMENT, 0)))
          this.spreadFormationPositions.push(new Vector2(
            spreadPositionsStartX + spreadX,
            startYPosition + spreadY
          ));
        }
      }
    }
  }

  getEnemyCount() {
    return this.enemies.size;
  }
  
  /** 
   * When called, this will set the new destination formation positions to be the spread
   * formation and the current formation at the time of the call will be set to the base formation
   * position.
   */
  #switchToSpreadFormation() {
    for (let locationNumber = 0; locationNumber < this.currentPositions.length; locationNumber++) {
      this.baseFormationPositions[locationNumber] = this.currentPositions[locationNumber];
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
    
    /** @type {Array<Vector2>} */
    const centerPositions = new Array(this.currentPositions.length);
    for (let locationNumber = 0; locationNumber < this.currentPositions.length; locationNumber++) {
      centerPositions[locationNumber] = lerp(this.baseFormationPositions[locationNumber], this.destFormationPositions[locationNumber], 0.5);
      if (movementCyclePercentage === 0.5) {
        // Snap location to center position since we are there (give or take a little floating point error)
        this.currentPositions[locationNumber] = centerPositions[locationNumber];
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

    for (let locationNumber = 0; locationNumber < this.currentPositions.length; locationNumber++) {
      this.currentPositions[locationNumber] = lerp(
        this.baseFormationPositions[locationNumber],
        this.destFormationPositions[locationNumber],
        this.elapsedMovementTime / this.formationMovementTime
      );
    }
  }
}

/**
 * A set of parameters needed to construct an enemy along a given
 * entry path defined by the path description data files.
 * 
 * @typedef {Exclude<ReturnType<ReturnType<typeof enemyGenerator>['next']>['value'], void>} EnemyDescriptor
 */

function* enemyGenerator(pathDescriptor) {
  /** @type {Array<Vector2>} */
  const pathPoints = pathDescriptor.points.map(point => new Vector2(point.x, point.y));
  /** @type {Array<number>} */
  const pathTriggers = pathDescriptor.triggerPoints;
  
  for (let i = 0; i < pathDescriptor.enemyOrder.length; i++) {
    const enemyDetails = pathDescriptor.enemyOrder[i];
    yield {
      /** @type {string} */
      type: enemyDetails.enemyType,
      /** @type {number} */
      formationLocation: enemyDetails.formationSpot,
      path: {
        points: pathPoints,
        triggerPoints: pathTriggers,
      }
    };
  }
}

function* enemySquadGenerator(waveDescriptor) {
  const pathCount = Object.keys(waveDescriptor).length;

  for (let i = 1; i <= pathCount; i++) {
    if (`path${i}` in waveDescriptor) {
      yield [enemyGenerator(waveDescriptor[`path${i}`])];
    } else if (`path${i}L` in waveDescriptor && `path${i}R` in waveDescriptor) {
      yield [enemyGenerator(waveDescriptor[`path${i}L`]), enemyGenerator(waveDescriptor[`path${i}R`])];
    }
  }
}

export class EnemyManager {
  static waveEntryPatternNames = [
    'wave1',
    'wave2',
    'challenge'
  ];

  constructor() {
    this.wave = -1;

    /**
     * This map serves two purposes: Stores the enemy IDs that we need to keep track of (keys)
     * and it maps those enemy IDs to their location in the enemy formation (values).
     * 
     * @type {Map<number, number>}
     */
    this.enemies = new Map();
    this.enemyDeregisterHandler = (entityId, entity) => {
      if (!entity.hasEnteredFormation) {
        this.enemyEnteredFormationHandler();
      }
      this.enemies.delete(entityId);
    };
    
    this.enemyEnteredFormationHandler = () => {
      this.lastSpawnedSquadInFormationCt++;
      if (this.lastSpawnedSquadCount === this.lastSpawnedSquadInFormationCt) {
        this.lastSpawnedSquadInFormationCt = 0;
        this.lastSpawnedSquadCount = 0;
        
        const { value: nextEnemySquadGenerator, done } = this.enemySquadGenerator.next();
        if (done) {
          this.enemyGenerators = null;
          this.titmeToNextSpawn = Infinity;
          this.timeSinceLastAttackRun = ATTACK_RUN_INTERVAL - 1000;
          this.enemyFormation.transitionToCenterFormation();
        } else {
          this.timeToNextSpawn = SPAWN_GAP;
          this.enemyGenerators = nextEnemySquadGenerator;
        }
      }
    };
  }
  
   getEnemyCount() {
    return this.enemies.size;
  }
  
  initializeNextWave() {
    this.wave++;
    if (this.wave >= EnemyManager.waveEntryPatternNames.length) {
      this.wave = 0;
    }

    this.enemyFormation = new EnemyFormation();
    this.enemySquadGenerator = enemySquadGenerator(Assets.waveEntryPatterns[EnemyManager.waveEntryPatternNames[this.wave]]);
    this.enemyGenerators = this.enemySquadGenerator.next().value;

    this.timeSinceLastAttackRun = -Infinity;
    this.nextAttackCounter = 0;
    this.attackRunEnemyCt = 0;

    this.timeToNextSpawn = SPAWN_GAP;
    this.lastSpawnedSquadCount = 0;
    this.lastSpawnedSquadInFormationCt = 0;
  }
  
  /**
   * @param {EnemyDescriptor} enemyDescriptor 
   */
  spawnEnemy(enemyDescriptor) {
    const gameManager = GameManager.getInstance();

    const enemy = new Enemy(
      enemyDescriptor.type,
      this.wave !== 2 ? this.enemyFormation.getPosition(enemyDescriptor.formationLocation) : null,
      enemyDescriptor.path
    );
    enemy.once('destroyed', this.enemyDeregisterHandler);
    this.enemies.set(enemy.id, enemyDescriptor.formationLocation);
    enemy.addCollisionBox(ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, ENEMY_SPRITE_SIZE, false);
    enemy.on('enteredFormation', this.enemyEnteredFormationHandler);
    gameManager.entities.add(enemy);

    this.lastSpawnedSquadCount++;
  }

  /** @type {number} */
  update(elapsedTime) {
    if (this.wave === -1) return; // Nothing to do yet
    
    if (this.enemies.size === 0 && this.enemyGenerators === null) {
      this.initializeNextWave();
    }

    this.enemyFormation.update(elapsedTime);
    
    this.timeToNextSpawn -= elapsedTime;
    if (this.enemyGenerators && this.timeToNextSpawn <= 0) {
      let allGeneratorsDone = true;
      for (let i = 0; i < this.enemyGenerators.length; i++) {
        const enemyGenerator = this.enemyGenerators[i];
        if (!enemyGenerator) continue; // This generator has finished

        const { value: enemyDescriptor, done } = enemyGenerator.next();
        if (done) {
          this.enemyGenerators[i] = null;
        } else {
          allGeneratorsDone = false;
          this.spawnEnemy(enemyDescriptor);
        }
      }
      
      if (allGeneratorsDone) {
        this.timeToNextSpawn = Infinity;
        this.enemyGenerators = null;
      } else {
        this.timeToNextSpawn = SPAWN_INTERVAL + this.timeToNextSpawn;
      }
    }

    const gameManager = GameManager.getInstance();
    for (const enemyEntityId of this.enemies.keys()) {
      /** @type {Enemy} */
      const enemy = gameManager.entities.get(enemyEntityId);
      if (!enemy) {
        continue;
      }
      enemy.formationPosition = this.enemyFormation.getPosition(this.enemies.get(enemyEntityId));
    }
    
    if (!this.isAttacking) {
      this.timeSinceLastAttackRun += elapsedTime;
    }

    if (this.timeSinceLastAttackRun >= ATTACK_RUN_INTERVAL) {
      this.isAttacking = true;
      this.timeSinceLastAttackRun = 0;
      this.#attack();
    }
    
    if (this.isAttacking) {
      this.nextAttackCounter += elapsedTime;
      if (this.nextAttackCounter >= ATTACK_GAP) {
        this.nextAttackCounter -= ATTACK_GAP;
        this.#attack();
        if (this.attackRunEnemyCt >= ATTACK_RUN_ENEMY_CT) {
          this.isAttacking = false;
          this.attackRunEnemyCt = 0;
          this.nextAttackCounter = 0;
        }
      }
    }
  }
  
  #attack() {
    const enemyIds = Array.from(this.enemies.keys());
    const enemyToAttackWith = Math.floor(Math.random() * enemyIds.length);
    const enemyIdToAttackWith = enemyIds[enemyToAttackWith];
    /** @type {Enemy} */
    const attacker = GameManager.getInstance().entities.get(enemyIdToAttackWith);
    if (!attacker || !attacker.inFormation) {
      // Enemy we were about to send got destroyed between the time we picked it and now
      // or the enemy we chose is already attacking.
      return; 
    }
    attacker.launchAttackRun();
    this.attackRunEnemyCt++;
  }
}