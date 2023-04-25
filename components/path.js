import { Entity } from "../entity.js";
import { EventEmitter } from "../eventEmitter.js";
import { Vector2 } from "../vector.js";
import { Transform } from "./transform.js";

export class Path extends EventEmitter {
  #endEventFired = false;
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
    if (this.#currentPoint >= this.#points.length) {
      return;
    }

    this.#currentPoint++;
  }
  
  getNextPoint() {
    if (this.#currentPoint >= this.#points.length) {
      if (!this.#endEventFired) {
        this.#endEventFired = true;
        this.emit('pathEnd');
      }
      return null;
    }
    return this.#points[this.#currentPoint];
  }
  
  /** @param {Vector2} point */
  addPoint(point) {
    this.#endEventFired = false; // End has been extended
    this.#points.push(point);
  }
  
  /** @param {Vector2} */
  setDestination(destination) {
    if (this.#points.length === 0) {
      this.#points.push(this.entityLocation.position);
    } else {
      this.#points[this.#points.length - 1] = destination;
    }
  }
}