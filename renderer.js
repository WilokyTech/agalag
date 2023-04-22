//Written by Ryan Andersen A02288683 for CS5410
import { Assets } from "./assets.js";
import { GameManager } from "./gameManager.js";
import { Ship } from "./entities/ship.js";
import { ParticleSystem } from "./particleSystem.js";
import { UIManager } from "./UIManager.js";

export class Renderer {
    static {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById("canvas");
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");

        this.SONG_BPM = 142;
        this.SONG_BPS = 60 / this.SONG_BPM;
    }
    
    static drawGame(timeElapsed){
        if(Assets.bgImg && !UIManager.inAMenu){
            this.clear();
    
            this.ctx.drawImage(Assets.bgImg, 0, 0, this.canvas.width, this.canvas.height);
    
            this.updateTimeRenderChanges(timeElapsed);
            this.drawLives();
            this.drawParticles();
            this.drawShip(timeElapsed);
            this.drawScore();
            this.drawTimer();
        }
    }

    static clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    static drawLives(){
        let width = GameManager.ALL_BALLS_DIAMETER * this.canvas.width;
        let height = GameManager.ALL_BALLS_DIAMETER * this.canvas.height;
        let startX = GameManager.BRICK_MARGIN * 3 * this.canvas.width;
        for(let i = 0; i < GameManager.livesLeft; i++){
            this.ctx.drawImage(Assets.nyanCatImg, startX + GameManager.BRICK_MARGIN * this.canvas.width + (width * i), 0.9 * this.canvas.height, width, height);
        }
    }

    static drawShip(timeElapsed){
        try{
            GameManager.ship.render(this.ctx, timeElapsed);
        }
        catch(err){
            console.log(`ship image note loaded: ${err}`);
        }
    }

    static updateTimeRenderChanges(timeElapsed){

    }


    static drawTimer(){
        if(GameManager.countDownTimer <= 1000){
            this.drawText("3");
        }
        else if (GameManager.countDownTimer <= 2000){
            this.drawText("2");
        }
        else if (GameManager.countDownTimer <= 3000){
            this.drawText("1");
        }
    }

    static drawText(t){
        this.ctx.fillStyle = "rgb(20, 20, 20)";
        this.ctx.font = ("100px sans-serif")
        this.ctx.fillText(t, (this.canvas.width / 2) - 18, (this.canvas.height / 2));

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = ("90px sans-serif")
        this.ctx.fillText(t, (this.canvas.width / 2) - 22.5, (this.canvas.height / 2) - 10);
    }

    static drawScore(){
        this.ctx.fillStyle = "rgb(0, 0, 0)";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${GameManager.score}`, this.canvas.width * 0.835, this.canvas.height * 0.945);

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${GameManager.score}`, this.canvas.width * 0.83, this.canvas.height * 0.94);
    }

    static drawParticles(){

    }
}