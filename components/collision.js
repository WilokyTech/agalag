export class CollisionBox {
    constructor(entity, width, height, isFriendly) {
        this.entity = entity;
        this.width = width;
        this.height = height;
        this.isFriendly = isFriendly;
    }

    static detectCollision(obj1, obj2){
        // calculate the sides of the rectangles
        const left1 = obj1.transform.position.x;
        const top1 = obj1.transform.position.y;
        if (obj1.heigh != null){
            const right1 = obj1.transform.position.x + obj1.width;
            const bottom1 = rect1.y + rect1.height;
        } else {
            const right1 = obj1.transform.position.x;
            const bottom1 = obj1.transform.position.y;
        }
        
        const left2 = rect2.x;
        const top2 = rect2.y;
        const right2 = rect2.x + rect2.width;
        const bottom2 = rect2.y + rect2.height;
      
        // check for intersection
        if (left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2) {
          // collision detected
          return true;
        }
      
        return false;
      }
      

}