import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import  { GUI } from "lil-gui"

document.title = "Raycaster and Mouse events"
THREE.ColorManagement.enabled = false

const gui = new GUI()
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000)
camera.position.set(0,0,3)
scene.add(camera)
window.addEventListener("resize", ()=>{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//! CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

//! RENDERER
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

//! OBJECTS

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000"})
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000"})
)


const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000"})
)
object3.position.x = 2
scene.add(object1, object2, object3)

object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

//* RAYCASTER
const raycaster = new THREE.Raycaster()


//! TICK
const clock = new THREE.Clock()
let previousTime = 0

function tick(){
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

  // const rayOrigin = new THREE.Vector3(-3, 0, 0)
  // const rayDirection = new THREE.Vector3(1, 0, 0)
  // rayDirection.normalize()
  // raycaster.set(rayOrigin, rayDirection)
  // const intersects = raycaster.intersectObjects([object1, object2, object3])

  // for (const obj of [object1, object2, object3]) {
  //   obj.material.color.set("#ff0000")
  // }

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff")
  // }
  


  controls.update()

  //* RENDER
  renderer.render(scene, camera)
  //* REQUEST NEXT FRAME
  window.requestAnimationFrame(tick)
}

tick()