import * as THREE from 'three'
// A single transparent shader plane: layered, advected noise instead of white particle balls.
export function createSmoke(canvas, onFailure) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:false, powerPreference:'low-power' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1,1,1,-1,0,2)
  camera.position.z = 1
  const geometry = new THREE.PlaneGeometry(2,2)
  const material = new THREE.ShaderMaterial({ transparent:true, depthWrite:false,
    uniforms:{ uTime:{ value:0 }, uAspect:{ value:1 } },
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader:`precision mediump float;
      varying vec2 vUv; uniform float uTime; uniform float uAspect;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float n=0., a=.5;for(int i=0;i<4;i++){n+=a*noise(p);p=p*2.03+12.7;a*=.5;}return n;}
      void main(){
        vec2 p=vUv; float y=p.y; float t=uTime*.23;
        float width=.014+pow(y,1.35)*.25;
        float drift=(fbm(vec2(y*3.5-t,t*.3))-.5)*y*.65;
        float x=(p.x-.5)*uAspect-drift;
        float n=fbm(vec2(x*12.,y*9.-t*2.)+fbm(vec2(x*4.+t,y*5.-t)));
        float ribbon=exp(-pow(x/width,2.)*2.6);
        float veil=smoothstep(.23,.7,n)*ribbon;
        float fade=smoothstep(0.,.09,y)*(1.-smoothstep(.55,1.,y));
        gl_FragColor=vec4(vec3(.74,.80,.86),veil*fade*.52);
      }` })
  scene.add(new THREE.Mesh(geometry,material))
  const resize = () => { const w=canvas.clientWidth,h=canvas.clientHeight; renderer.setSize(w,h,false); material.uniforms.uAspect.value=w/Math.max(h,1) }
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize()
  const fail = e => { e.preventDefault(); onFailure() }
  canvas.addEventListener('webglcontextlost',fail)
  const start=performance.now()
  renderer.setAnimationLoop(time => { material.uniforms.uTime.value=(time-start)/1000;renderer.render(scene,camera) })
  return () => { observer.disconnect();canvas.removeEventListener('webglcontextlost',fail);renderer.setAnimationLoop(null);geometry.dispose();material.dispose();renderer.dispose();renderer.forceContextLoss() }
}
