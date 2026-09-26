(() => {
  const THREE = window.THREE;
  const image = document.getElementById('artwork-3-texture');
  const width = 4.15;
  const height = 4.15;
  const thickness = .12;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', '第三件拼豆作品，可拖动小角度旋转');
  canvas.tabIndex = 0;

  scene.add(new THREE.AmbientLight(0xffffff, 1.8));
  const light = new THREE.DirectionalLight(0xffffff, 1.25);
  light.position.set(-2, 3, 6);
  scene.add(light);
  const edgeLight = new THREE.DirectionalLight(0xffe9d5, .7);
  edgeLight.position.set(3, -2, -3);
  scene.add(edgeLight);

  const work = new THREE.Group();
  scene.add(work);

  // Only the fused piece is solid; there is no supporting display card.
  const shape = new THREE.Shape();
  const inset = .075;
  const left = -width / 2 + inset, right = width / 2 - inset;
  const bottom = -height / 2 + inset, top = height / 2 - inset;
  const count = 32;
  const amplitude = .012;
  const horizontal = (right - left) / count;
  const vertical = (top - bottom) / count;
  shape.moveTo(left, bottom);
  for (let i = 0; i < count; i++) {
    shape.lineTo(left + (i + .5) * horizontal, bottom - amplitude);
    shape.lineTo(left + (i + 1) * horizontal, bottom);
  }
  for (let i = 0; i < count; i++) {
    shape.lineTo(right + amplitude, bottom + (i + .5) * vertical);
    shape.lineTo(right, bottom + (i + 1) * vertical);
  }
  for (let i = 0; i < count; i++) {
    shape.lineTo(right - (i + .5) * horizontal, top + amplitude);
    shape.lineTo(right - (i + 1) * horizontal, top);
  }
  for (let i = 0; i < count; i++) {
    shape.lineTo(left - amplitude, top - (i + .5) * vertical);
    shape.lineTo(left, top - (i + 1) * vertical);
  }
  shape.closePath();
  const solid = new THREE.ExtrudeGeometry(shape, {
    depth: thickness, steps: 1, bevelEnabled: true,
    bevelThickness: .008, bevelSize: .006, bevelSegments: 1,
  });
  solid.translate(0, 0, -thickness / 2);
  work.add(new THREE.Mesh(solid, [
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    new THREE.MeshStandardMaterial({ color: 0xe2c2a0, roughness: .92 }),
  ]));

  function addFront() {
    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: texture, transparent: true, alphaTest: .05,
        depthWrite: false, side: THREE.FrontSide,
      }),
    );
    face.position.z = thickness / 2 + .007;
    work.add(face);
  }
  if (image.complete && image.naturalWidth) addFront();
  else image.addEventListener('load', addFront, { once: true });

  // Less than 20 degrees on either axis: the back can never face the camera.
  const start = { x: -.045, y: -.085 };
  let targetX = start.x, targetY = start.y;
  let shownX = targetX, shownY = targetY;
  let dragging = false, lastX = 0, lastY = 0;
  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    targetY = THREE.MathUtils.clamp(targetY + (event.clientX - lastX) * .0033, -.30, .30);
    targetX = THREE.MathUtils.clamp(targetX + (event.clientY - lastY) * .0028, -.20, .20);
    lastX = event.clientX;
    lastY = event.clientY;
  });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('dblclick', () => { targetX = start.x; targetY = start.y; });
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') targetY = Math.max(-.30, targetY - .05);
    else if (event.key === 'ArrowRight') targetY = Math.min(.30, targetY + .05);
    else if (event.key === 'ArrowUp') targetX = Math.max(-.20, targetX - .05);
    else if (event.key === 'ArrowDown') targetX = Math.min(.20, targetX + .05);
    else if (event.key.toLowerCase() === 'r') { targetX = start.x; targetY = start.y; }
    else return;
    event.preventDefault();
  });

  function resize() {
    const { innerWidth: w, innerHeight: h } = window;
    camera.aspect = w / h;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, Math.max(
      height / (2 * tan * .78), width / (2 * tan * camera.aspect * .86),
    ));
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);
  resize();
  function draw() {
    requestAnimationFrame(draw);
    shownX += (targetX - shownX) * .14;
    shownY += (targetY - shownY) * .14;
    work.rotation.set(shownX, shownY, 0);
    renderer.render(scene, camera);
  }
  draw();
})();
