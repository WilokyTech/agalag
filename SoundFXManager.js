export class SoundFXManager {

    static {
        /**@type {HTMLAudioElement} */
        this.BG_MUSIC = new Audio('./audio/AgalagTheme.mp3');
        this.BG_MUSIC.loop = true;
        this.BG_MUSIC.volume = 0.5;
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

    static resetBGMusic(){

    }

    static playBGMusic(){
        this.BG_MUSIC.currentTime = 0;
        this.BG_MUSIC.play();
    }

    static pauseBGMusic(){
        this.BG_MUSIC.pause();
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