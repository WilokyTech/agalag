//Written by Ryan Andersen A02288683 for CS5410
import { Assets } from "./assets.js";
import { GameManager } from "./gameManager.js";
import { ParticleSystem } from "./particleSystem.js";
import { UIManager } from "./UIManager.js";

export class Renderer {
    static #isInternalConstructing = false;
    static #instance = null;

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
        this.songBPMS = 60000 / 112;
        this.songBreakpoint = this.songBPMS;
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
            this.drawScore();
            this.gameManager.entities.render(this.ctx, timeElapsed);
            this.drawParticles();
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
                let drawX = (liveWidth * i) + (margin * i);
                let drawY = startY;
                let degrees = 7 * (i % 2 == 0 ? 1 : -1) * (this.bgTimer < this.songBreakpoint ? 1 : -1);
                this.ctx.save();
                this.ctx.translate(drawX + liveWidth / 2, drawY + liveWidth /2);                
                this.ctx.rotate(degrees*Math.PI/180);
                this.ctx.translate(-1 * (drawX + liveWidth / 2), -1 * (drawY + liveWidth /2));                
                this.ctx.drawImage(Assets.images.emptyShip.getImage(), drawX, drawY, liveWidth, liveWidth);
                this.ctx.restore();
            }
        }
    }
    
    updateTimeRenderChanges(timeElapsed){
        let bgImg;
        if(this.bgTimer < this.songBreakpoint){
            bgImg = Assets.images.bgImg1.getImage();
        }
        else{
            bgImg = Assets.images.bgImg2.getImage();
        }
        if(this.bgTimer >= (this.songBPMS * 2)) this.bgTimer = 0;

        console.log(`time elapsed: ${timeElapsed} bpms: ${this.songBPMS}`);
        this.bgTimer += timeElapsed;
        this.ctx.drawImage(bgImg, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawScore(){
        this.ctx.fillStyle = "rgb(0, 0, 0)";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${GameManager.getInstance().score}`, this.canvas.width * 0.835, this.canvas.height * 0.945);

        this.ctx.fillStyle = "#c29659";
        this.ctx.font = ("20px sans-serif");
        this.ctx.fillText(`Score: ${GameManager.getInstance().score}`, this.canvas.width * 0.834, this.canvas.height * 0.944);
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