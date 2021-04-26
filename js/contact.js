
			import * as THREE from './three/build/three.module.js';
			import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
			import { BloomPass } from './three/examples/jsm/postprocessing/BloomPass.js';
			import { FilmPass } from './three/examples/jsm/postprocessing/FilmPass.js';
			import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
			import { ShaderPass } from './three/examples/jsm/postprocessing/ShaderPass.js';
			import { FocusShader } from './three/examples/jsm/shaders/FocusShader.js';



			
			// import Stats from './three/examples/jsm/libs/stats.module.js';

			let container, stats;

			let camera, scene, renderer,geometry,mesh,line;
			let composer, effectFocus;

			let mouseX = 0, mouseY = 0;
			let color = 0x8AFFFD
			let radius = 200;

			let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;


            const textureloader = new THREE.TextureLoader()
            const normaltexture = textureloader.load('../assets/Normals/normal1.jpg')

			init();
			animate();
			
			function init() {

				container = document.getElementById( 'contactdiv' );

				camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 1800;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );


				const canvas = document.createElement( 'canvas' );
				canvas.width = 128;
				canvas.height = 128;


                // LIGHTS                
				const light = new THREE.DirectionalLight( color, 2);
				light.position.set( 0, 10, -5);
                light.lookAt(0,0,0)
				scene.add( light );
			

				scene.background = new THREE.Color( 0x000000 );
				// scene.fog = new THREE.Fog( 0xffffff, 500, 10000 );


				//GEOMETRY
				geometry = new THREE.IcosahedronGeometry( radius, 0);       
				let wireframegeo = new THREE.WireframeGeometry(geometry)
				line = new THREE.LineSegments( wireframegeo );
				line.material.depthTest = true;
				line.material.opacity = 1;
				line.material.transparent = true;				
				
				const geometry2 = new THREE.BufferGeometry();
				const vertices = [];

				const sprite = new THREE.TextureLoader().load( '../assets/Textures/disc.png' );

				for ( let i = 0; i < 10000; i ++ ) {

					const x = 2000 * Math.random() - 1000;
					const y = 2000 * Math.random() - 1000;
					const z = 1000 * Math.random() - 1000;

					vertices.push( x, y, z );

				}

				geometry2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3) );

				let material2 = new THREE.PointsMaterial( { 
					size: 10, 
					sizeAttenuation: true, 
					map:sprite, 
					alphaTest: 0.5, 
					transparent: true 
				} );
				
				material2.color.setRGB( 93, 208, 216);
				const particles = new THREE.Points( geometry2, material2 );
				scene.add( particles );

                //MATERIALS
				const wireframeMaterial = new THREE.MeshPhongMaterial( {
                    color: color,
                    wireframe: true,
                    transparent: true,
                    emissive: color,
                    emissiveIntensity: 1,

                } )

				const material = new THREE.MeshStandardMaterial({
                    color: 0x000000,
					roughness: 0.5,
					metalness:1

                })


				mesh = new THREE.Mesh( geometry, material );
				let wireframe = new THREE.Mesh( geometry, wireframeMaterial );
				mesh.add( wireframe );
				mesh.position.x = 0;


				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				// stats = new Stats();
				// container.appendChild( stats.dom );
				const renderModel = new RenderPass( scene, camera );
				const effectBloom = new BloomPass( 1,25,5,254 );
				const effectFilm = new FilmPass( 0.5, 0.5, 500, false );

				effectFocus = new ShaderPass( FocusShader );

				effectFocus.uniforms[ "screenWidth" ].value = window.innerWidth * window.devicePixelRatio;
				effectFocus.uniforms[ "screenHeight" ].value = window.innerHeight * window.devicePixelRatio;

				composer = new EffectComposer( renderer );

				composer.addPass( renderModel );
				// composer.addPass( effectBloom );
				composer.addPass( effectFilm );
				composer.addPass( effectFocus );



				document.addEventListener( 'mousemove', onDocumentMouseMove );
				window.addEventListener( 'resize', onWindowResize );
				animate()

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX );
				mouseY = ( event.clientY - windowHalfY );
			}

			//

			function animate() {
				requestAnimationFrame( animate );
                
				render();
				// stats.update();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
				mesh.rotation.y += 0.0005;
				line.rotation.y += 0.0005;

				camera.lookAt( scene.position );
				
				renderer.render( scene, camera );
				
				composer.render( 0.01 );
			}
