  
//Variables for setup
let container;
let camera;
let renderer;
let scene;
let house;
var clock = new THREE.Clock();
var frustumSize = 4;

var color = 0xf48c06;

function init() {
  container = document.querySelector("#about3d");

  //Create scene
  scene = new THREE.Scene();

  const fov = 20;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;
 
  //Camera setup
  // camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(9, 5, -9);
  camera.lookAt(0,1,0);


  //LIGHTS
  const ambient = new THREE.AmbientLight(0x00b4d8,0.2);
  scene.add(ambient);
  
  const light = new THREE.DirectionalLight(0xff0000, 0.5);
  light.position.set(-20, 20, 10);
  light.target.position.set(0, 0, 0);
  scene.add(light)

  // const light = new THREE.DirectionalLight(color, 0.5);
  // light.position.set(-50, 10, 100);
  // scene.add(light);

  const light1 = new THREE.HemisphereLight(0x00b4d8, 0x4cc9f0, 1);
  scene.add(light1);
  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);


  // //CONTROLS
  // var controls = new THREE.OrbitControls( camera, renderer.domElement );
  // controls.listenToKeyEvents( window ); // optional

  // //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  // controls.dampingFactor = 0.5;

  // controls.screenSpacePanning = false;

  // controls.minDistance = 0.1;
  // controls.maxDistance = 100;

  // controls.maxPolarAngle = Math.PI / 2;

//Mouse track
  // container.addEventListener('mousemove', (e) => {
  //   let axisX = -(window.innerWidth / 2- e.pageX) / 50;
  //   let axisY = -(window.innerHeight / 1 - e.pageY) / 100;
  //   console.log(axisX, axisY)
  //   camera.position.set(9, 5, -9);

  //   camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  //   camera.position.set(axisX, axisY, -9);
  //   if(axisX <= -5 || axisX >= 5 || axisY <= 3 || axisY >= 9){
  //     camera.position.set(9, 5, -9);
  //   }
  //   camera.lookAt(0,1,0);


  // })

  
  //RESIZING
  function onWindowResize() {
    const canvas = renderer.domElement;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener("resize", onWindowResize);
  
  
  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load(".././assets/Models/main bw.glb", function(gltf) {
    scene.add(gltf.scene);
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      for (var i = 0; i < gltf.animations.length; i++) {
        var animation = gltf.animations[i];
        mixer.clipAction(animation).play();
      } 
    }
    house = gltf.scene.children[0];
    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  house.rotation.x = Math.PI / 2;  // controls.update();
	if (mixer) {
		mixer.update(clock.getDelta() * mixer.timeScale);
	}
  renderer.render(scene, camera);
}


init();






// //HAMBURGER
// const toggleButton = document.getElementsByClassName('toggle-button')[0];
// const links = document.getElementsByClassName('navbar-links')[0]

// toggleButton.addEventListener("click", () => {
//     links.classList.toggle('active')
//     toggleButton.classList.toggle('tactive');
// })

// //FOR THE BLURRY EFFECT
// const center = document.querySelector("#blurryrender")
// var fontSize = center.style.fontSize
// center.addEventListener("mousemove", (e)=>{
//     center.style.color = 'rgba(157, 167, 175, 0)';
//     center.style.fontSize = '4vw';
//     center.style.textShadow = '0 0 5px rgba(157, 167, 175, 0.5)';
// });

// //Animate In
// center.addEventListener("mouseenter", (e)=>{
//     center.style.transition = 'all 0.5s ease'

// });

// //Animate Out
// center.addEventListener("mouseleave", (e)=>{
//     center.style.transition = 'all 0.5s ease';
//     center.style.fontSize = fontSize;
//     center.style.color = 'rgba(157, 167, 175, 1)';
//     center.style.textShadow = '0 0 0px rgba(157, 167, 175, 0)';

// });


// //FOR THE CHANGING TEXT
// const aboutdiv = document.querySelector(".about-div");
// const changing_text = document.querySelector('.changing-text')
// var job = ['Web Developer','Video editor','3D artist','VFX artist'];

// changingText(1);

// function changingText (i){
//     if (job.length > i) {
//         setTimeout ( function(){
//             changing_text.innerHTML = job[i];
//             changeBackground(i);
//             changingText(++i);
//         }, 3300)
//     }
//     else if ( job.length==i){
//         changingText(0);
//     }

// }

// function changeBackground(i){
//     var color = ['#ED2D53','#CCFF92','#8AFFFD','#D3BFF5'] 
    
//     color = '0x' + color[i];

// }

//FOR TEXT FADE ON SCROLL
// window.addEventListener('scroll', (e)=>{
//     console.log('scrolll')
//     document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.offsetHeight - window.innerHeight));

// })
