import { EntityManager } from "./entityManager.js";
import { Ship } from "./entities/ship.js";
import { ParticleSystem } from "./particleSystem.js";
import { Vector2 } from "./vector.js";
import { EventEmitter } from "./eventEmitter.js";
import { InputManager } from "./InputManager.js";
import { Collision } from "./components/collision.js";
import { EnemyManager } from "./enemyManager.js";
import { ScoreManager } from "./scoreManager.js";
import { AttractModeManager } from "./attractModeManager.js";
import { SoundFXManager } from "./SoundFXManager.js";

/**
 * Manages the game state. All entities are passed a reference to this object
 * when they are created. Events that affect the entire game state are emitted from
 * this object.
 */
export class GameManager extends EventEmitter {
    static #isInternalConstructing = false;
    static #instance = null;
    
    /** @type {HTMLCanvasElement} */
    static canvas = document.getElementById("canvas");

    constructor() {
        if (!GameManager.#isInternalConstructing) {
            throw new TypeError("GameManager is a singleton. Use GameManager.getInstance() instead.");
        }
        GameManager.#isInternalConstructing = false;

        super();

        this.entities = new EntityManager();
        InputManager.getInstance().entitiesToSendInput = this.entities;
    }
    
    /**
     * @returns {GameManager}
     */
    static getInstance() {
        if (GameManager.#instance === null) {
            GameManager.#isInternalConstructing = true;
            GameManager.#instance = new GameManager();
        }
        return GameManager.#instance;
    }

    setDefaultState(){
        this.paused = false;

        this.entities.clear();
        this.enemyManager = new EnemyManager();

        this.entities.addInitial(this.createShip());
        this.enemyManager.initializeNextWave();

        this.livesLeft = 2;
        this.score = 0;
        this.countDownTimer = 5000;

        this.shotsFired = 0;
        this.enemiesHit = 0;

    }

    onQuit() {
        this.entities.clear();
        clearTimeout(this.respawnTimeout);
        clearTimeout(this.gameOverTimeout);
        SoundFXManager.pauseBGMusic();
    }
    
    createShip(){
        const shipWidth = 64
        const shipHeight = 64
        const ship = new Ship(shipWidth, shipHeight, new Vector2((GameManager.canvas.width/2) - (shipWidth/2), GameManager.canvas.height - 64));
        ship.addCollisionBox(shipWidth, shipHeight, shipWidth, shipHeight, true);
        this.shipId = ship.id;
        ship.once('destroyed', () => {
            this.lostLife();
            ParticleSystem.playerDeath(ship);
        });
        return ship;
    }

    tick(elapsedTime){
        if (!this.paused) {
            if(this.countDownTimer < 3000){
                this.countDownTimer += elapsedTime;
            }
            else{
                if (AttractModeManager.enabled) {
                    AttractModeManager.AIShip(this.entities.get(this.shipId), elapsedTime);
                }
                // Execute the game
                let collisions = this.detectCollisions();
                for (let collision of collisions) {
                    collision.entity1.onCollision(collision.collisionType);
                    collision.entity2.onCollision(collision.collisionType);
                }
                this.entities.update(elapsedTime);
                this.enemyManager?.update(elapsedTime);
            }
        }
    }

    detectCollisions(){
        let collisions = [];
        //I made collisions an object in the last project, containing things like type of collision, objects collided, etc to be examined in other funcs
        let entityEntries = Array.from(this.entities.entries());
        for (let i=0; i<entityEntries.length; i++) {
            let colBox1 = entityEntries[i][1]?.collisionBox;
            if (!colBox1) continue;
            for (let j=i+1; j<entityEntries.length; j++) {
                let colBox2 = entityEntries[j][1].collisionBox;
                if (colBox2 == null || colBox1 == null) {
                    continue;
                }
                if (colBox1.detectCollision(colBox2)) {
                    collisions.push(new Collision(entityEntries[i][1], entityEntries[j][1]));
                }
            }
        }
        return collisions;
    }

    lostLife(){
        if (AttractModeManager.enabled) {
            this.respawnTimeout = setTimeout(() => this.entities.add(this.createShip()), 1000);
            return;
        }
        if(this.livesLeft <= 0){
            this.gameOver();
        }
        else{
            this.livesLeft--;
            this.respawnTimeout = setTimeout(() => this.entities.add(this.createShip()), 1000);
        }
    }

    gameOver(){
        this.paused = true;
        //save score to local storage. Probably use a storage manager for this
        this.gameOverTimeout = setTimeout(() => this.emit("gameOver"), 1000);
        ScoreManager.addScore(this.score);
        this.emit("gameOver");
    }
}