//Written by Ryan Andersen A02288683 for CS5410
import { GameManager } from "./gameManager.js";
import { InputManager } from "./InputManager.js";
import { ParticleSystem } from "./particleSystem.js";
import { Renderer } from "./renderer.js";
import { UIManager } from "./UIManager.js";

function main() {
    let prevTime = performance.now();
    let elapsedTime;
    let timeRan = 0;

    let gameManager = new GameManager();
    let uiManager = new UIManager(gameManager);
    let inputManager = new InputManager(gameManager, uiManager);
    let renderer = new Renderer(gameManager);
    
    /** @type {FrameRequestCallback} */
    function gameLoop(timeStamp){
        elapsedTime = timeStamp - prevTime;
        prevTime = timeStamp;
        update(elapsedTime);
        render();
        requestAnimationFrame(gameLoop);
    }

    function render(){
        renderer.drawGame(elapsedTime);
    }

    function update(elapsedTime){
        inputManager.processInputs(elapsedTime);
        gameManager.tick(elapsedTime);
        ParticleSystem.tick(elapsedTime);
        timeRan += elapsedTime;
    }
    
    requestAnimationFrame(gameLoop);
}

// Adjust canvas display size to be a whole integer multiple when upscaling.
// In combination with the CSS on the canvas, this ensures that we get nice sharp pixels
// when we upscale. For downscaling, we will probably want to compare the different
// downsampling methods on final assets. Downsampling cases should be easiest using CSS
// media queries if we need to only permit downscaling by powers of two since we don't
// want to downsample to smaller than 16x16 tile size.
function scaleCanvas() {
    const gameCanvas = document.getElementById('canvas');
    const gameHeight = Number.parseInt(gameCanvas.getAttribute('height'));
    
    if (window.innerHeight > gameHeight) {
        const gameWidth = Number.parseInt(gameCanvas.getAttribute('width'));
        const sizeScaleFactor = Math.floor(window.innerHeight / gameHeight);
        gameCanvas.style.width = `${gameWidth * sizeScaleFactor}px`;
        gameCanvas.style.height = `${gameHeight * sizeScaleFactor}px`;
    } else {
        gameCanvas.style.height = '';
        gameCanvas.style.width = '';
    }
}
document.addEventListener("DOMContentLoaded", scaleCanvas);
window.addEventListener("resize", scaleCanvas);
document.addEventListener("DOMContentLoaded", main);
