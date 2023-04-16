export class Entity {
  static #nextId = 0;
  
  constructor() {
    this.id = Entity.#nextId++;
    
    // All possible game component will be exposed as properties on the entity since there's only a small number of them
    // If the component is not present on the entity, it will be null.
    this.transform = null; // Position and rotation - Borrowing from Unity terminology
    this.collision = null;
    this.health = null;
    this.path = null;
    this.formation = null;
    this.velocity = null;
  }
  
  /**
   * Updates the entity and their component.
   * When overriding, be sure to call super.update(elapsedTime) to ensure the entity's components are updated.
   * 
   * @param {number} elapsedTime 
   */
  update(elapsedTime) {
    // Update the entity's components
  }
  
  /**
   * Renders the entity
   * 
   * @param {number} elapsedTime 
   */
  render(elapsedTime) {
    // Render the entity. Default implementation is an intentional no-op.
  }
}