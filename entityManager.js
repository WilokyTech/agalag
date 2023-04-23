import { Entity } from './entity.js';
import { EventEmitter } from './eventEmitter.js';

/**
 * Manages a collection of entities.
 * 
 * Emits the following events:
 * - add {Entity} Triggered when an entity is added and registered in the collection
 * - remove {Entity} Triggered when an entity is removed, immediately before it is de-registered from the collection.
 * 
 * These events are passed the entity's ID as the first argument. They are also triggered prior to the entity's
 * `initialize()` or `destroy()` methods being called.
 *
 * @extends EventEmitter
 */
export class EntityManager extends EventEmitter {
  /** @type {Map<number, Entity>} */
  #entities = new Map();
  /** @type {Array<number>} */
  #removeQueue = [];
  /** @type {Array<Entity>} */
  #addQueue = [];
  
  /**
   * @param {Entity} entity
   */
  add(entity) {
    this.#addQueue.push(entity);
  }
  
  /**
   * Adds an entity to the collection without triggering the 'add' event.
   * This should be used only for entities that are added to the collection at startup.
   * 
   * @param {Entity} entity 
   */
  addInitial(entity) {
    this.#entities.set(entity.id, entity);
    entity.initialize();
  }
  
  /**
   * @param {Entity | number} entity
   */
  remove(entity) {
    if (typeof entity === 'number')
      this.#removeQueue.push(entity);
    else
      this.#removeQueue.push(entity.id);
  }
  
  /**
   * @param {number} id 
   * @returns {Entity}
   */
  get(id) {
    return this.#entities.get(id);
  }
  
  /**
   * @param {number} elapsedTime 
   */
  update(elapsedTime) {
    for (let i = 0; i < this.#addQueue.length; ++i) {
      this.#entities.set(this.#addQueue[i].id, this.#addQueue[i]);
      this.#addQueue[i].initialize();
      this.emit('add', this.#addQueue[i].id);
    }
    this.#addQueue.length = 0;

    for (const entity of this.#entities.values()) {
      entity.update(elapsedTime);
    }
    
    for (let i = 0; i < this.#removeQueue.length; ++i) {
      this.emit('remove', this.#removeQueue[i]);
      this.#entities.get(this.#removeQueue[i]).dispose();
      this.#entities.delete(this.#removeQueue[i]);
    }
    this.#removeQueue.length = 0;
  }
  
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} elapsedTime 
   */
  render(ctx, elapsedTime) {
    for (const entity of this.#entities.values()) {
      entity.render(ctx, elapsedTime);
    }
  }
  
  processInputs(elapsedTime) {
    for (const entity of this.#entities.values()) {
      entity.processInput(elapsedTime);
    }
  }
  
  clear() {
    this.#entities.clear();
    this.#addQueue.length = 0;
    this.#removeQueue.length = 0;
  }
}