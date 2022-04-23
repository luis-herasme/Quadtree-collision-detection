import Entity from "./Entity"

class Render {
  context: CanvasRenderingContext2D
  entities: Array<Entity> = []
  clearColor: string = "#4f9bd9"
  private lastUpdate: number = Date.now()
  private canvas: HTMLCanvasElement

  constructor(width: number = window.innerWidth, height: number = window.innerHeight) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')
  }

  add(entiti: Entity): void {
    this.entities.push(entiti)
  }

  render(): void {
    const now = Date.now()
    const dt = now - this.lastUpdate
    this.lastUpdate = now
    this.clear()
    
    this.entities.forEach(entiti => {
      entiti.render(this.context)
      entiti.update(this.entities, dt)
    })
    this.update(this)
    this.drawFPS(dt)
  }

  init(): void {
    if (document.readyState === "complete") {
      this.loadCanvas()
    } else {
      window.onload = this.loadCanvas.bind(this)
    }
  }

  private clear(): void {
    this.context.fillStyle = this.clearColor
    this.context.fillRect(0, 0, window.innerWidth, window.innerHeight)
  }

  private drawFPS(dt: number): void {
    this.context.fillStyle = "white"
    this.context.lineWidth = 10
    this.context.font = "bold 35px Arial"
    this.context.strokeText(`FPS: ${Math.round(1000 / dt)}`, 50, 50)
    this.context.fillText(`FPS: ${Math.round(1000 / dt)}`, 50, 50)
    this.context.lineWidth = 1
  }

  private loadCanvas(): void {
    document.body.appendChild(this.canvas)
    setInterval(this.render.bind(this), 0)
  }

  update(render: Render) {
    return
  }
}

export default Render
