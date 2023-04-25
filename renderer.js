//Written by Ryan Andersen A02288683 for CS5410
import { Assets } from "./assets.js";
import { GameManager } from "./gameManager.js";
import { ParticleSystem } from "./particleSystem.js";
import { UIManager } from "./UIManager.js";

export class Renderer {
    static #isInternalConstructing = false;
    static #instance = null;

    static {
        this.SONG_BPM = 142;
        this.SONG_BPS = 60 / this.SONG_BPM;
    }

    constructor(){
        if (!Renderer.#isInternalConstructing) {
            throw new TypeError("Renderer is a singleton. Use Renderer.getInstance() instead.");
        }
        Renderer.#isInternalConstructing = false;

        /** @type {HTMLCanvasElement} */
        this.canvas = GameManager.canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.gameManager = GameManager.getInstance();
        this.bgTimer = 0;
    }
    
    /** @returns {Renderer} */
    static getInstance() {
        if (Renderer.#instance === null) {
            Renderer.#isInternalConstructing = true;
            Renderer.#instance = new Renderer();
        }
        return Renderer.#instance;
    }
    
    drawGame(timeElapsed){
        if(Assets.assetsFinishedLoading && !UIManager.getInstance().inAMenu){
            this.clear();
    
            this.updateTimeRenderChanges(timeElapsed);
            this.drawLives();
            this.gameManager.entities.render(this.ctx, timeElapsed);
            this.drawParticles();
            this.drawScore();
            this.drawTimer();
        }
    }
    
    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawLives(){
        if(Assets.assetsFinishedLoading){
            let startY = this.canvas.height * 0.9;
            let margin = this.canvas.width * 0.01;
            let liveWidth = this.canvas.width * 0.05;
            for(let i = 1; i <= GameManager.getInstance().livesLeft; i++){
                this.ctx.drawImage(Assets.images.emptyShip.getImage(), (liveWidth * i) + (margin * i), startY, liveWidth, liveWidth);
            }
            
        }
    }
    
    updateTimeRenderChanges(timeElapsed){
        let bgImg;
        if(this.bgTimer < 500){
            bgImg = Assets.images.bgImg1.getImage();
        }
        else{
            bgImg = Assets.images.bgImg2.getImage();
        }
        if(this.bgTimer >= 1000) this.bgTimer = 0;

        this.bgTimer += timeElapsed;
        this.ctx.drawImage(bgImg, 0, 0, this.canvas.width, this.canvas.height);
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
        // this.ctx.fillStyle = "rgb(20, 20, 20)";
        // this.ctx.font = ("100px sans-serif")
        // this.ctx.fillText(t, (this.canvas.width / 2) - 18, (this.canvas.height / 2));

        // this.ctx.fillStyle = "rgb(255, 255, 255)";
        // this.ctx.font = ("90px sans-serif")
        // this.ctx.fillText(t, (this.canvas.width / 2) - 22.5, (this.canvas.height / 2) - 10);
    }

    drawScore(){
        // this.ctx.fillStyle = "rgb(0, 0, 0)";
        // this.ctx.font = ("20px sans-serif");
        // this.ctx.fillText(`Score: ${this.gameManager.score}`, this.canvas.width * 0.835, this.canvas.height * 0.945);

        // this.ctx.fillStyle = "rgb(255, 255, 255)";
        // this.ctx.font = ("20px sans-serif");
        // this.ctx.fillText(`Score: ${this.gameManager.score}`, this.canvas.width * 0.83, this.canvas.height * 0.94);
    }

    drawParticles(){
        for(let i = 0; i < ParticleSystem.texturedParticles.length; i++){
            this.ctx.drawImage(
                ParticleSystem.texturedParticles[i].texture,
                ParticleSystem.texturedParticles[i].position.x,
                ParticleSystem.texturedParticles[i].position.y,
                ParticleSystem.texturedParticles[i].size, 
                ParticleSystem.texturedParticles[i].size);
        }
        for(let i = 0; i < ParticleSystem.squareParticles.length; i++){
            this.ctx.fillStyle = ("red");
            this.ctx.fillRect(
                ParticleSystem.squareParticles[i].position.x,
                ParticleSystem.squareParticles[i].position.y,
                ParticleSystem.squareParticles[i].size,
                ParticleSystem.squareParticles[i].size
            )
        }
    }

}