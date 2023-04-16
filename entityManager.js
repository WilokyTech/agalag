import { Entity } from './entity.js';

export class EntityManager {
  /** @type {Map<number, Entity>} */
  #entities = new Map();
  /** @type {Array<number>} */
  #removeQueue = [];
  #addQueue = [];
  
  /**
   * @param {Entity} entity
   */
  add(entity) {
    this.#addQueue.push(entity);
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
    }
    this.#addQueue.length = 0;

    for (const entity of this.#entities.values()) {
      entity.update(elapsedTime);
    }
    
    for (let i = 0; i < this.#removeQueue.length; ++i) {
      this.remove(this.#removeQueue[i]);
    }
    this.#removeQueue.length = 0;
  }
  
  /**
   * @param {number} elapsedTime 
   */
  render(elapsedTime) {
    for (const entity of this.#entities.values()) {
      entity.render(elapsedTime);
    }
  }
}