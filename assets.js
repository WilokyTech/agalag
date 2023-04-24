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
            sparkleYellow: new ImageAsset(null, "./images/particles/sparkeYellow.png"),
            bgImg: new ImageAsset(null, "./images/bg.jpg")
        }
        this.loadAssets();
    }

    static async loadAssets(){
        for(const [key, value] of Object.entries(this.images)){
            await value.loadImage();
        }
        
        //TODO: replace with animated background. 
        this.bgImg = this.images.bgImg.getImage();
        this.assetsFinishedLoading = true;
    }
}