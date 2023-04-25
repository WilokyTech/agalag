import { Assets } from "../assets.js";
import { Velocity } from "../components/velocity.js";
import { CollisionBox } from "../components/collision.js";
import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { Vector2 } from "../vector.js";

/** Movement speed given as a percentage of the total height per millisecond */
const PLAYER_PROJECTILE_SPEED = 0.0015;
const ENEMY_PROJECTILE_SPEED = 0.0005;

export class Projectile extends Entity {
  constructor(posx, posy, velx, vely, isFriendly) {
    super();
    this.transform.position.x = posx - 8;
    this.transform.position.y = posy - 8;
    this.velocity = new Velocity((isFriendly ? PLAYER_PROJECTILE_SPEED : ENEMY_PROJECTILE_SPEED) * GameManager.canvas.height, new Vector2(velx, vely));

    this.isFriendly = isFriendly;
    
    this.gameManager = GameManager.getInstance();

    this.textureNum = Math.floor(Math.random() * 3);
    this.currentRotation = 0;
  }
  
  /** @type {Entity['update']} */
  update(elapsedTime) {
    super.update(elapsedTime);
    
    // Remove the projectile if it's off the screen
    if (
      this.transform.position.x < 0 ||
      this.transform.position.x > GameManager.canvas.width ||
      this.transform.position.y < 0 ||
      this.transform.position.y > GameManager.canvas.height
    ) {
      this.gameManager.entities.remove(this);
    }
  }

  /** @type {Entity['onCollision']} */
  onCollision(collisionType) {
    if (collisionType != null) {
      this.gameManager.entities.remove(this);
    }
  }

  addCollisionBox(graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly) {
    this.collisionBox = new CollisionBox(this, graphicsWidth, graphicsHeight, collisionWidth, collisionHeight, isFriendly);
  }

  /** @type {Entity['render']} */
  render(ctx, elapsedTime) {
    if(Assets.assetsFinishedLoading){ 
        if(!this.image){
          if(this.textureNum == 0){
            this.image = Assets.images.milk.getImage();
          }
          else if(this.textureNum == 1){
            this.image = Assets.images.fish.getImage();
          }
          else{
            this.image = Assets.images.yarn.getImage();
          }
        }
        ctx.drawImage(this.image, this.transform.position.x, this.transform.position.y, 16, 16);
        ctx.drawImage(Assets.images.target.getImage(), this.transform.position.x, this.transform.position.y, 16, 16);
    }
    else{
        ctx.fillStyle = "magenta";
        ctx.fillRect(this.transform.position.x, this.transform.position.y, 16, 16);
    }
  }
}