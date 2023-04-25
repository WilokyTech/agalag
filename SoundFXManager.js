export class SoundFXManager {

    static {
        /**@type {HTMLAudioElement} */
        this.BG_MUSIC = new Audio('./audio/NyanLoop.mp3');
        this.BG_MUSIC.loop = true;

    }

    static playLaserSFX(){
        this.#playGenericSound('./audio/laserSound.mp3');
    }
    
    static playThrowSFX(){
        this.#playGenericSound(`./audio/throwSound.mp3`);
    }
    
    static playExplosionSFX(){
        this.#playGenericSound('./audio/explosionSound.mp3');
    }
    
    //creating a new element each time so that multiple can play at once
    static #playGenericSound(name){
        let sfx = new Audio(name);
        sfx.addEventListener("ended", () => {
            sfx.remove();
        });
        sfx.play();
    }
}