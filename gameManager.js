import { EntityManager } from "./entityManager.js";
import { Ship } from "./entities/ship.js";
import { ParticleSystem } from "./particleSystem.js";
import { Vector2 } from "./vector.js";
import { EventEmitter } from "./eventEmitter.js";
import { InputManager } from "./InputManager.js";
import { CollisionBox, Collision } from "./components/collision.js";
import { EnemyManager } from "./enemyManager.js";
//import { Projectile } from "./entities/projectile.js";

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
        this.paused = false;
        /** @type {EnemyManager} */
        this.enemyManager = new EnemyManager();
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
        this.entities.clear();

        this.entities.addInitial(this.createShip());
        this.enemyManager.initialize();
        //this.entities.addInitial(new Projectile(0.5 * GameManager.canvas.width, GameManager.canvas.height - 64, 0, -1, true))
        this.livesLeft = 3;
        this.score = 0;
        this.countDownTimer = 5000;

        InputManager.getInstance().inputPaused = true;
    }

    createShip(){
        const shipWidth = 64
        const shipHeight = 64
        const ship = new Ship(shipWidth, shipHeight, new Vector2((GameManager.canvas.width/2) - (shipWidth/2), GameManager.canvas.height - 64));
        // ParticleSystem.playerDeath(ship);
        ship.on('destroyed', this.lostLife.bind(this));
        return ship;
    }

    tick(elapsedTime){
        if (!this.paused) {
            if(this.countDownTimer < 3000){
                this.countDownTimer += elapsedTime;
            }
            else{
                InputManager.getInstance().inputPaused = false;
                // Execute the game
                let collisions = this.detectCollisions();
                this.enemyManager.update(elapsedTime);
                this.entities.update(elapsedTime);
            }
        }
    }

    detectCollisions(){
        let collisions = [];
        //I made collisions an object in the last project, containing things like type of collision, objects collided, etc to be examined in other funcs
        let entityEntries = Array.from(this.entities.entries());
        for (let i=0; i<entityEntries.length; i++) {
            let colBox1 = entityEntries[i][1].collisionBox;
            for (let j=i+1; j<entityEntries.length; j++) {
                let colBox2 = entityEntries[j][1].collisionBox;
                if (colBox1.detectCollision(colBox2)) {
                    collisions.push(new Collision(entityEntries[i][1], entityEntries[j][1]));
                }
            }
        }
        return collisions;
    }

    lostLife(){
        if(this.livesLeft < 0){
            this.gameOver();
        }
        else{
            this.entities.add(this.createShip());
            this.countDownTimer = 0;
        }
    }

    gameOver(){
        //save score to local storage. Probably use a storage manager for this
        this.emit("gameOver");
    }
}