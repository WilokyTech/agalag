export class Assets {
    static {
        /** @type {Image} */
        this.bgImg = null;
        this.loadAssets();
    }

    static async #fetchAsset(assetName, url){
        const img = new Image();
        this[assetName] = img;
        img.src = url;
        return new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(img);
            };
        });
    }

    static async loadAssets(){
        // await this.#fetchAsset('nyanCatImg', './images/nyanCat.png');
        // await this.#fetchAsset('nyanCatLeftImg','./images/nyanCatLeft.png');
        //TODO: replace bg image with animated system
        await this.#fetchAsset('bgImg', './images/bg.jpg');
    }
}