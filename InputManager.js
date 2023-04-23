import { EventEmitter } from "./eventEmitter.js";
import { GameManager } from "./gameManager.js";
import { UIManager } from "./UIManager.js";

/**
 * Listens for keyboard input and emits events based on the input. Also stores the current keyboard state.
 * 
 * Event names follow this format:
 * - "controlName" is emitted every frame that the control is being pressed.
 * - "controlNameDown" is emitted when the control is first pressed.
 * - "controlNameUp" is emitted when the control is released.
 * 
 * Control names are the keys in the controls object.
 * 
 * @extends EventEmitter
 */
export class InputManager extends EventEmitter {
    static controls = {
        left: "ArrowLeft", 
        right: "ArrowRight", 
        fire: " ",
        pause: "Escape"
    };
    
    /**
     * 
     * @param {string} control
     * @param {KeyboardEvent} e 
     */
    static updateControls(control, e){
        this.controls[control] = e.key;
    }
    
    constructor(gameManager, uiManager) {
        super();
        this.gameManager = gameManager;
        this.gameManager.inputManager = this;
        this.uiManager = uiManager;

        this.pressedKeys = new Set();
        this.activeControls = new Set();
        
        window.addEventListener("keydown", e => {
            if (InputManager.controls.pause === e.key) {
                if (!uiManager.inAMenu) {
                    uiManager.showGenericMenu(uiManager.pauseMenuEl);
                }
                else {
                    uiManager.setDefaultState();
                }
            }
            else {
                this.addKeyInput(e);
            }
        });

        window.addEventListener("keyup", e => {
            this.removeKeyInput(e);
        });
    }
    
    isControlDown(controlName) {
        return this.activeControls.has(controlName);
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    addKeyInput(e){
        this.pressedKeys.add(e.key);
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    removeKeyInput(e) {
        this.pressedKeys.delete(e.key);
    }

    processInputs(elapsedTime){
        if (this.gameManager.countDownTimer < 3000 || this.uiManager.inAMenu) {
            return
        }

        const currentControls = new Set();
        for (let key of this.pressedKeys) {
            for (let control in InputManager.controls) {
                if (InputManager.controls[control] === key) {
                    currentControls.add(control);
                    if (!this.activeControls.has(control)) {
                        this.emit(control + "Down", elapsedTime);
                    }
                    this.emit(control, elapsedTime);
                    // Remove keys from activeControls so that when the loop exits, the remaining keys are the ones that were released.
                    this.activeControls.delete(control);
                }
            }
        }
        
        for (let control of this.activeControls) {
            this.activeControls.delete(control);
            this.emit(control + "Up", elapsedTime);
        }

        this.activeControls = currentControls;
        
        this.gameManager.entities.processInputs(elapsedTime);
    }
}

