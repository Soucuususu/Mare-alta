import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $ = id => document.getElementById(id);
const canvas = $('game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x83b9c7);
scene.fog = new THREE.FogExp2(0x83b9c7, 0.0028);
const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, 0.1, 700);
camera.rotation.order = 'YXZ';
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

scene.add(new THREE.HemisphereLight(0xc5e8f4, 0x405a42, 1.7));
const sun = new THREE.DirectionalLight(0xffedcf, 2.2);
sun.position.set(-70,100,45); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-100; sun.shadow.camera.right=100; sun.shadow.camera.top=100; sun.shadow.camera.bottom=-100;
scene.add(sun);

const mat = (color, roughness=0.85, extra={}) => {
  if (typeof roughness === 'object') { extra = roughness; roughness = 0.85; }
  return new THREE.MeshStandardMaterial({color,roughness,...extra});
};
const sandMat=mat(0xd6c49a), grassMat=mat(0x527c58), darkGrass=mat(0x365e46), rockMat=mat(0x727f7d), barkMat=mat(0x594638), leafMat=mat(0x285b43), leafLight=mat(0x3f7950), dockMat=mat(0x856b4d), dockEdge=mat(0x4b4237), waterMat=new THREE.MeshStandardMaterial({color:0x247f9c,roughness:.27,metalness:.16,transparent:true,opacity:.92});
const waterGeo=new THREE.PlaneGeometry(700,700,70,70);
const water=new THREE.Mesh(waterGeo,waterMat); water.rotation.x=-Math.PI/2; water.position.y=-1.2; scene.add(water);
const waterPositions=waterGeo.attributes.position;
const waterBase=Float32Array.from(waterPositions.array);

