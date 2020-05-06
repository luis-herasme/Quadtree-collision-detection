
class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  sub(vector: Vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  normalized(): Vector {
    return Vector.mult(1 / this.mag(), this);
  }

  normalize(): void {
    this.mult(1 / this.mag());
  }

  mag() {
    return Math.hypot(this.x, this.y);
  }

  mult(s: number) {
    this.x *= s;
    this.y *= s;
  }

  copy(): Vector {
    return new Vector(this.x, this.y);
  }

  static mult(s: number, v: Vector): Vector {
    return new Vector(v.x * s, v.y * s);
  }

  static add(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }
}

export default Vector
