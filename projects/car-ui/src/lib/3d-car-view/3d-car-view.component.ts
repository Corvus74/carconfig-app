import { AfterViewInit, Component, OnDestroy, ElementRef, inject, effect, viewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CarConfigStoreService } from '@carconfig/car-state';
import { CarColorDto } from '@carconfig/api-client';


@Component({
  selector: 'app-3d-car-view',
  templateUrl: './3d-car-view.component.html',
  styleUrl: './3d-car-view.component.scss',
  standalone: true,
})
export class CarConfig3dCarViewComponent implements AfterViewInit, OnDestroy {
  readonly rendererContainer = viewChild.required<ElementRef<HTMLDivElement>>('rendererContainer');

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private carModel!: THREE.Group;
  private carBodyMaterial!: THREE.MeshStandardMaterial;
  private readonly clock = new THREE.Clock();
  private readonly drivingSpeed = 5.5;
  private readonly wheelRadius = 0.48;
  private readonly roadLength = 240;
  private animationFrameId = 0;
  private destroyed = false;
  private environmentTexture?: THREE.Texture;
  private readonly resizeHandler = () => this.onWindowResize();
  private readonly roadsideObjects: Array<{ object: THREE.Object3D; x: number; speed: number }> = [];

  private colorData: CarColorDto = {}

  private readonly wheels: THREE.Object3D[] = [];

  private readonly carBodyMaterialProperties = {
    metalness: 1.0,
    roughness: 0.5,
    envMapIntensity: 1.5,
  };

  // --- Lifecycle Hooks ---
  private readonly carConfigStoreService = inject(CarConfigStoreService);

  /**
   * This method is called once when the component is initialized.
   * It's where we set up the entire 3D scene.
   */

  constructor() {
    effect(() => {
      const color = this.carConfigStoreService.color();
      this.colorData = color || {};
      this.updateColor();
      this.updateColorStyle();
    });
  }

  ngAfterViewInit() {
    this.initScene();
    this.createEnvironment();
    this.loadCarModel();
    window.addEventListener('resize', this.resizeHandler);
    this.animate();
    this.onWindowResize();
  }

  updateColor() {
    if (this.colorData) {
      if (this.colorData.colorCodeHex) {
        this.changeCarColor(this.colorData.colorCodeHex);
      }
    }
  }

  private updateColorStyle() {
    // Exit early if the material isn't ready yet.
    // This method will be called again by the model loader once it's ready.
    if (!this.carBodyMaterial || !this.colorData?.materialType) {
      return;
    }

    switch (this.colorData.materialType) {
      case CarColorDto.MaterialTypeEnum.Glossy:
        this.changeCarMaterialProperties(1.0, 0.2);
        break;
      case CarColorDto.MaterialTypeEnum.Matte:
        this.changeCarMaterialProperties(0.5, 0.8);
        break;
    }
  }

  ngOnDestroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.resizeHandler);
    this.controls?.dispose();
    this.scene?.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) value.dispose();
        }
        material.dispose();
      }
    });
    this.environmentTexture?.dispose();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }

  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const host = this.rendererContainer().nativeElement;
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(4, 2.8, 5);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(this.renderer.domElement);

    // Orbit Controls for user interaction
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 0.65, 0);
    this.controls.enablePan = false;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 18;
    this.controls.minPolarAngle = 0.12;
    this.controls.maxPolarAngle = 1.15;
    this.controls.update();

    // Load the HDR environment map.
    new RGBELoader()
      .load('assets/quarry_01_1k.hdr', (texture) => {
      if (this.destroyed) {
        texture.dispose();
        return;
      }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      // Keep the HDR image for car reflections; the visible sky is now desert blue.
      this.environmentTexture = texture;
      this.scene.environment = texture;
    });
  }

  private createEnvironment(): void {
    this.scene.background = new THREE.Color(0x9bc8d8);
    this.scene.fog = new THREE.Fog(0xd8c397, 80, 235);

    const ambientLight = new THREE.HemisphereLight(0xd9efff, 0xa8763e, 1.15);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffe3b2, 2.2);
    directionalLight.position.set(-22, 38, 12);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.left = -28;
    directionalLight.shadow.camera.right = 28;
    directionalLight.shadow.camera.top = 28;
    directionalLight.shadow.camera.bottom = -28;
    this.scene.add(directionalLight);

    this.createDuneTerrain();
    this.createMovingRoadsideRocks();

    this.createRoad();
  }

  private createRoad(): void {
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(10, this.roadLength),
      new THREE.MeshStandardMaterial({ color: 0x34383b, roughness: 0.92, metalness: 0.01 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.01;
    road.receiveShadow = true;
    this.scene.add(road);

    // Light gravel shoulders frame the asphalt edge.
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Mesh(
        new THREE.PlaneGeometry(0.38, this.roadLength),
        new THREE.MeshStandardMaterial({ color: 0xb49a70, roughness: 1 })
      );
      shoulder.rotation.x = -Math.PI / 2;
      shoulder.position.set(side * 4.81, 0, 0);
      shoulder.receiveShadow = true;
      this.scene.add(shoulder);

      const edgeLine = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12, this.roadLength),
        new THREE.MeshStandardMaterial({ color: 0xe8dfc6, roughness: 0.8, emissive: 0x252116 })
      );
      edgeLine.rotation.x = -Math.PI / 2;
      edgeLine.position.set(side * 4.12, 0.006, 0);
      this.scene.add(edgeLine);
    }

    // Dashed center markings stream toward the camera as the car travels forward.
    const dashGeometry = new THREE.PlaneGeometry(0.14, 2.6);
    const dashMaterial = new THREE.MeshStandardMaterial({ color: 0xf6f0d9, roughness: 0.75, emissive: 0x29271e });
    for (let i = 0; i < 30; i++) {
      const dash = new THREE.Mesh(dashGeometry, dashMaterial);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.008, -118 + i * 8);
      this.scene.add(dash);
      this.roadsideObjects.push({ object: dash, x: 0, speed: this.drivingSpeed });
    }
  }

  private createDuneTerrain(): void {
    const geometry = new THREE.PlaneGeometry(260, 260, 150, 150);
    const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
    const colors = new Float32Array(positions.count * 3);
    const sand = new THREE.Color(0xc99f5e);

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = -positions.getY(i);
      const height = this.duneHeight(x, z);
      positions.setZ(i, height);

      const shade = 0.88 + Math.sin(x * 0.13 + z * 0.035) * 0.045 + Math.min(height, 4) * 0.018;
      const color = sand.clone().multiplyScalar(shade);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    const dunes = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0,
    }));
    dunes.receiveShadow = true;
    this.scene.add(dunes);
  }

  private duneHeight(x: number, z: number): number {
    const t = THREE.MathUtils.clamp((Math.abs(x) - 5.2) / 18, 0, 1);
    const roadClearance = t * t * (3 - 2 * t);
    const ridges = 1.8
      + 1.35 * Math.sin(x * 0.052 + Math.sin(z * 0.018) * 1.4)
      + 0.9 * Math.sin(x * 0.105 - z * 0.026)
      + 0.32 * Math.cos(z * 0.06 + x * 0.02);
    return -0.035 + roadClearance * Math.max(0, ridges);
  }

  private createMovingRoadsideRocks(): void {
    const rockGeometry = new THREE.DodecahedronGeometry(0.55, 0);
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x92764f, roughness: 1 });

    for (let i = 0; i < 10; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (7.5 + (i % 3) * 1.5);
      const z = -95 + Math.floor(i / 2) * 38;
      const group = new THREE.Group();

      for (let rockIndex = 0; rockIndex < 3; rockIndex++) {
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set((rockIndex - 1) * 0.42, 0.25 + (rockIndex % 2) * 0.08, 0);
        rock.scale.set(0.75 + rockIndex * 0.12, 0.55 + (rockIndex % 2) * 0.15, 0.75);
        rock.castShadow = true;
        group.add(rock);
      }

      group.position.set(x, this.duneHeight(x, z), z);
      this.scene.add(group);
      this.roadsideObjects.push({ object: group, x, speed: this.drivingSpeed });
    }
  }

  private loadCarModel(): void {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/gltf/'); // Path to the Draco decoder
    loader.setDRACOLoader(dracoLoader);

    loader.load('assets/ferrari.glb', (gltf) => {
      if (this.destroyed) return;
      this.carModel = gltf.scene;
      this.scene.add(this.carModel);
      this.carModel.scale.set(1.5, 1.5, 1.5);

      // Find the car body mesh and wheels
      this.carModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          //  console.log("Found mesh with name:", child.name, "and material type:", child.material.type);
          if (child.name === 'body') {
            // It's a best practice to clone the material to avoid modifying the original
            // material, which might be shared across other models.
            this.carBodyMaterial = (child.material as THREE.MeshStandardMaterial).clone();
            child.material = this.carBodyMaterial;

            // Set the initial properties
            this.carBodyMaterial.metalness = this.carBodyMaterialProperties.metalness;
            this.carBodyMaterial.roughness = this.carBodyMaterialProperties.roughness;
          }
          // A more efficient way to find all wheels
          if (child.name.startsWith('wheel')) {
            this.wheels.push(child);
          }
          if (child.name.startsWith('rim')) {
            this.wheels.push(child);
          }
        }

      });

      // CRITICAL FIX: Now that the model is loaded and we have a reference to the material,
      // apply the currently selected color and style. This prevents the race condition.
      this.updateColor();
      this.updateColorStyle();
    });
  }

  private readonly animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.controls.update();

    for (const scenery of this.roadsideObjects) {
      scenery.object.position.z += delta * scenery.speed;
      if (scenery.object.position.z > 125) scenery.object.position.z = -125;
      if (scenery.x !== 0) scenery.object.position.y = this.duneHeight(scenery.x, scenery.object.position.z);
    }
    this.renderer.render(this.scene, this.camera);

    this.wheels.forEach(wheel => {
      wheel.rotation.x -= (delta * this.drivingSpeed / this.wheelRadius)*0.3;
    });
  };

  private onWindowResize(): void {
    const host = this.rendererContainer().nativeElement;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }


  // Public methods to be called from the HTML template
  public changeCarColor(color: string): void {
    if (this.carBodyMaterial) {
      this.carBodyMaterial.color.set(color);
    }
  }

  public changeCarMaterialProperties(metalness: number, roughness: number): void {
    if (this.carBodyMaterial) {
      this.carBodyMaterial.metalness = metalness;
      this.carBodyMaterial.roughness = roughness;
    }
  }

}