const island = new THREE.Group(); scene.add(island);
function addMesh(geo, material, x,y,z, scale=null, parent=scene, cast=true, receive=true){
  const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);if(scale)m.scale.set(...scale);m.castShadow=cast;m.receiveShadow=receive;parent.add(m);return m;
}
addMesh(new THREE.CylinderGeometry(29,34,5,48),sandMat,0,-2.6,0,[1,1,.88],island);
addMesh(new THREE.CylinderGeometry(25,29,4,48),grassMat,0,-.1,0,[1,1,.88],island);
addMesh(new THREE.CylinderGeometry(18,22,1.2,48),darkGrass,0,1.95,0,[1,1,.88],island);
// irregular beach rocks and grass clumps
for(let i=0;i<54;i++){
 const a=Math.random()*Math.PI*2, r=24+Math.random()*7;
 const x=Math.cos(a)*r,z=Math.sin(a)*r*.88;
 if(Math.abs(x)<10&&z>11&&z<27) continue;
 if(Math.random()<.55) addMesh(new THREE.DodecahedronGeometry(.45+Math.random()*1.1,0),rockMat,x,-.3+Math.random()*.25,z,[1,.5+Math.random(),.8],island,false,true);
 else addMesh(new THREE.ConeGeometry(.15+Math.random()*.2,.5+Math.random()*.8,5),mat(0x75935a),x,2.15,z,[1,1,1],island,false,false);
}
// hills
for(let i=0;i<7;i++){
 const a=i/7*Math.PI*2,r=9+Math.random()*6;
 addMesh(new THREE.DodecahedronGeometry(5+Math.random()*4,1),i%2?grassMat:darkGrass,Math.cos(a)*r,2+Math.random()*1.4,Math.sin(a)*r*.8,[1,.7+Math.random()*.45,1],island);
}
// palm-ish trees with trunks and layered foliage
function tree(x,z,size=1){
 const g=new THREE.Group();g.position.set(x,1.7,z);g.scale.setScalar(size);island.add(g);
 const trunk=addMesh(new THREE.CylinderGeometry(.22,.42,5.4,7),barkMat,0,2.7,0,null,g);
 trunk.rotation.z=(Math.random()-.5)*.14;
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3+Math.random()*.2;
  const frond=addMesh(new THREE.ConeGeometry(1.05,3.8,6),i%2?leafMat:leafLight,Math.cos(a)*1.1,5.1,Math.sin(a)*1.1,[.8,.55,1],g);
  frond.rotation.z=Math.cos(a)*.8; frond.rotation.x=Math.sin(a)*.8; frond.rotation.y=-a;
 }
 addMesh(new THREE.SphereGeometry(1.15,8,6),leafMat,0,5.3,0,[1,1,1],g,false,false);
}
for(let i=0;i<26;i++){
 const a=Math.random()*Math.PI*2,r=8+Math.random()*14;
 const x=Math.cos(a)*r,z=Math.sin(a)*r*.82;
 if(z>11&&Math.abs(x)<9) continue;
 tree(x,z,.65+Math.random()*.65);
}
// dock extends south from island
const dock=new THREE.Group();dock.position.set(0,.2,22);scene.add(dock);
addMesh(new THREE.BoxGeometry(8,.38,15),dockMat,0,0,0,null,dock);
for(let z=-6;z<=6;z+=3) for(let x of [-3.5,3.5]) addMesh(new THREE.CylinderGeometry(.18,.22,2.3,8),dockEdge,x,-.8,z,null,dock);
for(let x=-3.1;x<=3.2;x+=1.05){
 const plank=addMesh(new THREE.BoxGeometry(.92,.07,14.6),mat(x%2?0x927653:0x806444),x,.23,0,null,dock,false,true);
}
for(let x of [-4.1,4.1]){
 addMesh(new THREE.CylinderGeometry(.08,.1,1.2,8),dockEdge,x,.65,-5,null,dock);
 addMesh(new THREE.SphereGeometry(.15,8,8),mat(0xf0c879,{emissive:0x69471b}),x,1.28,-5,null,dock,false,false);
}
// small fishing hut on shore
const hut=new THREE.Group();hut.position.set(8,1.7,13);scene.add(hut);
addMesh(new THREE.BoxGeometry(5,3.3,4),mat(0x8c795f),0,1.65,0,null,hut);
addMesh(new THREE.ConeGeometry(4.1,2.4,4),mat(0x4d5148),0,4.1,0,[1,1,.8],hut);
addMesh(new THREE.BoxGeometry(1.1,2,.12),mat(0x463d32),-.8,1,2.06,null,hut);
addMesh(new THREE.BoxGeometry(1.05,1,.12),mat(0x9fc5c8,{emissive:0x182d30}),1.25,2,2.06,null,hut);
const sign= new THREE.Group();sign.position.set(-5,1.8,19);scene.add(sign);
addMesh(new THREE.BoxGeometry(2.7,1.25,.16),mat(0x344a48),0,1.7,0,null,sign);
addMesh(new THREE.CylinderGeometry(.08,.12,2.5,6),barkMat,0,.4,0,null,sign);
const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=256;
const ctx=signCanvas.getContext('2d');ctx.fillStyle='#344a48';ctx.fillRect(0,0,512,256);ctx.fillStyle='#d7e6d9';ctx.font='bold 48px sans-serif';ctx.textAlign='center';ctx.fillText('CAIS',256,110);ctx.font='24px sans-serif';ctx.fillText('PESCA • LOJA',256,158);
const signTexture=new THREE.CanvasTexture(signCanvas);signTexture.colorSpace=THREE.SRGBColorSpace;
addMesh(new THREE.PlaneGeometry(2.6,1.15),new THREE.MeshBasicMaterial({map:signTexture}),0,1.7,.095,null,sign,false,false);

