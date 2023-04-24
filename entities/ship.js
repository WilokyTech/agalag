import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { InputManager } from "../InputManager.js";
import { Projectile } from "./projectile.js";
import { CollisionBox } from "../components/collision.js";

/** Movement speed given as a percentage of the total width per millisecond */
const PLAYER_MOVEMENT_SPEED = 0.001;

export class Ship extends Entity {
    constructor(width, height, position){
        super()
        this.width = width;
        this.height = height;
        this.transform.position = position;
        this.collisionBox = new CollisionBox(this, width, height, width, height, true);
        
        this.gameManager = GameManager.getInstance();
        this.inputManager = InputManager.getInstance();
    }
    
    /** @type {Entity['initialize']} */
    initialize() {
        this.fireProjectile = this.fireProjectile.bind(this);
        this.inputManager.on('fireDown', this.fireProjectile);
    }
    
    /** @type {Entity['processInput']} */
    processInput(elapsedTime) {
        const movementAmount = PLAYER_MOVEMENT_SPEED * GameManager.canvas.width * elapsedTime;

        if(this.inputManager.isControlDown("right")){
            if (this.transform.position.x < GameManager.canvas.width - this.width){
                this.transform.position.x += movementAmount;
            }
        }
        if (this.inputManager.isControlDown("left")) {
            if (this.transform.position.x > 0){
                this.transform.position.x -= movementAmount;
            }
        }
    }
    
    fireProjectile() {
        const projectile = new Projectile(this.transform.position.x + this.width/2, this.transform.position.y, 0, -1, true);
        this.gameManager.entities.add(projectile); 
    }
    
    /** @type {Entity['render']} */
    render(ctx, elapsedTime) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.transform.position.x, this.transform.position.y, this.width, this.height);
    }
    
    /** @type {Entity['dispose']} */    
    dispose() {
        this.inputManager.off('fireDown', this.fireProjectile);
    }
}