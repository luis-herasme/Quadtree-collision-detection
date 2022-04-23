import Vector from "./Vector"

class Circle {
  radius: number
  position: Vector

  constructor(position: Vector, radius: number) {
    this.position = position
    this.radius = radius
  }

  collides(other: Circle): boolean {
    const distanceVector = Vector.sub(this.position, other.position)
    const distance = distanceVector.mag()
    if (distance <= this.radius + other.radius) {
      return true
    }
    return false
  }
}

export default Circle

