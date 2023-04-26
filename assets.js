export class ImageAsset{
    /**
     * 
     * @param {Image?} image 
     * @param {String} imagePath 
     */
    constructor(image, imagePath){
        this.image = image;
        this.imagePath = imagePath
    }

    /**
     * 
     * @returns {Image}
     */
    getImage(){
        return this.image;
    }

    getImagePath(){
       return this.imagePath;
    }

    /**
     * 
     * @param {Image} img 
     */
    setImage(img){
        this.image = img;
    }

    async loadImage(){
        const img = new Image();
        img.src = this.getImagePath();
        return new Promise((resolve, reject) => {
            img.onload = () => {
                this.setImage(img);
                resolve(img);
            };
        });
    }
}

export class Assets {
    static {
        /** @type {Image} */
        this.assetsFinishedLoading = false;
        this.bgImg = null;
        this.images = {
            heartPink: new ImageAsset(null, "./images/particles/heartPink.png"),
            heartRed: new ImageAsset(null, "./images/particles/heartRed.png"),
            sparkleLightYellow: new ImageAsset(null, "./images/particles/sparkleLightYellow.png"),
            sparkleYellow: new ImageAsset(null, "./images/particles/sparkleYellow.png"),
            playerShip1: new ImageAsset(null, "./images/cats/ship/1.png"),
            playerShip2: new ImageAsset(null, "./images/cats/ship/2.png"),
            emptyShip: new ImageAsset(null, "./images/cats/ship/emptyShip.png"),
            milk: new ImageAsset(null, "./images/projectiles/milk.png"),
            fish: new ImageAsset(null, "./images/projectiles/fish.png"),
            yarn: new ImageAsset(null, "./images/projectiles/yarn.png"),
            bgImg1: new ImageAsset(null, "./images/bg1.png"),
            bgImg2: new ImageAsset(null, "./images/bg2.png"),
            target: new ImageAsset(null, "./images/projectiles/target.png"),
            wingCat1: new ImageAsset(null, "./images/cats/wingCat/1.png"),
            wingCat2: new ImageAsset(null, "./images/cats/wingCat/2.png"),
            beeCat1: new ImageAsset(null, "./images/cats/beeCat/1.png"),
            beeCat2: new ImageAsset(null, "./images/cats/beeCat/2.png"),
            butterflyCat1: new ImageAsset(null, "./images/cats/butterflyCat/1.png"),
            butterflyCat2: new ImageAsset(null, "./images/cats/butterflyCat/2.png")
        }
        this.waveEntryPatterns = {}
        this.loadAssets();
    }

    static async loadAssets(){
        for(const [key, value] of Object.entries(this.images)){
            await value.loadImage();
        }
        
        this.waveEntryPatterns.wave1 = await fetch('/data/wave1.json').then(res => res.json());
        this.waveEntryPatterns.wave2 = await fetch('/data/wave2.json').then(res => res.json());
        this.waveEntryPatterns.challenge = await fetch('/data/waveChallenge.json').then(res => res.json());
        
        this.assetsFinishedLoading = true;
    }
}