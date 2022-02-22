import * as THREE from "three";
import { APP } from "../script";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import DeviceCheck from "./device";

export default class Stage {
  $stage: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  mesh: THREE.Mesh;
  controls: OrbitControls;

  objectGroup: THREE.Group;
  snowGroup: THREE.Group;
  snowArray: THREE.Mesh[] = new Array();
  snowTimerArray: any[] = new Array();
  snowCount: number;
  snowScale: number;
  boxScale: number;
  isMobile: boolean;

  constructor() {
    this.snowCount = 150;
    this.$stage = document.getElementById("stage");
    this.scaleFix();
    this.setUp();
    this.bindEvents();
  }

  scaleFix() {
    this.isMobile = new DeviceCheck().isMobile();
    this.isMobile ? (this.boxScale = 3) : (this.boxScale = 5);
    this.isMobile ? (this.snowScale = 0.05) : (this.snowScale = 0.06);
  }

  setUp() {
    this.setScene();
    this.setCamera();
    this.setObjectGroup();
    this.setSnowGroup();
    this.setWireFrame();
    this.setupSnowGroup();
    this.setLights();
    this.setRenderer();
    this.setControls();
    this.sliderUi();
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setCamera() {
    const { W, H } = APP.Info;
    this.camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 10000);
    this.camera.position.set(0, 0, -25);
    this.camera.lookAt(new THREE.Vector3());
  }

  setControls() {
    this.controls = new OrbitControls(this.camera, this.$stage);
    this.controls.update();
    this.controls.minDistance = 5;
    this.controls.maxDistance = 100;
  }

  sliderUi() {
    const slider = document.getElementById("snow-count-slider");
    slider.addEventListener("change", (e: any) => {
      this.reset();
      this.changeSnowCount(e.target.value);
    });
  }

  reset() {
    for (let i = 0; i < this.snowTimerArray.length; i++) {
      clearTimeout(this.snowTimerArray[i]);
    }
    this.snowGroup.clear();
    this.snowArray.splice(0);
  }

  changeSnowCount(count: number) {
    this.snowCount = count;
    this.setupSnowGroup();
  }

  setObjectGroup() {
    this.objectGroup = new THREE.Group();
    this.objectGroup.rotation.set(-302, 65, 0);
    this.scene.add(this.objectGroup);
  }

  setSnowGroup() {
    this.snowGroup = new THREE.Group();
    this.objectGroup.add(this.snowGroup);
  }

  generateSnow() {
    const geo = new THREE.SphereGeometry(this.snowScale, 6, 4);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geo, mat);
    const x = Math.random() * (this.boxScale + this.boxScale) - this.boxScale;
    const z = Math.random() * (this.boxScale + this.boxScale) - this.boxScale;
    mesh.position.set(x, this.boxScale, z);
    this.snowArray.push(mesh);
    this.snowGroup.add(mesh);
  }

  setupSnowGroup() {
    for (let i = 0; i < this.snowCount; i++) {
      const timelag = Math.random() * (3000 - 10) - 100;
      const timer = setTimeout(() => {
        this.generateSnow();
      }, timelag);
      this.snowTimerArray.push(timer);
    }
  }

  setWireFrame() {
    const loader = new GLTFLoader();
    const scale = this.boxScale;
    let group = this.objectGroup;
    loader.load("./static/3d/wire07.glb", function (gltf) {
      let model = gltf.scene;
      model.scale.set(scale, scale, scale);
      group.add(model);
    });
  }

  setLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);
    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 10, -10);
    this.objectGroup.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(0, 50, 50);
    this.objectGroup.add(backLight);
  }

  setRenderer() {
    const { W, H } = APP.Info;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.$stage,
    });
    this.renderer.setClearColor(0x092782);
    this.renderer.setSize(W, H);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setAnimationLoop(() => {
      this.renderStage();
    });
  }

  renderStage() {
    this.objectGroup.rotation.y += 0.005;
    this.renderer.render(this.scene, this.camera);
    for (let i = 0; i < this.snowArray.length; i++) {
      if (this.snowArray[i].position.y >= -this.boxScale) {
        this.snowArray[i].position.y -= 0.058;
      } else {
        this.snowGroup.remove(this.snowArray[i]);
        this.snowArray.splice(i, 1);
        this.generateSnow();
      }
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.onResize();
    });
  }

  onResize() {
    const { W, H } = APP.Info;
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(W, H);
  }
}
