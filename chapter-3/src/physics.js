import * as THREE from "three"
import GUI from "lil-gui"
import * as CANNON from 'cannon-es'
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

const gui = new GUI()

//! SOUND
const hitSound = new Audio("/sounds/hit.mp3")
const playHitSound =(collision)=>{
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  if( impactStrength > 1.5){
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

const debugObject = {}

debugObject.createSphere =()=>{
  createSphere(
    Math.random() * 0.5,
    { 
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    })
  createSphere(
    Math.random() * 0.5,
    { 
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    })
}

debugObject.createBox =()=>{
  createBox(
    Math.random(),
    Math.random(),
    Math.random(),
    {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    })
}

debugObject.reset =()=>{
  for (const object of objectsToUpdate) {
    object.body.removeEventListener("collide", playHitSound)
    world.removeBody(object.body)
    scene.remove(object.mesh)
  }
  objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, 'createBox' )
gui.add(debugObject, 'createSphere' )
gui.add(debugObject, 'reset' )

//!!!!!!!!  TEXTURES
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  'textures/environmentMaps/0/px.png',
  'textures/environmentMaps/0/nx.png',
  'textures/environmentMaps/0/py.png',
  'textures/environmentMaps/0/ny.png',
  'textures/environmentMaps/0/pz.png',
  'textures/environmentMaps/0/nz.png',
])


//!!!!!!!!  PHYSICS

// Physics World
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

//MATERIAL
// const concreteMaterial = new CANNON.Material("concrete")
// const plasticMaterial = new CANNON.Material("plastic")
const defaultMaterial = new CANNON.Material("default")


const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7
  }
)
world.defaultContactMaterial = defaultContactMaterial

//  To create a body, we need to create a shape
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   material: plasticMaterial,
//   shape: sphereShape,
// })
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// )
// world.addBody(sphereBody)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI/2
)

world.addBody(floorBody) 

//!!!!!!!!  OBJECTS

// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5
//   })
// )

// sphere.position.y = 0.5
// sphere.castShadow = true

// scene.add(sphere)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
  })
)
floor.rotation.x = -Math.PI/2
floor.receiveShadow = true

scene.add(floor)

//!!!!!!! LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true;
directionalLight.position.set(5,5,5)
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
scene.add(directionalLight)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera( 75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//! RENDERER
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

//! UTILS
const objectsToUpdate = []

const SphereGeometry = new THREE.SphereGeometry( 1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture
})

const createSphere = (radius, position)=>{
  const mesh = new THREE.Mesh(SphereGeometry, sphereMaterial)
  mesh.castShadow = true;
  mesh.scale.set(radius, radius, radius)
  mesh.position.copy(position)
  scene.add(mesh)

  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
    position: new CANNON.Vec3(0, 3, 0),
    material: defaultMaterial
  })

  body.position.copy(position)
  body.addEventListener("collide", playHitSound)
  world.addBody(body)

  //Save in objects to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body
  })

}

const boxGeometry = new THREE.BoxGeometry(1,1,1)
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5
})

const createBox = (width,height, depth, position) =>{
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.castShadow = true
  mesh.scale.set(width, height, depth)
  mesh.position.copy(position)
  scene.add(mesh)

  const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5,height * 0.5, depth * 0.5))
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
    material: defaultMaterial,
    position: new CANNON.Vec3(0, 3, 0)
  })
  body.position.copy(position)
  body.addEventListener("collide", playHitSound)
  world.addBody(body)
  objectsToUpdate.push({
    mesh: mesh, 
    body: body
  })
}


// createSphere(0.5, { x: 0, y: 3, z: 0})
// createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })

//! ANIMATE
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>{
    //  TIME
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    
    //* UPDATE PHYSICS WORLD

    // sphereBody.applyForce(
    //   new CANNON.Vec3(-0.5, 0, 0),
    //   sphereBody.position
    // )

    world.step(1/60, deltaTime, 3)

    for (const object of objectsToUpdate) {
      object.mesh.position.copy(object.body.position)
      object.mesh.quaternion.copy(object.body.quaternion)
    }

    // sphere.position.x = sphereBody.position.x;
    // sphere.position.y = sphereBody.position.y;
    // sphere.position.z = sphereBody.position.z;
    // sphere.position.copy(sphereBody.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()