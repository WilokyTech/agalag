export class ScoreManager{
    static {
        this.#loadData()
        this.HIGH_SCORES_STR = "highScores";
    }

    static #loadData(){
        this.highScores = JSON.parse(window.localStorage.getItem(this.HIGH_SCORES_STR));
        if(this.highScores == [] || this.highScores == null){
            this.highScores = [0, 0, 0, 0, 0];
        }
    }

    static addScore(score){
        this.#loadData();
        if(this.#zeroScoreExists()){
            for(let i = 0; i < this.highScores.length; i++){
                if(this.highScores[i] == 0){
                    this.#replaceScore(i, score);
                    break;
                }
            }
        }
        else{
            for(let i = 0; i < this.highScores.length; i++){
                if(this.highScores[i] < score){
                    this.#replaceScore(i, score);
                    break;
                }
            }
        }
        window.localStorage.setItem(this.HIGH_SCORES_STR, JSON.stringify(this.highScores));
        this.#loadData();
    }

    static #replaceScore(index, score){
        this.highScores.splice(index, 1);
        this.highScores.push(score);
        this.highScores.sort((a, b) => {
            if(a > b){
                return -1;
            }
            else if (a < b){
                return 1;
            }
            return 0;
        });
    }

    static #zeroScoreExists(){
        this.#loadData();
        for(let score of this.highScores){
            if(score == 0) return true;
        }
        return false;
    }

    static getScores(){
        this.#loadData();
        return this.highScores;
    }

    static clearScores(){
        window.localStorage.setItem(this.HIGH_SCORES_STR, null);
        this.#loadData();
    }
}