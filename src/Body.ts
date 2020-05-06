import Vector from "./Vector";
import Entity from "./Entity";
import Circle from "./Circle";

// COEFICIENTE_RESTITUCION
const CR = 0.99;
let id = 0; //!
const IMPULSE_MAG = 1;

class Body extends Circle {

  velocity: Vector;
  acceleration: Vector;
  mass: number;
  id: number; //!
  friction: number = 1;

  constructor(position: Vector, radius: number) {
    super(position, radius);
    id++; //!
    this.id = id;
    this.velocity = new Vector();
    this.acceleration = new Vector();
    this.mass = Math.PI * this.radius * this.radius;
  }

  fixPosition(other: Entity): void {
    const distance = Vector.sub(this.position, other.position);
    const overlap = this.radius + other.radius - distance.mag();
    const fix = Vector.mult(overlap / 2, distance.normalized());
    this.position.add(fix);
    other.position.add(Vector.mult(-1, fix));
  }

  updateCollisions(Entitys: Entity[]) {
    Entitys.forEach(Entity => {
      if (this.id !== Entity.id) {
        if (this.collides(Entity)) {
          const [v1, v2] = this.velocityAfterCollision(Entity)
          this.velocity = v1;
          Entity.velocity = v2;
          this.fixPosition(Entity);
        }
      }
    })
  }

  velocityAfterCollision(other: Body): Vector[] {
    //if (Vector.sub(this.position, other.position).mag() > 1) {
    const v1: Vector = Vector.mult(1 / (this.mass + other.mass), Vector.add(Vector.add(Vector.mult(CR * other.mass, Vector.sub(other.velocity, this.velocity)), Vector.mult(this.mass, this.velocity)), Vector.mult(other.mass, other.velocity)))
    const v2: Vector = Vector.mult(1 / (this.mass + other.mass), Vector.add(Vector.add(Vector.mult(CR * this.mass, Vector.sub(this.velocity, other.velocity)), Vector.mult(this.mass, this.velocity)), Vector.mult(other.mass, other.velocity)))
    return [v1, v2];
    //}
    //return [this.position.copy(), other.position.copy()];
  }

  updatePhysics(dt: number): void {
    const dtInSeconds = dt / 1000;
    this.position.add(Vector.mult(dtInSeconds, this.velocity));
    this.velocity.add(Vector.mult(dtInSeconds, this.acceleration));
    this.velocity.mult(dtInSeconds * this.friction);
    this.acceleration.mult(0);
  }

  addForce(force: Vector): void {
    this.acceleration.add(Vector.mult(1 / this.mass, force));
  }
}

export default Body
// this.addForce(Vector.mult(IMPULSE_MAG, dist));
    // other.addForce(Vector.mult(IMPULSE_MAG, dist));