import Render from "./Render"
import Entity from "./Entity"
import Vector from "./Vector"
import QuadTree from "./Quadtree"
import Rect from "./Rect"

const NUMBER_OF_BALLS = 500
const COLLISION_SEARCH_AREA = 30
const ATTRACTION_FORCE_TO_MOUSE = 100000000000

let quadtreeMode = true
let attractionMouse = false
let showQuadtreeMode = true

const mousePosition: Vector = new Vector()

const render = new Render()

const entityFollowMouse = new Entity(50, new Vector(500, 500))
render.add(entityFollowMouse)

// * Initialization
while (render.entities.length < NUMBER_OF_BALLS) {
  const entitySize = 10 + Math.random() * 10

  const entityPosition = new Vector(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight
  )

  const entity = new Entity(entitySize, entityPosition)

  let entityCanBeAdded: Boolean = true

  // An entity can be added if it doesn't collide with other entity.
  render.entities.forEach(other => {
    if (other.collides(entity))
      entityCanBeAdded = false
  })

  if (entityCanBeAdded) {
    render.add(entity)
  }
}

document.addEventListener("mousemove", (event) => {
  mousePosition.x = event.clientX
  mousePosition.y = event.clientY
})

document.addEventListener("keydown", (event) => {
  if (event.key.toLocaleLowerCase() === "q") {
    quadtreeMode = !quadtreeMode
  }
  if (event.key.toLocaleLowerCase() === "a") {
    attractionMouse = !attractionMouse
  }
  if (event.key.toLocaleLowerCase() === "s") {
    showQuadtreeMode = !showQuadtreeMode
  }

})

// Add force of attraction between the mouse and the entity.
function addForceEntityToMouse(): void {
  if (attractionMouse) {
    render.entities.forEach(entity => {
      const distanceVector = Vector.sub(mousePosition, entity.position)
      const distance = distanceVector.mag()
      if (distance > 50) {  // Does not add forces if the object is too near of the mouse.
        const force = distanceVector.normalized()
        force.mult(ATTRACTION_FORCE_TO_MOUSE / (distance))
        entity.addForce(force)
      }
    })
  }
}

function text(txt, x, y, render) {
  render.context.strokeText(txt, x, y)
  render.context.fillText(txt, x, y)
}

render.update = () => {

  const distance = Vector.sub(mousePosition, entityFollowMouse.position)
  if (distance.mag() > 10) {
    distance.normalize()
    distance.mult(10)
    entityFollowMouse.velocity = distance
    entityFollowMouse.position.add(distance)
  }

  addForceEntityToMouse()
  if (quadtreeMode) {
    const screenSizeRectangle = new Rect(new Vector(), window.innerWidth, window.innerHeight)
    const qt: QuadTree = new QuadTree(screenSizeRectangle, 5)
    // Inset all entities in quadtree.
    render.entities.forEach(entity => qt.insert(entity))

    render.entities.forEach(entity => {
      // Rectangle around the entity.
      const query = generateRectAroundVector(entity.position)
      // Search all entities inside the rectangle.
      const entitiesInsideRect = qt.queryRect(query)
      // Check collision with all entities inside the rectangle.
      entity.updateCollisions(entitiesInsideRect)
    })
    if (showQuadtreeMode) {
      qt.draw(render.context)
    }
  }
  else {
    render.entities.forEach(entity => {
      entity.updateCollisions(render.entities)
    })
  }

  render.context.fillStyle = "white"
  render.context.strokeStyle = "black"
  render.context.font = "bold 35px Arial"
  render.context.lineWidth = 10

  text(`Quadtree mode: ${quadtreeMode ? 'ON' : 'OFF'}.  [Press q to change]`, 50, 100, render)
  text(`show quadtree lines mode: ${showQuadtreeMode ? 'ON' : 'OFF'}.  [Press s to change]`, 50, 150, render)
  text(`Attraction mouse mode: ${attractionMouse ? 'ON' : 'OFF'}.  [Press a to change]`, 50, 200, render)
  text(`Number of rocks ${NUMBER_OF_BALLS}.`, 50, 250, render)
  render.context.lineWidth = 1
}

render.init()












function generateRectAroundVector(v: Vector): Rect {
  return new Rect(Vector.sub(v,
    new Vector(COLLISION_SEARCH_AREA / 2, COLLISION_SEARCH_AREA / 2)),
    COLLISION_SEARCH_AREA,
    COLLISION_SEARCH_AREA)
}








    //    const result = render.entities
    // result.forEach(r => {
    //   const distance = Vector.sub(r.position, entity.position)
    //   const d = distance.mag()
    //   distance.normalize()
    //   distance.mult((entity.mass * r.mass) / (d * d))
    //   distance.mult(0.005)
    //   if (!isNaN(distance.x) || !isNaN(distance.x)) {
    //     entity.addForce(distance)
    //   }
    // })