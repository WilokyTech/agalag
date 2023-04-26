import { UIManager } from "./UIManager.js";
import { GameManager } from "./gameManager.js";

export class AttractModeManager{

    static{
        this.timeToWait = 10000;
        this.enabled = false;
    }

    //This is called by the UIManager once when it detects that it's been longer than timeToWait in the main menu
    static enableAttractMode(){
        if(!this.enabled){
            console.log('Attract mode enabled');
            this.enabled = true;

            GameManager.getInstance().setDefaultState();
            UIManager.getInstance().showGame();

            //more code here
        }
    }

    //This is called by the InputManager whenever the user inputs a key or clicks
    static disableAttractMode(){
        if(this.enabled){
            console.log(`Attract mode disabled`);
            this.enabled = false;

            // reset the main menu for the player.
            GameManager.getInstance().onQuit();
            UIManager.getInstance().setDefaultState();
        }
    }
}