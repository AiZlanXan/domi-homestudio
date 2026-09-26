const THREE = window.THREE;

const points = [[1213,243],[1202,238],[1164,236],[1160,215],[1154,209],[1135,206],[1135,171],[1125,159],[1082,155],[1074,134],[1035,130],[1032,109],[1025,103],[1010,102],[1007,83],[998,76],[974,76],[968,82],[965,101],[928,99],[925,76],[919,71],[905,70],[894,60],[811,56],[803,64],[801,77],[753,77],[746,97],[672,92],[664,99],[661,114],[533,107],[526,115],[524,131],[497,134],[490,152],[447,149],[439,155],[434,174],[385,171],[375,180],[371,194],[355,195],[345,211],[323,212],[317,218],[312,237],[278,236],[265,246],[260,261],[235,264],[227,274],[221,308],[202,309],[191,319],[177,372],[156,373],[146,379],[132,434],[110,434],[99,440],[93,467],[83,476],[77,515],[83,524],[107,530],[95,572],[97,595],[113,604],[144,610],[140,621],[143,637],[129,690],[137,702],[152,708],[150,723],[160,734],[201,744],[199,760],[210,775],[230,779],[229,794],[237,805],[274,811],[277,830],[284,836],[303,840],[297,872],[304,881],[320,884],[322,901],[331,911],[344,915],[342,929],[348,940],[391,946],[396,959],[420,976],[436,975],[448,984],[469,978],[480,986],[498,981],[506,988],[525,984],[534,989],[590,990],[590,1008],[595,1017],[651,1026],[678,1022],[685,1028],[724,1028],[737,1024],[743,1030],[798,1031],[813,1020],[818,1003],[879,1007],[893,997],[897,979],[939,982],[952,973],[956,956],[974,957],[982,948],[998,949],[1006,938],[1034,937],[1049,916],[1051,899],[1074,896],[1081,877],[1093,871],[1100,844],[1121,844],[1130,827],[1184,832],[1193,825],[1196,813],[1217,814],[1225,797],[1247,797],[1254,793],[1264,757],[1286,757],[1295,748],[1298,735],[1314,735],[1321,729],[1335,729],[1345,723],[1357,663],[1375,660],[1387,648],[1392,589],[1387,582],[1371,577],[1375,495],[1367,485],[1346,481],[1345,433],[1327,427],[1323,407],[1302,401],[1298,383],[1293,377],[1280,374],[1277,338],[1270,331],[1257,330],[1247,305],[1235,301],[1235,284],[1229,275],[1216,270]];
const imageElement = document.getElementById('egg-texture');
const imageWidth = 1445;
const imageHeight = 1088;
const modelWidth = 4;
const modelHeight = modelWidth * imageHeight / imageWidth;
const thickness = 0.19;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
renderer.domElement.setAttribute('aria-label','可小角度旋转的像素煎蛋 3D 模型');
renderer.domElement.style.touchAction = 'none';

scene.add(new THREE.AmbientLight(0xffffff, 1.65));
const key = new THREE.DirectionalLight(0xffedcf, 2.1);
key.position.set(-2,3,7);
scene.add(key);
const rim = new THREE.DirectionalLight(0xffa94d, 1.1);
rim.position.set(3,-2,-3);
scene.add(rim);

const model = new THREE.Group();
scene.add(model);
const shape = new THREE.Shape();
points.forEach(([px,py],i) => {
  const x=(px/imageWidth-.5)*modelWidth;
  const y=(.5-py/imageHeight)*modelHeight;
  if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);
});
shape.closePath();

// The edge follows the actual cut-out contour, with a shallow physical depth.
const solid = new THREE.ExtrudeGeometry(shape,{
  depth:thickness, steps:1, bevelEnabled:true,
  bevelThickness:0.012,bevelSize:0.008,bevelSegments:1,
  curveSegments:1
});
solid.translate(0,0,-thickness/2);
solid.computeVertexNormals();
const edge = new THREE.Mesh(solid,[
  new THREE.MeshStandardMaterial({color:0x995321,roughness:.72,metalness:.05}),
  new THREE.MeshStandardMaterial({color:0xd16b26,roughness:.62,metalness:.09})
]);
model.add(edge);

function addFrontTexture() {
  const texture = new THREE.Texture(imageElement);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(modelWidth,modelHeight),
    new THREE.MeshBasicMaterial({
      map:texture,transparent:true,alphaTest:.035,
      depthWrite:false,side:THREE.FrontSide
    })
  );
  face.position.z = thickness/2+0.015;
  model.add(face);
}
if (imageElement.complete && imageElement.naturalWidth) addFrontTexture();
else imageElement.addEventListener('load',addFrontTexture,{once:true});

const start={x:-0.055,y:-0.11};
let targetX=start.x,targetY=start.y,down=false,lastX=0,lastY=0;
let shownX=start.x,shownY=start.y;
const canvas=renderer.domElement;
canvas.addEventListener('pointerdown',e=>{
  down=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{
  if(!down)return;
  targetY=THREE.MathUtils.clamp(targetY+(e.clientX-lastX)*0.0035,-.32,.32);
  targetX=THREE.MathUtils.clamp(targetX+(e.clientY-lastY)*0.003,-.22,.22);
  lastX=e.clientX;lastY=e.clientY;
});
canvas.addEventListener('pointerup',()=>down=false);
canvas.addEventListener('pointercancel',()=>down=false);
canvas.addEventListener('dblclick',()=>{targetX=start.x;targetY=start.y});
window.addEventListener('keydown',e=>{
  const delta=.055;
  if(e.key==='ArrowLeft')targetY=Math.max(-.32,targetY-delta);
  else if(e.key==='ArrowRight')targetY=Math.min(.32,targetY+delta);
  else if(e.key==='ArrowUp')targetX=Math.max(-.22,targetX-delta);
  else if(e.key==='ArrowDown')targetX=Math.min(.22,targetX+delta);
  else if(e.key.toLowerCase()==='r'){targetX=start.x;targetY=start.y}
  else return;
  e.preventDefault();
});

function resize(){
  const width=innerWidth,height=innerHeight;
  camera.aspect=width/height;
  const halfTan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  const zByHeight=modelHeight/(2*halfTan*.68);
  const zByWidth=modelWidth/(2*halfTan*camera.aspect*.82);
  camera.position.set(0,0,Math.max(zByHeight,zByWidth));
  camera.updateProjectionMatrix();
  renderer.setSize(width,height);
}
window.addEventListener('resize',resize);
resize();
function draw(){
  requestAnimationFrame(draw);
  shownX += (targetX-shownX)*.14;
  shownY += (targetY-shownY)*.14;
  model.rotation.set(shownX,shownY,0);
  renderer.render(scene,camera);
}
draw();
