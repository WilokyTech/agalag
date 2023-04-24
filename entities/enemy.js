import { Entity } from "../entity.js";
import { GameManager } from "../gameManager.js";
import { Velocity } from "../components/velocity.js";
import { Path } from "../components/path.js";
import { Vector2 } from "../vector.js";

const ENEMY_SPEED = 0.00033;

export class Enemy extends Entity {
  /**
   * @param {Vector2} location 
   * @param {Path} path 
   */
  constructor(location, path) {
    super();
    this.transform.position = location;
    this.velocity = new Velocity(ENEMY_SPEED * GameManager.canvas.height);
    this.path = path;
  }
}