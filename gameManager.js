import { Entity } from "./entity.js";
import { EntityManager } from "./entityManager.js";
import { Ship } from "./entities/ship.js";
import { UIManager } from "./UIManager.js";
import { ParticleSystem } from "./particleSystem.js";
import { Vector2 } from "./vector.js";
import { EventEmitter } from "./eventEmitter.js";
import { InputManager } from "./InputManager.js";

/**
 * Manages the game state. All entities are passed a reference to this object
 * when they are created. Events that affect the entire game state are emitted from
 * this object.
 */
export class GameManager extends EventEmitter {
    entities = new EntityManager();

    /** This is injected by the input manager
     * @type {InputManager} */
    inputManager = null;
    canvas = document.getElementById("canvas");
    paused = false;

    constructor() {
        super();
        this.setDefaultState();
    }

    setDefaultState(){
        this.entities.clear();

        this.entities.addInitial(this.createShip());
        this.livesLeft = 3;
        this.score = 0;
        this.countDownTimer = 0;
    }

    createShip(){
        const shipWidth = 64
        const shipHeight = 64
        const ship = new Ship(this, shipWidth, shipHeight, new Vector2((this.canvas.width/2) - (shipWidth/2), this.canvas.height - 64));
        ship.on('destroyed', this.lostLife.bind(this));
        return ship;
    }

    tick(elapsedTime){
        if (!this.paused) {
            if(this.countDownTimer < 3000){
                this.countDownTimer += elapsedTime;
            }
            else{
                // Execute the game
                let collisions = this.detectCollisions();
                this.entities.update(elapsedTime);
            }
        }
    }

    detectCollisions(){
        let collisions = [];
        //I made collisions an object in the last project, containing things like type of collision, objects collided, etc to be examined in other funcs
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