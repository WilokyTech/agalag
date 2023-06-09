import { InputManager } from "./InputManager.js";
import { GameManager } from "./gameManager.js";
import { ScoreManager } from "./scoreManager.js";
import { AttractModeManager } from "./attractModeManager.js";
import { SoundFXManager } from "./SoundFXManager.js";

export class UIManager{
    static #isInternalConstructing = false;
    static #instance = null;

    
    constructor(){
        if (!UIManager.#isInternalConstructing) {
            throw new TypeError("UIManager is a singleton. Use UIManager.getInstance() instead.");
        }
        UIManager.#isInternalConstructing = false;
        
        this.canvasEl = document.getElementById("canvas");
        this.mainMenuEl = document.getElementById("main-menu");
        this.newGameEl = document.getElementById("new-game");
        this.remapControlsEl = document.getElementById("remap-controls");
        this.highScoresEl = document.getElementById("high-scores");
        this.creditsEl = document.getElementById("credits");
        this.pauseMenuEl = document.getElementById("pause-menu");
        this.resumeEl = document.getElementById("resume");
        this.quitEl = document.getElementById("quit");
        this.controlsMenuEl = document.getElementById("controls-menu");
        this.remapMoveLeftButtonEl = document.getElementById("remap-move-left-button");
        this.remapMoveRightButtonEl = document.getElementById("remap-move-right-button");
        this.remapFireButtonEl = document.getElementById("remap-fire-button");
        this.remapPauseButtonEl = document.getElementById("remap-pause-button");
        this.resetDefaultButtonEl = document.getElementById("reset-default-button");
        this.highScoresDisplayEl = document.getElementById("high-scores-display");
        this.creditsDisplayEl = document.getElementById("credits-display");
        this.backBttn = document.getElementById("back-button");
        this.gameOverEl = document.getElementById("game-over");
        this.scoreSpanEl = document.getElementById("score-span");
        this.highScoresListEl = document.getElementById("high-scores-list");
        this.clearHighScoresEl = document.getElementById("clear-high-scores");
        this.shotsFiredEl = document.getElementById("shots-span");
        this.shotsHitEl = document.getElementById("hits-span");
        this.hitMissEl = document.getElementById("hit-miss-span");
        
        this.backableMenus = [this.controlsMenuEl, this.creditsDisplayEl, this.highScoresDisplayEl, this.gameOverEl];
        
        this.currentMenu = null;
        this.timeNoActivityInMainMenu = 0;
        this.attractModeHasBeenSet = false;

        this.newGameEl.onclick = () => {
            SoundFXManager.playBGMusic();
            GameManager.getInstance().setDefaultState();
            this.showGame();
        }

        this.resumeEl.onclick = () => {
            this.showGame();
            GameManager.getInstance().paused = false;
        }

        this.quitEl.onclick = () => {
            this.setDefaultState();
            GameManager.getInstance().onQuit();
        }

        this.remapControlsEl.onclick = () => {
            this.showControlsMenu();
        }

        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        }

        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        }

        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        }
        
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };

        this.resetDefaultButtonEl.onclick = () => {
            this.resetDefaultControls();
        }

        this.highScoresEl.onclick = () => {
            this.showHighScores();
        }

        this.creditsEl.onclick = () => {
            this.showGenericMenu(this.creditsDisplayEl);
        }

        this.backBttn.onclick = () => {
            this.setDefaultState();
        }

        this.clearHighScoresEl.onclick = () => {
            ScoreManager.clearScores();
            this.showHighScores();
        }
        
        GameManager.getInstance().on('gameOver', this.showGameOver.bind(this));

        this.setDefaultState();
    }

    /** @returns {UIManager} */
    static getInstance() {
        if (UIManager.#instance == null) {
            UIManager.#isInternalConstructing = true;
            UIManager.#instance = new UIManager();
        }
        return UIManager.#instance;
    }
    
    setDefaultState(){
        this.showGenericMenu(this.mainMenuEl);
    }

    /**
     * 
     * @param {HTMLElement} menuEl 
     */
    showGenericMenu(menuEl){
        this.timeNoActivityInMainMenu = 0;
        this.currentMenu = menuEl;
        this.hideEverything();
        menuEl.style = "display: flex";
        if(this.backableMenus.includes(menuEl)){
            this.backBttn.style = "display: block";
        }
        this.inAMenu = true;
    }

    tick(elapsedTime){
        if(this.inAMenu && this.currentMenu == this.mainMenuEl){
            if(this.timeNoActivityInMainMenu < AttractModeManager.timeToWait && !AttractModeManager.enabled){
                this.timeNoActivityInMainMenu += elapsedTime;
            }
            else if(!AttractModeManager.enabled){
                this.timeNoActivityInMainMenu = 0;
                AttractModeManager.enableAttractMode();
            }
        }
    }

    showControlsMenu(){
        let previousControls = localStorage.getItem("agalag.controls");
        if (previousControls != null){
            previousControls = JSON.parse(previousControls);
            this.remapMoveLeftButtonEl.innerHTML = `Move Left: "${previousControls.left}"`;
            this.remapMoveRightButtonEl.innerHTML = `Move Right: "${previousControls.right}"`;
            this.remapFireButtonEl.innerHTML = `Fire: "${previousControls.fire}"`;
            this.remapPauseButtonEl.innerHTML = `Pause/Back: "${previousControls.pause}"`;
        }
        this.showGenericMenu(this.controlsMenuEl);
    }

    remapMoveLeft(){
        this.remapMoveRightButtonEl.onclick = null;
        this.remapFireButtonEl.onclick = null;
        this.remapPauseButtonEl.onclick = null;

        this.remapMoveLeftButtonEl.innerHTML = "Press a key to set control for Move Left...";

        window.addEventListener('keyup', function(event) {
            const key = event.key;
            document.getElementById("remap-move-left-button").innerHTML = `Move Left: "${key}"`;
            InputManager.updateControls('left', event);
        }, { once : true });

        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        };
        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        };
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };
    }

    remapMoveRight(){
        this.remapMoveLeftButtonEl.onclick = null;
        this.remapFireButtonEl.onclick = null;
        this.remapPauseButtonEl.onclick = null;

        this.remapMoveRightButtonEl.innerHTML = "Press a key to set control for Move Right...";

        window.addEventListener('keyup', function(event) {
            const key = event.key;
            document.getElementById('remap-move-right-button').innerHTML = `Move Right: "${key}"`;
            InputManager.updateControls('right', event);
        }, { once : true });

        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        };
        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        };
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };
    }

    remapFire(){
        this.remapMoveLeftButtonEl.onclick = null;
        this.remapMoveRightButtonEl.onclick = null;
        this.remapPauseButtonEl.onclick = null;

        this.remapFireButtonEl.innerHTML = "Press a key to set control for Fire...";

        window.addEventListener('keyup', function(event) {
            const key = event.key;
            document.getElementById('remap-fire-button').innerHTML = `Fire: "${key}"`;
            InputManager.updateControls('fire', event);
        }, { once : true });
        
        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        };
        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        };
        this.remapPauseButtonEl.onclick = () => {
            this.remapPause();
        };
    }

    remapPause(){
        this.remapMoveLeftButtonEl.onclick = null;
        this.remapMoveRightButtonEl.onclick = null;
        this.remapFireButtonEl.onclick = null;

        this.remapPauseButtonEl.innerHTML = "Press a key to set control for Pause/Back...";

        window.addEventListener('keyup', function(event) {
            const key = event.key;
            document.getElementById('remap-pause-button').innerHTML = `Pause/Back: "${key}"`;
            InputManager.updateControls('pause', event);
        }, { once : true });
        
        this.remapMoveLeftButtonEl.onclick = () => {
            this.remapMoveLeft();
        };
        this.remapMoveRightButtonEl.onclick = () => {
            this.remapMoveRight();
        };
        this.remapFireButtonEl.onclick = () => {
            this.remapFire();
        };
    }

    resetDefaultControls(){
        this.remapMoveLeftButtonEl.innerHTML = "Move Left: \"ArrowLeft\""
        this.remapMoveRightButtonEl.innerHTML = "Move Right: \"ArrowRight\""
        this.remapFireButtonEl.innerHTML = "Fire: \" \""
        this.remapPauseButtonEl.innerHTML = "Pause/Back: \"Escape\""
        InputManager.controls = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            fire: ' ',
            pause: 'Escape'
        }
        InputManager.saveControls();
    }

    showHighScores(){
        this.showGenericMenu(this.highScoresDisplayEl);
        //custom high scores func here
        this.highScoresListEl.innerHTML = ``;
        for(let score of ScoreManager.getScores()){
            this.highScoresListEl.innerHTML += `<li class="list-group-item score">${score}</li>`;
        }
    }

    showGameOver(){
        this.showGenericMenu(this.gameOverEl);
        let misses = GameManager.getInstance().shotsFired - GameManager.getInstance().enemiesHit;
        this.scoreSpanEl.innerHTML = `Your Score: ${GameManager.getInstance().score}`;
        this.shotsFiredEl.innerHTML = `Shots fired: ${GameManager.getInstance().shotsFired}`;
        this.shotsHitEl.innerHTML = `Hits: ${GameManager.getInstance().enemiesHit}`;
        this.hitMissEl.innerHTML = `Hit/Miss Ratio: ${misses == 0? "Perfect" : (GameManager.getInstance().enemiesHit / misses).toFixed(2)}`;
        SoundFXManager.pauseBGMusic();
    }

    showGame(){
        this.hideEverything();
        this.canvasEl.style = "display: block;";
        this.inAMenu = false;
    }

    hideEverything(){
        this.pauseMenuEl.style = "display: none";
        this.canvasEl.style = "display: none;";
        this.mainMenuEl.style = "display: none;";
        this.controlsMenuEl.style = "display: none;";
        this.creditsDisplayEl.style = "display: none;";
        this.highScoresDisplayEl.style = "display: none";
        this.backBttn.style = "display: none";
        this.gameOverEl.style = "display: none";
    }
}