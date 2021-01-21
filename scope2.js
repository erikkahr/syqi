document.addEventListener('DOMContentLoaded', function() {

    const vshaderDesktop = `
	varying vec2 vUv;

	void main(){
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}

	`

    const fshaderDesktop = `

		uniform vec2 resolution;
		uniform float time;
		uniform vec2 mouse;
		varying vec2 vUv;


		void main() {
			vec2 p = (gl_FragCoord.xy / resolution.x);

			p.x -= 0.17 - (mouse.x / 1.5);
			p.y -= 5.7 - (mouse.y / 1.5);

			vec3 col = vec3(1.0);

			for(float j = 0.0; j < 3.0; j++){
				for(float i = 1.0; i < 5.0; i++){
					p.x += 2.7 / (i + j) * sin(i * 1.0 * p.y + (4.80 * 3.) + cos(((11. * i)) * i + j)) + (mouse.x /4.);
					p.y -= 0.42 / (i + j) * cos(i * 0.81 * p.x + ( 4.50 * 3.) + sin(((12.3456 * i)) * i + j)) + (mouse.y /4.);
				}
				col[int(j)] = abs(p.x / p.y);
			}

			gl_FragColor = vec4(col, 1.);
		}

	`



    const vshaderMobile = `
	varying vec2 vUv;

	void main(){
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}

	`

    const fshaderMobile = `

	  uniform vec2 resolution;
	  uniform float time;
	  uniform vec2 mouse;
	  varying vec2 vUv;


	  void main() {
	    vec2 p = (gl_FragCoord.xy / resolution.x);

	    p.x -= 0.17 - (mouse.x / 25.5);
	    p.y -= 5.7 - (mouse.x / 25.5);

	    vec3 col = vec3(1.0);

	    for(float j = 0.0; j < 3.0; j++){
	      for(float i = 1.0; i < 5.0; i++){
	        p.x += 1.4 / (i + j) * sin(i * 1.0 * p.y + (4.80 * 3.) + cos(((10. * i)) * i + j)) - (mouse.x /10.);
	        p.y -= 0.62 / (i + j) * cos(i * 0.81 * p.x + ( 4.50 * 3.) + sin(((12.3456 * i)) * i + j)) - (mouse.y /10.);
	      }
	      col[int(j)] = abs(p.x / p.y);
	    }

	    gl_FragColor = vec4(col, 1.);
	  }

	`

    let renderer, scene, camera, mesh, material;

    const container = document.getElementById('hero')
    let vw = document.documentElement.clientWidth // viewport width
    // var vh = document.documentElement.clientHeight // viewport height
    let vh = window.screen.height
    let mouse = new THREE.Vector2()
    let clock = new THREE.Clock();
    let geometry = new THREE.PlaneBufferGeometry(882, 677, 1)





    //////////////////////////////////////////////////////////////////////////////////////



    const uniforms = {
        time: {
            value: 0.0
        },
        mouse: {
            value: {
                x: 0.0,
                y: 0.0
            }
        },
        resolution: {
            value: {
                x: vw,
                y: vh
            }
        },
    }



    //////////////////////////////////////////////////////////////////////////////////////




    function getWindowCursor(ev) {
        const touches = ev.targetTouches
        const position = {
            x: touches ? touches[0].pageX : ev.clientX,
            y: touches ? touches[0].pageY : ev.clientY,
        }
        return position
    }


    function saveCursor(e) {
        e.preventDefault()
        mouse.x = (getWindowCursor(e).x / vw) * 2 - 1
        mouse.y = -(getWindowCursor(e).y / vh) * 2 + 1
    }



    //////////////////////////////////////////////////////////////////////////////////////



    function init() {


        // let container = document.getElementById('mycanvas')
        // document.body.appendChild( container )

        camera = new THREE.PerspectiveCamera(45, vw / vh, 1, 1000);
        camera.position.set(0, 0, 290);

        scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)

        var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(light);

        renderer = new THREE.WebGLRenderer({
            antialias: false
        })


        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(vw, vh)

        objectForScene(scene)

        container.appendChild(renderer.domElement)

        window.addEventListener('resize', onWindowResize, false)
        window.addEventListener('mousemove', saveCursor)
        window.addEventListener('touchmove', saveCursor)
    }

    if (window.App.isTouch) {

        //mobile

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vshaderMobile,
            fragmentShader: fshaderMobile,
            side: THREE.DoubleSide,
        });


    } else {

        //desktop

        material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vshaderDesktop,
            fragmentShader: fshaderDesktop,
            side: THREE.DoubleSide,
        });


    }



    // const material = new THREE.ShaderMaterial( {
    //   uniforms:uniforms,
    //   vertexShader:vshader,
    //   fragmentShader:fshader,
    //   side: THREE.DoubleSide,
    // });





    function onWindowResize() {

        vw = document.documentElement.clientWidth
        vh = window.screen.height
        camera.aspect = vw / vh
        camera.updateProjectionMatrix()
        renderer.setSize(vw, vh)
        uniforms.resolution.value.x = vw;
        uniforms.resolution.value.y = vh;

    }


    function objectForScene(scene) {
        if (!scene) return
        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(1.4, 2.4, 1.4)
        scene.add(mesh)

        App.Dom.html.classList.add('run-shader')
    }


    function moveShader() {

        window.App.gsap.to(uniforms.mouse.value, {
            duration: 1.5,
            x: mouse.x,
            y: mouse.y
        })

    }


    function loop() {
        moveShader()
        renderer.render(scene, camera)
    }




    init()
    window.App.gsap.ticker.add(loop)

})