//Written by Ryan Andersen A02288683 for CS5410
import { Assets } from "./assets.js";
import { GameManager } from "./gameManager.js";
import { Ship } from "./entities/ship.js";
import { ParticleSystem } from "./particleSystem.js";
import { UIManager } from "./UIManager.js";

export class Renderer {
    static {
        this.SONG_BPM = 142;
        this.SONG_BPS = 60 / this.SONG_BPM;
    }

    constructor(gameManager) {
        /** @type {HTMLCanvasElement} */
        this.canvas = gameManager.canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");
        /** @type {GameManager} */
        this.gameManager = gameManager;
    }
    
    drawGame(timeElapsed){
        if(Assets.bgImg && !UIManager.inAMenu){
            this.clear();
    
            this.ctx.drawImage(Assets.bgImg, 0, 0, this.canvas.width, this.canvas.height);
    
            this.updateTimeRenderChanges(timeElapsed);
            this.drawLives();
            this.drawParticles();
            this.gameManager.entities.render(this.ctx, timeElapsed);
            this.drawScore();
            this.drawTimer();
        }
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLives(){
        let width = this.gameManager.ALL_BALLS_DIAMETER * this.canvas.width;
        let height = this.gameManager.ALL_BALLS_DIAMETER * this.canvas.height;
        let startX = this.gameManager.BRICK_MARGIN * 3 * this.canvas.width;
        for(let i = 0; i < this.gameManager.livesLeft; i++){
            this.ctx.drawImage(Assets.nyanCatImg, startX + this.gameManager.BRICK_MARGIN * this.canvas.width + (width * i), 0.9 * this.canvas.height, width, height);
        }
    }

    updateTimeRenderChanges(timeElapsed){

    }


    drawTimer(){
        if(this.gameManager.countDownTimer <= 1000){
            this.drawText("3");
        }
        else if (this.gameManager.countDownTimer <= 2000){
            this.drawText("2");
        }
        else if (this.gameManager.countDownTimer <= 3000){
            this.drawText("1");
        }
    }

    drawText(t){
        this.ctx.fillStyle = "rgb(20, 20, 20)";
        this.ctx.font = ("100px sans-serif")
        this.ctx.fillText(t, (this.canvas.width / 2) - 18, (this.canvas.height / 2));

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = ("90px sans-serif")
        this.ctx.fillText(t, (this.canvas.width / 2) - 22.5, (this.canvas.height / 2) - 10);
    }

    drawScore(){
        this.ctx.fillStyle = "rgb(0, 0, 0)";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${this.gameManager.score}`, this.canvas.width * 0.835, this.canvas.height * 0.945);

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${this.gameManager.score}`, this.canvas.width * 0.83, this.canvas.height * 0.94);
    }

    drawParticles(){

    }
}