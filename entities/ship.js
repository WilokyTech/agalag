import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { InputManager } from "../InputManager.js";

export class Ship extends Entity {
    /** Movement speed given as a percentage of the total width per millisecond */
    static PLAYER_MOVEMENT_SPEED = 0.001;

    constructor(width, height, position){
        super()
        this.width = width;
        this.height = height;
        this.transform.position = position;
        this.inputManager = InputManager.getInstance();
    }
    
    /** @type {Entity['processInput']} */
    processInput(elapsedTime) {
        const movementAmount = Ship.PLAYER_MOVEMENT_SPEED * GameManager.canvas.width * elapsedTime;

        if(this.inputManager.isControlDown("right")){
            if (this.transform.position.x < GameManager.canvas.width - this.width){
                this.transform.position.x += movementAmount;
            }
        }
        else if (this.inputManager.isControlDown("left")) {
            if (this.transform.position.x > 0){
                this.transform.position.x -= movementAmount;
            }
        }
    }
    
    /** @type {Entity['render']} */
    render(ctx, elapsedTime) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.transform.position.x, this.transform.position.y, this.width, this.height);
    }
}