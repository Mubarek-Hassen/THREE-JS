import * as THREE from "three"
// import * as dat from "lil-gui"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

THREE.ColorManagement.enabled = false
document.title = "Physics.js"
const canvas = document.querySelector("canvas.webgl")

window.addEventListener("resize", ()=>{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
window.addEventListener("dblclick", ()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

const scene = new THREE.Scene()

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({ color: 'green' })
)
scene.add(cube)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera( 75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(0, 0, 4)
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

const clock = new THREE.Clock()



function tick(){
  const elapsedTime = clock.getElapsedTime()
  
  
  controls.update()
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()