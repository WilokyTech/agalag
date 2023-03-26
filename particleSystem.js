import { Renderer } from "./renderer.js";

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

export class ParticleSystem{
    static{
        this.setDefaultState();
    }

    static setDefaultState(){
        /**@type {Array<SquareParticle} */
        this.squareParticles = [];

        this.texturedParticles = [];
    }

    /**
     * 
     * @param {SquareParticle} particle 
     */
    static addSquareParticle(particle){
        this.squareParticles.push(particle);
    }

    //TODO: Parameterize this more for future applications. For now, hardcode vals to work for specific effect in this project
    static generateSquareParticle(position){
        return new SquareParticle(
            position,
            500, 
            0.0008, 
            this.getRandomDirection(), 
            1, 
            this.getRandomSize(), 
            this.getRandomRotation(),
            this.getRandomSpin(),
            this.getRandomColor());
    }

    static getRandomDirection(){
        let num = Math.random() * 360;
        num = (num * Math.PI) / 180;
        return {x: Math.cos(num), y: Math.sin(num)};
    }

    static getRandomSize(){
        return Math.random() * .030;
    }

    static getRandomRotation(){
        return Math.random() * 360;
    }

    static getRandomSpin(){
        return Math.random > 0.5 ? 1 : -1;
    }

    static getRandomColor(){
        return Renderer.PADDLE_COLOR_LIST[Math.floor(Math.random() * 6)];
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
    }
}