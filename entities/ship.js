import { Assets } from "../assets.js";
import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { InputManager } from "../InputManager.js";
import { Projectile } from "./projectile.js";
import { CollisionBox } from "../components/collision.js";
import { SoundFXManager } from "../SoundFXManager.js";

/** Movement speed given as a percentage of the total width per millisecond */
const PLAYER_MOVEMENT_SPEED = 0.001;

export class Ship extends Entity {
    constructor(width, height, position){
        super()
        this.width = width;
        this.height = height;
        this.transform.position = position;
        // this.collisionBox = new CollisionBox(this, width, height, width, height, true);
        
        this.gameManager = GameManager.getInstance();
        this.inputManager = InputManager.getInstance();
    }
    
    /** @type {Entity['initialize']} */
    initialize() {
        this.fireProjectile = this.fireProjectile.bind(this);
        this.inputManager.on('fireDown', this.fireProjectile);

        super.initialize();
    }
    
    /** @type {Entity['processInput']} */
    processInput(elapsedTime) {
        if (this.inputManager.isControlDown("right")) {
            this.moveRight(elapsedTime);
        }
        if (this.inputManager.isControlDown("left")) {
            this.moveLeft(elapsedTime);
        }
    }

    moveRight(elapsedTime) {
        const movementAmount = PLAYER_MOVEMENT_SPEED * GameManager.canvas.width * elapsedTime;
        if (this.transform.position.x < GameManager.canvas.width - this.width){
            this.transform.position.x += movementAmount;
            if (this.transform.position.x > GameManager.canvas.width - this.width){
                this.transform.position.x = GameManager.canvas.width - this.width;
            }
        }
    }

    moveLeft(elapsedTime) {
        const movementAmount = PLAYER_MOVEMENT_SPEED * GameManager.canvas.width * elapsedTime;
        if (this.transform.position.x > 0) {
            this.transform.position.x -= movementAmount;
            if (this.transform.position.x < 0){
                this.transform.position.x = 0;
            }
        }
    }

    /** @type {Entity['onCollision']} */
    onCollision(collisionType) {
        if (collisionType === "playerDeath") {
            SoundFXManager.playExplosionSFX();
            this.gameManager.entities.remove(this);
        }
    }

    addCollisionBox(graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly) {
        this.collisionBox = new CollisionBox(this, graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly);
    }
    
    fireProjectile() {
        const projectile = new Projectile(this.transform.position.x + this.width/2, this.transform.position.y, 0, -1, true);
        projectile.addCollisionBox(16, 16, 16, 16, true);
        SoundFXManager.playThrowSFX();
        GameManager.getInstance().shotsFired++;
        this.gameManager.entities.add(projectile); 
    }
    
    /** @type {Entity['render']} */
    render(ctx, elapsedTime) {
        if(Assets.assetsFinishedLoading){
            let image = InputManager.getInstance().isControlDown("fire") ? Assets.images.playerShip2.getImage() : Assets.images.playerShip1.getImage();
            ctx.drawImage(image, this.transform.position.x, this.transform.position.y, this.width, this.height);
        }
        else{
            ctx.fillStyle = "magenta";
            ctx.fillRect(this.transform.position.x, this.transform.position.y, this.width, this.height);
        }
    }
    
    /** @type {Entity['dispose']} */    
    dispose() {
        this.inputManager.off('fireDown', this.fireProjectile);
        
        super.dispose();
    }
}