import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

@Component({
  selector: 'app-car-config-car-canvas',
  templateUrl: './car-config-3d-car-view.component.html',
  styleUrl: './car-config-3d-car-view.component.scss'
})
export class CarConfig3dCarViewComponent implements OnInit, OnDestroy{
// @ViewChild gets a reference to the canvas element from the HTML template.
  @ViewChild('myCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // --- Core Three.js Variables ---
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  // An array to hold meshes that will change color.
  private partsToColor: THREE.Mesh[] = [];

  // An array to hold the wheel meshes for rotation.
  private wheels: THREE.Object3D[] = [];

  // A handle for the animation frame, for cleanup.
  private animationId!: number;

  // --- Lifecycle Hooks ---

  /**
   * This method is called once when the component is initialized.
   * It's where we set up the entire 3D scene.
   */
  ngOnInit(): void {
    // Call the main setup function.
    this.initScene();
    // Start the animation loop.
    this.animate();
    // Add a listener to handle window resizing.
    this.addLights();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  /**
   * This method is called just before the component is destroyed.
   * It's crucial for cleaning up resources to prevent memory leaks.
   */
  ngOnDestroy(): void {
    // Cancel the animation loop.
    cancelAnimationFrame(this.animationId);
    // Remove the event listener.
    window.removeEventListener('resize', this.onResize.bind(this));
    // Dispose of the renderer and other resources.
    this.renderer.dispose();
    this.controls.dispose();
  }

  // --- Scene Setup and Logic ---

  /**
   * Initializes the Three.js scene, camera, renderer, and lights.
   */
  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111827); // Dark gray background.

    // Camera setup
    const aspect = this.canvasRef.nativeElement.clientWidth / this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 1, 1000);
    this.camera.position.set(4, 2, 4);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
    this.renderer.shadowMap.enabled = true; // Enable shadows
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    // Controls setup
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Provides a smooth, flywheel effect

    // Load the HDR environment map.
    new RGBELoader()
      .load('assets/quarry_01_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = texture;
      });

    // Load the GLTF car model.
    const loader = new GLTFLoader();

    // Create and configure the Draco loader
    const dracoLoader = new DRACOLoader();
    // Set the path to the Draco decoder
    // You will need to copy the files from node_modules/three/examples/jsm/libs/draco/gltf/ to your assets folder
    dracoLoader.setDecoderPath('assets/draco/gltf/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      // The path to your model file. You will need to put this file in your assets folder.
      'assets/ferrari.glb',
      (gltf) => {
        const carModel = gltf.scene;
        this.scene.add(carModel);

        // Traverse the model to find the parts to color and the wheels.
        carModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Check for specific parts to add to our color array.
            if (mesh.material && (mesh.material as any).name === 'paint') {
              this.partsToColor.push(mesh);
            }
          }

          // Check for the wheels by name to add them to a dedicated array.
          // The wheel names from the original model are 'wheel_fr', 'wheel_fl', 'wheel_rr', 'wheel_rl'.
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
        });

        // Initial color setting (e.g., to red)
        this.partsToColor.forEach(mesh => {
          (mesh.material as any).color.setHex(0xff0000); // Set to red
        });

      },
      // Optional: Progress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // Optional: Error callback
      (error) => {
        console.error('An error occurred loading the model', error);
      }
    );

    // Create a ground plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  /**
   * Adds ambient and directional lights to the scene.
   */
  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);
  }

  /**
   * The main animation loop.
   * Uses requestAnimationFrame for performance.
   */
  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update(); // Required if damping is enabled

    // Animate the wheels' rotation
    this.wheels.forEach(wheel => {
      wheel.rotation.x += -0.01; // Adjust the rotation speed here
    });

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handles canvas resizing to ensure the scene looks correct on all devices.
   */
  private onResize(): void {
    const width = this.canvasRef.nativeElement.clientWidth;
    const height = this.canvasRef.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Event handler for the color input.
   * @param event The change event from the color input element.
   */
  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newColor = new THREE.Color(input.value);

    // Update the color of all meshes in the partsToColor array.
    this.partsToColor.forEach(mesh => {
      if (mesh.material instanceof THREE.MeshStandardMaterial || mesh.material instanceof THREE.MeshPhongMaterial) {
        mesh.material.color = newColor;
      }
    });
  }

}
