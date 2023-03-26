//Written by Ryan Andersen A02288683 for CS5410
import { GameManager } from "./gameManager.js";
import { InputManager } from "./InputManager.js";
import { ParticleSystem } from "./particleSystem.js";
import { Renderer } from "./renderer.js";

let prevTime = performance.now();
let elapsedTime;
let timeRan = 0;

requestAnimationFrame(gameLoop);

function gameLoop(timeStamp){
    elapsedTime = timeStamp - prevTime;
    prevTime = timeStamp;
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
    
}

function render(){
    Renderer.drawGame(elapsedTime);
}

function update(elapsedTime){
    InputManager.processInputs(elapsedTime);
    GameManager.tick(elapsedTime);
    ParticleSystem.tick(elapsedTime);
    timeRan += elapsedTime;
}