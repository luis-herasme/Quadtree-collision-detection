import Rect from "./Rect";
import Entity from "./Entity";
import Vector from "./Vector";
import Circle from "./Circle";

class QuadTree {
  border: Rect;
  capacity: number;
  divided: boolean = false;
  childs: Entity[] = [];
  subTrees: QuadTree[] = [];

  constructor(border: Rect, capacity: number = 10) {
    this.border = border;
    this.capacity = capacity;
  }

  subdivide() {
    const offsetX = Vector.add(new Vector(this.border.w / 2, 0), this.border.position);
    const offsetY = Vector.add(new Vector(0, this.border.h / 2), this.border.position);
    const offsetXY = Vector.add(new Vector(this.border.w / 2, this.border.h / 2), this.border.position);

    this.subTrees.push(
      new QuadTree(new Rect(this.border.position.copy(), this.border.w / 2, this.border.h / 2), this.capacity),
      new QuadTree(new Rect(offsetX, this.border.w / 2, this.border.h / 2), this.capacity),
      new QuadTree(new Rect(offsetY, this.border.w / 2, this.border.h / 2), this.capacity),
      new QuadTree(new Rect(offsetXY, this.border.w / 2, this.border.h / 2), this.capacity)
    )

    this.divided = true;
  }

  queryRange(range: Circle): Entity[] {
    const found = [];
    if (this.border.containsCircle(range)) {
      this.childs.forEach(child => {
        if (range.collides(child)) found.push(child)
      })
      if (this.divided) {
        this.subTrees.forEach(tree => {
          found.push(...tree.queryRange(range))
        })
      }
    }
    return found;
  }

  queryRect(range: Rect): Entity[] {
    const found = [];
    if (this.border.collidesRect(range)) {
      this.childs.forEach(child => {
        if (range.containsCircle(child)) found.push(child)
      })
      if (this.divided) {
        this.subTrees.forEach(tree => {
          found.push(...tree.queryRect(range))
        })
      }
    }
    return found;
  }


  insert(Entity: Entity): boolean {
    if (this.border.containsCircle(Entity)) {
      if (this.childs.length < this.capacity) {
        this.childs.push(Entity)
        return true;
      } else {
        if (!this.divided) {
          this.subdivide()
        }
        this.subTrees.find(tree => tree.insert(Entity));
        return true;
      }
    }
  }


  draw(context: CanvasRenderingContext2D): void {
    context.strokeStyle = "#FFFFFF";
    context.strokeRect(this.border.position.x, this.border.position.y, this.border.w, this.border.h);
    this.subTrees.forEach(tree => tree.draw(context));
  }
}

export default QuadTree
