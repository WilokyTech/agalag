import { EventEmitter } from "./eventEmitter.js";
import { Path } from "./components/path.js";
import { Transform } from "./components/transform.js";
import { Velocity } from "./components/velocity.js";

export class Entity extends EventEmitter {
  static #nextId = 0;
  
  constructor() {
    super();
    this.id = Entity.#nextId++;
    
    // All possible game component will be exposed as properties on the entity since there's only a small number of them
    // If the component is not present on the entity, it will be null.
    this.transform = new Transform(this); // Position and orientation - Borrowing from Unity terminology
    /** @type {CollisionBox} */
    this.collisionBox = null;
    this.health = null;
    /** @type {Path} */
    this.path = null;
    this.formation = null;
    /** @type {Velocity} */
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
   * If you need access to game singletons like the game manager or input manager and are encountering reference errors when doing
   * so in the constructor, you can access them here.
   */
  initialize() {
    this.emit('created');
  }
  
  /**
   * Processes input for the entity. This is called before update.
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
    this.transform.update(elapsedTime);
  }

  onCollision(collisionType) {
    // Default no-op
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
    } else {
      // Draw a debug representation of the entity 
      ctx.fillStyle = 'magenta';
      if (!this.collisionBox) {
        ctx.fillRect(this.transform.position.x, this.transform.position.y, 64, 64); // 64 is the typical sprite size
      } else {
        ctx.fillRect(this.collisionBox.left, this.collisionBox.top, this.collisionBox.width, this.collisionBox.height);
      }
    }
  }
  
  /**
   * Disposes of the entity and their components. This is called when the entity is removed from the game world.
   * When overriding, be sure to call super.dispose() at the end.
   */
  dispose() {
    this.emit('destroyed', this.id);
  }
}