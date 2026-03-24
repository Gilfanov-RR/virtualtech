import { Engine } from './engine.js';

const app = new Engine();

//Свет
const ambLight = new THREE.AmbientLight(0xffffff, 1);
const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(0,5,0);
sunLight.castShadow = true;
app.scene.add(ambLight, sunLight);

//Пол
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0xb0a9ab})
);
plane.castShadow = true;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
app.scene.add(plane);
const listObj = [];
function CreateObject(geom, color, x, y, z, name){
    const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({color : color}));
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = name;
    mesh.userData.originaColor = new THREE.Color(color);
    mesh.userData.baseY = y;
    app.scene.add(mesh);
    listObj.push(mesh);
}
const cube = CreateObject(new THREE.BoxGeometry(1, 1, 1), 0x8a677e, 0, 1, 0, "Куб");
const cylinder= CreateObject(new THREE.CylinderGeometry(1, 1, 1), 0x8a674e, 3, 1, 0, "Цилиндр")
let angle = 0;
let rotateFlag = false;
const rad = 5;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObj = null;
let selectObj = null;
let jumpAnim = 0;
const nameObj = document.getElementById("obj-name");
const colorObj = document.getElementById("obj-color");
const LoopLogic = () =>{
    if (rotateFlag){
        angle +=0.01;
        app.camera.position.x = rad * Math.cos(angle);
        app.camera.position.z = rad * Math.sin(angle);
        app.camera.lookAt(0,0,0);
    }
    raycaster.setFromCamera(mouse, app.camera);
    const inters = raycaster.intersectObjects(listObj);
    if (inters.length > 0){
        const res = inters[0].object;
        if (hoveredObj !== res){
        resetHover();
        hoveredObj = res;
        hoveredObj.material.color.set(0xffffff)
        }
    }
    else{
        resetHover();
    }
    if (selectObj){
        jumpAnim += 0.01;
        selectObj.position.y = selectObj.userData.baseY + Math.abs(Math.cos(jumpAnim))*0.5;

    }
}
function resetHover(){
    if (hoveredObj){
        hoveredObj.material.color.copy(hoveredObj.userData.originaColor);
        hoveredObj = null;

    }
}
//Анимацию с передачей логики вращения
app.updateRender(LoopLogic);
document.addEventListener("DOMContentLoaded", ()=>{
    const rotateBtn = document.getElementById("rotate-btn");
    rotateBtn.addEventListener("click", ()=>{
        rotateFlag = !rotateFlag;
    })
}) 
window.addEventListener("mousemove", () =>{
    mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY/window.innerHeight) * 2 + 1.1;
});
window.addEventListener("click", () =>{
    if (hoveredObj){
        if (selectObj && selectObj == hoveredObj){
            selectObj.position.y = selectObj.userData.baseY;
            selectObj = null;
        }
        else if(selectObj && selectObj != hoveredObj){
            selectObj.position.y = selectObj.userData.baseY;
            selectObj = hoveredObj;
        }
        else{
        selectObj = hoveredObj;
        jumpAnim = 0;
        }
        nameObj.textContent = selectObj.name;
    }
})