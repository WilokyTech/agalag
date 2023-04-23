import { Entity } from "../entity.js";
import { InputManager } from "../InputManager.js";

export class Ship extends Entity {
    /** Movement speed given as a percentage of the total width per millisecond */
    static PLAYER_MOVEMENT_SPEED = 0.001;

    constructor(gameManager, width, height, position){
        super(gameManager)
        this.width = width;
        this.height = height;
        this.transform.position = position;
    }
    
    /** @type {Entity['processInput']} */
    processInput(elapsedTime) {
        const movementAmount = Ship.PLAYER_MOVEMENT_SPEED * this.gameManager.canvas.width * elapsedTime;

        if(this.gameManager.inputManager.isControlDown("right")){
            if (this.transform.position.x < this.gameManager.canvas.width - this.width){
                this.transform.position.x += movementAmount;
            }
        }
        else if (this.gameManager.inputManager.isControlDown("left")) {
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