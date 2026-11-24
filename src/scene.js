import * as THREE from 'three';

// Ashima/stegu 3D simplex noise, used to morph the core
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const CERULEAN = new THREE.Color('#2a7fd4');
const ROSE = new THREE.Color('#ff2e88');

export function createScene(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const world = new THREE.Group();
  scene.add(world);

  // ---- The core: a morphing, iridescent "neural" blob ----
  const coreUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.32 },
    uShift: { value: 0 }, // 0 = cerulean-led, 1 = rose-led
    uDim: { value: 1 },
    uA: { value: CERULEAN },
    uB: { value: ROSE },
  };
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 96),
    new THREE.ShaderMaterial({
      uniforms: coreUniforms,
      vertexShader: /* glsl */ `
        uniform float uTime; uniform float uAmp;
        varying vec3 vN; varying vec3 vView; varying float vD;
        ${NOISE}
        float field(vec3 p){
          return snoise(p*1.15 + vec3(0.0, uTime*0.22, uTime*0.12))*0.7
               + snoise(p*2.6 - uTime*0.18)*0.3;
        }
        void main(){
          vec3 p = position;
          float d = field(normalize(p));
          vec3 displaced = p + normal * d * uAmp;
          // approximate normal via neighbours
          vec3 t = normalize(cross(normal, vec3(0.0,1.0,0.0)) + 0.0001);
          vec3 b = normalize(cross(normal, t));
          float e = 0.02;
          vec3 p1 = p + t*e; vec3 p2 = p + b*e;
          p1 += normalize(p1) * field(normalize(p1)) * uAmp;
          p2 += normalize(p2) * field(normalize(p2)) * uAmp;
          vec3 n = normalize(cross(p1 - displaced, p2 - displaced));
          if (dot(n, normal) < 0.0) n = -n;
          vD = d;
          vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
          vN = normalize(normalMatrix * n);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uA; uniform vec3 uB; uniform float uShift; uniform float uDim; uniform float uTime;
        varying vec3 vN; varying vec3 vView; varying float vD;
        void main(){
          float fres = pow(1.0 - max(dot(vN, vView), 0.0), 2.2);
          float band = 0.5 + 0.5*sin(vD*6.0 + vN.y*3.0 + uTime*0.6);
          float m = clamp(mix(band, 1.0-band, uShift) * 0.85 + vN.x*0.25, 0.0, 1.0);
          vec3 base = mix(uA, uB, m);
          vec3 deep = vec3(0.02, 0.02, 0.05);
          vec3 col = mix(deep, base, 0.35 + 0.45*smoothstep(-0.2, 0.6, vD));
          // soft key light from top-left, rim from fresnel
          float key = max(dot(vN, normalize(vec3(-0.6, 0.8, 0.6))), 0.0);
          col += base * key * 0.35;
          col += mix(uB, uA, m) * fres * 1.25;
          col += vec3(0.86,0.9,0.95) * pow(key, 24.0) * 0.6;
          gl_FragColor = vec4(col * uDim, 1.0);
        }`,
    })
  );
  world.add(core);

  // ---- Orbit rings ----
  const ringMat = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.006, 8, 220), ringMat(CERULEAN, 0.9));
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.004, 8, 220), ringMat(ROSE, 0.7));
  ring1.rotation.set(1.2, 0.3, 0);
  ring2.rotation.set(1.75, -0.5, 0.4);
  world.add(ring1, ring2);

  // satellites riding the rings
  const satGeo = new THREE.SphereGeometry(0.055, 16, 16);
  const sat1 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: '#9fd0ff' }));
  const sat2 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: '#ff8cc0' }));
  ring1.add(sat1); ring2.add(sat2);

  // ---- Particle field ----
  const COUNT = window.innerWidth < 700 ? 900 : 2200;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const r = 3 + Math.pow(Math.random(), 0.6) * 12;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
    pos[i * 3 + 2] = r * Math.cos(ph) - 4;
    const c = Math.random() < 0.55 ? CERULEAN : Math.random() < 0.6 ? ROSE : new THREE.Color('#dce3ea');
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    seed[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() } },
    vertexShader: /* glsl */ `
      uniform float uTime; uniform float uPR; attribute float aSeed; varying vec3 vC; varying float vA;
      void main(){
        vec3 p = position; p.y += sin(uTime*0.3 + aSeed*20.0)*0.15;
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_PointSize = (1.2 + aSeed*2.4) * uPR * (8.0 / -mv.z);
        vC = color; vA = 0.35 + 0.65*abs(sin(uTime*0.8 + aSeed*30.0));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vC; varying float vA;
      void main(){ float d = length(gl_PointCoord-0.5); if(d>0.5) discard;
        gl_FragColor = vec4(vC, smoothstep(0.5,0.0,d)*vA); }`,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // ---- State driven from the page ----
  const state = { mx: 0, my: 0, tmx: 0, tmy: 0, scroll: 0, shift: 0, tShift: 0, layout: 'wide' };

  function layoutFor(w) { return w < 700 ? 'narrow' : w < 1100 ? 'mid' : 'wide'; }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    state.layout = layoutFor(w);
  }
  resize();

  const onMove = (e) => {
    state.tmx = (e.clientX / window.innerWidth) * 2 - 1;
    state.tmy = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  let raf = 0, running = true;

  function frame() {
    const t = reducedMotion ? 4 : clock.getElapsedTime();
    state.mx += (state.tmx - state.mx) * 0.05;
    state.my += (state.tmy - state.my) * 0.05;
    state.shift += (state.tShift - state.shift) * 0.04;

    // hero progress 0..1 over the first screen
    const hp = Math.min(state.scroll / window.innerHeight, 1.6);
    const baseX = state.layout === 'wide' ? 1.75 : state.layout === 'mid' ? 1.2 : 0;
    const baseY = state.layout === 'narrow' ? 1.25 : 0.1;
    const baseS = state.layout === 'narrow' ? 0.62 : 1;

    const k = Math.min(hp, 1);
    if (state.layout === 'narrow') {
      world.position.x = 0;
      world.position.y = baseY + k * 3.4 + state.my * -0.1;
      world.position.z = -k * 1.5;
    } else {
      world.position.x = baseX + k * 2.7;
      world.position.y = baseY - k * 0.5 + state.my * -0.15;
      world.position.z = -k * 2.6;
    }
    world.scale.setScalar(baseS);
    world.rotation.y = state.mx * 0.35 + t * 0.06;
    world.rotation.x = state.my * 0.2;

    core.rotation.y = t * 0.12;
    coreUniforms.uTime.value = t;
    coreUniforms.uShift.value = state.shift;
    coreUniforms.uAmp.value = 0.26 + Math.sin(t * 0.5) * 0.06 + Math.abs(state.mx) * 0.08;
    coreUniforms.uDim.value = 1 - k * (state.layout === 'narrow' ? 0.7 : 0.55);
    ring1.material.opacity = 0.9 - k * 0.5; ring2.material.opacity = 0.7 - k * 0.4;

    ring1.rotation.z = t * 0.25;
    ring2.rotation.z = -t * 0.18;
    sat1.position.set(Math.cos(t * 0.9) * 2.25, Math.sin(t * 0.9) * 2.25, 0);
    sat2.position.set(Math.cos(-t * 0.6 + 2) * 2.7, Math.sin(-t * 0.6 + 2) * 2.7, 0);

    points.rotation.y = t * 0.015 + state.mx * 0.08;
    points.rotation.x = state.my * 0.05;
    points.position.y = state.scroll * 0.0009;
    pMat.uniforms.uTime.value = t;

    renderer.render(scene, camera);
    if (running && !reducedMotion) raf = requestAnimationFrame(frame);
  }
  frame();

  const onVis = () => {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!running) { running = true; clock.getDelta(); frame(); }
  };
  document.addEventListener('visibilitychange', onVis);

  return {
    setScroll(y) { state.scroll = y; if (reducedMotion) frame(); },
    setShift(v) { state.tShift = v; if (reducedMotion) { state.shift = v; frame(); } },
    dispose() {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      renderer.dispose();
    },
  };
}
