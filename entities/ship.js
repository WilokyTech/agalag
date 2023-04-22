import { Entity } from "../entity.js";

export class Ship extends Entity {
    constructor(width, height, position){
        super()
        this.width = width;
        this.height = height;
        this.transform.position = position;
    }
    
    /** @type {Entity['render']} */
    render(ctx, elapsedTime) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.transform.position.x, this.transform.position.y, this.width, this.height);
    }
}