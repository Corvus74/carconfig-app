import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {CarConfigChangeService} from '../../service/car-config-change.service';
import {Subscription} from 'rxjs';
import {CarColorDto} from '../../api';


@Component({
  selector: 'app-car-config-3d-car-view',
  templateUrl: './car-config-3d-car-view.component.html',
  styleUrl: './car-config-3d-car-view.component.scss',
  standalone: true,
})
export class CarConfig3dCarViewComponent implements OnInit, OnDestroy {
// @ViewChild gets a reference to the canvas element from the HTML template.
  @ViewChild('rendererContainer', {static: true})
  rendererContainer!: ElementRef;
  private carColorSubscription: Subscription | undefined;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private carModel!: THREE.Group;
  private carBodyMaterial!: THREE.MeshStandardMaterial;

  private colorData: CarColorDto = {}

  private readonly wheels: THREE.Object3D[] = [];

  private readonly carBodyMaterialProperties = {
    metalness: 1.0,
    roughness: 0.5,
    envMapIntensity: 1.5,
  };

  // --- Lifecycle Hooks ---
  constructor(private readonly carConfigChangedService: CarConfigChangeService) {
  }

  /**
   * This method is called once when the component is initialized.
   * It's where we set up the entire 3D scene.
   */

  ngOnInit() {
    this.initScene();
    this.createEnvironment();
    this.loadCarModel();
    this.animate();


    this.carColorSubscription = this.carConfigChangedService.colorData$.subscribe(
      (data) => {
        this.colorData = data;
        this.updateColor();
        this.updateColorStyle()

      }
    )
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
    this.renderer.dispose();
    this.carColorSubscription?.unsubscribe();
  }

  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup
    const aspect = this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(4, 2, 4);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Orbit Controls for user interaction
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Load the HDR environment map.
    new RGBELoader()
      .load('assets/quarry_01_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        // Use the same texture for the background and the environment map for reflections.
        this.scene.background = texture;
        this.scene.environment = texture;
      });
    // Window resize handling
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private createEnvironment(): void {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(2, 5, 3);
    this.scene.add(directionalLight);

    // Create a road mesh
    const textureLoader = new THREE.TextureLoader();
    // Note: You will need to add a 'road_texture.jpg' file to your 'src/assets' folder.
    textureLoader.load('assets/asphalt_02_ao_1k.jpg', (texture) => {
      // Configure the texture to repeat, which is ideal for a long road.
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 10); // Repeat the texture 10 times along its length

      const roadGeometry = new THREE.PlaneGeometry(10, 200); // A long, thin plane
      const roadMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8, // Make the road less shiny
        metalness: 0.2
      });

      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
      road.position.y = -0.0; // Position it just below the car's wheels
      this.scene.add(road);
    });
  }

  private loadCarModel(): void {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('assets/draco/gltf/'); // Path to the Draco decoder
    loader.setDRACOLoader(dracoLoader);

    loader.load('assets/ferrari.glb', (gltf) => {
      this.carModel = gltf.scene;
      this.scene.add(this.carModel);
      this.carModel.scale.set(1.5, 1.5, 1.5);

      // Find the car body mesh and wheels
      this.carModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
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
    requestAnimationFrame(this.animate);
    this.controls.update(); // only required if controls.enableDamping = true
    this.renderer.render(this.scene, this.camera);

    // Animate the wheels' rotation
    this.wheels.forEach(wheel => {
      wheel.rotation.x += -0.02; // Adjust the rotation speed here
    });
  };

  private onWindowResize(): void {
    const width = this.rendererContainer.nativeElement.clientWidth;
    const height = this.rendererContainer.nativeElement.clientHeight;

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
