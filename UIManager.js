import { GameManager } from "./gameManager.js";

export class UIManager{
    static {
        this.canvasEl = document.getElementById("canvas");
        this.mainMenuEl = document.getElementById("main-menu");
        this.newGameEl = document.getElementById("new-game");
        this.highScoresEl = document.getElementById("high-scores");
        this.creditsEl = document.getElementById("credits");
        this.pauseMenuEl = document.getElementById("pause-menu");
        this.resumeEl = document.getElementById("resume");
        this.quitEl = document.getElementById("quit");
        this.highScoresDisplayEl = document.getElementById("high-scores-display");
        this.creditsDisplayEl = document.getElementById("credits-display");
        this.backBttn = document.getElementById("back-button");
        this.gameOverEl = document.getElementById("game-over");
        this.scoreSpanEl = document.getElementById("score-span");
        this.highScoresListEl = document.getElementById("high-scores-list");
        this.clearHighScoresEl = document.getElementById("clear-high-scores");

        /**@type {HTMLAudioElement} */
        this.BG_MUSIC = new Audio('./audio/NyanLoop.mp3');
        this.BG_MUSIC.loop = true;

        this.backableMenus = [this.creditsDisplayEl, this.highScoresDisplayEl, this.gameOverEl];

        this.newGameEl.onclick = () => {
            this.showGame();
            //commenting out for now as it gets old during development
            // this.BG_MUSIC.play();
            GameManager.setDefaultState();
        }

        this.resumeEl.onclick = () => {
            this.showGame();
        }

        this.quitEl.onclick = () => {
            this.setDefaultState();
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
            SaveDataManager.clearScores();
            this.showHighScores();
        }

        this.setDefaultState();
    }
 
    static setDefaultState(){
        this.showGenericMenu(this.mainMenuEl);
        this.BG_MUSIC.pause();
    }

    /**
     * 
     * @param {HTMLElement} menuEl 
     */
    static showGenericMenu(menuEl){
        this.hideEverything();
        menuEl.style = "display: flex";
        if(this.backableMenus.includes(menuEl)){
            this.backBttn.style = "display: block";
        }
        this.inAMenu = true;
    }

    static showHighScores(){
        this.showGenericMenu(this.highScoresDisplayEl);
        //custom high scores func here
        this.highScoresListEl.innerHTML = ``;
        for(let score of [0, 0, 0, 0, 0]){
            this.highScoresListEl.innerHTML += `<li class="list-group-item score">${score}</li>`;
        }
    }

    static showGameOver(){
        this.showGenericMenu(this.gameOverEl);
        this.BG_MUSIC.pause();
        this.scoreSpanEl.innerHTML = `Your Score: ${GameManager.score}`;
    }

    static showGame(){
        this.hideEverything();
        this.canvasEl.style = "display: block;";
        this.inAMenu = false;
    }

    static hideEverything(){
        this.pauseMenuEl.style = "display: none";
        // this.canvasEl.style = "display: none;";
        this.mainMenuEl.style = "display: none;";
        this.creditsDisplayEl.style = "display: none;";
        this.highScoresDisplayEl.style = "display: none";
        this.backBttn.style = "display: none";
        this.gameOverEl.style = "display: none";
    }
}