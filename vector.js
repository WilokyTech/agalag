export class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  
  elementMultiply(other) {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  divide(scalar) {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize() {
    const mag = this.magnitude();
    return new Vector2(this.x / mag, this.y / mag);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
}
