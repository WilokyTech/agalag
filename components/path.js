import { Entity } from "../entity.js";
import { EventEmitter } from "../eventEmitter.js";
import { Vector2 } from "../vector.js";
import { Transform } from "./transform.js";

export class Path extends EventEmitter {
  #endEventFired = false;
  #currentPoint = 0;
  
  /**
   * @param {Entity} entity
   * @param {Array<Vector2>} [points]
   * @param {Array<number>} [triggerPoints] - Points in the path that trigger events. These are 0-indexed, so the first point is 0, the second is 1, etc.
   */
  constructor(entity, points = [], triggerPoints = []) {
    super();

    /** @type {Array<Vector2>} */
    this.points = points;
    /** @type {Transform} */
    this.entityLocation = entity.transform;
    /** @type {Set<number>} */
    this.triggerPoints = new Set(triggerPoints);
  }
  
  advance() {
    if (this.#currentPoint >= this.points.length) {
      return;
    }

    if (this.triggerPoints.has(this.#currentPoint)) {
      this.emit('trigger', this.#currentPoint);
    }
    this.#currentPoint++;
  }
  
  getNextPoint() {
    if (this.#currentPoint >= this.points.length) {
      if (!this.#endEventFired) {
        this.#endEventFired = true;
        this.emit('end');
      }
      return null;
    }
    return this.points[this.#currentPoint];
  }
  
  /** @param {Vector2} point */
  addPoint(point, hasTrigger = false) {
    this.#endEventFired = false; // End has been extended
    this.points.push(point);
    if (hasTrigger) {
      this.triggerPoints.add(this.points.length - 1);
    }
  }
  
  /** @param {Vector2} */
  setDestination(destination) {
    if (this.points.length === 0) {
      this.points.push(this.entityLocation.position);
    } else {
      this.points[this.points.length - 1] = destination;
    }
  }
}