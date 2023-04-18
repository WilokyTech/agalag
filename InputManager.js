import { GameManager } from "./gameManager.js";
import { UIManager } from "./UIManager.js";

export class InputManager {
    static {
        this.controls = {
            left: "ArrowLeft", 
            right: "ArrowRight", 
            fire: " ",
            pause: "Escape"
        };
        this.pressedKeys = [];
    }
    /**
     * 
     * @param {string} control
     * @param {KeyboardEvent} e 
     */
    static updateControls(control, e){
        this.controls[control] = e.key;
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    static addInput(e){
        if(!this.pressedKeys.includes(e.key)){
            this.pressedKeys.push(e.key);
        }
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    static removeInput(e){
        this.pressedKeys = this.pressedKeys.filter(k => k != e.key);
    }

    static processInputs(elapsedTime){
        if(GameManager.countDownTimer >= 3000 && !UIManager.inAMenu){
            for(let key of this.pressedKeys){
                let movementAmount = GameManager.PLAYER_MOVEMENT_SPEED * elapsedTime;
    
                if(this.controls.right.includes(key)){
                    if(GameManager.ship.location.x < 1.0  - GameManager.ship.width){
                        GameManager.ship.location.x += movementAmount;
                    }
                }
                else if(this.controls.left.includes(key)){
                    if(GameManager.ship.location.x > 0){
                        GameManager.ship.location.x -= movementAmount;
                    }
                }
            }
        }
    }
}

window.addEventListener("keydown", e => {
    if(InputManager.controls.pause.includes(e.key)){
        if(!UIManager.inAMenu){
            UIManager.showGenericMenu(UIManager.pauseMenuEl);
        }
        else{
            UIManager.setDefaultState();
        }
    }
    else{
        InputManager.addInput(e);
    }
});

window.addEventListener("keyup", e => {
    InputManager.removeInput(e);
});