// Decorative water rings and buoys
for(let i=0;i<12;i++){
 const a=i/12*Math.PI*2,r=33+Math.random()*12;
 const x=Math.cos(a)*r,z=Math.sin(a)*r;
 addMesh(new THREE.SphereGeometry(.3,8,6),mat(i%3===0?0xe4bd73:0xdce6dc),x,-.65,z,[1,.8,1],scene,false,false);
}
// Clouds
const cloudMat=new THREE.MeshStandardMaterial({color:0xf1f5f2,roughness:1,transparent:true,opacity:.72});
const clouds=[];
for(let i=0;i<12;i++){
 const c=new THREE.Group();c.position.set((Math.random()-.5)*180,35+Math.random()*18,(Math.random()-.5)*160);scene.add(c);
 for(let j=0;j<5;j++)addMesh(new THREE.SphereGeometry(2.8+Math.random()*2.5,8,6),cloudMat,(j-2)*3,Math.random()*1.5,Math.random()*2,[1,.55,.75],c,false,false);
 clouds.push(c);
}
// distant island silhouettes
for(let i=0;i<5;i++){
 const a=i/5*Math.PI*2,r=125;
 const m=addMesh(new THREE.ConeGeometry(15+Math.random()*12,18+Math.random()*12,7),mat(0x648b89),Math.cos(a)*r,-1,Math.sin(a)*r,[1,1,1],scene,false,false);
}

