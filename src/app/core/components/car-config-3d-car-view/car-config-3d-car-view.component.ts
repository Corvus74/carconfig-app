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
  styleUrl: './car-config-3d-car-view.component.scss'
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

  private readonly colorDef = new Map();

  // --- Lifecycle Hooks ---
  constructor(private readonly carConfigChangedService: CarConfigChangeService) {
    this.colorDef.set("Black", "#000000")
    this.colorDef.set("Red", "#cf1515")
    this.colorDef.set("Blue", "#0518f0")
    this.colorDef.set("Yellow", "#f5d000")
    this.colorDef.set("Orange", "#f59300")
    this.colorDef.set("White", "#ffffff")
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
  }

  updateColor() {
    if (this.colorData) {
      if (this.colorData.colorCodeHex) {
        this.changeCarColor(this.colorData.colorCodeHex);
      }
    }
  }

  private updateColorStyle() {
    if (this.colorData?.materialType === CarColorDto.MaterialTypeEnum.Glossy) {
      this.changeCarMaterialProperties(1.0, 0.2);
    }
    if (this.colorData?.materialType === CarColorDto.MaterialTypeEnum.Matte) {
      this.changeCarMaterialProperties(0.5, 0.8);
    }
  }

  ngOnDestroy() {
    this.renderer.dispose();
  }

  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color(0x222222);
    this.scene.background = new THREE.Color(0x0320fc);

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

    // Add a simple ground plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0x444444, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -0.5;
    this.scene.add(plane);
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

      // Find the car body mesh to change its material
      this.carModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          //console.log("Found mesh with name:", child.name, "and material type:", child.material.type);
          if (child.name === 'body') {
            // Get a reference to the existing material on the mesh
            this.carBodyMaterial = child.material as THREE.MeshStandardMaterial;

            // The original material might be a MeshPhysicalMaterial
            if (this.carBodyMaterial.type === 'MeshPhysicalMaterial') {
              // If so, cast it to the correct type
              this.carBodyMaterial = child.material as any as THREE.MeshStandardMaterial;
            }
            // Set the initial properties you want to control
            this.carBodyMaterial.metalness = this.carBodyMaterialProperties.metalness;
            this.carBodyMaterial.roughness = this.carBodyMaterialProperties.roughness;
          }
          if (child.name.includes('wheel_fr')) {
            this.wheels.push(child);
          }
          if (child.name.includes('wheel_fl')) {
            this.wheels.push(child);
          }
          if (child.name.includes('wheel_rr')) {
            this.wheels.push(child);
          }
          if (child.name.includes('wheel_rl')) {
            this.wheels.push(child);
          }
        }

      });
    });
  }

  private readonly animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update(); // only required if controls.enableDamping = true
    this.renderer.render(this.scene, this.camera);

    // Animate the wheels' rotation
    this.wheels.forEach(wheel => {
      wheel.rotation.x += -0.01; // Adjust the rotation speed here
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
