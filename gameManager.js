import { UIManager } from "./UIManager.js";
import { ParticleSystem } from "./particleSystem.js";

export class Ship{
    constructor(width, height, location){
        this.width = width;
        this.height = height;
        this.location = location;
    }
}

export class GameManager{

    static{
        this.PLAYER_MOVEMENT_SPEED = 0.001;
        this.setDefaultState();
    }

    static setDefaultState(){
        this.ship = new Ship(0.15, 0.03, {x: 0.5 - (0.15/2), y: 1 - 0.03});

        this.livesLeft = 3;
        this.score = 0;
        this.countDownTimer = 0;
    }

    static tick(elapsedTime){
        if(!UIManager.inAMenu){
            if(this.countDownTimer < 3000){
                this.countDownTimer += elapsedTime;
            }
            else{
                let collisions = this.detectCollisions();
                //do the game shiz
            }
        }
    }

    static detectCollisions(){
        let collisions = [];
        //I made collisions an object in the last project, containing things like type of collision, objects collided, etc to be examined in other funcs
        return collisions;
    }

    static lostLife(){
        if(this.livesLeft < 0){
            this.gameOver();
        }
        else{
            this.ship = new Ship(0.15, 0.03, {x: 0.5 - (0.15/2), y: 1 - 0.03});
            this.countDownTimer = 0;
        }
    }

    static gameOver(){
        //save score to local storage. Probably use a storage manager for this
        UIManager.showGameOver();
    }
}