// Simple first-person player
const player={x:0,y:2.1,z:10, yaw:Math.PI, pitch:-.05, speed:8, moving:false, grounded:true, vy:0};
camera.position.set(player.x,player.y,player.z);
const keys={};let pointerLocked=false;let joy={x:0,y:0,active:false};let mobileLook=null;
const isMobile=()=>matchMedia('(max-width:700px)').matches || ('ontouchstart' in window);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function say(text){$('centerMessage').textContent=text;clearTimeout(say.timer);say.timer=setTimeout(()=>$('centerMessage').textContent='',1900)}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2300)}
function inWater(){return player.z>18 || Math.abs(player.x)>24 || Math.hypot(player.x,player.z)>27}
function nearDock(){return Math.abs(player.x)<8&&player.z>13&&player.z<31}
function distanceTo(x,z){return Math.hypot(player.x-x,player.z-z)}
function canFish(){return player.z>18 || Math.abs(player.x)>24 || Math.hypot(player.x,player.z)>26}
function updateLocation(){
 $('location').textContent=nearDock()?'Cais':(Math.hypot(player.x,player.z)>22?'Costa':'Enseada');
 $('hint').textContent=nearDock()?'Cais: pesque aqui ou abra a loja perto da cabana.':canFish()?'Boa posição para pescar. Pressione F ou toque em Pescar.':'Explore a ilha e encontre a água.';
 $('fishBtnSub').textContent=canFish()?'Lançar a linha':'Encontre a água';
 $('fishBtn').classList.toggle('ready',canFish());
}
let money=0, catches=[], capacity=20, upgradedBag=false, premiumBait=false, caughtTotal=0;
const fishTypes=[
 {name:'Sardinha',emoji:'🐟',rarity:'COMUM',weight:[.2,.7],price:8,chance:34,color:'#dce9e9'},
 {name:'Tilápia',emoji:'🐠',rarity:'COMUM',weight:[.5,1.8],price:12,chance:26,color:'#e0b77d'},
 {name:'Robalo',emoji:'🐟',rarity:'INCOMUM',weight:[1,4],price:24,chance:19,color:'#c5d9d4'},
 {name:'Dourado',emoji:'🐠',rarity:'INCOMUM',weight:[1.5,6],price:38,chance:12,color:'#e6c875'},
 {name:'Atum',emoji:'🐟',rarity:'RARO',weight:[4,16],price:72,chance:6,color:'#7eb9d0'},
 {name:'Peixe-espada',emoji:'🗡️',rarity:'ÉPICO',weight:[8,35],price:150,chance:2.4,color:'#c2b4ef'},
 {name:'Marlim-azul',emoji:'🐬',rarity:'LENDÁRIO',weight:[20,80],price:420,chance:.6,color:'#91e5f0'}
];
function rollFish(){
 let total=fishTypes.reduce((s,f)=>s+f.chance,0);
 if(premiumBait){fishTypes[0].chance; total+=0;}
 let r=Math.random()*total;
 for(const f of fishTypes){r-=f.chance;if(r<=0){
  const boost=premiumBait&&['RARO','ÉPICO','LENDÁRIO'].includes(f.rarity)?1.2:1;
  const weight=f.weight[0]+Math.random()*(f.weight[1]-f.weight[0]);
  return {...f,weight:Math.round(weight*10)/10,price:Math.round(f.price*weight*boost),id:Date.now()+Math.random()};
 }}
 return {...fishTypes[0],weight:.5,price:5,id:Date.now()};
}
function renderFish(){
 $('fishCount').textContent=`${catches.length} / ${capacity}`;
 $('bagBtnSub').textContent=`${catches.length} capturas`;
 $('sellValue').textContent=`₡ ${catches.reduce((s,f)=>s+f.price,0)}`;
 $('fishList').innerHTML=catches.length?catches.slice().reverse().map(f=>`<div class="fish-row"><div class="fish-emoji">${f.emoji}</div><div class="fish-info"><strong>${f.name}</strong><small>${f.rarity} · ${f.weight.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})} kg</small></div><div class="fish-value">₡ ${f.price}</div></div>`).join(''):'<div class="empty-state">Sua bolsa está vazia.<br>O oceano está esperando.</div>';
 $('questProgress').style.width=Math.min(100,caughtTotal/3*100)+'%';
 $('questText').textContent=`${Math.min(caughtTotal,3)} / 3 peixes pescados`;
 $('money').textContent=`₡ ${money}`;
 $('baitStatus').textContent=premiumBait?'Ativa nesta sessão':'Não comprada';
 $('buyBait').textContent=premiumBait?'Comprada':'₡ 180';
 $('buyBait').disabled=premiumBait;
 $('upgradeBag').textContent=upgradedBag?'Comprada':'₡ 250';
 $('upgradeBag').disabled=upgradedBag;
}
const saved=(()=>{try{return JSON.parse(localStorage.getItem('mareAltaSave')||'{}')}catch{return {}}})();
money=saved.money||0; catches=saved.catches||[]; capacity=saved.capacity||20; upgradedBag=capacity>20;
function save(){try{localStorage.setItem('mareAltaSave',JSON.stringify({money,catches,capacity}))}catch{}renderFish()}
renderFish();
let fishingState='idle', biteTimeout=null, activeCatch=null, biteCount=0;
function openFishing(){
 if(fishingState!=='idle')return;
 if(!canFish()){toast('Chegue perto da água para lançar a linha.');return}
 if(catches.length>=capacity){toast('Sua bolsa está cheia. Venda os peixes no cais.');$('inventoryPanel').classList.add('open');return}
 fishingState='waiting';$('fishingOverlay').classList.add('open');$('reelBtn').disabled=true;
 $('fishingTitle').textContent='Linha lançada';$('fishingDesc').textContent='A boia está na água. Espere a mordida e recolha rápido.';
 $('fishingTimer').textContent='LANÇADA';$('biteIndicator').classList.remove('active');
 $('fishingTip').textContent='Fique atento ao sinal. A janela de reação é curta.';
 const wait=1500+Math.random()*4000;
 biteTimeout=setTimeout(()=>{
  if(fishingState!=='waiting')return;
  fishingState='bite';biteCount=0;
  $('fishingTitle').textContent='AGORA!';$('fishingDesc').textContent='A boia afundou. Recolha a linha antes que o peixe escape!';
  $('fishingTimer').textContent='MORDIDA';$('biteIndicator').classList.add('active');$('reelBtn').disabled=false;
  biteTimeout=setTimeout(()=>{if(fishingState==='bite'){finishFishing(false)}},1800);
 },wait);
}
function finishFishing(success){
 clearTimeout(biteTimeout);
 if(success&&fishingState==='bite'){
  activeCatch=rollFish();fishingState='catch';
  $('fishingOverlay').classList.remove('open');
  $('catchEmoji').textContent=activeCatch.emoji;$('catchName').textContent=activeCatch.name;
  $('catchRarity').textContent=activeCatch.rarity;$('catchWeight').textContent=activeCatch.weight.toLocaleString('pt-BR',{minimumFractionDigits:1})+' kg';
  $('catchPrice').textContent='₡ '+activeCatch.price;
  const rarityColors={'COMUM':'#9bd6d9','INCOMUM':'#8de3a7','RARO':'#82b9ff','ÉPICO':'#c2a3ff','LENDÁRIO':'#f1d09b'};
  $('catchRarity').style.color=rarityColors[activeCatch.rarity]||'#9bd6d9';
  $('catchOverlay').classList.add('open');
 }else{
  fishingState='idle';$('fishingOverlay').classList.remove('open');toast('O peixe escapou. Tente de novo!');say('A linha ficou vazia...');
 }
}
$('reelBtn').addEventListener('click',()=>finishFishing(true));
$('keepCatch').addEventListener('click',()=>{
 if(activeCatch){if(catches.length<capacity){catches.push(activeCatch);caughtTotal++;save();toast(`${activeCatch.name} guardado na bolsa!`)}else toast('Bolsa cheia!');}
 activeCatch=null;fishingState='idle';$('catchOverlay').classList.remove('open');updateLocation();
});
function sellFish(){
 if(!catches.length){toast('Você ainda não tem peixes para vender.');return}
 const total=catches.reduce((s,f)=>s+f.price,0);money+=total;catches=[];save();toast(`Captura vendida por ₡ ${total}!`);
}
$('sellBtn').addEventListener('click',sellFish);
$('bagBtn').addEventListener('click',()=>$('inventoryPanel').classList.toggle('open'));
$('closeInventory').addEventListener('click',()=>$('inventoryPanel').classList.remove('open'));
$('fishBtn').addEventListener('click',openFishing);
$('menuBtn').addEventListener('click',()=>$('menuPanel').classList.add('open'));
$('closeMenu').addEventListener('click',()=>$('menuPanel').classList.remove('open'));
$('openBag').addEventListener('click',()=>{$('menuPanel').classList.remove('open');$('inventoryPanel').classList.add('open')});
$('openStore').addEventListener('click',()=>{$('menuPanel').classList.remove('open');$('shopPanel').classList.add('open')});
$('closeShop').addEventListener('click',()=>$('shopPanel').classList.remove('open'));
$('upgradeBag').addEventListener('click',()=>{if(upgradedBag)return;if(money<250){toast('Você precisa de ₡ 250. Venda alguns peixes.');return}money-=250;capacity=35;upgradedBag=true;save();toast('Cesta reforçada comprada!')});
$('buyBait').addEventListener('click',()=>{if(premiumBait)return;if(money<180){toast('Você precisa de ₡ 180. Venda alguns peixes.');return}money-=180;premiumBait=true;save();toast('Isca premium equipada!')});
$('resetBtn').addEventListener('click',()=>{if(confirm('Reiniciar a expedição? Isso apaga dinheiro e peixes salvos neste navegador.')){money=0;catches=[];capacity=20;upgradedBag=false;premiumBait=false;caughtTotal=0;save();$('menuPanel').classList.remove('open');toast('Expedição reiniciada.')}});
$('interactBtn').addEventListener('click',()=>{if(nearDock()){$('shopPanel').classList.add('open')}else if(canFish())openFishing();else say('Explore a costa.')});
$('jumpBtn').addEventListener('click',()=>{if(player.grounded){player.vy=7;player.grounded=false}});
function interact(){if(fishingState==='bite'){finishFishing(true);return}if(fishingState!=='idle')return;if(nearDock()){$('shopPanel').classList.add('open');return}openFishing()}
document.addEventListener('keydown',e=>{
 keys[e.code]=true;
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 if(e.repeat)return;
 if(e.code==='KeyF')openFishing();
 if(e.code==='KeyB')$('inventoryPanel').classList.toggle('open');
 if(e.code==='KeyE')interact();
 if(e.code==='Space'){if(fishingState==='bite')finishFishing(true);else if(player.grounded){player.vy=7;player.grounded=false}}
 if(e.code==='Escape'){document.exitPointerLock?.();['inventoryPanel','shopPanel','menuPanel'].forEach(id=>$(id).classList.remove('open'))}
});
document.addEventListener('keyup',e=>keys[e.code]=false);
canvas.addEventListener('click',()=>{if(!isMobile()&&!pointerLocked&&$('menuPanel').classList.contains('open')===false&&!['inventoryPanel','shopPanel'].some(id=>$(id).classList.contains('open')))canvas.requestPointerLock?.()});
document.addEventListener('pointerlockchange',()=>pointerLocked=document.pointerLockElement===canvas);
document.addEventListener('mousemove',e=>{if(pointerLocked){player.yaw-=e.movementX*.0022;player.pitch=clamp(player.pitch-e.movementY*.0022,-1.25,1.25)}});
canvas.addEventListener('touchstart',e=>{if(!isMobile())return;const t=e.changedTouches[0];mobileLook={x:t.clientX,y:t.clientY,id:t.identifier}}, {passive:true});
canvas.addEventListener('touchmove',e=>{if(!mobileLook)return;for(const t of e.changedTouches){if(t.identifier===mobileLook.id){player.yaw-=(t.clientX-mobileLook.x)*.006;player.pitch=clamp(player.pitch-(t.clientY-mobileLook.y)*.006,-1.15,1.15);mobileLook.x=t.clientX;mobileLook.y=t.clientY}}},{passive:true});
canvas.addEventListener('touchend',()=>mobileLook=null,{passive:true});
// joystick
const joystick=$('joystick'), knob=$('joyKnob');let joyId=null;
joystick.addEventListener('pointerdown',e=>{joyId=e.pointerId;joystick.setPointerCapture(joyId);joy.active=true;moveJoy(e)});
joystick.addEventListener('pointermove',e=>{if(joyId===e.pointerId)moveJoy(e)});
function moveJoy(e){const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=35,d=Math.hypot(dx,dy);if(d>max){dx=dx/d*max;dy=dy/d*max}joy.x=dx/max;joy.y=dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`}
function endJoy(e){if(joyId===e.pointerId){joyId=null;joy.x=0;joy.y=0;joy.active=false;knob.style.transform='translate(0,0)'}}
joystick.addEventListener('pointerup',endJoy);joystick.addEventListener('pointercancel',endJoy);

const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.035), t=clock.elapsedTime;
 // animate ocean
 for(let i=0;i<waterPositions.count;i++){
  const x=waterBase[i*3],y=waterBase[i*3+1];
  waterPositions.array[i*3+2]=Math.sin(x*.055+t*.8)*.18+Math.cos(y*.06+t*.7)*.14;
 }
 waterPositions.needsUpdate=true;waterGeo.computeVertexNormals();
 clouds.forEach((c,i)=>{c.position.x+=dt*(.4+i%3*.12);if(c.position.x>110)c.position.x=-110});
 const forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-joy.y;
 const side=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x;
 const mag=Math.hypot(forward,side);player.moving=mag>.08;
 if(mag>.01){
  const f=Math.min(1,mag), speed=player.speed*(keys.ShiftLeft?1.35:1);
  player.x+=(-Math.sin(player.yaw)*forward+Math.cos(player.yaw)*side)*speed*dt*f;
  player.z+=(-Math.cos(player.yaw)*forward-Math.sin(player.yaw)*side)*speed*dt*f;
  // keep player on island and above water edge
  const radius=Math.hypot(player.x,player.z);
  if(radius>34){player.x*=34/radius;player.z*=34/radius}
 }
 player.vy-=18*dt;player.y+=player.vy*dt;
 if(player.y<2.1){player.y=2.1;player.vy=0;player.grounded=true}
 camera.position.set(player.x,player.y+(player.moving?Math.sin(t*10)*.045:0),player.z);
 camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
 // sun shifts gently, atmosphere warms
 sun.position.x=-70+Math.sin(t*.025)*15;
 const daylight=.5+Math.sin(t*.012)*.12;
 $('weather').textContent='Ensolarado';
 updateLocation();
 renderer.render(scene,camera);
}
animate();
setTimeout(()=>$('loading').classList.add('hide'),900);
setTimeout(()=>$('loading').remove(),1700);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight)});
if(isMobile())$('mobileTip').style.display='block';
