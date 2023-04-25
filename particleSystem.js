import { GameManager } from "./gameManager.js";
import { Renderer } from "./renderer.js";
import { Assets } from "./assets.js";
import { Entity } from "./entity.js";
import { Vector2 } from "./vector.js";
import { Ship } from "./entities/ship.js";

export class SquareParticle{
    constructor(position, lifetime, velocity, direction, acceleration, size, rotation, spin, color){
        this.position = position;
        this.lifetime = lifetime;
        this.velocity = velocity;
        this.direction = direction;
        this.acceleration = acceleration;
        this.size = size;
        this.rotation = rotation;
        this.spin = spin;
        this.color = color;
        this.originalLifetime = lifetime;
        this.originalSize = size;
    }
}

export class TexturedParticle{
    /**
     * 
     * @param {Vector2} position 
     * @param {Image} texture 
     * @param {number} lifetime 
     * @param {number} velocity 
     * @param {Vector2} direction 
     * @param {number} size 
     * @param {number} rotation 
     * @param {number} spin 
     */
    constructor(position, texture, lifetime, velocity, direction, size, rotation, spin){
        this.position = position;
        this.texture = texture;
        this.lifetime = lifetime;
        this.velocity = velocity;
        this.direction = direction;
        this.size = size;
        this.rotation = rotation;
        this.spin = spin;
        this.originalLifetime = lifetime;
        this.originalSize = size;
    }
}

export class ParticleSystem{
    static{
        this.setDefaultState();
    }

    static setDefaultState(){
        /**@type {Array<SquareParticle} */
        this.squareParticles = [];

        /**@type {Array<TexturedParticle} */
        this.texturedParticles = [];
    }

