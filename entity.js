import { Transform } from "./components/transform.js";
import { EventEmitter } from "./eventEmitter.js";
import { GameManager } from "./gameManager.js";

export class Entity extends EventEmitter {
  static #nextId = 0;
  
  constructor() {
    super();
    this.id = Entity.#nextId++;
    
    // All possible game component will be exposed as properties on the entity since there's only a small number of them
    // If the component is not present on the entity, it will be null.
    this.transform = new Transform(); // Position and orientation - Borrowing from Unity terminology
    this.collision = null;
    this.health = null;
    this.path = null;
    this.formation = null;
    this.velocity = null;
    
    /**
     * Specifies the texture to use for this entity. The texture value is a string that is used to
     * look up the texture in the Assets object.
     * 
     * @type {string}
     */
    this.texture = null;
  }
  
  /**
   * Called when the entity is added to the game world. If overriding, be sure to call super.initialize() at the end.
   */
  initialize() {
    this.emit('created');
  }
  
  /**
   * Processes input for the entity. This is called before update. If overriding, be sure to call super.processInput(elapsedTime).
   * 
   * @param {number} elapsedTime
   */
  processInput(elapsedTime) {
    // Default no-op
  }
  
  /**
   * Updates the entity and their component.
   * When overriding, be sure to call super.update(elapsedTime) to ensure the entity's components are updated.
   * 
   * @param {number} elapsedTime 
   */
  update(elapsedTime) {
    // Update the entity's components, namely velocity and transform if they exist
  }
  
  /**
   * Renders the entity.
   * 
   * Default implementation renders the texture defined by the entity's texture property. If the texture is null, it will
   * render a debug representation of the entity. Override this method to provide custom rendering. It is not necessary to
   * call super.render(ctx, elapsedTime) when overriding this method unless you want to render the entity's texture.
   * 
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} elapsedTime 
   */
  render(ctx, elapsedTime) {
    if (this.texture) {
      // Draw the entity's texture 
    } else if (false) {
      // Draw a debug representation of the entity 
    }
  }
  
  /**
   * Disposes of the entity and their components. This is called when the entity is removed from the game world.
   * When overriding, be sure to call super.dispose() at the end.
   */
  dispose() {
    this.emit('destroyed');
  }
}