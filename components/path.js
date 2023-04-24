import { Entity } from "../entity.js";
import { EventEmitter } from "../eventEmitter.js";
import { Vector2 } from "../vector.js";
import { Transform } from "./transform.js";

export class Path extends EventEmitter {
  #currentPoint = 0;
  #points
  
  /**
   * @param {Entity} entity
   * @param {Array<Vector2>} [points]
   */
  constructor(entity, points = []) {
    super();

    /** @type {Vector2} */
    this.#points = points;
    /** @type {Transform} */
    this.entityLocation = entity.transform;
  }
  
  advance() {
    this.#currentPoint++;
    if (this.#currentPoint === this.#points.length) {
      this.emit('pathEnd');
    }
  }
  
  getNextPoint() {
    if (this.#currentPoint >= this.#points.length) {
      return null;
    }
    return this.#points[this.#currentPoint];
  }
  
  /** @param {Vector2} point */
  addPoint(point) {
    this.#points.push(point);
  }
}