
export class Engine {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202020);

        this.camera = new THREE.PerspectiveCamera(
            90, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.set(5, 5, 0);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.initResize();
        
    }

    //Изменение размера
    initResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Универсальный цикл анимации
    updateRender(updateCallback) {
        const loop = () => {
            requestAnimationFrame(loop);

            // Если мы передали функцию обновления (вращение и т.д.)
            if (updateCallback) updateCallback();

            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }
}