import * as THREE from "three"
import GUI from "lil-gui"
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

THREE.ColorManagement.enabled = false;
const canvas = document.querySelector("canvas.webgl")
document.title = "21 - Imported models"
const gui = new GUI()


//!   SCENE
const scene = new THREE.Scene()

//! CAMERA
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera( 75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(2,2,2)
scene.add(camera)

window.addEventListener("resize", ()=>{
  //update sizes
  sizes.width = window.innerWidth
  sizes.height= window.innerHeight
  //update camera
  camera.aspect = sizes.width/ sizes.height
  camera.updateProjectionMatrix()
  //update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//!   OBJECTS

//*   MODELS

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")

const gltfLoader = new GLTFLoader()

gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

// add the path to the model, then 3 callback(arrow) functions (success, progress, error) (err and progress not required)
gltfLoader.load(
  "/models/Fox/glTF/Fox.gltf", // the path to the model
  (gltf)=>{
    console.log(gltf);
    // scene.add(gltf.scene.children[0])

    // for the fox we adjusted the scale and added the gltf scene to the scene
    gltf.scene.scale.set(0.025,0.025,0.025)
    scene.add(gltf.scene)

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[1])
    action.play()

    // while(gltf.scene.children.length){
    //   scene.add(gltf.scene.children[0])
     // }
    
    // When we have multiple meshes in the children array of the scene
    // const children = [...gltf.scene.children]
    // for (const child of children) {
    //   scene.add(child)
    // }
  
  }
  // (progress)=>{
  //   console.log("progress");
  // },
  // (error)=>{
  //   console.log("error");
  // }
)


//*   FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5
  })
)
floor.receiveShadow = true;
floor.rotation.x = -Math.PI/2
scene.add(floor)

//*   LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5,5,5)
scene.add(directionalLight)



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

//! TICK
const clock = new THREE.Clock()
let previousTime = 0

function tick(){
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime

  //* UPDATE OBJECTS
  if(mixer !== null){
    mixer.update(deltaTime)
  }

  //* UPDATE CONTROLS
  controls.update()

  //* RENDER
  renderer.render(scene, camera)

  //* REQUEST NEXT FRAME
  window.requestAnimationFrame(tick)
}

tick()