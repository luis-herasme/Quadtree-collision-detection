import Vector from './Vector';
import Entity from './Entity';
import Circle from './Circle';

class Rect {
  position: Vector;
  w: number;
  h: number;

  constructor(position: Vector, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.position = position;
  }

  render(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.w, this.h);
    context.stroke();
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  collidesRect(rect: Rect) {
    if (this.x < rect.x + rect.w &&
      this.x + this.w > rect.x &&
      this.y < rect.y + rect.h &&
      this.y + this.h > rect.y) {
      return true;
    }
    return false;
  }

  containsCircle(circle: Circle): boolean {
    const distX = Math.abs(circle.position.x - this.position.x - this.w / 2)
    const distY = Math.abs(circle.position.y - this.position.y - this.h / 2)

    if (distX > (this.w / 2 + circle.radius)) return false
    if (distY > (this.h / 2 + circle.radius)) return false

    if (distX <= (this.w / 2)) return true;
    if (distY <= (this.h / 2)) return true;

    const dx = distX - this.w / 2;
    const dy = distY - this.h / 2;

    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
  }
}

export default Rect;
