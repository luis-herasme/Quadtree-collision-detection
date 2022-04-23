import Vector from "./Vector"
import Body from "./Body"
import srcImg from '../rock.png'

const FIX_POS = 2
const VEL_AFTER_COLLISION = 0.5

const img = document.createElement('img')
img.src = srcImg

img.onload = () => {
  console.log("IMG: LOADED CORRECTLY")
}

class Entity extends Body {
  color: string = "#00FF00"

  constructor(radius: number, position: Vector) {
    super(position, radius)
    this.position = position
  }

  update(Entitys: Entity[], dt: number): void {
    this.updatePhysics(dt)
    this.maintainInsideFrame()
  }

  maintainInsideFrame(width: number = window.innerWidth, height: number = window.innerHeight) {

    const fix = (FIX_POS + this.radius)

    if (this.position.x - this.radius < 0) {
      this.velocity.x *= -VEL_AFTER_COLLISION
      this.position.x = fix
    }

    if (this.position.x + this.radius > width) {
      this.velocity.x *= -VEL_AFTER_COLLISION
      this.position.x = width - fix
    }

    if (this.position.y - this.radius < 0) {
      this.velocity.y *= -VEL_AFTER_COLLISION
      this.position.y = fix
    }

    if (this.position.y + this.radius > height) {
      this.velocity.y *= -VEL_AFTER_COLLISION
      this.position.y = height - fix
    }

  }

  render(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.strokeStyle = this.color
    context.drawImage(img, this.position.x - this.radius, this.position.y - this.radius, 2 * this.radius, 2 * this.radius)
    context.stroke()
  }
}

export default Entity
