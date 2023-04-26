import { UIManager } from "./UIManager.js";

export class AttractModeManager{

    static{
        this.timeToWait = 10000;
        this.enabled = sfalse;
    }
    static enableAttractMode(){
        if(!this.enabled){
            console.log('Attract mode enabled');
            this.enabled = true;

            //more code here
        }
    }

    static disableAttractMode(){
        if(this.enabled){
            UIManager.getInstance().setAttractMode = false;
            console.log(`Attract mode disabled`);
            this.enabled = false;

            //more code here
        }
    }
}