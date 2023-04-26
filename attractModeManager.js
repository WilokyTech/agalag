import { UIManager } from "./UIManager.js";
import { GameManager } from "./gameManager.js";
import { Projectile } from "./entities/projectile.js";

export class AttractModeManager{

    static{
        this.timeToWait = 10000;
        this.enabled = false;

        // for the AI
        this.moveAILeft = true;
        this.AIFireRate = 500;
        this.AIFireTimer = 0;
    }

    //This is called by the UIManager once when it detects that it's been longer than timeToWait in the main menu
    static enableAttractMode(){
        if(!this.enabled){
            console.log('Attract mode enabled');
            this.enabled = true;

            // set up game and run with dummy player.
            GameManager.getInstance().setDefaultState();
            UIManager.getInstance().showGame();
        }
    }

    //This is called by the InputManager whenever the user inputs a key or clicks
    static disableAttractMode(){
        if(this.enabled){
            console.log(`Attract mode disabled`);
            this.enabled = false;

            // reset the main menu for the player.
            GameManager.getInstance().onQuit();
            UIManager.getInstance().setDefaultState();
        }
    }

    // methods for the AI ship movement and firing

    static AIShip(ship, elapsedTime) {
        if (!ship) {
            return;
        }
        let enemyDirection = AttractModeManager.detectIncomingProjectile(ship);
        if (!enemyDirection) {
            let moveDirection = AttractModeManager.directionOfEnemies(ship);
            if (moveDirection == "left") {
                ship.moveLeft(elapsedTime);
            } else {
                ship.moveRight(elapsedTime);
            }
        } else {
            if (enemyDirection == "left") {
                ship.moveRight(elapsedTime);
            } else if (enemyDirection == "right") {
                ship.moveLeft(elapsedTime);
            }
        }
        
        this.AIFireTimer += elapsedTime;
        if (this.AIFireTimer >= this.AIFireRate) {
            if (AttractModeManager.isEnemyAbove(ship)) {
                ship.fireProjectile();
            }
            this.AIFireTimer -= this.AIFireRate;
        }
    }

    static detectIncomingProjectile(ship) {
        let entities = GameManager.getInstance().entities.entries();
        let nearestDist = 150;
        let nearest;
        for (let entry of entities) {
            let entity = entry[1];
            if (entity == ship || entity.collisionBox.isFriendly) {
                continue;
            }
            let distance = ship.transform.position.subtract(entity.transform.position);
            if (distance.magnitude() <= nearestDist) {
                nearest = entity;
            }
        }
        if (nearest) {
            return (nearest.transform.position.x < ship.transform.position.x) ? "left" : "right";
        }
        return null;
    }

    static isEnemyAbove(ship) {
        let entities = GameManager.getInstance().entities.entries();
        for (let entry of entities) {
            let entity = entry[1];
            if (entity == ship || entity.collisionBox.isFriendly) {
                continue;
            }
            if (Math.abs(entity.transform.position.x - ship.transform.position.x) < 32) {
                return true;
            }
        }
        return false;
    }

    static directionOfEnemies(ship) {
        let entities = GameManager.getInstance().entities.entries();
        let left = 0;
        let right = 0;
        for (let entry of entities) {
            let entity = entry[1];
            if (entity == ship || entity.collisionBox.isFriendly || entity instanceof Projectile) {
                continue;
            }
            if (entity.transform.position.x < ship.transform.position.x) {
                left++;
            } else {
                right++;
            }
        }
        if (left > right) {
            return "left";
        } else {
            return "right";
        }
    }
}