    /**
     * 
     * @param {SquareParticle} particle 
     */
    static #addSquareParticle(particle){
        this.squareParticles.push(particle);
    }

    /**
     * 
     * @param {TexturedParticle} particle 
     */
    static #addTexturedParticle(particle){
        this.texturedParticles.push(particle);
    }

    //TODO: Parameterize this more for future applications. For now, hardcode vals to work for specific effect in this project
    static #generateSquareParticle(position){
        return new SquareParticle(
            position,
            500, 
            0.0008, 
            this.#getRandomDirection(), 
            this.#getRandomSize(), 
            this.#getRandomRotation(),
            this.#getRandomSpin(),
            this.#getRandomColor());
    }

    /**
     * 
     * @param {Vector2} position 
     * @param {Image} texture
     */
    static #generateTexturedParticle(position, texture){
        return new TexturedParticle(
            position,
            texture,
            this.#getRandomLifetime(), 
            this.#getRandomVelocity(), 
            this.#getRandomDirection(), 
            this.#getRandomSize(), 
            this.#getRandomRotation(),
            this.#getRandomSpin(),
        )
    }

    static #setScaleMultiplier(){
        this.scaleMultiplier = GameManager.canvas.width;
    }

    /**
     * 
     * @param {Entity} playerEntity
     */
    static playerDeath(playerEntity){
        this.#setScaleMultiplier();
        
        for(let i = 0; i < 60; i++){
            let startX = playerEntity.transform.position.x + playerEntity.width / 2;
            let startY = playerEntity.transform.position.y + playerEntity.height / 2;
            let startPos = new Vector2(startX, startY);
            this.#addTexturedParticle(this.#generateTexturedParticle(startPos, this.#getRandomExplosionTexture()));
            this.#addTexturedParticle(this.#generateTexturedParticle(startPos, this.#getRandomProjectileTexture()))
        }    
    }

    /**
     * 
     * @param {Entity} enemyEntity
     */
    static enemyDeath(enemyEntity){
        this.#setScaleMultiplier();
        
        for(let i = 0; i < 60; i++){
            let startX = enemyEntity.transform.position.x + 32;
            let startY = enemyEntity.transform.position.y + 32;
            let startPos = new Vector2(startX, startY);
            this.#addTexturedParticle(this.#generateTexturedParticle(startPos, this.#getRandomExplosionTexture()));
        }        
    }  

    /**
     * 
     * @param {Entity} entity 
     */
    static #defaultExplosion(entity){
        this.#setScaleMultiplier();
        
        for(let i = 0; i < 60; i++){
            let startX = entity.transform.position.x;
            let startY = entity.transform.position.y;
            let startPos = new Vector2(startX, startY);
            this.#addTexturedParticle(this.#generateTexturedParticle(startPos, this.#getRandomExplosionTexture()));
        }
    }

    static #getRandomExplosionTexture(){
        if(Assets.assetsFinishedLoading){
            let ranNum = Math.floor(Math.random() * 4);
            if(ranNum == 0){
                return Assets.images.heartPink.getImage();
            }
            else if(ranNum == 1){
                return Assets.images.heartRed.getImage();
            }
            else if(ranNum == 2){
                return Assets.images.sparkleLightYellow.getImage();
            }
            else if(ranNum == 3){
                return Assets.images.sparkleYellow.getImage();
            }
        }
        else{
            throw new Error("Can't get particle texture: assets not finished loading!");
        }
    }


    static #getRandomProjectileTexture(){
        if(Assets.assetsFinishedLoading){
            let num = Math.floor(Math.random() * 3);
            if(num == 0){
                return Assets.images.milk.getImage(0);
            }
            else if(num == 1){
                return Assets.images.fish.getImage();
            }
            else if (num == 2){
                return Assets.images.yarn.getImage();
            }
            else{
                throw new Error("Can't get particle texture: assets not finished loading!");
            }
        }
    }

    static #getRandomLifetime(){
        return this.getScaledValue(Math.random(), 0, 1, 500, 800);
    }

    static #getRandomVelocity(){
        return this.getScaledValue(Math.random(), 0, 1, 0.0001, 0.0004)
    }

    static #getRandomDirection(){
        let num = Math.random() * 360;
        num = (num * Math.PI) / 180;
        return new Vector2(Math.cos(num), Math.sin(num));
    }

    static #getRandomSize(){
        return Math.random() * .050 * this.scaleMultiplier;
    }

    static #getRandomRotation(){
        return Math.random() * 360;
    }

    static #getRandomSpin(){
        return Math.random > 0.5 ? 1 : -1;
    }

    static #getRandomColor(){
        // return Renderer.PADDLE_COLOR_LIST[Math.floor(Math.random() * 6)];
        return "magenta";
    }

    //https://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges Ryan Loggerythm's answer, a linear interpolation
    static getScaledValue(value, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax) {
        let targetRange = targetRangeMax - targetRangeMin;
        let sourceRange = sourceRangeMax - sourceRangeMin;
        return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
    }

    static tick(elapsedTime){
        for(let i = 0; i < this.squareParticles.length; i++){
            if(this.squareParticles[i].lifetime <= 0){
                this.squareParticles.splice(i, 1);
            }
            else{
                this.squareParticles[i].position.x += this.squareParticles[i].velocity * elapsedTime * this.squareParticles[i].direction.x;
                this.squareParticles[i].position.y += this.squareParticles[i].velocity * elapsedTime * this.squareParticles[i].direction.y;
                this.squareParticles[i].rotation += this.squareParticles[i].spin * (this.squareParticles[i].velocity/elapsedTime) * 2000;
                this.squareParticles[i].size = this.squareParticles[i].originalSize * (this.squareParticles[i].lifetime / this.squareParticles[i].originalLifetime);
                this.squareParticles[i].lifetime -= elapsedTime;
            }
        }

        for(let i = 0; i < this.texturedParticles.length; i++){
            if(this.texturedParticles[i].lifetime <= 0){
                this.texturedParticles.splice(i, 1);
            }
            else{
                let moveX = this.texturedParticles[i].velocity * elapsedTime * this.texturedParticles[i].direction.x * this.scaleMultiplier;
                let moveY = this.texturedParticles[i].velocity * elapsedTime * this.texturedParticles[i].direction.y * this.scaleMultiplier;
                this.texturedParticles[i].position.x += moveX;
                this.texturedParticles[i].position.y += moveY;
                this.texturedParticles[i].rotation += this.texturedParticles[i].spin * (this.texturedParticles[i].velocity/elapsedTime) * 2000;
                this.texturedParticles[i].size = this.texturedParticles[i].originalSize * (this.texturedParticles[i].lifetime / this.texturedParticles[i].originalLifetime);
                this.texturedParticles[i].lifetime -= elapsedTime;
            }
        }
    }
}